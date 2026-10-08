import { describe, expect, it } from "vitest";
import { CORNER, MEDALLION, RULE, mapSpine, pointOn, reverseSpine, spinePath, swapXY, type Spine } from "./stitch";

const S: Spine = {
  start: [0, 0],
  segs: [
    [[1, 0], [2, 1], [3, 1]],
    [[4, 1], [5, 3], [6, 3]],
  ],
};

/** How many subpaths a path's data starts (each M is one). */
const subpaths = (d: string) => (d.match(/M/g) ?? []).length;

describe("stitch geometry", () => {
  it("reverses a spine end to start with its control points swapped", () => {
    const reversed = reverseSpine(S);
    expect(reversed.start).toEqual([6, 3]);
    expect(reversed.segs).toEqual([
      [[5, 3], [4, 1], [3, 1]],
      [[2, 1], [1, 0], [0, 0]],
    ]);
    expect(reverseSpine(reversed)).toEqual(S);
  });

  it("mirrors across the diagonal", () => {
    expect(mapSpine(S, swapXY).segs[1][2]).toEqual([3, 6]);
  });

  it("finds the ends of a segment and the direction of travel", () => {
    expect(pointOn(S, 0, 0).at).toEqual([0, 0]);
    expect(pointOn(S, 1, 1).at).toEqual([6, 3]);
    expect(pointOn(S, 0, 0).angle).toBe(0);
  });

  it("continues a subpath instead of starting a new one when asked", () => {
    expect(spinePath(S, false).startsWith("L0 0C")).toBe(true);
  });

  it("gives every motif a needle of one subpath, so each draws as a single animated path", () => {
    for (const needle of [CORNER.needle, MEDALLION.needle, RULE.needle]) expect(subpaths(needle)).toBe(1);
  });
});
