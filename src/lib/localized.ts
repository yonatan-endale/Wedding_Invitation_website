export const LOCALES = ["en", "am", "ar", "ti", "om"] as const;
export type Locale = (typeof LOCALES)[number];

export type Script = "latin" | "ethiopic" | "arabic";

type Language = {
  englishName: string;
  nativeName: string;
  /** The label on the guest's language switcher. */
  short: string;
  script: Script;
  dir: "ltr" | "rtl";
  /** Which calendar a guest reading this language recognises first. */
  calendar: "ethiopian" | "gregorian";
  /** The word between the two names: "Selam and Dawit". */
  and: string;
  /** Between the initials on monograms and seals. */
  initialsSeparator: "&" | "፡";
};

export const LANGUAGES: Record<Locale, Language> = {
  en: {
    englishName: "English",
    nativeName: "English",
    short: "EN",
    script: "latin",
    dir: "ltr",
    calendar: "gregorian",
    and: "&",
    initialsSeparator: "&",
  },
  am: {
    englishName: "Amharic",
    nativeName: "አማርኛ",
    short: "አማ",
    script: "ethiopic",
    dir: "ltr",
    calendar: "ethiopian",
    and: "እና",
    initialsSeparator: "፡",
  },
  ar: {
    englishName: "Arabic",
    nativeName: "العربية",
    short: "ع",
    script: "arabic",
    dir: "rtl",
    calendar: "gregorian",
    and: "و",
    initialsSeparator: "&",
  },
  ti: {
    englishName: "Tigrigna",
    nativeName: "ትግርኛ",
    short: "ትግ",
    script: "ethiopic",
    dir: "ltr",
    calendar: "ethiopian",
    and: "&",
    initialsSeparator: "፡",
  },
  om: {
    englishName: "Afaan Oromo",
    nativeName: "Afaan Oromoo",
    short: "OR",
    script: "latin",
    dir: "ltr",
    calendar: "ethiopian",
    and: "fi",
    initialsSeparator: "&",
  },
};

/** Every site starts with these; the rest are switched on per couple. */
export const DEFAULT_SITE_LOCALES: Locale[] = ["am", "en"];

export type LocalizedText = { en: string } & Partial<Record<Exclude<Locale, "en">, string>>;

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export const isEthiopic = (locale: Locale) => LANGUAGES[locale].script === "ethiopic";
export const isRtl = (locale: Locale) => LANGUAGES[locale].dir === "rtl";
export const localeDir = (locale: Locale) => LANGUAGES[locale].dir;
export const usesEthiopianCalendar = (locale: Locale) => LANGUAGES[locale].calendar === "ethiopian";

/** Keeps only known codes, in registry order, with no repeats. */
export function sanitizeLocales(values: readonly unknown[]): Locale[] {
  return LOCALES.filter((locale) => values.includes(locale));
}

/**
 * Text in the requested language, else English, else Amharic, else whichever
 * language has content.
 */
export function pickText(text: LocalizedText | null | undefined, locale: Locale): string {
  if (!text) return "";
  const order: Locale[] = [locale, "en", "am", ...LOCALES];
  for (const candidate of order) {
    const value = text[candidate];
    if (value && value.trim()) return value;
  }
  return "";
}
