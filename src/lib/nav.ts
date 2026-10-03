/** Sections the header can link to. Each layout lists them in its own page order. */
export const NAV_KEYS = ["invitation", "couple", "story", "schedule", "venues", "gallery", "gifts", "rsvp"] as const;
export type NavKey = (typeof NAV_KEYS)[number];
