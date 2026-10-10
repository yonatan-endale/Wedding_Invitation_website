import { contrastRatio, mixHex } from "@/lib/contrast";

/*
 * Slate's colours, worked out from the theme so they can be checked: the deep
 * band behind the cover's foot, the dark cards and the footer, the accent as
 * it reads on that band, and the accent as small text on the paper and the
 * white cards. The layout sets them on its root as --slate-* variables.
 */

const WHITE = "#ffffff";
const BLACK = "#000000";

/** White text on a band needs at least this much, so the band reads as dark, not just as dark enough. */
export const BAND_CONTRAST = 7;

/** How much of the ink is folded into the deep thread, so the band sits a shade deeper than the thread itself. */
export const BAND_INK_SHARE = 0.3;

/** How far a dark theme's paper is taken toward black for its band. */
export const DARK_BAND_SHADE = 0.4;

type Colors = { paper: string; ink: string; sheet: string; thread1: string; thread3: string };

export type SlateColors = {
  /** The deep band: the cover's gradient, the dark cards and the footer. */
  band: string;
  /** Text on the band. */
  onBand: string;
  /** The accent as text and marks on the band (4.5:1). */
  glow: string;
  /** The accent as small text on the paper and the white cards (4.5:1 on both). */
  accent: string;
};

/** Dark paper (a dark theme) has light ink. */
export const isDarkTheme = (colors: Pick<Colors, "paper" | "ink">) => contrastRatio(colors.paper, BLACK) < contrastRatio(colors.ink, BLACK);

/** Hue in degrees and saturation (HSL), from #rrggbb. */
function hueAndSaturation(hex: string): { h: number; s: number } {
  const value = Number.parseInt(hex.slice(1), 16);
  const [r, g, b] = [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((c) => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return { h: 0, s: 0 };
  const l = (max + min) / 2;
  const s = d / (1 - Math.abs(2 * l - 1));
  const h = max === r ? ((g - b) / d + 6) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: h * 60, s };
}

/** A cool or quiet colour (a navy, slate, teal or grey) that can carry a whole band; reds and golds cannot. */
export function isCoolOrQuiet(hex: string): boolean {
  const { h, s } = hueAndSaturation(hex);
  return s < 0.12 || (h >= 150 && h <= 270);
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
 * The band is the theme's deep thread (Slate's navy) deepened a little with
 * the ink, when that thread is cool or quiet and white type reads on it at
 * 7:1. Otherwise a light theme falls back to its ink (Ivory's thread-3 is a
 * pale grey, Basalt's an oxblood) and a dark theme to its paper taken toward
 * black, so the band is always the darkest, calmest thing on the page.
 */
export function slateColors(colors: Colors): SlateColors {
  const dark = isDarkTheme(colors);
  const deep = mixHex(colors.thread3, colors.ink, BAND_INK_SHARE);
  const band = dark
    ? mixHex(colors.paper, BLACK, DARK_BAND_SHADE)
    : isCoolOrQuiet(colors.thread3) && contrastRatio(deep, WHITE) >= BAND_CONTRAST
      ? deep
      : colors.ink;
  const onBand = dark ? colors.ink : WHITE;
  return {
    band,
    onBand,
    glow: readable(colors.thread1, [band], 4.5, onBand),
    accent: readable(colors.thread1, [colors.paper, colors.sheet], 4.5, colors.ink),
  };
}
