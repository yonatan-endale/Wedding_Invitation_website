export type EthiopianDate = { year: number; month: number; day: number };

/** Julian Day Number of 1 Meskerem 1 in the Amete Mihret era. */
const ETHIOPIC_EPOCH = 1724221;

export const ETHIOPIAN_MONTHS_AM = [
  "መስከረም",
  "ጥቅምት",
  "ኅዳር",
  "ታኅሣሥ",
  "ጥር",
  "የካቲት",
  "መጋቢት",
  "ሚያዝያ",
  "ግንቦት",
  "ሰኔ",
  "ሐምሌ",
  "ነሐሴ",
  "ጳጉሜን",
] as const;

/** Latin spellings, for guests who don't read Amharic script. */
export const ETHIOPIAN_MONTHS_LATIN = [
  "Meskerem",
  "Tikimt",
  "Hidar",
  "Tahsas",
  "Tir",
  "Yekatit",
  "Megabit",
  "Miyazya",
  "Ginbot",
  "Sene",
  "Hamle",
  "Nehase",
  "Pagume",
] as const;

function gregorianToJdn(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

/** Days from the epoch to 1 Meskerem of `year`. Year 3 of each 4-year cycle has Pagume 6. */
function yearStartOffset(year: number): number {
  return 365 * (year - 1) + Math.floor(year / 4);
}

function jdnToEthiopian(jdn: number): EthiopianDate {
  const offset = jdn - ETHIOPIC_EPOCH;
  const year = Math.floor((4 * offset + 1463) / 1461);
  const dayOfYear = offset - yearStartOffset(year);
  return { year, month: Math.floor(dayOfYear / 30) + 1, day: (dayOfYear % 30) + 1 };
}

export function gregorianToEthiopian(year: number, month: number, day: number): EthiopianDate {
  return jdnToEthiopian(gregorianToJdn(year, month, day));
}

export type GregorianDate = { year: number; month: number; day: number };

function ethiopianToJdn({ year, month, day }: EthiopianDate): number {
  return ETHIOPIC_EPOCH + yearStartOffset(year) + (month - 1) * 30 + day - 1;
}

function jdnToGregorian(jdn: number): GregorianDate {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  return {
    year: 100 * b + d - 4800 + Math.floor(m / 10),
    month: m + 3 - 12 * Math.floor(m / 10),
    day: e - Math.floor((153 * m + 2) / 5) + 1,
  };
}

export function ethiopianToGregorian(date: EthiopianDate): GregorianDate {
  return jdnToGregorian(ethiopianToJdn(date));
}

/** Twelve months of thirty days, then Pagume: six days in year 3 of each four-year cycle, five otherwise. */
export function ethiopianMonthLength(year: number, month: number): number {
  if (month < 13) return 30;
  return year % 4 === 3 ? 6 : 5;
}

/** Weekday counted from Sunday as 0, the way the Ethiopian week begins. */
export type EthiopianMonthDay = { day: number; weekday: number; gregorian: GregorianDate };

export function ethiopianMonth(year: number, month: number): EthiopianMonthDay[] {
  const first = ethiopianToJdn({ year, month, day: 1 });
  return Array.from({ length: ethiopianMonthLength(year, month) }, (_, index) => ({
    day: index + 1,
    weekday: (first + index + 1) % 7,
    gregorian: jdnToGregorian(first + index),
  }));
}

export function formatEthiopianDate(date: EthiopianDate): string {
  return `${ETHIOPIAN_MONTHS_AM[date.month - 1]} ${date.day} ቀን ${date.year} ዓ.ም.`;
}

/** Ethiopian clock: the day's first hour starts at 7:00, and hours are named by period of day. */
export function formatEthiopianTime(hour24: number, minute: number): string {
  const period = hour24 < 6 ? "ከሌሊቱ" : hour24 < 12 ? "ከጠዋቱ" : hour24 < 18 ? "ከቀኑ" : "ከምሽቱ";
  const hour = (hour24 + 6) % 12 || 12;
  return `${period} ${hour}:${String(minute).padStart(2, "0")} ሰዓት`;
}
