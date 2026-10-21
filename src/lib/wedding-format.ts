import {
  ETHIOPIAN_MONTHS_AM,
  ETHIOPIAN_MONTHS_LATIN,
  ETHIOPIAN_MONTHS_OM,
  ETHIOPIAN_MONTHS_TI,
  formatEthiopianDate,
  gregorianToEthiopian,
  type EthiopianDate,
  type GregorianDate,
} from "./ethiopian-calendar";
import { zonedParts } from "./datetime";
import { usesEthiopianCalendar, type Locale } from "./localized";

export const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTHS_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

/** Weekday names, Sunday first, and the comma that follows them in a date. */
const WEEKDAYS: Record<Locale, { names: string[]; comma: string }> = {
  en: { names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], comma: "," },
  am: { names: ["እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"], comma: "፣" },
  ar: { names: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"], comma: "،" },
  ti: { names: ["ሰንበት", "ሰኑይ", "ሰሉስ", "ረቡዕ", "ሓሙስ", "ዓርቢ", "ቀዳም"], comma: "፣" },
  om: { names: ["Dilbata", "Wiixata", "Kibxata", "Roobii", "Kamiisa", "Jimaata", "Sanbata"], comma: "," },
};

function localParts(iso: string, timeZone: string) {
  const parts = zonedParts(new Date(iso), timeZone);
  const weekday = new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay();
  return { ...parts, weekday };
}

/** An Ethiopian calendar date in the guest's language. English and Arabic read the Latin spelling. */
function ethiopianDateIn(date: EthiopianDate, locale: Locale): string {
  if (locale === "am") return formatEthiopianDate(date);
  if (locale === "ti") return `${date.day} ${ETHIOPIAN_MONTHS_TI[date.month - 1]} ${date.year} ዓ.ም.`;
  if (locale === "om") return `${date.day} ${ETHIOPIAN_MONTHS_OM[date.month - 1]} ${date.year}`;
  return `${ETHIOPIAN_MONTHS_LATIN[date.month - 1]} ${date.day}, ${date.year} E.C.`;
}

/** A Gregorian date with month names in Arabic on Arabic pages and in English everywhere else. */
function gregorianDateIn(p: GregorianDate, locale: Locale): string {
  if (locale === "ar") return `${p.day} ${MONTHS_AR[p.month - 1]} ${p.year}`;
  return `${p.day} ${MONTHS_EN[p.month - 1]} ${p.year}`;
}

/** The Ethiopian calendar date in Amharic script, with no weekday: "ጥር 15 ቀን 2019 ዓ.ም." */
export function formatEthiopianDateLine(iso: string, timeZone: string): string {
  const p = localParts(iso, timeZone);
  return formatEthiopianDate(gregorianToEthiopian(p.year, p.month, p.day));
}

export function formatGregorianDate(iso: string, timeZone: string): string {
  return gregorianDateIn(localParts(iso, timeZone), "en");
}

/** The Gregorian months an Ethiopian month covers: "October – November 2026". */
export function formatGregorianSpan(first: GregorianDate, last: GregorianDate): string {
  const firstMonth = MONTHS_EN[first.month - 1];
  const lastMonth = MONTHS_EN[last.month - 1];
  if (first.year !== last.year) return `${firstMonth} ${first.year} – ${lastMonth} ${last.year}`;
  if (first.month !== last.month) return `${firstMonth} – ${lastMonth} ${last.year}`;
  return `${lastMonth} ${last.year}`;
}

/**
 * The weekday and date in the guest's own calendar: English "Saturday, 18 July 2026",
 * Amharic the weekday plus the Ethiopian calendar date.
 */
export function formatWeddingDate(iso: string, timeZone: string, locale: Locale): string {
  const p = localParts(iso, timeZone);
  const { names, comma } = WEEKDAYS[locale];
  const date = usesEthiopianCalendar(locale)
    ? ethiopianDateIn(gregorianToEthiopian(p.year, p.month, p.day), locale)
    : gregorianDateIn(p, locale);
  return `${names[p.weekday]}${comma} ${date}`;
}

const MONTHS_EN_SHORT = MONTHS_EN.map((month) => month.slice(0, 3));
const ETHIOPIAN_MONTHS: Partial<Record<Locale, readonly string[]>> = {
  am: ETHIOPIAN_MONTHS_AM,
  ti: ETHIOPIAN_MONTHS_TI,
  om: ETHIOPIAN_MONTHS_OM,
};

/**
 * The wedding date split for large numerals: English "14 / Mar / 2025",
 * Ethiopian-calendar languages the Ethiopian day, month and year.
 */
export function weddingDateParts(iso: string, timeZone: string, locale: Locale): { day: string; month: string; year: string } {
  const p = localParts(iso, timeZone);
  const months = ETHIOPIAN_MONTHS[locale];
  if (months) {
    const ethiopian = gregorianToEthiopian(p.year, p.month, p.day);
    return { day: String(ethiopian.day), month: months[ethiopian.month - 1], year: String(ethiopian.year) };
  }
  const month = locale === "ar" ? MONTHS_AR[p.month - 1] : MONTHS_EN_SHORT[p.month - 1];
  return { day: String(p.day), month, year: String(p.year) };
}

/** A plain calendar day, "YYYY-MM-DD", with no weekday, in the guest's own calendar. */
export function formatCalendarDate(date: string, locale: Locale): string {
  const p = localParts(`${date}T12:00:00Z`, "UTC");
  return usesEthiopianCalendar(locale)
    ? ethiopianDateIn(gregorianToEthiopian(p.year, p.month, p.day), locale)
    : gregorianDateIn(p, locale);
}

/**
 * How each language reads the Ethiopian clock: the names of the day's four
 * periods from midnight, whether the period comes before the hour, the word
 * after the hour, and the word for "to" in a range.
 */
const CLOCK: Record<Locale, { periods: [string, string, string, string]; before: boolean; suffix: string; to: string }> = {
  en: { periods: ["at night", "in the morning", "in the afternoon", "in the evening"], before: false, suffix: "", to: "to" },
  am: { periods: ["ከሌሊቱ", "ከጠዋቱ", "ከቀኑ", "ከምሽቱ"], before: true, suffix: "ሰዓት", to: "እስከ" },
  ar: { periods: ["ليلاً", "صباحاً", "بعد الظهر", "مساءً"], before: false, suffix: "", to: "إلى" },
  ti: { periods: ["ናይ ለይቲ", "ናይ ንግሆ", "ድሕሪ ቐትሪ", "ናይ ምሸት"], before: true, suffix: "ሰዓት", to: "ክሳብ" },
  om: { periods: ["halkan", "ganama", "guyyaa", "galgala"], before: true, suffix: "", to: "hanga" },
};

/** The Ethiopian clock starts the day at 6 in the morning, so 2 PM is 8:00 in the afternoon. */
function ethiopianClock(iso: string, timeZone: string, locale: Locale) {
  const p = localParts(iso, timeZone);
  const hour = (p.hour + 6) % 12 || 12;
  return {
    clock: `${hour}:${String(p.minute).padStart(2, "0")}`,
    period: CLOCK[locale].periods[Math.floor(p.hour / 6)],
  };
}

const words = (...parts: string[]) => parts.filter(Boolean).join(" ");

/** English "8:00 in the afternoon", Amharic "ከቀኑ 8:00 ሰዓት". */
export function formatWeddingTime(iso: string, timeZone: string, locale: Locale): string {
  const { clock, period } = ethiopianClock(iso, timeZone, locale);
  const { before, suffix } = CLOCK[locale];
  return before ? words(period, clock, suffix) : words(clock, period);
}

/** A start and end in the Ethiopian clock, naming the period once when both share it. */
export function formatWeddingTimeRange(startIso: string, endIso: string, timeZone: string, locale: Locale): string {
  const start = ethiopianClock(startIso, timeZone, locale);
  const end = ethiopianClock(endIso, timeZone, locale);
  const same = start.period === end.period;
  const { before, suffix, to } = CLOCK[locale];
  if (before) {
    return same
      ? words(start.period, start.clock, to, end.clock, suffix)
      : words(start.period, start.clock, to, end.period, end.clock, suffix);
  }
  return same
    ? words(start.clock, to, end.clock, start.period)
    : words(start.clock, start.period, to, end.clock, end.period);
}

/** International clock, for the admin dashboard where times are typed in this form. */
export function formatStandardTime(iso: string, timeZone: string): string {
  const p = localParts(iso, timeZone);
  const hour = p.hour % 12 || 12;
  return `${hour}:${String(p.minute).padStart(2, "0")} ${p.hour < 12 ? "AM" : "PM"}`;
}

export function formatStandardTimeRange(startIso: string, endIso: string, timeZone: string): string {
  return `${formatStandardTime(startIso, timeZone)} to ${formatStandardTime(endIso, timeZone)}`;
}

/**
 * The big date on the save-the-date, month first: English "August 29, 2026"
 * or "Nehase 23, 2018 E.C.", Amharic "ነሐሴ 23 ቀን 2018 ዓ.ም.". Gregorian dates
 * keep English month names on Ethiopic pages, as elsewhere on the site.
 */
export function formatSaveTheDate(iso: string, timeZone: string, locale: Locale, system: "ethiopian" | "gregorian"): string {
  const p = localParts(iso, timeZone);
  if (system === "gregorian") {
    return locale === "ar" ? gregorianDateIn(p, "ar") : `${MONTHS_EN[p.month - 1]} ${p.day}, ${p.year}`;
  }
  return ethiopianDateIn(gregorianToEthiopian(p.year, p.month, p.day), locale);
}
