import { describe, expect, it } from "vitest";
import { toGeez } from "@/lib/geez";
import { ethiopianYear } from "./year";

describe("ethiopianYear", () => {
  it("gives the Ethiopian year of the test wedding, written ፳፻፲፱ in the colophon", () => {
    expect(ethiopianYear("2026-10-24T12:00:00.000Z", "Africa/Addis_Ababa")).toBe(2019);
    expect(toGeez(2019)).toBe("፳፻፲፱");
  });

  it("turns at Enkutatash, the Ethiopian New Year on 11 September", () => {
    expect(ethiopianYear("2026-09-10T09:00:00.000Z", "Africa/Addis_Ababa")).toBe(2018);
    expect(ethiopianYear("2026-09-11T09:00:00.000Z", "Africa/Addis_Ababa")).toBe(2019);
  });

  it("reads the day in the couple's time zone, not UTC", () => {
    // 22:30 UTC on 10 September is already 01:30 on the 11th in Addis Ababa.
    expect(ethiopianYear("2026-09-10T22:30:00.000Z", "Africa/Addis_Ababa")).toBe(2019);
    expect(ethiopianYear("2026-09-10T22:30:00.000Z", "America/New_York")).toBe(2018);
  });
});
