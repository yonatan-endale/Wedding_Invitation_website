const STEP = 5;
const FIRST_LOCK_MS = 15 * 60_000;
const LONGEST_LOCK_MS = 24 * 60 * 60_000;

/**
 * Locks the couple's page after every fifth wrong passcode in a row: 15 minutes,
 * then 30, then an hour, doubling up to a day. Kept in the database, so it holds
 * across server instances where the in-memory rate limit does not.
 */
export function lockoutAfterFailure(failedAttempts: number, now: Date): Date | null {
  if (failedAttempts <= 0 || failedAttempts % STEP !== 0) return null;
  const ms = Math.min(FIRST_LOCK_MS * 2 ** (failedAttempts / STEP - 1), LONGEST_LOCK_MS);
  return new Date(now.getTime() + ms);
}

export function isLocked(lockedUntil: Date | null | undefined, now: Date): boolean {
  return Boolean(lockedUntil && lockedUntil.getTime() > now.getTime());
}
