"use server";

import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { getDb } from "@/db";
import { isUuid } from "@/db/queries/admin";
import { rsvps } from "@/db/schema";
import { endSession, getCoupleSession, startSession, verifyAccess } from "@/lib/couple-access";
import { createRateLimiter } from "@/lib/rate-limit";

/*
 * Actions for the couple's private page. They never use Clerk or the admin
 * API: each one proves the couple through the link and passcode, or through
 * the session cookie that unlocking set.
 */

export type UnlockState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; error: "invalid" | "locked" | "rateLimited" | "generic" };

/** A first line against guessing from one device; the database lockout holds across instances. */
const perDevice = createRateLimiter({ limit: 10, windowMs: 60_000 });
/** Caps attempts on one couple even if client IPs are spoofed, since each one costs a scrypt. */
const perCouple = createRateLimiter({ limit: 30, windowMs: 60_000 });

export async function unlockPortal(slug: string, _previous: UnlockState, formData: FormData): Promise<UnlockState> {
  const token = String(formData.get("token") ?? "");
  const passcode = String(formData.get("passcode") ?? "");

  const requestHeaders = await headers();
  const ip = requestHeaders.get("x-real-ip") || requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!perCouple.check(slug) || !perDevice.check(`${slug}:${ip}`)) return { status: "error", error: "rateLimited" };

  try {
    const result = await verifyAccess(slug, token, passcode);
    if (!result.ok) return { status: "error", error: result.reason };
    await startSession(slug, result.coupleId);
  } catch (error) {
    console.error("Couple page unlock failed", { slug, error });
    return { status: "error", error: "generic" };
  }
  // Setting the cookie re-renders the page, now signed in. No redirect: on a couple's
  // subdomain Next would render the redirect target without the middleware's rewrite.
  return { status: "success" };
}

/** Signs this device out; deleting the cookie re-renders the page as the unlock form. */
export async function lockPortal(slug: string): Promise<void> {
  await endSession(slug);
}

/** Hides a wish from the couple's list, or shows it again. Only the couple's own RSVPs can change. */
export async function setWishHidden(slug: string, rsvpId: string, hidden: boolean): Promise<{ ok: boolean }> {
  const session = await getCoupleSession(slug);
  if (!session || !isUuid(rsvpId)) return { ok: false };
  const updated = await getDb()
    .update(rsvps)
    .set({ hiddenAt: hidden ? new Date() : null })
    .where(and(eq(rsvps.id, rsvpId), eq(rsvps.coupleId, session.coupleId)))
    .returning({ id: rsvps.id });
  return { ok: updated.length > 0 };
}
