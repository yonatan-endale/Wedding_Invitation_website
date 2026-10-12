import { describe, expect, it } from "vitest";
import { scallopPath } from "./ornament-geometry";

describe("scallopPath", () => {
  it("draws one curve per lobe and closes the shape", () => {
    const path = scallopPath(60, 60, 50, 12, 2);
    expect(path.startsWith("M")).toBe(true);
    expect(path.endsWith("Z")).toBe(true);
    expect(path.match(/Q/g)).toHaveLength(12);
  });

  it("starts and ends in the same dip at the top", () => {
    const path = scallopPath(60, 60, 50, 8, 3);
    expect(path).toMatch(/^M60 13Q/);
    expect(path).toMatch(/ 60 13Z$/);
  });
});
