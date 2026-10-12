import { describe, expect, it } from "vitest";
import { geezNumeral, niche, romanNumeral } from "./numerals";

describe("romanNumeral", () => {
  it("writes the usual forms", () => {
    expect([1, 2, 3, 4, 5, 6, 9, 10, 14, 40, 99].map(romanNumeral)).toEqual([
      "I",
      "II",
      "III",
      "IV",
      "V",
      "VI",
      "IX",
      "X",
      "XIV",
      "XL",
      "XCIX",
    ]);
  });
});

describe("geezNumeral", () => {
  it("joins tens and ones", () => {
    expect([1, 6, 10, 11, 20, 26, 99].map(geezNumeral)).toEqual(["፩", "፮", "፲", "፲፩", "፳", "፳፮", "፺፱"]);
  });

  it("falls back to digits outside 1 to 99", () => {
    expect(geezNumeral(0)).toBe("0");
    expect(geezNumeral(100)).toBe("100");
  });
});

describe("niche", () => {
  it("picks the numerals for the language", () => {
    expect(niche(3, "en")).toBe("III");
    expect(niche(3, "am")).toBe("፫");
    expect(niche(0, "en")).toBe("0");
  });
});
