import { contrastRatio, mixHex } from "@/lib/contrast";

/*
 * Brana Manuscript's colours, worked out from the theme so they can be
 * checked. The parchment itself is drawn in brana.module.css with
 * color-mix(in srgb, …), which is exactly mixHex here, so the numbers in this
 * file and the colours on the page agree.
 */

/** The warm vellum tone mixed into the theme's paper to make the parchment (keep in step with brana.module.css). */
export const VELLUM = "#c9a46c";
export const VELLUM_SHARE = 0.16;

/** The brown of the darkened edges and the foxing (keep in step with brana.module.css). */
export const FOXING = "#8a6534";
/** The most of it any text can sit on: the edge vignette and a foxing spot together. */
export const FOXING_MAX = 0.2;

/** A scribe's cinnabar, for themes that have no red thread. */
export const CINNABAR = "#a23a22";

/** A deep madder: light pages deepen their red toward it, so it stays red instead of browning toward the ink. */
export const MADDER = "#3a0d08";

/** AA for body-size text, so the rubric can carry small labels as well as headings. */
export const RUBRIC_CONTRAST = 4.5;

type Colors = { paper: string; ink: string; inkSoft: string; thread1: string; thread2: string; thread3: string };

/** Dark paper (a dark theme) has light ink. */
const isDark = (colors: Colors) => contrastRatio(colors.paper, "#000000") < contrastRatio(colors.ink, "#000000");

/** The parchment: the theme's paper warmed with vellum. */
export function parchment(paper: string): string {
  return mixHex(paper, VELLUM, VELLUM_SHARE);
}

/** The darkest parchment any text sits on: an edge of the page under a foxing spot. */
export function darkestParchment(paper: string): string {
  return mixHex(parchment(paper), FOXING, FOXING_MAX);
}

/** Hue in degrees, saturation and lightness (HSL), from #rrggbb. */
function hsl(hex: string): { h: number; s: number; l: number } {
  const value = Number.parseInt(hex.slice(1), 16);
  const [r, g, b] = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: h * 60, s, l };
}

/** A red (or a red-brown or rose) a scribe could have rubricated with. */
export function isRubricRed(hex: string): boolean {
  const { h, s, l } = hsl(hex);
  return (h >= 340 || h <= 30) && s >= 0.25 && l >= 0.15 && l <= 0.78;
}

/** Moves `color` toward `toward` in twentieths until it reaches `ratio` on every ground. */
function readable(color: string, grounds: string[], ratio: number, toward: string): string {
  for (let step = 0; step <= 20; step++) {
    const candidate = mixHex(color, toward, step / 20);
    if (grounds.every((ground) => contrastRatio(candidate, ground) >= ratio)) return candidate;
  }
  return toward;
}

/**
 * The page's rubric and secondary ink. The rubric is the theme's red thread:
 * thread-3, or thread-1 or thread-2 when thread-3 is not a red (Lalibela's is
 * a priest's blue), or a scribe's cinnabar when no thread is. On light
 * paper it is deepened toward a dark madder (on dark paper, lifted toward the
 * ink) until it reads at 4.5:1 on the parchment and on its darkest, foxed
 * edge. The soft ink is moved toward the ink the same way.
 */
export function branaColors(colors: Colors): { parchment: string; rubric: string; inkSoft: string } {
  const grounds = [parchment(colors.paper), darkestParchment(colors.paper)];
  const red = [colors.thread3, colors.thread1, colors.thread2].find(isRubricRed) ?? CINNABAR;
  return {
    parchment: grounds[0],
    rubric: readable(red, grounds, RUBRIC_CONTRAST, isDark(colors) ? colors.ink : MADDER),
    inkSoft: readable(colors.inkSoft, grounds, 4.5, colors.ink),
  };
}
