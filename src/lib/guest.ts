import { graphemes } from "./text";

const MAX_GRAPHEMES = 60;
const MAX_UNITS = 120;
/** Real names need at most a couple of combining marks per character; more is "Zalgo" text. */
const MAX_MARKS = 3;

/** Control characters and bidirectional overrides, which could reorder or hide the text around the name. */
const UNSAFE = /[\p{Cc}‎‏‪-‮⁦-⁩]/gu;

/**
 * The guest's name from an invitation link such as /s/hanna-dawit?to=Abebe,
 * for the opening's "Dear Abebe". Couples send each guest their own link on
 * Telegram. Cleaned, capped at 60 characters, and only ever rendered as text.
 */
export function parseGuestName(raw: string | string[] | undefined): string | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return null;
  const cleaned = value.normalize("NFC").replace(UNSAFE, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) return null;
  const tamed = graphemes(cleaned)
    .slice(0, MAX_GRAPHEMES)
    .map((char) => {
      let marks = 0;
      return Array.from(char)
        .filter((point) => !/\p{M}/u.test(point) || ++marks <= MAX_MARKS)
        .join("");
    })
    .join("");
  return graphemes(tamed.slice(0, MAX_UNITS)).join("").trim() || null;
}
