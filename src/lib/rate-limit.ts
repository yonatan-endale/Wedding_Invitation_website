type Options = { limit: number; windowMs: number; now?: () => number };

/**
 * Fixed-window limiter kept in memory. Good enough to slow down repeated RSVP
 * spam on one warm instance; swap for Upstash if abuse becomes real.
 */
export function createRateLimiter({ limit, windowMs, now = Date.now }: Options) {
  const hits = new Map<string, { count: number; resetAt: number }>();

  return {
    check(key: string): boolean {
      const t = now();
      const entry = hits.get(key);
      if (!entry || t > entry.resetAt) {
        if (hits.size > 5000) hits.clear();
        hits.set(key, { count: 1, resetAt: t + windowMs });
        return true;
      }
      if (entry.count >= limit) return false;
      entry.count += 1;
      return true;
    },
  };
}
