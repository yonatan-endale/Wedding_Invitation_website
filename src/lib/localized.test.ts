import { describe, expect, it } from "vitest";
import { pickText } from "./localized";

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
