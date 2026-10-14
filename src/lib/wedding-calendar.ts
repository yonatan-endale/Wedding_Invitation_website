import "server-only";

import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { weddingEnd, type CalendarEvent } from "./calendar-links";
import { pickText, type Locale } from "./localized";
import { layoutNames } from "./site-names";

/**
 * The celebration as one calendar entry, from the cover time to the end of the
 * last event. The title comes from the site's messages, so a graduation reads
 * as one; weddings keep their uid so a re-download updates the same entry.
 */
export async function weddingCalendarEvent(site: SiteData, locale: Locale, siteUrl: string): Promise<CalendarEvent> {
  const t = await getTranslations({ locale, namespace: "calendar" });
  const { couple, venues, events } = site;
  const { one, two } = layoutNames(site, locale);
  const venue = venues[0];
  const start = new Date(couple.weddingAt);
  return {
    uid: `${couple.eventType}-${couple.slug}@invitations`,
    title: t("eventTitle", { one, two }),
    start,
    end: weddingEnd(start, events),
    details: t("details"),
    location: venue ? [pickText(venue.name, locale), pickText(venue.address, locale)].filter(Boolean).join(", ") : undefined,
    url: siteUrl,
  };
}
