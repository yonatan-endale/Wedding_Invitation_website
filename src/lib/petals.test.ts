import { describe, expect, it } from "vitest";
import { petalLayout } from "./petals";

describe("petalLayout", () => {
  it("returns the requested number of petals", () => {
    expect(petalLayout(12)).toHaveLength(12);
    expect(petalLayout(0)).toEqual([]);
  });

  it("is the same on every call, so server and client markup match", () => {
    expect(petalLayout(12)).toEqual(petalLayout(12));
  });

  it("keeps every value inside its range", () => {
    for (const petal of petalLayout(40)) {
      expect(petal.left).toBeGreaterThanOrEqual(0);
      expect(petal.left).toBeLessThanOrEqual(100);
      expect(petal.delay).toBeGreaterThanOrEqual(0);
      expect(petal.delay).toBeLessThan(petal.duration);
      expect(petal.duration).toBeGreaterThanOrEqual(14);
      expect(petal.duration).toBeLessThanOrEqual(24);
      expect(petal.size).toBeGreaterThanOrEqual(14);
      expect(petal.size).toBeLessThanOrEqual(26);
      expect(Math.abs(petal.drift)).toBeLessThanOrEqual(60);
      expect(petal.opacity).toBeGreaterThanOrEqual(0.7);
      expect(petal.opacity).toBeLessThanOrEqual(0.9);
    }
  });

  it("spreads petals across the width instead of bunching them", () => {
    const lefts = petalLayout(12).map((p) => p.left);
    expect(Math.min(...lefts)).toBeLessThan(20);
    expect(Math.max(...lefts)).toBeGreaterThan(80);
  });
});
