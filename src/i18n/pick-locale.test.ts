import { describe, expect, it } from "vitest";
import { pickLocale } from "./pick-locale";

describe("pickLocale", () => {
  it("keeps the guest's own pick when the site offers it", () => {
    expect(pickLocale(["am", "en", "ar"], "ar", "en-US")).toBe("ar");
  });

  it("ignores a pick the site has switched off", () => {
    expect(pickLocale(["am", "en"], "ar", null)).toBe("en");
    expect(pickLocale(["am", "en"], "ar", "am-ET,en;q=0.8")).toBe("am");
  });

  it("follows the browser's languages in order", () => {
    expect(pickLocale(["en", "am", "ti", "om"], undefined, "fr-FR, om;q=0.9, ti;q=0.8")).toBe("om");
  });

  it("falls back to English, then to the site's first language", () => {
    expect(pickLocale(["en", "am"], undefined, "fr")).toBe("en");
    expect(pickLocale(["am"], undefined, "en-US")).toBe("am");
  });
});
