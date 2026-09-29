import { ETHIOPIAN_MONTHS_AM, formatEthiopianDate, gregorianToEthiopian } from "./ethiopian-calendar";
import { zonedParts } from "./datetime";
import type { Locale } from "./localized";

const MONTHS_EN = [
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
const WEEKDAYS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAYS_AM = ["እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "ዓርብ", "ቅዳሜ"];

function localParts(iso: string, timeZone: string) {
  const parts = zonedParts(new Date(iso), timeZone);
  const weekday = new Date(Date.UTC(parts.year, parts.month - 1, parts.day)).getUTCDay();
  return { ...parts, weekday };
}

/** The Ethiopian calendar date in Amharic script, with no weekday: "ጥር 15 ቀን 2019 ዓ.ም." */
export function formatEthiopianDateLine(iso: string, timeZone: string): string {
  const p = localParts(iso, timeZone);
  return formatEthiopianDate(gregorianToEthiopian(p.year, p.month, p.day));
}

export function formatGregorianDate(iso: string, timeZone: string): string {
  const p = localParts(iso, timeZone);
  return `${p.day} ${MONTHS_EN[p.month - 1]} ${p.year}`;
}

/** English: "Saturday, 18 July 2026". Amharic: weekday plus the Ethiopian calendar date. */
export function formatWeddingDate(iso: string, timeZone: string, locale: Locale): string {
  const p = localParts(iso, timeZone);
  if (locale === "am") {
    const ethiopian = gregorianToEthiopian(p.year, p.month, p.day);
    return `${WEEKDAYS_AM[p.weekday]}፣ ${formatEthiopianDate(ethiopian)}`;
  }
  return `${WEEKDAYS_EN[p.weekday]}, ${formatGregorianDate(iso, timeZone)}`;
}

const MONTHS_EN_SHORT = MONTHS_EN.map((month) => month.slice(0, 3));

/**
 * The wedding date split for large numerals: English "14 / Mar / 2025",
 * Amharic the Ethiopian calendar day, month and year.
 */
export function weddingDateParts(iso: string, timeZone: string, locale: Locale): { day: string; month: string; year: string } {
  const p = localParts(iso, timeZone);
  if (locale === "am") {
    const ethiopian = gregorianToEthiopian(p.year, p.month, p.day);
    return { day: String(ethiopian.day), month: ETHIOPIAN_MONTHS_AM[ethiopian.month - 1], year: String(ethiopian.year) };
  }
  return { day: String(p.day), month: MONTHS_EN_SHORT[p.month - 1], year: String(p.year) };
}

/** A plain calendar day, "YYYY-MM-DD", with no weekday: English "6 January 2023", Amharic the Ethiopian date. */
export function formatCalendarDate(date: string, locale: Locale): string {
  const iso = `${date}T12:00:00Z`;
  return locale === "am" ? formatEthiopianDateLine(iso, "UTC") : formatGregorianDate(iso, "UTC");
}

/** Periods of the Ethiopian day, from midnight. Amharic names go before the clock, English after. */
const ETHIOPIAN_PERIODS = [
  { until: 6, en: "at night", am: "ከሌሊቱ" },
  { until: 12, en: "in the morning", am: "ከጠዋቱ" },
  { until: 18, en: "in the afternoon", am: "ከቀኑ" },
  { until: 24, en: "in the evening", am: "ከምሽቱ" },
];

/** The Ethiopian clock starts the day at 6 in the morning, so 2 PM is 8:00 in the afternoon. */
function ethiopianClock(iso: string, timeZone: string, locale: Locale) {
  const p = localParts(iso, timeZone);
  const hour = (p.hour + 6) % 12 || 12;
  return {
    clock: `${hour}:${String(p.minute).padStart(2, "0")}`,
    period: ETHIOPIAN_PERIODS.find((candidate) => p.hour < candidate.until)![locale],
  };
}

/** English "8:00 in the afternoon", Amharic "ከቀኑ 8:00 ሰዓት". */
export function formatWeddingTime(iso: string, timeZone: string, locale: Locale): string {
  const { clock, period } = ethiopianClock(iso, timeZone, locale);
  return locale === "am" ? `${period} ${clock} ሰዓት` : `${clock} ${period}`;
}

/** A start and end in the Ethiopian clock, naming the period once when both share it. */
export function formatWeddingTimeRange(startIso: string, endIso: string, timeZone: string, locale: Locale): string {
  const start = ethiopianClock(startIso, timeZone, locale);
  const end = ethiopianClock(endIso, timeZone, locale);
  const same = start.period === end.period;
  if (locale === "am") {
    return same
      ? `${start.period} ${start.clock} እስከ ${end.clock} ሰዓት`
      : `${start.period} ${start.clock} እስከ ${end.period} ${end.clock} ሰዓት`;
  }
  return same
    ? `${start.clock} to ${end.clock} ${start.period}`
    : `${start.clock} ${start.period} to ${end.clock} ${end.period}`;
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
