import { describe, expect, it } from "vitest";
import { isLocked, lockoutAfterFailure } from "./lockout";

const now = new Date("2026-10-07T12:00:00Z");
const minutes = (date: Date | null) => (date ? (date.getTime() - now.getTime()) / 60_000 : null);

describe("lockoutAfterFailure", () => {
  it("does not lock before the fifth failure", () => {
    for (const n of [0, 1, 2, 3, 4, 6, 9]) expect(lockoutAfterFailure(n, now)).toBeNull();
  });

  it("locks for 15 minutes, then doubles", () => {
    expect(minutes(lockoutAfterFailure(5, now))).toBe(15);
    expect(minutes(lockoutAfterFailure(10, now))).toBe(30);
    expect(minutes(lockoutAfterFailure(15, now))).toBe(60);
  });

  it("never locks for more than a day", () => {
    expect(minutes(lockoutAfterFailure(100, now))).toBe(24 * 60);
    expect(minutes(lockoutAfterFailure(5000, now))).toBe(24 * 60);
  });
});

describe("isLocked", () => {
  it("is locked only until the time passes", () => {
    expect(isLocked(new Date(now.getTime() + 1), now)).toBe(true);
    expect(isLocked(new Date(now.getTime() - 1), now)).toBe(false);
    expect(isLocked(null, now)).toBe(false);
  });
});
