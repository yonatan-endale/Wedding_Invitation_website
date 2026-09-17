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

/** English: "2:00 PM". Amharic: Ethiopian clock, "ከቀኑ 8:00 ሰዓት". */
export function formatWeddingTime(iso: string, timeZone: string, locale: Locale): string {
  const p = localParts(iso, timeZone);
  if (locale === "am") return formatEthiopianTime(p.hour, p.minute);
  const hour = p.hour % 12 || 12;
  return `${hour}:${String(p.minute).padStart(2, "0")} ${p.hour < 12 ? "AM" : "PM"}`;
}
