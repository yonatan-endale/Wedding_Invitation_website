import "server-only";

import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import { getDb } from "@/db";
import { couples, events, giftAccounts, photos, venues, wishlistItems } from "@/db/schema";
import { siteCacheTag, type BorderStyle, type CoupleStatus, type GiftKind } from "@/lib/constants";
import type { LocalizedText } from "@/lib/localized";

/** Plain, JSON-safe shapes: cached data loses Date objects, so dates travel as ISO strings. */
export type SiteCouple = {
  id: string;
  slug: string;
  status: CoupleStatus;
  partnerOne: LocalizedText;
  partnerTwo: LocalizedText;
  partnerOneNick: LocalizedText | null;
  partnerTwoNick: LocalizedText | null;
  partnerOneFather: LocalizedText | null;
  partnerTwoFather: LocalizedText | null;
  tagline: LocalizedText | null;
  weddingAt: string;
  timezone: string;
  city: LocalizedText | null;
  invitation: LocalizedText | null;
  hosts: LocalizedText | null;
  story: LocalizedText | null;
  scripture: LocalizedText | null;
  scriptureRef: LocalizedText | null;
  dressCode: LocalizedText | null;
  giftNote: LocalizedText | null;
  heroPhotoUrl: string | null;
  heroPosition: string;
  musicUrl: string | null;
  musicTitle: string | null;
  telegramUrl: string | null;
  theme: string;
  border: BorderStyle;
  petals: boolean;
  rsvpEnabled: boolean;
  rsvpDeadline: string | null;
};

export type SitePhoto = { id: string; url: string; caption: LocalizedText | null };

export type SiteVenue = {
  id: string;
  name: LocalizedText;
  address: LocalizedText | null;
  mapsUrl: string | null;
  lat: number | null;
  lng: number | null;
  imageUrl: string | null;
};

export type SiteEvent = {
  id: string;
  title: LocalizedText;
  description: LocalizedText | null;
  startsAt: string;
  endsAt: string | null;
  venueId: string | null;
};

export type SiteGiftAccount = {
  id: string;
  kind: GiftKind;
  provider: string;
  accountName: string;
  accountNumber: string;
  note: LocalizedText | null;
};

export type SiteWishlistItem = {
  id: string;
  title: LocalizedText;
  url: string | null;
  imageUrl: string | null;
  price: string | null;
};

export type SiteData = {
  couple: SiteCouple;
  photos: SitePhoto[];
  venues: SiteVenue[];
  events: SiteEvent[];
  giftAccounts: SiteGiftAccount[];
  wishlistItems: SiteWishlistItem[];
};

async function loadSite(slug: string): Promise<SiteData | null> {
  const db = getDb();
  const [row] = await db.select().from(couples).where(eq(couples.slug, slug)).limit(1);
  if (!row) return null;

  const [photoRows, venueRows, eventRows, giftRows, wishRows] = await Promise.all([
    db.select().from(photos).where(eq(photos.coupleId, row.id)).orderBy(asc(photos.sortOrder), asc(photos.createdAt)),
    db.select().from(venues).where(eq(venues.coupleId, row.id)).orderBy(asc(venues.sortOrder), asc(venues.createdAt)),
    db.select().from(events).where(eq(events.coupleId, row.id)).orderBy(asc(events.startsAt)),
    db
      .select()
      .from(giftAccounts)
      .where(eq(giftAccounts.coupleId, row.id))
      .orderBy(asc(giftAccounts.sortOrder), asc(giftAccounts.createdAt)),
    db
      .select()
      .from(wishlistItems)
      .where(eq(wishlistItems.coupleId, row.id))
      .orderBy(asc(wishlistItems.sortOrder), asc(wishlistItems.createdAt)),
  ]);

  return {
    couple: {
      id: row.id,
      slug: row.slug,
      status: row.status,
      partnerOne: row.partnerOne,
      partnerTwo: row.partnerTwo,
      partnerOneNick: row.partnerOneNick,
      partnerTwoNick: row.partnerTwoNick,
      partnerOneFather: row.partnerOneFather,
      partnerTwoFather: row.partnerTwoFather,
      tagline: row.tagline,
      weddingAt: row.weddingAt.toISOString(),
      timezone: row.timezone,
      city: row.city,
      invitation: row.invitation,
      hosts: row.hosts,
      story: row.story,
      scripture: row.scripture,
      scriptureRef: row.scriptureRef,
      dressCode: row.dressCode,
      giftNote: row.giftNote,
      heroPhotoUrl: row.heroPhotoUrl,
      heroPosition: row.heroPosition,
      musicUrl: row.musicUrl,
      musicTitle: row.musicTitle,
      telegramUrl: row.telegramUrl,
      theme: row.theme,
      border: row.border,
      petals: row.petals,
      rsvpEnabled: row.rsvpEnabled,
      rsvpDeadline: row.rsvpDeadline?.toISOString() ?? null,
    },
    photos: photoRows.map((p) => ({ id: p.id, url: p.url, caption: p.caption })),
    venues: venueRows.map((v) => ({
      id: v.id,
      name: v.name,
      address: v.address,
      mapsUrl: v.mapsUrl,
      lat: v.lat,
      lng: v.lng,
      imageUrl: v.imageUrl,
    })),
    events: eventRows.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      startsAt: e.startsAt.toISOString(),
      endsAt: e.endsAt?.toISOString() ?? null,
      venueId: e.venueId,
    })),
    giftAccounts: giftRows.map((g) => ({
      id: g.id,
      kind: g.kind,
      provider: g.provider,
      accountName: g.accountName,
      accountNumber: g.accountNumber,
      note: g.note,
    })),
    wishlistItems: wishRows.map((w) => ({
      id: w.id,
      title: w.title,
      url: w.url,
      imageUrl: w.imageUrl,
      price: w.price,
    })),
  };
}

/** Cached per couple; admin edits call revalidateTag(siteCacheTag(slug)). */
export function getSiteData(slug: string): Promise<SiteData | null> {
  return unstable_cache(() => loadSite(slug), ["site-data", slug], {
    tags: [siteCacheTag(slug)],
    revalidate: 3600,
  })();
}
