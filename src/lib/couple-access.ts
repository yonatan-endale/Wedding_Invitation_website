import "server-only";

import { and, eq, gt, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "@/db";
import { coupleAccess, coupleSessions, couples } from "@/db/schema";
import { sitePathFromRequest } from "./card/site-base";
import { isLocked, lockoutAfterFailure } from "./lockout";
import { hashPasscode, newPasscode, randomToken, sha256, verifyPasscode } from "./tokens";

/*
 * The couple's private page: a secret link (32 random bytes, kept only as a
 * sha256) plus a passcode (kept only as salted scrypt). Opening it starts a
 * session: a random token in an HttpOnly cookie, kept only as a sha256 and
 * checked against the database on every request. Nothing here touches Clerk.
 */

const SESSION_DAYS = 30;
const MAX_TOKEN_LENGTH = 100;
const MAX_PASSCODE_LENGTH = 40;
/** randomToken(32): 43 base64url characters. */
const LINK_TOKEN = /^[A-Za-z0-9_-]{43}$/;

/** One cookie per couple, so a device can hold more than one couple's page. Slugs are cookie-safe. */
const cookieName = (slug: string) => `couple_${slug}`;

/** The cookie goes only to the private page itself, which is also where its server actions post. */
async function cookiePath(slug: string): Promise<string> {
  return `${await sitePathFromRequest(slug)}/couple`;
}

/** Creates or replaces the couple's link and passcode. The old ones and every session stop working. */
export async function createAccess(coupleId: string): Promise<{ token: string; passcode: string }> {
  const token = randomToken();
  const passcode = newPasscode();
  const values = {
    tokenHash: sha256(token),
    passcodeHash: await hashPasscode(passcode),
    failedAttempts: 0,
    lockedUntil: null,
    lastUsedAt: null,
  };
  await getDb().transaction(async (tx) => {
    await tx
      .insert(coupleAccess)
      .values({ coupleId, ...values })
      .onConflictDoUpdate({ target: coupleAccess.coupleId, set: values });
    await tx.delete(coupleSessions).where(eq(coupleSessions.coupleId, coupleId));
  });
  return { token, passcode };
}

export async function revokeAccess(coupleId: string): Promise<void> {
  await getDb().transaction(async (tx) => {
    await tx.delete(coupleAccess).where(eq(coupleAccess.coupleId, coupleId));
    await tx.delete(coupleSessions).where(eq(coupleSessions.coupleId, coupleId));
  });
}

/** Lifts a lockout early, for a couple who mistyped and called the admin. */
export async function unlockAccess(coupleId: string): Promise<void> {
  await getDb().update(coupleAccess).set({ failedAttempts: 0, lockedUntil: null }).where(eq(coupleAccess.coupleId, coupleId));
}

export type AccessStatus = { updatedAt: Date; lastUsedAt: Date | null; lockedUntil: Date | null; failedAttempts: number };

/** What the admin sees about the private page. Never the hashes. */
export async function getAccessStatus(coupleId: string): Promise<AccessStatus | null> {
  const [row] = await getDb()
    .select({
      updatedAt: coupleAccess.updatedAt,
      lastUsedAt: coupleAccess.lastUsedAt,
      lockedUntil: coupleAccess.lockedUntil,
      failedAttempts: coupleAccess.failedAttempts,
    })
    .from(coupleAccess)
    .where(eq(coupleAccess.coupleId, coupleId))
    .limit(1);
  return row ?? null;
}

// Checked against when the link matches no couple, so a wrong link takes as long as a wrong passcode.
let decoyHash: Promise<string> | null = null;

export type VerifyResult = { ok: true; coupleId: string } | { ok: false; reason: "invalid" | "locked" };

/**
 * Checks a link token and passcode for the couple at `slug`. A wrong link and a
 * wrong passcode get the same answer, and take about as long. Wrong passcodes
 * count up in the database, and every fifth one locks the page for longer (see lockout.ts).
 */
export async function verifyAccess(slug: string, token: string, passcode: string): Promise<VerifyResult> {
  // Not a link this app could have made: answer at once, without spending a scrypt.
  if (!LINK_TOKEN.test(token) || passcode.length > MAX_PASSCODE_LENGTH) return { ok: false, reason: "invalid" };

  const db = getDb();
  const [row] = await db
    .select({ id: coupleAccess.id, coupleId: coupleAccess.coupleId, passcodeHash: coupleAccess.passcodeHash })
    .from(coupleAccess)
    .innerJoin(couples, eq(couples.id, coupleAccess.coupleId))
    .where(and(eq(coupleAccess.tokenHash, sha256(token)), eq(couples.slug, slug)))
    .limit(1);

  if (!row) {
    decoyHash ??= hashPasscode(randomToken(8));
    await verifyPasscode(passcode, await decoyHash);
    return { ok: false, reason: "invalid" };
  }

  const correct = await verifyPasscode(passcode, row.passcodeHash);

  // The lock is read and written under a row lock, so a burst of parallel guesses
  // is counted one by one and nothing gets in once the page is locked.
  return db.transaction(async (tx) => {
    const now = new Date();
    const [current] = await tx
      .select({ failedAttempts: coupleAccess.failedAttempts, lockedUntil: coupleAccess.lockedUntil })
      .from(coupleAccess)
      .where(eq(coupleAccess.id, row.id))
      .for("update");
    if (!current) return { ok: false, reason: "invalid" } as const;
    if (isLocked(current.lockedUntil, now)) return { ok: false, reason: "locked" } as const;

    if (!correct) {
      const failedAttempts = current.failedAttempts + 1;
      const lockedUntil = lockoutAfterFailure(failedAttempts, now);
      await tx
        .update(coupleAccess)
        .set({ failedAttempts, ...(lockedUntil ? { lockedUntil } : {}) })
        .where(eq(coupleAccess.id, row.id));
      return { ok: false, reason: lockedUntil ? "locked" : "invalid" } as const;
    }

    await tx
      .update(coupleAccess)
      .set({ failedAttempts: 0, lockedUntil: null, lastUsedAt: now })
      .where(eq(coupleAccess.id, row.id));
    return { ok: true, coupleId: row.coupleId } as const;
  });
}

/** Signs this device in to the couple's page for 30 days. */
export async function startSession(slug: string, coupleId: string): Promise<void> {
  const db = getDb();
  const token = randomToken();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DAYS * 24 * 60 * 60_000);
  await db.insert(coupleSessions).values({ coupleId, tokenHash: sha256(token), expiresAt });
  await db.delete(coupleSessions).where(and(eq(coupleSessions.coupleId, coupleId), lt(coupleSessions.expiresAt, now)));
  (await cookies()).set(cookieName(slug), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: await cookiePath(slug),
    expires: expiresAt,
  });
}

/** The couple this device is signed in to, if its session is still in the database and unexpired. */
export async function getCoupleSession(slug: string): Promise<{ coupleId: string } | null> {
  const token = (await cookies()).get(cookieName(slug))?.value;
  if (!token || token.length > MAX_TOKEN_LENGTH) return null;
  const [row] = await getDb()
    .select({ coupleId: coupleSessions.coupleId })
    .from(coupleSessions)
    .innerJoin(couples, eq(couples.id, coupleSessions.coupleId))
    .where(and(eq(coupleSessions.tokenHash, sha256(token)), eq(couples.slug, slug), gt(coupleSessions.expiresAt, new Date())))
    .limit(1);
  return row ?? null;
}

export async function endSession(slug: string): Promise<void> {
  const jar = await cookies();
  const token = jar.get(cookieName(slug))?.value;
  if (token) await getDb().delete(coupleSessions).where(eq(coupleSessions.tokenHash, sha256(token)));
  jar.set(cookieName(slug), "", { path: await cookiePath(slug), maxAge: 0 });
}
