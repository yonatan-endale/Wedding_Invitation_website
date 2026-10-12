import { describe, expect, it } from "vitest";
import { firstGrapheme, fullName, initials, initialsOf, joinNames, monogramText, widestWordEm } from "./names";

describe("fullName", () => {
  it("joins the first name and the father's name", () => {
    expect(fullName({ en: "Hanna" }, { en: "Tesfaye" }, "en")).toBe("Hanna Tesfaye");
  });

  it("uses the Amharic forms together when available", () => {
    expect(fullName({ en: "Hanna", am: "ሐና" }, { en: "Tesfaye", am: "ተስፋዬ" }, "am")).toBe("ሐና ተስፋዬ");
  });

  it("falls back per part when one language is missing", () => {
    expect(fullName({ en: "Hanna", am: "ሐና" }, { en: "Tesfaye" }, "am")).toBe("ሐና Tesfaye");
  });

  it("is just the first name when there is no father's name", () => {
    expect(fullName({ en: "Hanna" }, null, "en")).toBe("Hanna");
    expect(fullName({ en: "Hanna" }, { en: "  " }, "en")).toBe("Hanna");
  });
});

describe("initials", () => {
  it("takes the first letter of each first name", () => {
    expect(initials("Hanna", "dawit")).toEqual(["H", "D"]);
  });

  it("keeps an Ethiopic syllable and a combining accent whole", () => {
    expect(firstGrapheme("ሐና")).toBe("ሐ");
    expect(firstGrapheme("élise")).toBe("É");
  });

  it("ignores leading spaces and returns nothing for a blank name", () => {
    expect(firstGrapheme("  Meron")).toBe("M");
    expect(firstGrapheme("   ")).toBe("");
  });
});

describe("monogramText", () => {
  it("joins the initials with an ampersand and drops a missing one", () => {
    expect(monogramText(["H", "D"])).toBe("H & D");
    expect(monogramText(["", "D"])).toBe("D");
  });
});

describe("widestWordEm", () => {
  it("measures the widest word, not the whole name", () => {
    expect(widestWordEm("Woldegiyorgis Hailemariam")).toBeCloseTo(widestWordEm("Woldegiyorgis"));
    expect(widestWordEm("Woldegiyorgis")).toBeGreaterThan(widestWordEm("Dawit"));
  });

  it("counts Ge'ez syllables wider than Latin letters", () => {
    expect(widestWordEm("ዳዊት")).toBeGreaterThan(widestWordEm("abc"));
  });

  it("never returns less than 1em", () => {
    expect(widestWordEm("")).toBe(1);
  });
});


describe("joinNames", () => {
  it("reads two names the way couples always have", () => {
    expect(joinNames(["Hanna Tesfaye", "Dawit Alemu"])).toBe("Hanna Tesfaye & Dawit Alemu");
  });

  it("handles one name and lists of three or more", () => {
    expect(joinNames(["Ruth"])).toBe("Ruth");
    expect(joinNames(["Ruth", "Mahlet", "Selam"])).toBe("Ruth, Mahlet & Selam");
  });

  it("skips blank names and works in Amharic", () => {
    expect(joinNames(["ሩት", " ", "ማህሌት"])).toBe("ሩት & ማህሌት");
    expect(joinNames([])).toBe("");
  });
});

describe("initialsOf", () => {
  it("takes each first grapheme and drops blanks", () => {
    expect(initialsOf(["Ruth", "", "ማህሌት"])).toEqual(["R", "ማ"]);
  });
});
