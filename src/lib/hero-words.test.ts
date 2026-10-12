import { describe, expect, it } from "vitest";
import { splitWords } from "./hero-words";

describe("splitWords", () => {
  it("splits on spaces", () => {
    expect(splitWords("Hanna Tesfaye")).toEqual(["Hanna", "Tesfaye"]);
  });

  it("keeps punctuation attached to its word", () => {
    expect(splitWords("Hanna, Dawit & co.")).toEqual(["Hanna,", "Dawit", "&", "co."]);
  });

  it("keeps an Ethiopic word whole", () => {
    expect(splitWords("ሐና ተስፋዬ")).toEqual(["ሐና", "ተስፋዬ"]);
    expect(splitWords("ቤተልሔም")).toEqual(["ቤተልሔም"]);
  });

  it("collapses runs of whitespace, tabs and newlines", () => {
    expect(splitWords("  Hanna \t\n Dawit  ")).toEqual(["Hanna", "Dawit"]);
  });

  it("treats the Ethiopic wordspace as part of the word", () => {
    // ፡ is punctuation, not whitespace; only spaces separate words.
    expect(splitWords("ሐና፡ዳዊት")).toEqual(["ሐና፡ዳዊት"]);
  });

  it("is empty for empty or blank text", () => {
    expect(splitWords("")).toEqual([]);
    expect(splitWords("   ")).toEqual([]);
  });
});
