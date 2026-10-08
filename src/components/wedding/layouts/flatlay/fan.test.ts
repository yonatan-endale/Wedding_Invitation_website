import { describe, expect, it } from "vitest";
import { PRINTS_SHOWN, dealFans, fanSizes } from "./fan";

describe("fanSizes", () => {
  it("deals nothing for no photos", () => {
    expect(fanSizes(0)).toEqual([]);
  });

  it("keeps one to three photos in a single fan", () => {
    expect(fanSizes(1)).toEqual([1]);
    expect(fanSizes(2)).toEqual([2]);
    expect(fanSizes(3)).toEqual([3]);
  });

  it("never leaves a single print alone after the first fan", () => {
    for (let count = 2; count <= PRINTS_SHOWN; count++) {
      const sizes = fanSizes(count);
      expect(sizes.reduce((a, b) => a + b, 0)).toBe(count);
      expect(Math.min(...sizes)).toBeGreaterThanOrEqual(2);
      expect(Math.max(...sizes)).toBeLessThanOrEqual(3);
    }
  });

  it("evens the fans out", () => {
    expect(fanSizes(4)).toEqual([2, 2]);
    expect(fanSizes(7)).toEqual([3, 2, 2]);
    expect(fanSizes(12)).toEqual([3, 3, 3, 3]);
  });
});

describe("dealFans", () => {
  it("shows at most PRINTS_SHOWN prints, in order", () => {
    const fans = dealFans(20);
    expect(fans.reduce((n, fan) => n + fan.poses.length, 0)).toBe(PRINTS_SHOWN);
    expect(fans.map((fan) => fan.start)).toEqual([0, 3, 6, 9]);
  });

  it("keeps every print inside its fan and reading left to right", () => {
    for (let count = 1; count <= PRINTS_SHOWN; count++) {
      for (const fan of dealFans(count)) {
        const lefts = fan.poses.map((pose) => pose.left);
        expect(lefts).toEqual([...lefts].sort((a, b) => a - b));
        for (const pose of fan.poses) {
          expect(pose.left).toBeGreaterThanOrEqual(0);
          expect(pose.left + pose.width).toBeLessThanOrEqual(100);
          expect(pose.top).toBeGreaterThanOrEqual(0);
          expect(fan.height).toBeGreaterThan(pose.top + pose.width);
        }
      }
    }
  });

  it("mirrors every other fan", () => {
    const [first, second] = dealFans(6);
    expect(second.poses.map((pose) => pose.rotate)).toEqual(first.poses.map((pose) => -pose.rotate).reverse());
  });

  it("puts the middle print of three on top", () => {
    const [fan] = dealFans(3);
    expect(fan.poses[1].z).toBeGreaterThan(fan.poses[0].z);
    expect(fan.poses[1].z).toBeGreaterThan(fan.poses[2].z);
  });
});
