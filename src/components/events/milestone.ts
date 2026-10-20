/**
 * The age in a birthday honoree's headline, so a layout can set it large:
 * "Turns 30", "60th birthday", "ዕድሜ 50". Only a whole number from 1 to 120
 * counts, and only the first one, so "Class of 2026" or a phone number never
 * becomes an age. Null when the line has none.
 */
export function milestoneNumber(headline: string): number | null {
  for (const match of headline.matchAll(/\d+/g)) {
    const value = Number(match[0]);
    if (value >= 1 && value <= 120 && match[0].length <= 3) return value;
    return null;
  }
  return null;
}
