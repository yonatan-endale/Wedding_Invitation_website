import { toGeez } from "@/lib/geez";

const MAX_AGE = 120;

/** Every age written in Ge'ez numerals, back to its number: "፻" → 100, "፹፭" → 85. */
const GEEZ_AGES = new Map(Array.from({ length: MAX_AGE }, (_, i) => [toGeez(i + 1), i + 1] as const));

/**
 * The age in a birthday honoree's headline, so a layout can set it large:
 * "Turns 30", "60th birthday", "ዕድሜ 50", "፻ኛ ዓመት". Only a whole number from
 * 1 to 120 counts, and only the first one, so "Class of 2026" or a phone
 * number never becomes an age. Null when the line has none.
 */
export function milestoneNumber(headline: string): number | null {
  const match = /\d+|[፩-፼]+/.exec(headline);
  if (!match) return null;
  const [text] = match;
  if (/^\d+$/.test(text)) {
    const value = Number(text);
    return value >= 1 && value <= MAX_AGE && text.length <= 3 ? value : null;
  }
  return GEEZ_AGES.get(text) ?? null;
}

/** The first age found in these lines, in order: the person's own line, then the site's tagline. */
export function milestoneAge(...lines: string[]): number | null {
  for (const line of lines) {
    const age = milestoneNumber(line);
    if (age) return age;
  }
  return null;
}
