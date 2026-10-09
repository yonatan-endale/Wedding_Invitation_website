import { ImageResponse } from "next/og";
import { getSiteData } from "@/db/queries/site";
import { fullName } from "@/lib/names";
import { loadGoogleFont } from "@/lib/og-fonts";
import { getTheme } from "@/lib/theme";
import { formatWeddingDate } from "@/lib/wedding-format";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Wedding invitation";

/** Share preview for WhatsApp, Telegram and Facebook: photo on the left, names and date on the right. */
export default async function OpenGraphImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getSiteData(slug);
  const published = site?.couple.status === "published" ? site : null;
  const colors = getTheme(published?.couple.theme).colors;

  const names = published
    ? `${fullName(published.couple.partnerOne, published.couple.partnerOneFather, "en")} & ${fullName(published.couple.partnerTwo, published.couple.partnerTwoFather, "en")}`
    : "Wedding invitation";
  const date = published ? formatWeddingDate(published.couple.weddingAt, published.couple.timezone, "en") : "";
  const photo = published?.couple.heroPhotoUrl?.startsWith("https://") ? published.couple.heroPhotoUrl : null;
  const font = await loadGoogleFont("Marcellus", `${names}${date}You are invited`);

  // Thin gold rules only: green, gold and red stripes stacked together would read as the flag.
  const stripe = (color: string, height: number) => <div style={{ display: "flex", height, background: color }} />;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: colors.paper, color: colors.ink }}>
        {photo ? (
          <img src={photo} alt="" width={520} height={630} style={{ width: 520, height: 630, objectFit: "cover" }} />
        ) : null}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {stripe(colors.metal, 6)}
          {stripe(colors.paper, 6)}
          {stripe(colors.metal, 4)}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
              padding: "0 64px",
              fontFamily: font ? "Marcellus" : "serif",
            }}
          >
            <div style={{ fontSize: 30, color: colors.inkSoft }}>You are invited</div>
            <div style={{ fontSize: names.length > 22 ? 68 : 84, lineHeight: 1.05, marginTop: 24 }}>{names}</div>
            {date ? <div style={{ fontSize: 34, marginTop: 32 }}>{date}</div> : null}
          </div>
          {stripe(colors.metal, 4)}
          {stripe(colors.paper, 6)}
          {stripe(colors.metal, 6)}
        </div>
      </div>
    ),
    { ...size, fonts: font ? [{ name: "Marcellus", data: font, style: "normal", weight: 400 }] : [] },
  );
}
