export const LOCALES = ["en", "am"] as const;
export type Locale = (typeof LOCALES)[number];

export type LocalizedText = { en: string; am?: string };

export function isLocale(value: unknown): value is Locale {
  return value === "en" || value === "am";
}

/** Returns text in the requested language, falling back to whichever language has content. */
export function pickText(text: LocalizedText | null | undefined, locale: Locale): string {
  if (!text) return "";
  const preferred = locale === "am" ? text.am : text.en;
  if (preferred && preferred.trim()) return preferred;
  const other = locale === "am" ? text.en : text.am;
  return other && other.trim() ? other : "";
}
