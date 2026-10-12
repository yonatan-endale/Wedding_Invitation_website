/**
 * Per-couple settings that sit next to the layout and theme: which calendar
 * the save-the-date shows, how much the page moves, and the optional faith
 * ornament. Stored as plain text columns, so unknown or missing values fall
 * back to the defaults instead of breaking old rows.
 */

type Option = { label: string; description: string };

function isOneOf<T extends string>(values: readonly T[], value: unknown): value is T {
  return typeof value === "string" && (values as readonly string[]).includes(value);
}

/** "both" lets guests switch; the grid starts on the guest's language (Gregorian in English, Ethiopian in Amharic). */
export const CALENDAR_STYLES = ["both", "ethiopian", "gregorian"] as const;
export type CalendarStyle = (typeof CALENDAR_STYLES)[number];
export const DEFAULT_CALENDAR_STYLE: CalendarStyle = "both";

export const CALENDAR_STYLE_OPTIONS: Record<CalendarStyle, Option> = {
  both: {
    label: "Both calendars",
    description: "Guests can switch. English pages start on the Gregorian month, Amharic pages on the Ethiopian month.",
  },
  ethiopian: { label: "Ethiopian", description: "The Ethiopian month, with the Gregorian date in small figures." },
  gregorian: { label: "Gregorian", description: "The Gregorian month, with the Ethiopian date in small figures." },
};

export const isCalendarStyle = (value: unknown): value is CalendarStyle => isOneOf(CALENDAR_STYLES, value);
export const getCalendarStyle = (value: unknown): CalendarStyle => (isCalendarStyle(value) ? value : DEFAULT_CALENDAR_STYLE);

/** How much the page animates. Guests who ask their device for reduced motion always get none. */
export const MOTION_LEVELS = ["subtle", "moderate", "rich"] as const;
export type MotionLevel = (typeof MOTION_LEVELS)[number];
export const DEFAULT_MOTION_LEVEL: MotionLevel = "moderate";

export const MOTION_LEVEL_OPTIONS: Record<MotionLevel, Option> = {
  subtle: { label: "Subtle", description: "Sections fade in. Nothing slides, zooms or loops." },
  moderate: {
    label: "Moderate",
    description: "Sections rise into place, the timeline draws as guests scroll, the wedding day is stamped on the calendar.",
  },
  rich: {
    label: "Rich",
    description: "Adds slow photo zooms, parallax, sliding cards and gentle looping glows. Heavier on older phones.",
  },
};

export const isMotionLevel = (value: unknown): value is MotionLevel => isOneOf(MOTION_LEVELS, value);
export const getMotionLevel = (value: unknown): MotionLevel => (isMotionLevel(value) ? value : DEFAULT_MOTION_LEVEL);

/** A small religious symbol over the couple's names, in the theme's gold. Off unless the couple asks for it. */
export const ORNAMENTS = ["none", "orthodox", "protestant", "harari"] as const;
export type Ornament = (typeof ORNAMENTS)[number];
export const DEFAULT_ORNAMENT: Ornament = "none";

export const ORNAMENT_OPTIONS: Record<Ornament, Option> = {
  none: { label: "None", description: "No religious symbol anywhere on the site." },
  orthodox: {
    label: "Orthodox cross",
    description: "An Ethiopian processional cross: flared arms in outline around an inner cross, bosses on every arm end.",
  },
  protestant: { label: "Plain cross", description: "A slim Latin cross with no ornament." },
  harari: {
    label: "Harari rosette",
    description: "An eight-pointed star in a woven band, after the baskets of Harari homes. No cross, no script.",
  },
};

export const isOrnament = (value: unknown): value is Ornament => isOneOf(ORNAMENTS, value);
export const getOrnament = (value: unknown): Ornament => (isOrnament(value) ? value : DEFAULT_ORNAMENT);
