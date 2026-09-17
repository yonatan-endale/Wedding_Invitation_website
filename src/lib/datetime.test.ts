import { describe, expect, it } from "vitest";
import { countdownParts, toDateTimeLocalValue, zonedParts, zonedTimeToUtc } from "./datetime";

describe("zonedParts", () => {
  it("reads wall-clock time in Addis Ababa", () => {
    expect(zonedParts(new Date("2026-07-18T11:00:00Z"), "Africa/Addis_Ababa")).toMatchObject({
      year: 2026,
      month: 7,
      day: 18,
      hour: 14,
      minute: 0,
    });
  });

  it("reports midnight as hour 0", () => {
    expect(zonedParts(new Date("2026-07-17T21:00:00Z"), "Africa/Addis_Ababa").hour).toBe(0);
  });
});

describe("zonedTimeToUtc", () => {
  it("converts Addis Ababa wall-clock time to UTC", () => {
    expect(zonedTimeToUtc("2026-07-18T14:00", "Africa/Addis_Ababa").toISOString()).toBe(
      "2026-07-18T11:00:00.000Z",
    );
  });

  it("respects daylight saving time", () => {
    expect(zonedTimeToUtc("2026-07-18T14:00", "America/New_York").toISOString()).toBe(
      "2026-07-18T18:00:00.000Z",
    );
    expect(zonedTimeToUtc("2026-01-18T14:00", "America/New_York").toISOString()).toBe(
      "2026-01-18T19:00:00.000Z",
    );
  });

  it("throws on malformed input", () => {
    expect(() => zonedTimeToUtc("tomorrow", "Africa/Addis_Ababa")).toThrow();
  });
});

describe("toDateTimeLocalValue", () => {
  it("round-trips through zonedTimeToUtc", () => {
    const utc = zonedTimeToUtc("2026-07-18T14:05", "Africa/Addis_Ababa");
    expect(toDateTimeLocalValue(utc, "Africa/Addis_Ababa")).toBe("2026-07-18T14:05");
  });
});

describe("countdownParts", () => {
  it("splits the remaining time into days, hours, minutes and seconds", () => {
    const now = new Date("2026-07-16T10:00:00Z");
    const target = new Date("2026-07-18T11:02:03Z");
    expect(countdownParts(target, now)).toEqual({
      days: 2,
      hours: 1,
      minutes: 2,
      seconds: 3,
      passed: false,
    });
  });

  it("counts upward once the wedding has passed", () => {
    const now = new Date("2026-07-21T12:30:45Z");
    const target = new Date("2026-07-18T11:00:00Z");
    expect(countdownParts(target, now)).toEqual({ days: 3, hours: 1, minutes: 30, seconds: 45, passed: true });
  });

  it("counts a whole year of marriage in days", () => {
    const now = new Date("2027-07-18T11:00:00Z");
    const target = new Date("2026-07-18T11:00:00Z");
    expect(countdownParts(target, now)).toMatchObject({ days: 365, hours: 0, minutes: 0, passed: true });
  });

  it("treats the exact moment as passed, with zeros", () => {
    const target = new Date("2026-07-18T11:00:00Z");
    expect(countdownParts(target, target)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0, passed: true });
  });
});
