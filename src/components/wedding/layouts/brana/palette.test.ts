import { describe, expect, it } from "vitest";
import { contrastRatio } from "@/lib/contrast";
import { THEME_LIST } from "@/lib/theme";
import { CINNABAR, branaColors, darkestParchment, isRubricRed, parchment } from "./palette";

const theme = (name: string) => THEME_LIST.find((candidate) => candidate.name === name)!;

describe("parchment", () => {
  it("warms the paper with vellum, as color-mix(in srgb) does on the page", () => {
    expect(parchment("#fbf8f1")).toBe("#f3ebdc");
  });
});

describe("isRubricRed", () => {
  it("takes reds, red-browns and roses, not blues, greys, golds or greens", () => {
    expect(["#9c3b30", "#7a3a2a", "#8e3b46", "#e4572e", "#c2626f", "#d9a1a8"].every(isRubricRed)).toBe(true);
    expect(["#34566b", "#9a948a", "#b8913a", "#1f5a43", "#4a4741"].some(isRubricRed)).toBe(false);
  });
});

describe("branaColors", () => {
  it.each(THEME_LIST.map((entry) => [entry.name, entry] as const))("%s: rubric, soft ink and ink pass AA on the parchment", (_, entry) => {
    const { rubric, inkSoft } = branaColors(entry.colors);
    for (const ground of [parchment(entry.colors.paper), darkestParchment(entry.colors.paper)]) {
      expect(contrastRatio(rubric, ground)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(inkSoft, ground)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(entry.colors.ink, ground)).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("stays a red on every light theme", () => {
    for (const entry of THEME_LIST.filter((candidate) => candidate.scheme === "light")) {
      expect(isRubricRed(branaColors(entry.colors).rubric), entry.name).toBe(true);
    }
  });

  it("keeps close to the theme's own red thread (Netela)", () => {
    expect(contrastRatio(branaColors(theme("netela").colors).rubric, "#9c3b30")).toBeLessThan(1.15);
  });

  it("takes the red thread when thread-3 is not red (Lalibela's blue)", () => {
    expect(contrastRatio(branaColors(theme("lalibela").colors).rubric, "#8e3b46")).toBeLessThan(1.15);
  });

  it("falls back to cinnabar when no thread is red (Ivory)", () => {
    expect(contrastRatio(branaColors(theme("ivory").colors).rubric, CINNABAR)).toBeLessThan(1.15);
  });
});
