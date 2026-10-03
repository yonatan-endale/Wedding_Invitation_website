import type { CalendarStyle } from "./appearance";
import type { BorderStyle } from "./constants";
import { zonedParts } from "./datetime";
import {
  ETHIOPIAN_MONTHS_AM,
  ETHIOPIAN_MONTHS_LATIN,
  ethiopianMonth,
  gregorianMonth,
  gregorianToEthiopian,
} from "./ethiopian-calendar";
import type { Locale } from "./localized";
import { MONTHS_EN } from "./wedding-format";

export type CalendarSystem = "ethiopian" | "gregorian";

/** A day in the grid: its number in the grid's calendar, and in the other calendar for the small figures. */
export type MonthCell = { day: number; other: number; wedding: boolean };

export type MonthGrid = {
  system: CalendarSystem;
  year: number;
  /** Month name in Amharic script for the Ethiopian grid, English otherwise. */
  monthName: string;
  /** Latin spelling of an Ethiopian month, for guests who don't read Amharic script. */
  monthLatin: string | null;
  weddingDay: number;
  /** Weeks from Sunday; blank cells before the 1st and after the last day are null. */
  weeks: (MonthCell | null)[][];
};

/** Pads a month to whole weeks starting on Sunday, then cuts it into rows of seven. */
export function monthWeeks<T>(days: T[], firstWeekday: number): (T | null)[][] {
  const cells: (T | null)[] = [...Array<null>(firstWeekday).fill(null), ...days];
  while (cells.length % 7 !== 0) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, row) => cells.slice(row * 7, row * 7 + 7));
}

/** The month of the wedding in either calendar, with the wedding day marked. Uses the couple's time zone, never UTC. */
export function buildMonthGrid(weddingAt: string, timeZone: string, system: CalendarSystem): MonthGrid {
  const local = zonedParts(new Date(weddingAt), timeZone);
  if (system === "gregorian") {
    const days = gregorianMonth(local.year, local.month);
    return {
      system,
      year: local.year,
      monthName: MONTHS_EN[local.month - 1],
      monthLatin: null,
      weddingDay: local.day,
      weeks: monthWeeks(
        days.map((d) => ({ day: d.day, other: d.ethiopian.day, wedding: d.day === local.day })),
        days[0].weekday,
      ),
    };
  }
  const wedding = gregorianToEthiopian(local.year, local.month, local.day);
  const days = ethiopianMonth(wedding.year, wedding.month);
  return {
    system,
    year: wedding.year,
    monthName: ETHIOPIAN_MONTHS_AM[wedding.month - 1],
    monthLatin: ETHIOPIAN_MONTHS_LATIN[wedding.month - 1],
    weddingDay: wedding.day,
    weeks: monthWeeks(
      days.map((d) => ({ day: d.day, other: d.gregorian.day, wedding: d.day === wedding.day })),
      days[0].weekday,
    ),
  };
}

/** Which grids the guest can see, and which one shows first: their own language's calendar when both are offered. */
export function calendarViews(style: CalendarStyle, locale: Locale): { initial: CalendarSystem; available: CalendarSystem[] } {
  if (style === "ethiopian") return { initial: "ethiopian", available: ["ethiopian"] };
  if (style === "gregorian") return { initial: "gregorian", available: ["gregorian"] };
  const initial = locale === "am" ? "ethiopian" : "gregorian";
  return { initial, available: ["ethiopian", "gregorian"] };
}

export type MarkerShape = "diamond" | "heart" | "circle" | "square";

/** The wedding day's mark echoes the couple's border. */
export function markerFor(border: BorderStyle): MarkerShape {
  if (border === "floral") return "heart";
  if (border === "line") return "circle";
  return "diamond";
}
