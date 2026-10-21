import { describe, expect, it } from "vitest";
import { milestoneNumber } from "./milestone";

describe("milestoneNumber", () => {
  it("finds the age in the ways people write it", () => {
    expect(milestoneNumber("Turns 30")).toBe(30);
    expect(milestoneNumber("60th birthday")).toBe(60);
    expect(milestoneNumber("ዕድሜ 50")).toBe(50);
  });

  it("ignores lines without a believable age", () => {
    expect(milestoneNumber("Our little one")).toBeNull();
    expect(milestoneNumber("Class of 2026")).toBeNull();
    expect(milestoneNumber("0 years")).toBeNull();
    expect(milestoneNumber("")).toBeNull();
  });
});
