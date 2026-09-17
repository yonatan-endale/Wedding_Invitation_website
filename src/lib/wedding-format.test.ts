import { describe, expect, it } from "vitest";
import {
  formatEthiopianDateLine,
  formatGregorianDate,
  formatStandardTime,
  formatStandardTimeRange,
  formatWeddingDate,
  formatWeddingTime,
  formatWeddingTimeRange,
} from "./wedding-format";

const ISO = "2026-07-18T11:00:00.000Z";
const TZ = "Africa/Addis_Ababa";

describe("formatWeddingDate", () => {
  it("writes the full English date in the wedding time zone", () => {
    expect(formatWeddingDate(ISO, TZ, "en")).toBe("Saturday, 18 July 2026");
  });

  it("writes the Ethiopian calendar date in Amharic", () => {
    expect(formatWeddingDate(ISO, TZ, "am")).toBe("ቅዳሜ፣ ሐምሌ 11 ቀን 2018 ዓ.ም.");
  });

  it("uses the local date, not the UTC date, near midnight", () => {
    expect(formatWeddingDate("2026-07-17T22:30:00.000Z", TZ, "en")).toBe("Saturday, 18 July 2026");
  });
});

describe("formatWeddingTime", () => {
  it("writes the Ethiopian clock in English, because guests in Ethiopia read that", () => {
    expect(formatWeddingTime(ISO, TZ, "en")).toBe("8:00 in the afternoon");
    expect(formatWeddingTime("2026-07-18T07:00:00.000Z", TZ, "en")).toBe("4:00 in the morning");
    expect(formatWeddingTime("2026-07-18T15:00:00.000Z", TZ, "en")).toBe("12:00 in the evening");
    expect(formatWeddingTime("2026-07-18T21:30:00.000Z", TZ, "en")).toBe("6:30 at night");
  });

  it("counts noon and six in the morning the Ethiopian way", () => {
    expect(formatWeddingTime("2026-07-18T09:00:00.000Z", TZ, "en")).toBe("6:00 in the afternoon");
    expect(formatWeddingTime("2026-07-18T03:00:00.000Z", TZ, "en")).toBe("12:00 in the morning");
  });

  it("writes Ethiopian clock time in Amharic", () => {
    expect(formatWeddingTime(ISO, TZ, "am")).toBe("ከቀኑ 8:00 ሰዓት");
  });
});

describe("formatWeddingTimeRange", () => {
  it("names the period once when both times fall in it", () => {
    expect(formatWeddingTimeRange("2026-07-18T07:00:00.000Z", "2026-07-18T08:30:00.000Z", TZ, "en")).toBe(
      "4:00 to 5:30 in the morning",
    );
    expect(formatWeddingTimeRange("2026-07-18T07:00:00.000Z", "2026-07-18T08:30:00.000Z", TZ, "am")).toBe(
      "ከጠዋቱ 4:00 እስከ 5:30 ሰዓት",
    );
  });

  it("names both periods when the range crosses one", () => {
    expect(formatWeddingTimeRange("2026-07-18T07:00:00.000Z", "2026-07-18T10:00:00.000Z", TZ, "en")).toBe(
      "4:00 in the morning to 7:00 in the afternoon",
    );
    expect(formatWeddingTimeRange("2026-07-18T07:00:00.000Z", "2026-07-18T10:00:00.000Z", TZ, "am")).toBe(
      "ከጠዋቱ 4:00 እስከ ከቀኑ 7:00 ሰዓት",
    );
  });
});

describe("formatStandardTimeRange", () => {
  it("writes the international range for the admin", () => {
    expect(formatStandardTimeRange("2026-07-18T07:00:00.000Z", "2026-07-18T10:00:00.000Z", TZ)).toBe(
      "10:00 AM to 1:00 PM",
    );
  });
});

describe("formatStandardTime", () => {
  it("writes the international clock for the admin, matching what is typed into the form", () => {
    expect(formatStandardTime(ISO, TZ)).toBe("2:00 PM");
    expect(formatStandardTime("2026-07-18T21:30:00.000Z", TZ)).toBe("12:30 AM");
  });
});

describe("formatEthiopianDateLine", () => {
  it("writes the Ethiopian date in Amharic script without a weekday", () => {
    expect(formatEthiopianDateLine(ISO, TZ)).toBe("ሐምሌ 11 ቀን 2018 ዓ.ም.");
  });

  it("uses the local date, not the UTC date, near midnight", () => {
    expect(formatEthiopianDateLine("2026-07-17T22:30:00.000Z", TZ)).toBe("ሐምሌ 11 ቀን 2018 ዓ.ም.");
  });
});

describe("formatGregorianDate", () => {
  it("writes a short Gregorian date for use beside the Ethiopian date", () => {
    expect(formatGregorianDate(ISO, TZ)).toBe("18 July 2026");
  });
});
