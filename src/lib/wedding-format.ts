import { formatEthiopianDate, formatEthiopianTime, gregorianToEthiopian } from "./ethiopian-calendar";
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

const ETHIOPIAN_PERIODS_EN = [
  { until: 6, label: "at night" },
  { until: 12, label: "in the morning" },
  { until: 18, label: "in the afternoon" },
  { until: 24, label: "in the evening" },
];

/**
 * Guest sites always use the Ethiopian clock, which starts the day at 6 in the
 * morning: 2 PM reads as 8:00 in the afternoon.
 */
export function formatWeddingTime(iso: string, timeZone: string, locale: Locale): string {
  const p = localParts(iso, timeZone);
  if (locale === "am") return formatEthiopianTime(p.hour, p.minute);
  const hour = (p.hour + 6) % 12 || 12;
  const period = ETHIOPIAN_PERIODS_EN.find((candidate) => p.hour < candidate.until)!.label;
  return `${hour}:${String(p.minute).padStart(2, "0")} ${period}`;
}

/** International clock, for the admin dashboard where times are typed in this form. */
export function formatStandardTime(iso: string, timeZone: string): string {
  const p = localParts(iso, timeZone);
  const hour = p.hour % 12 || 12;
  return `${hour}:${String(p.minute).padStart(2, "0")} ${p.hour < 12 ? "AM" : "PM"}`;
}
