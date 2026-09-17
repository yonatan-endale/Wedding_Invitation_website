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

export function formatEthiopianDate(date: EthiopianDate): string {
  return `${ETHIOPIAN_MONTHS_AM[date.month - 1]} ${date.day} ቀን ${date.year} ዓ.ም.`;
}

/** Ethiopian clock: the day's first hour starts at 7:00, and hours are named by period of day. */
export function formatEthiopianTime(hour24: number, minute: number): string {
  const period = hour24 < 6 ? "ከሌሊቱ" : hour24 < 12 ? "ከጠዋቱ" : hour24 < 18 ? "ከቀኑ" : "ከምሽቱ";
  const hour = (hour24 + 6) % 12 || 12;
  return `${period} ${hour}:${String(minute).padStart(2, "0")} ሰዓት`;
}
