import { pickText, type Locale, type LocalizedText } from "./localized";

/**
 * Ethiopian full names are the first name followed by the father's name.
 * Each part falls back to the other language on its own, so a couple who
 * only typed the father's name in English still get a complete name in Amharic.
 */
export function fullName(first: LocalizedText, father: LocalizedText | null | undefined, locale: Locale): string {
  return [pickText(first, locale), pickText(father, locale)].filter((part) => part.trim()).join(" ");
}
