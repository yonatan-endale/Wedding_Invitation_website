import type { LocalizedText } from "@/lib/localized";

/** Ethiopic, Ethiopic Supplement, Extended and Extended-A. */
const ETHIOPIC = /[ሀ-᎟ⶀ-⷟꬀-꬯]/;

/** A name as the manuscript sets it: the Ge'ez form above the Latin one. Either can be missing, never both. */
export type ScribedName = { geez: string | null; latin: string };

const clean = (text: string | null | undefined) => text?.trim().replace(/\s+/g, " ") ?? "";

/** The Ge'ez form the couple typed: the Amharic field, or the English one if that is the field they wrote Ge'ez in. */
function geezOf(text: LocalizedText | null | undefined): string {
  const am = clean(text?.am);
  if (ETHIOPIC.test(am)) return am;
  const en = clean(text?.en);
  return ETHIOPIC.test(en) && !am ? en : "";
}

/** The Latin form the couple typed, if any. */
function latinOf(text: LocalizedText | null | undefined): string {
  const en = clean(text?.en);
  if (en && !ETHIOPIC.test(en)) return en;
  const am = clean(text?.am);
  return am && !ETHIOPIC.test(am) ? am : "";
}

/**
 * One partner's name in both scripts, exactly as the couple typed them and
 * never transliterated: the Ge'ez line only when there is a Ge'ez name, the
 * Latin line only when there is a Latin one. With a father's name, each line
 * adds the father's name in its own script when the couple gave it there; the
 * Ge'ez line never starts from the father's name alone.
 */
export function scribedName(first: LocalizedText, father?: LocalizedText | null): ScribedName {
  const geezFirst = geezOf(first);
  const latinFirst = latinOf(first);
  const geez = geezFirst ? [geezFirst, geezOf(father)].filter(Boolean).join(" ") : "";
  const latin = latinFirst ? [latinFirst, latinOf(father)].filter(Boolean).join(" ") : "";
  // A name with no Latin form shows its Ge'ez alone; one with neither keeps whatever was typed.
  if (!latin && geez) return { geez, latin: "" };
  return { geez: geez || null, latin: latin || clean(first.en) || clean(first.am) };
}

/** "am" for text written in Ge'ez script, so it gets Ge'ez type and is never letter-spaced or uppercased, even on English pages. */
export function scriptLang(text: string): "am" | undefined {
  return ETHIOPIC.test(text) ? "am" : undefined;
}

/** The language of a name's script: "am" for Ge'ez, "en" for Latin, so a Latin gloss keeps its capitals on Amharic pages too. */
export function nameLang(text: string): "am" | "en" {
  return ETHIOPIC.test(text) ? "am" : "en";
}
