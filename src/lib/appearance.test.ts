import { describe, expect, it } from "vitest";
import {
  CALENDAR_STYLES,
  CALENDAR_STYLE_OPTIONS,
  MOTION_LEVELS,
  MOTION_LEVEL_OPTIONS,
  ORNAMENTS,
  ORNAMENT_OPTIONS,
  getCalendarStyle,
  getMotionLevel,
  getOrnament,
  isCalendarStyle,
  isMotionLevel,
  isOrnament,
} from "./appearance";

describe("appearance settings", () => {
  it("fall back to the defaults for unknown or missing values", () => {
    expect(getCalendarStyle("lunar")).toBe("both");
    expect(getCalendarStyle(undefined)).toBe("both");
    expect(getMotionLevel("wild")).toBe("moderate");
    expect(getMotionLevel(null)).toBe("moderate");
    expect(getOrnament("toString")).toBe("none");
  });

  it("return known values unchanged", () => {
    expect(getCalendarStyle("gregorian")).toBe("gregorian");
    expect(getMotionLevel("rich")).toBe("rich");
    expect(getOrnament("orthodox")).toBe("orthodox");
  });

  it("accept every listed value and reject anything else", () => {
    for (const value of CALENDAR_STYLES) expect(isCalendarStyle(value)).toBe(true);
    for (const value of MOTION_LEVELS) expect(isMotionLevel(value)).toBe(true);
    for (const value of ORNAMENTS) expect(isOrnament(value)).toBe(true);
    expect(isCalendarStyle(1)).toBe(false);
    expect(isMotionLevel("")).toBe(false);
    expect(isOrnament("cross")).toBe(false);
  });

  it("describe every value for the admin picker", () => {
    for (const options of [CALENDAR_STYLE_OPTIONS, MOTION_LEVEL_OPTIONS, ORNAMENT_OPTIONS]) {
      for (const option of Object.values(options)) {
        expect(option.label).toBeTruthy();
        expect(option.description).toBeTruthy();
      }
    }
  });
});
