import { pickText, type Locale, type LocalizedText } from "./localized";

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
  const trimmed = text.trim();
  if (!trimmed) return "";
  const first = new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(trimmed)[Symbol.iterator]().next();
  return first.done ? "" : first.value.segment.toLocaleUpperCase();
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
