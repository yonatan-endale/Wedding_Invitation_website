import { describe, expect, it } from "vitest";
import { buildMonthGrid, calendarViews, markerFor, monthWeeks } from "./month-grid";

// 29 August 2026, 3 PM in Addis Ababa: Nehase 23, 2018 in the Ethiopian calendar.
const WEDDING = "2026-08-29T12:00:00.000Z";

const flat = (weeks: ReturnType<typeof buildMonthGrid>["weeks"]) => weeks.flat();

describe("monthWeeks", () => {
  it("pads to whole weeks from Sunday", () => {
    const weeks = monthWeeks([1, 2, 3, 4, 5, 6, 7, 8], 6);
    expect(weeks).toEqual([
      [null, null, null, null, null, null, 1],
      [2, 3, 4, 5, 6, 7, 8],
    ]);
  });
});

describe("buildMonthGrid", () => {
  it("lays out the Gregorian month from Sunday with the Ethiopian day beside each date", () => {
    const grid = buildMonthGrid(WEDDING, "Africa/Addis_Ababa", "gregorian");
    expect(grid).toMatchObject({ system: "gregorian", year: 2026, monthName: "August", monthLatin: null, weddingDay: 29 });
    // August 2026 starts on a Saturday, as on the reference calendar.
    expect(grid.weeks[0].slice(0, 6)).toEqual([null, null, null, null, null, null]);
    expect(grid.weeks[0][6]).toEqual({ day: 1, other: 25, wedding: false });
    expect(grid.weeks).toHaveLength(6);
    const marked = flat(grid.weeks).filter((cell) => cell?.wedding);
    expect(marked).toEqual([{ day: 29, other: 23, wedding: true }]);
  });

  it("lays out the Ethiopian month with the Gregorian day beside each date", () => {
    const grid = buildMonthGrid(WEDDING, "Africa/Addis_Ababa", "ethiopian");
    expect(grid).toMatchObject({ system: "ethiopian", year: 2018, monthName: "ነሐሴ", monthLatin: "Nehase", weddingDay: 23 });
    const cells = flat(grid.weeks).filter((cell) => cell !== null);
    expect(cells).toHaveLength(30);
    expect(cells.find((cell) => cell.wedding)).toEqual({ day: 23, other: 29, wedding: true });
  });

  it("uses the couple's local date, not UTC", () => {
    // 11:30 PM on 29 August in Los Angeles is already 30 August in UTC.
    const grid = buildMonthGrid("2026-08-30T06:30:00.000Z", "America/Los_Angeles", "gregorian");
    expect(grid.weddingDay).toBe(29);
  });

  it("fits Pagume's five or six days in a short grid", () => {
    const grid = buildMonthGrid("2026-09-08T09:00:00.000Z", "Africa/Addis_Ababa", "ethiopian");
    expect(grid.monthLatin).toBe("Pagume");
    expect(flat(grid.weeks).filter((cell) => cell !== null)).toHaveLength(5);
    expect(grid.weeks.length).toBeLessThanOrEqual(2);
    expect(grid.weddingDay).toBe(3);
  });
});

describe("calendarViews", () => {
  it("offers both calendars, starting on the guest's language", () => {
    expect(calendarViews("both", "en")).toEqual({ initial: "gregorian", available: ["ethiopian", "gregorian"] });
    expect(calendarViews("both", "am")).toEqual({ initial: "ethiopian", available: ["ethiopian", "gregorian"] });
  });

  it("shows only the chosen calendar otherwise", () => {
    expect(calendarViews("ethiopian", "en")).toEqual({ initial: "ethiopian", available: ["ethiopian"] });
    expect(calendarViews("gregorian", "am")).toEqual({ initial: "gregorian", available: ["gregorian"] });
  });
});

describe("markerFor", () => {
  it("echoes the border", () => {
    expect(markerFor("tibeb")).toBe("diamond");
    expect(markerFor("tibeb2")).toBe("diamond");
    expect(markerFor("floral")).toBe("heart");
    expect(markerFor("line")).toBe("circle");
    expect(markerFor("harag")).toBe("square");
  });
});
