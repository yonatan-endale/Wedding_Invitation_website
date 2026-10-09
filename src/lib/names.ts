import { pickText, type Locale, type LocalizedText } from "./localized";
import { graphemes } from "./text";

/**
 * Ethiopian full names are the first name followed by the father's name.
 * Each part falls back to the other language on its own, so a couple who
 * only typed the father's name in English still get a complete name in Amharic.
 */
export function fullName(first: LocalizedText, father: LocalizedText | null | undefined, locale: Locale): string {
  return [pickText(first, locale), pickText(father, locale)].filter((part) => part.trim()).join(" ");
}

/** The first character as a reader sees it, so an Ethiopic syllable or an accented letter stays whole. */
export function firstGrapheme(text: string): string {
  return (graphemes(text.trim())[0] ?? "").toLocaleUpperCase();
}

/**
 * The couple's initials in the order the names were entered. Habesha names
 * have no shared surname, so a monogram is always the two first initials.
 */
export function initials(one: string, two: string): [string, string] {
  return [firstGrapheme(one), firstGrapheme(two)];
}

/** "H & D", the monogram in the header and watermark. A missing initial is left out. */
export function monogramText([one, two]: [string, string]): string {
  return [one, two].filter(Boolean).join(" & ");
}

const ETHIOPIC = /[\u1200-\u139F\u2D80-\u2DDF\uAB00-\uAB2F]/;

/** A word's rough width in em: Ge'ez syllables run wider than Latin letters, capitals wider than lower case. */
function wordWidthEm(word: string): number {
  return graphemes(word).reduce((sum, char) => sum + (ETHIOPIC.test(char) ? 0.86 : /\p{Lu}/u.test(char) ? 0.66 : 0.52), 0);
}

/**
 * The widest single word across the names, in em. Hero headings divide the
 * screen width by it to cap their size, so a long name like "Woldegiyorgis"
 * stays on screen instead of running past the edge of a phone.
 */
export function widestWordEm(...texts: string[]): number {
  const words = texts.flatMap((text) => text.split(/\s+/)).filter(Boolean);
  return Math.max(1, ...words.map(wordWidthEm));
}

