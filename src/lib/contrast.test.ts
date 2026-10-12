import { describe, expect, it } from "vitest";
import { contrastRatio, mixHex, relativeLuminance } from "./contrast";

describe("relativeLuminance", () => {
  it("runs from 0 for black to 1 for white", () => {
    expect(relativeLuminance("#000000")).toBe(0);
    expect(relativeLuminance("#ffffff")).toBe(1);
  });

  it("weights green above red above blue", () => {
    expect(relativeLuminance("#00ff00")).toBeCloseTo(0.7152, 4);
    expect(relativeLuminance("#ff0000")).toBeCloseTo(0.2126, 4);
    expect(relativeLuminance("#0000ff")).toBeCloseTo(0.0722, 4);
  });

  it("rejects anything but #rrggbb", () => {
    expect(() => relativeLuminance("#fff")).toThrow();
    expect(() => relativeLuminance("red")).toThrow();
  });
});

describe("contrastRatio", () => {
  it("is 21 for black on white and 1 for a colour on itself", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBe(21);
    expect(contrastRatio("#c49a22", "#c49a22")).toBe(1);
  });

  it("matches known WCAG pairs in either order", () => {
    // #767676 is the classic lightest grey that passes AA on white.
    expect(contrastRatio("#767676", "#ffffff")).toBeCloseTo(4.54, 2);
    expect(contrastRatio("#ffffff", "#767676")).toBeCloseTo(4.54, 2);
    expect(contrastRatio("#777777", "#ffffff")).toBeLessThan(4.5);
  });

  it("ignores hex case", () => {
    expect(contrastRatio("#C49A22", "#FFFFFF")).toBe(contrastRatio("#c49a22", "#ffffff"));
  });
});

describe("mixHex", () => {
  it("returns either end at 0 and 1 and the midpoint at 0.5", () => {
    expect(mixHex("#000000", "#ffffff", 0)).toBe("#000000");
    expect(mixHex("#000000", "#ffffff", 1)).toBe("#ffffff");
    expect(mixHex("#000000", "#ffffff", 0.5)).toBe("#808080");
    expect(mixHex("#0b0b0b", "#17261f", 0.4)).toBe("#101613");
  });

  it("clamps the amount", () => {
    expect(mixHex("#102030", "#ffffff", -1)).toBe("#102030");
    expect(mixHex("#102030", "#ffffff", 2)).toBe("#ffffff");
  });
});
