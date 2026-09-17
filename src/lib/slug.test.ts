import { describe, expect, it } from "vitest";
import { isValidSlug, slugify } from "./slug";

describe("slugify", () => {
  it("joins partner names into a lowercase hyphenated slug", () => {
    expect(slugify("Yididiya & Kiber")).toBe("yididiya-kiber");
  });

  it("strips accents and punctuation", () => {
    expect(slugify("  Hélène  +  Dawit!! ")).toBe("helene-dawit");
  });

  it("returns an empty string when nothing latin remains", () => {
    expect(slugify("ሰላም")).toBe("");
  });

  it("trims to 40 characters without a trailing hyphen", () => {
    const slug = slugify("a".repeat(39) + " bbbb");
    expect(slug.length).toBeLessThanOrEqual(40);
    expect(slug.endsWith("-")).toBe(false);
  });
});

describe("isValidSlug", () => {
  it("accepts lowercase letters, digits and single hyphens", () => {
    expect(isValidSlug("sara-dawit-2026")).toBe(true);
  });

  it("rejects uppercase, spaces and edge hyphens", () => {
    expect(isValidSlug("Sara")).toBe(false);
    expect(isValidSlug("sara dawit")).toBe(false);
    expect(isValidSlug("-sara")).toBe(false);
    expect(isValidSlug("sara-")).toBe(false);
    expect(isValidSlug("sara--dawit")).toBe(false);
  });

  it("rejects slugs that are too short or too long", () => {
    expect(isValidSlug("ab")).toBe(false);
    expect(isValidSlug("a".repeat(41))).toBe(false);
  });

  it("rejects reserved words used by the platform", () => {
    for (const word of ["www", "admin", "api", "app", "sign-in", "s"]) {
      expect(isValidSlug(word)).toBe(false);
    }
  });
});
