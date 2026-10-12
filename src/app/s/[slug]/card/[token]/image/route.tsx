import { getGuestCard, type GuestCard } from "@/db/queries/cards";
import { cardFileName, passUrl } from "@/lib/card-links";
import { renderGuestCard } from "@/lib/card/render";
import { siteBaseFromRequest } from "@/lib/card/site-base";
import { BORDER_STYLES, type BorderStyle } from "@/lib/constants";
import { isLocale } from "@/lib/localized";
import { isThemeName } from "@/lib/theme";

type Params = { params: Promise<{ slug: string; token: string }> };

/** On `next dev` only, ?theme=, ?border=, ?locale= and ?name= try other looks without editing data, as on the site. */
function devLook(card: GuestCard, params: URLSearchParams): GuestCard {
  if (process.env.NODE_ENV !== "development") return card;
  const theme = params.get("theme");
  const border = params.get("border");
  const locale = params.get("locale");
  const name = params.get("name");
  return {
    site: {
      ...card.site,
      couple: {
        ...card.site.couple,
        ...(isThemeName(theme) ? { theme } : {}),
        ...(BORDER_STYLES.includes(border as BorderStyle) ? { border: border as BorderStyle } : {}),
      },
    },
    guest: { ...card.guest, ...(isLocale(locale) ? { locale } : {}), ...(name ? { name } : {}) },
  };
}

/**
 * The guest's invitation card as a PNG. Anyone with the token can fetch it, the
 * same as the card page; ?download=1 asks the browser to save it.
 */
export async function GET(request: Request, { params }: Params) {
  const { slug, token } = await params;
  const found = await getGuestCard(slug, token);
  if (!found) return new Response("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } });

  const { searchParams } = new URL(request.url);
  const card = devLook(found, searchParams);
  const base = await siteBaseFromRequest(slug);
  const download = searchParams.get("download") === "1";
  const fileName = cardFileName(card.guest.name);
  const headers: Record<string, string> = {
    "Cache-Control": "private, max-age=600",
    "X-Robots-Tag": "noindex",
    "Referrer-Policy": "no-referrer",
  };
  if (download) {
    // An ASCII name for old browsers, the real (possibly Amharic) one for the rest.
    const ascii = fileName.replace(/[^\x20-\x7e]/g, "").replace(/-+/g, "-").replace(/-\./, ".") || "invitation.png";
    headers["Content-Disposition"] = `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
  }

  return renderGuestCard(card, { passLink: passUrl(base, token), requestOrigin: new URL(base).origin, headers });
}
