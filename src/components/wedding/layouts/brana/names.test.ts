import { describe, expect, it } from "vitest";
import { nameLang, scribedName, scriptLang } from "./names";

describe("scribedName", () => {
  it("sets the Ge'ez name above the Latin one when the couple gave both", () => {
    expect(scribedName({ en: "Dawit", am: "ዳዊት" })).toEqual({ geez: "ዳዊት", latin: "Dawit" });
  });

  it("shows Latin only, and never transliterates, when there is no Amharic name", () => {
    expect(scribedName({ en: "Dawit" })).toEqual({ geez: null, latin: "Dawit" });
    expect(scribedName({ en: "Dawit", am: "" })).toEqual({ geez: null, latin: "Dawit" });
    expect(scribedName({ en: "Dawit", am: "   " })).toEqual({ geez: null, latin: "Dawit" });
  });

  it("ignores an Amharic field that holds Latin letters", () => {
    expect(scribedName({ en: "Dawit", am: "Dawit" })).toEqual({ geez: null, latin: "Dawit" });
  });

  it("takes Ge'ez typed into the English field as the Ge'ez form", () => {
    expect(scribedName({ en: "ዳዊት" })).toEqual({ geez: "ዳዊት", latin: "" });
  });

  it("adds the father's name in each script it was given in", () => {
    expect(scribedName({ en: "Dawit", am: "ዳዊት" }, { en: "Ayele", am: "አየለ" })).toEqual({ geez: "ዳዊት አየለ", latin: "Dawit Ayele" });
    expect(scribedName({ en: "Dawit", am: "ዳዊት" }, { en: "Ayele" })).toEqual({ geez: "ዳዊት", latin: "Dawit Ayele" });
    expect(scribedName({ en: "Dawit" }, { en: "Ayele", am: "አየለ" })).toEqual({ geez: null, latin: "Dawit Ayele" });
    expect(scribedName({ en: "Dawit" }, null)).toEqual({ geez: null, latin: "Dawit" });
  });

  it("tidies stray spaces", () => {
    expect(scribedName({ en: "  Dawit  ", am: " ዳዊት " })).toEqual({ geez: "ዳዊት", latin: "Dawit" });
  });
});

describe("scriptLang and nameLang", () => {
  it("tags Ge'ez text as Amharic wherever it appears", () => {
    expect(scriptLang("አዲስ አበባ")).toBe("am");
    expect(scriptLang("Addis Ababa")).toBeUndefined();
    expect(nameLang("ዳዊት")).toBe("am");
    expect(nameLang("Dawit")).toBe("en");
  });
});
