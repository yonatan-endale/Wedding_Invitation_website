import { describe, expect, it } from "vitest";
import {
  formatEthiopianDate,
  formatEthiopianTime,
  gregorianToEthiopian,
} from "./ethiopian-calendar";

describe("gregorianToEthiopian", () => {
  it("converts Ethiopian New Year in a regular year", () => {
    expect(gregorianToEthiopian(2025, 9, 11)).toEqual({ year: 2018, month: 1, day: 1 });
  });

  it("converts Meskel", () => {
    expect(gregorianToEthiopian(2025, 9, 27)).toEqual({ year: 2018, month: 1, day: 17 });
  });

  it("converts Genna in a regular year", () => {
    expect(gregorianToEthiopian(2026, 1, 7)).toEqual({ year: 2018, month: 4, day: 29 });
  });

  it("converts Timket", () => {
    expect(gregorianToEthiopian(2026, 1, 19)).toEqual({ year: 2018, month: 5, day: 11 });
  });

  it("converts a mid-year summer date", () => {
    expect(gregorianToEthiopian(2026, 7, 18)).toEqual({ year: 2018, month: 11, day: 11 });
  });

  it("handles the sixth day of Pagume before a Gregorian leap year", () => {
    expect(gregorianToEthiopian(2023, 9, 11)).toEqual({ year: 2015, month: 13, day: 6 });
    expect(gregorianToEthiopian(2023, 9, 12)).toEqual({ year: 2016, month: 1, day: 1 });
  });

  it("handles January in a Gregorian leap year", () => {
    expect(gregorianToEthiopian(2024, 1, 7)).toEqual({ year: 2016, month: 4, day: 28 });
  });
});

describe("formatEthiopianDate", () => {
  it("formats in Amharic with the month name and era", () => {
    expect(formatEthiopianDate({ year: 2018, month: 11, day: 11 })).toBe("ሐምሌ 11 ቀን 2018 ዓ.ም.");
  });

  it("names Pagume", () => {
    expect(formatEthiopianDate({ year: 2015, month: 13, day: 6 })).toBe("ጳጉሜን 6 ቀን 2015 ዓ.ም.");
  });
});

describe("formatEthiopianTime", () => {
  it("converts afternoon to the daytime Ethiopian clock", () => {
    expect(formatEthiopianTime(14, 30)).toBe("ከቀኑ 8:30 ሰዓት");
  });

  it("counts 7 in the morning as the first hour", () => {
    expect(formatEthiopianTime(7, 0)).toBe("ከጠዋቱ 1:00 ሰዓት");
  });

  it("shows 6 in the morning as 12", () => {
    expect(formatEthiopianTime(6, 0)).toBe("ከጠዋቱ 12:00 ሰዓት");
  });

  it("uses evening and night periods", () => {
    expect(formatEthiopianTime(20, 15)).toBe("ከምሽቱ 2:15 ሰዓት");
    expect(formatEthiopianTime(0, 0)).toBe("ከሌሊቱ 6:00 ሰዓት");
  });
});
