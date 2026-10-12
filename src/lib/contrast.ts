/**
 * WCAG 2.x colour contrast for `#rrggbb` colours. Used by the theme tests and by
 * `darkVariant()` to keep derived palettes readable.
 */

function channels(hex: string): [number, number, number] {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) throw new Error(`Expected a #rrggbb colour, got "${hex}"`);
  const value = Number.parseInt(match[1], 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function linear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Relative luminance from 0 (black) to 1 (white), per WCAG. */
export function relativeLuminance(hex: string): number {
  const [r, g, b] = channels(hex);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** Contrast ratio between two colours, from 1 (same) to 21 (black on white). Order does not matter. */
export function contrastRatio(hexA: string, hexB: string): number {
  const a = relativeLuminance(hexA);
  const b = relativeLuminance(hexB);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** `amount` of `to` mixed into `from` in sRGB, from 0 (all `from`) to 1 (all `to`). */
export function mixHex(from: string, to: string, amount: number): string {
  const a = channels(from);
  const b = channels(to);
  const t = Math.min(1, Math.max(0, amount));
  return `#${a
    .map((channel, index) => Math.round(channel + (b[index] - channel) * t).toString(16).padStart(2, "0"))
    .join("")}`;
}
