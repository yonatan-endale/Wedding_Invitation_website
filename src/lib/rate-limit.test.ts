import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";

describe("createRateLimiter", () => {
  it("allows requests up to the limit within the window", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000, now: () => 0 });
    expect(limiter.check("ip")).toBe(true);
    expect(limiter.check("ip")).toBe(true);
    expect(limiter.check("ip")).toBe(false);
  });

  it("allows requests again after the window passes", () => {
    let now = 0;
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => now });
    expect(limiter.check("ip")).toBe(true);
    now = 1001;
    expect(limiter.check("ip")).toBe(true);
  });

  it("tracks keys separately", () => {
    const limiter = createRateLimiter({ limit: 1, windowMs: 1000, now: () => 0 });
    expect(limiter.check("a")).toBe(true);
    expect(limiter.check("b")).toBe(true);
  });
});
