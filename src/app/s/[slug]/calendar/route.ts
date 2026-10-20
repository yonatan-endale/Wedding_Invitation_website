import { getLocale } from "next-intl/server";
import { getSiteData } from "@/db/queries/site";
import { buildIcs } from "@/lib/calendar-links";
import { siteBaseFromRequest } from "@/lib/card/site-base";
import { isLocale } from "@/lib/localized";
import { weddingCalendarEvent } from "@/lib/wedding-calendar";

type Params = { params: Promise<{ slug: string }> };

/**
 * The celebration as an .ics file for Apple Calendar, Outlook and phones. Only for
 * a published couple with "Add to calendar" turned on. No file extension in the
 * path: the middleware skips paths that have one, which breaks subdomains.
 */
export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params;
  const site = await getSiteData(slug);
  if (!site || site.couple.status !== "published" || !site.couple.calendarButtons) {
    return new Response("Not found", { status: 404 });
  }
  const current = await getLocale();
  const event = await weddingCalendarEvent(site, isLocale(current) ? current : "en", await siteBaseFromRequest(slug));
  return new Response(buildIcs(event), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${site.couple.eventType}.ics"`,
      "Cache-Control": "private, max-age=300",
      "X-Robots-Tag": "noindex",
    },
  });
}
