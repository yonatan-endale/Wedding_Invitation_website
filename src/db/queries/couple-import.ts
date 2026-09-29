import { eq } from "drizzle-orm";
import type { Db } from "@/db";
import { couples, events, giftAccounts, photos, storyMilestones, venues, wishlistItems } from "@/db/schema";
import type { CoupleImport } from "@/lib/validation/couple-import";

export class SlugTakenError extends Error {
  constructor(readonly slug: string) {
    super(`A couple already uses the link /s/${slug}.`);
    this.name = "SlugTakenError";
  }
}

/**
 * Inserts a whole couple from a validated import file in one transaction.
 * With `replace`, an existing couple with the same slug is deleted first,
 * which cascades to its photos, schedule, gifts and RSVPs.
 */
export async function importCouple(
  db: Db,
  data: CoupleImport,
  { replace }: { replace: boolean },
): Promise<{ id: string; replaced: boolean }> {
  const [existing] = await db.select({ id: couples.id }).from(couples).where(eq(couples.slug, data.couple.slug));
  if (existing && !replace) throw new SlugTakenError(data.couple.slug);

  const id = await db.transaction(async (tx) => {
    if (existing) await tx.delete(couples).where(eq(couples.id, existing.id));

    const [couple] = await tx.insert(couples).values(data.couple).returning({ id: couples.id });
    const coupleId = couple.id;

    const venueRows = data.venues.length
      ? await tx
          .insert(venues)
          .values(data.venues.map((venue, sortOrder) => ({ ...venue, coupleId, sortOrder })))
          .returning({ id: venues.id })
      : [];

    if (data.events.length) {
      await tx.insert(events).values(
        data.events.map(({ venue, ...event }) => ({
          ...event,
          coupleId,
          venueId: venue === null ? null : venueRows[venue].id,
        })),
      );
    }

    if (data.photos.length) {
      await tx.insert(photos).values(data.photos.map((photo, sortOrder) => ({ ...photo, coupleId, sortOrder })));
    }

    if (data.gifts.length) {
      await tx.insert(giftAccounts).values(data.gifts.map((gift, sortOrder) => ({ ...gift, coupleId, sortOrder })));
    }

    if (data.milestones.length) {
      await tx
        .insert(storyMilestones)
        .values(data.milestones.map((milestone, sortOrder) => ({ ...milestone, coupleId, sortOrder })));
    }

    if (data.wishlist.length) {
      await tx.insert(wishlistItems).values(data.wishlist.map((item, sortOrder) => ({ ...item, coupleId, sortOrder })));
    }

    return coupleId;
  });

  return { id, replaced: Boolean(existing) };
}
