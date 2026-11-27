import { describe, expect, it } from "vitest";
import { bareAge, milestoneAge, milestoneNumber } from "./milestone";

describe("milestoneNumber", () => {
  it("finds the age in the ways people write it", () => {
    expect(milestoneNumber("Turns 30")).toBe(30);
    expect(milestoneNumber("60th birthday")).toBe(60);
    expect(milestoneNumber("ዕድሜ 50")).toBe(50);
    expect(milestoneNumber("የልዑል ደጃዝማች መንገሻ 100ኛ ዓመት የልደት በዓል")).toBe(100);
  });

  it("reads an age written in Ge'ez numerals", () => {
    expect(milestoneNumber("፻ኛ ዓመት")).toBe(100);
    expect(milestoneNumber("፹፭ ዓመት")).toBe(85);
    expect(milestoneNumber("፻፲፩")).toBe(111);
  });

  it("ignores lines without a believable age", () => {
    expect(milestoneNumber("Our little one")).toBeNull();
    expect(milestoneNumber("Class of 2026")).toBeNull();
    expect(milestoneNumber("0 years")).toBeNull();
    expect(milestoneNumber("፳፻፲፱")).toBeNull();
    expect(milestoneNumber("")).toBeNull();
  });
});

describe("milestoneAge", () => {
  it("prefers the person's own line, then falls back to the tagline", () => {
    expect(milestoneAge("Turns 90", "100 years of grace")).toBe(90);
    expect(milestoneAge("", "100ኛ ዓመት የልደት በዓል")).toBe(100);
    expect(milestoneAge("Our grandfather", "With love")).toBeNull();
  });
});

describe("bareAge", () => {
  it("is the age only when the line is nothing but the number", () => {
    expect(bareAge("100")).toBe(100);
    expect(bareAge(" ፻ ")).toBe(100);
    expect(bareAge("Turns 100")).toBeNull();
    expect(bareAge("100 ዓመት")).toBeNull();
    expect(bareAge("2026")).toBeNull();
    expect(bareAge("")).toBeNull();
  });
});
