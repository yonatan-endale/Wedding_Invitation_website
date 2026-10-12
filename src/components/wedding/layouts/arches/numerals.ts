import { toGeez } from "@/lib/geez";
import type { Locale } from "@/lib/localized";

const ROMAN: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

/** 1 → "I", 14 → "XIV". */
export function romanNumeral(value: number): string {
  let rest = Math.floor(value);
  let out = "";
  for (const [amount, symbol] of ROMAN) {
    while (rest >= amount) {
      out += symbol;
      rest -= amount;
    }
  }
  return out;
}

/** 1 → "፩", 14 → "፲፬". Ge'ez numerals have no zero; past 99 the plain digits are clearer. */
export function geezNumeral(value: number): string {
  const n = Math.floor(value);
  if (n < 1 || n > 99) return String(n);
  return toGeez(n);
}

/**
 * The ordinal mark carved over each niche of the arcade: Roman numerals in
 * English, Ge'ez numerals in Amharic. Out-of-range values fall back to digits.
 */
export function niche(value: number, locale: Locale): string {
  if (value < 1 || !Number.isFinite(value)) return String(value);
  return locale === "am" ? geezNumeral(value) : romanNumeral(value);
}
