import { describe, expect, it } from "vitest";
import { isEthiopic, isLocale, isRtl, LOCALES, localeDir, pickText, sanitizeLocales, usesEthiopianCalendar } from "./localized";

describe("pickText", () => {
  it("returns the requested language when present", () => {
    expect(pickText({ en: "Welcome", am: "እንኳን ደህና መጡ" }, "am")).toBe("እንኳን ደህና መጡ");
  });

  it("falls back to English when Amharic is missing or blank", () => {
    expect(pickText({ en: "Welcome" }, "am")).toBe("Welcome");
    expect(pickText({ en: "Welcome", am: "   " }, "am")).toBe("Welcome");
  });

  it("falls back to Amharic when English is blank", () => {
    expect(pickText({ en: "", am: "ሰላም" }, "en")).toBe("ሰላም");
  });

  it("returns an empty string for missing values", () => {
    expect(pickText(null, "en")).toBe("");
    expect(pickText(undefined, "am")).toBe("");
  });
});

describe("the language registry", () => {
  it("accepts every listed language and nothing else", () => {
    for (const locale of LOCALES) expect(isLocale(locale)).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it("knows each language's script, direction and calendar", () => {
    expect(isEthiopic("ti")).toBe(true);
    expect(isEthiopic("om")).toBe(false);
    expect(isRtl("ar")).toBe(true);
    expect(localeDir("en")).toBe("ltr");
    expect(usesEthiopianCalendar("om")).toBe(true);
    expect(usesEthiopianCalendar("ar")).toBe(false);
  });

  it("keeps known codes in registry order without repeats", () => {
    expect(sanitizeLocales(["om", "xx", "am", "am", "en"])).toEqual(["en", "am", "om"]);
  });

  it("falls back to English, then Amharic, then any language with text", () => {
    expect(pickText({ en: "Welcome", ar: "أهلاً" }, "ar")).toBe("أهلاً");
    expect(pickText({ en: "Welcome", am: "እንኳን" }, "ti")).toBe("Welcome");
    expect(pickText({ en: "", am: "እንኳን" }, "om")).toBe("እንኳን");
    expect(pickText({ en: "", ti: "ሰላም" }, "ar")).toBe("ሰላም");
  });
});
