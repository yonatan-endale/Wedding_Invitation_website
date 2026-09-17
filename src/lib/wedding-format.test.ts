import { describe, expect, it } from "vitest";
import { formatGregorianDate, formatWeddingDate, formatWeddingTime } from "./wedding-format";

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
  it("writes a 12-hour English time", () => {
    expect(formatWeddingTime(ISO, TZ, "en")).toBe("2:00 PM");
    expect(formatWeddingTime("2026-07-18T21:30:00.000Z", TZ, "en")).toBe("12:30 AM");
  });

  it("writes Ethiopian clock time in Amharic", () => {
    expect(formatWeddingTime(ISO, TZ, "am")).toBe("ከቀኑ 8:00 ሰዓት");
  });
});

describe("formatGregorianDate", () => {
  it("writes a short Gregorian date for use beside the Ethiopian date", () => {
    expect(formatGregorianDate(ISO, TZ)).toBe("18 July 2026");
  });
});
