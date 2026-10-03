import { describe, expect, it } from "vitest";
import { hasPreviewOverrides, parsePreviewOverrides } from "./preview-overrides";

describe("parsePreviewOverrides", () => {
  it("reads the known parameters and maps calendar to calendarStyle", () => {
    expect(
      parsePreviewOverrides({ layout: "editorial", opening: "netela", motion: "rich", calendar: "gregorian", theme: "buna" }),
    ).toEqual({ layout: "editorial", opening: "netela", motion: "rich", calendarStyle: "gregorian", theme: "buna" });
  });

  it("ignores unknown values, unknown parameters and inherited names", () => {
    const overrides = parsePreviewOverrides({
      layout: "magazine",
      motion: "toString",
      theme: "__proto__",
      opening: "constructor",
      utm_source: "telegram",
      to: "Abebe",
    });
    expect(overrides).toEqual({});
    expect(hasPreviewOverrides(overrides)).toBe(false);
  });

  it("takes the first value of a repeated parameter", () => {
    expect(parsePreviewOverrides({ layout: ["editorial", "classic"] })).toEqual({ layout: "editorial" });
  });
});
