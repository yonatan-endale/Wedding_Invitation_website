import "server-only";

import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { rsvps } from "@/db/schema";
import { isCardToken } from "@/lib/card-links";
import { isLocale, type Locale } from "@/lib/localized";
import { getSiteData, type SiteData } from "./site";

export type CardGuest = { name: string; guestCount: number; locale: Locale; token: string };
export type GuestCard = { site: SiteData; guest: CardGuest };

/**
 * A guest's card by its secret token: only for a published couple, the slug in
 * the link and an RSVP that said yes. The RSVP is read fresh, not cached, so
 * deleting it in the admin voids the card and the entry pass at once.
 */
export async function getGuestCard(slug: string, token: string): Promise<GuestCard | null> {
  if (!isCardToken(token)) return null;
  const site = await getSiteData(slug);
  if (!site || site.couple.status !== "published") return null;

  const [row] = await getDb()
    .select({ name: rsvps.name, guestCount: rsvps.guestCount, attending: rsvps.attending, locale: rsvps.locale })
    .from(rsvps)
    .where(and(eq(rsvps.cardToken, token), eq(rsvps.coupleId, site.couple.id)))
    .limit(1);
  if (!row?.attending) return null;

  return {
    site,
    guest: { name: row.name, guestCount: row.guestCount, locale: isLocale(row.locale) ? row.locale : "en", token },
  };
}
