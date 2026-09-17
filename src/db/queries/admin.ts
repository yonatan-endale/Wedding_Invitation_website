import "server-only";

import { asc, desc, eq, sql } from "drizzle-orm";
import { getDb } from "@/db";
import { couples, events, giftAccounts, photos, rsvps, venues, wishlistItems } from "@/db/schema";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (value: string) => UUID_PATTERN.test(value);

export async function listCouples() {
  return getDb()
    .select({
      id: couples.id,
      slug: couples.slug,
      status: couples.status,
      partnerOne: couples.partnerOne,
      partnerTwo: couples.partnerTwo,
      partnerOneFather: couples.partnerOneFather,
      partnerTwoFather: couples.partnerTwoFather,
      weddingAt: couples.weddingAt,
      timezone: couples.timezone,
      theme: couples.theme,
      heroPhotoUrl: couples.heroPhotoUrl,
      responses: sql<number>`count(${rsvps.id})::int`,
      guests: sql<number>`coalesce(sum(case when ${rsvps.attending} then ${rsvps.guestCount} else 0 end), 0)::int`,
    })
    .from(couples)
    .leftJoin(rsvps, eq(rsvps.coupleId, couples.id))
    .groupBy(couples.id)
    .orderBy(asc(couples.weddingAt));
}

export type CoupleListItem = Awaited<ReturnType<typeof listCouples>>[number];

export async function getCoupleForAdmin(id: string) {
  if (!isUuid(id)) return null;
  const couple = await getDb().query.couples.findFirst({
    where: eq(couples.id, id),
    with: {
      photos: { orderBy: [asc(photos.sortOrder), asc(photos.createdAt)] },
      venues: { orderBy: [asc(venues.sortOrder), asc(venues.createdAt)] },
      events: { orderBy: [asc(events.startsAt)] },
      giftAccounts: { orderBy: [asc(giftAccounts.sortOrder), asc(giftAccounts.createdAt)] },
      wishlistItems: { orderBy: [asc(wishlistItems.sortOrder), asc(wishlistItems.createdAt)] },
    },
  });
  return couple ?? null;
}

export type AdminCouple = NonNullable<Awaited<ReturnType<typeof getCoupleForAdmin>>>;

export async function listRsvps(coupleId: string) {
  if (!isUuid(coupleId)) return [];
  return getDb().select().from(rsvps).where(eq(rsvps.coupleId, coupleId)).orderBy(desc(rsvps.createdAt));
}
