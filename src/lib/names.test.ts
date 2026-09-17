import { describe, expect, it } from "vitest";
import { fullName } from "./names";

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
