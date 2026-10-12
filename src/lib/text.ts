/** Splits text into the characters a reader sees, so Ethiopic syllables and accented letters stay whole. */
export function graphemes(text: string, locale?: string): string[] {
  return Array.from(new Intl.Segmenter(locale, { granularity: "grapheme" }).segment(text), (part) => part.segment);
}
