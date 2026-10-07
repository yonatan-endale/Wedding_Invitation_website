import "server-only";

import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { rsvps } from "@/db/schema";

/** Every reply for the couple's private page, newest first. Leaves out email and the guest's language. */
export function listRsvpsForCouple(coupleId: string) {
  return getDb()
    .select({
      id: rsvps.id,
      name: rsvps.name,
      phone: rsvps.phone,
      attending: rsvps.attending,
      guestCount: rsvps.guestCount,
      message: rsvps.message,
      cardToken: rsvps.cardToken,
      hiddenAt: rsvps.hiddenAt,
      createdAt: rsvps.createdAt,
    })
    .from(rsvps)
    .where(eq(rsvps.coupleId, coupleId))
    .orderBy(desc(rsvps.createdAt));
}

export type CoupleRsvp = Awaited<ReturnType<typeof listRsvpsForCouple>>[number];
