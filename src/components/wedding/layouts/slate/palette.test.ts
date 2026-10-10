import { describe, expect, it } from "vitest";
import { contrastRatio } from "@/lib/contrast";
import { THEME_LIST } from "@/lib/theme";
import { LAYOUTS } from "@/lib/layout";
import { BAND_CONTRAST, isCoolOrQuiet, isDarkTheme, slateColors } from "./palette";

const theme = (name: string) => THEME_LIST.find((candidate) => candidate.name === name)!;

describe("slateColors", () => {
  it.each(THEME_LIST.map((entry) => [entry.name, entry] as const))("%s: the band is dark and every accent passes AA", (_, entry) => {
    const { band, onBand, glow, accent } = slateColors(entry.colors);
    expect(contrastRatio(onBand, band)).toBeGreaterThanOrEqual(BAND_CONTRAST);
    expect(contrastRatio(glow, band)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(accent, entry.colors.paper)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(accent, entry.colors.sheet)).toBeGreaterThanOrEqual(4.5);
  });

  it.each(LAYOUTS.slate.recommendedThemes.map((name) => [name] as const))("%s: the buttons' own colours pass AA", (name) => {
    const { colors } = theme(name);
    expect(contrastRatio(colors.onThread1, colors.thread1)).toBeGreaterThanOrEqual(4.5);
  });

  it("gives Slate a navy band from its deep thread", () => {
    const { band, onBand } = slateColors(theme("slate").colors);
    expect(band).not.toBe(theme("slate").colors.ink);
    expect(onBand).toBe("#ffffff");
    const [r, g, b] = [1, 3, 5].map((i) => Number.parseInt(band.slice(i, i + 2), 16));
    expect(b).toBeGreaterThan(r);
    expect(b).toBeGreaterThan(g);
  });

  it("falls back to the ink when the deep thread is pale (Ivory) or warm (Basalt, Tibeb)", () => {
    for (const name of ["ivory", "basalt", "tibeb"]) expect(slateColors(theme(name).colors).band).toBe(theme(name).colors.ink);
  });

  it("takes navies, slates, teals and greys for a band, not reds or golds", () => {
    expect(["#1e3a4c", "#34566b", "#1f5a43", "#9a948a", "#4a4741"].every(isCoolOrQuiet)).toBe(true);
    expect(["#a8372c", "#7a3a2a", "#c39a3e", "#c98a94"].some(isCoolOrQuiet)).toBe(false);
  });

  it("deepens the paper of a dark theme (Emerald) and keeps its ink on the band", () => {
    const { colors } = theme("emerald");
    expect(isDarkTheme(colors)).toBe(true);
    const { band, onBand } = slateColors(colors);
    expect(onBand).toBe(colors.ink);
    expect(contrastRatio(band, "#000000")).toBeLessThan(contrastRatio(colors.paper, "#000000"));
  });

  it("keeps Slate's teal where it already reads on the white cards", () => {
    const { colors } = theme("slate");
    expect(contrastRatio(colors.thread1, colors.sheet)).toBeGreaterThanOrEqual(4.5);
  });
});
