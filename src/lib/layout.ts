import type { NavKey } from "./nav";
import type { OpeningName } from "./opening";
import type { ThemeName } from "./theme";

/**
 * Page layouts. A layout is a whole component tree for the couple's site;
 * the theme still supplies the colors on top of it. Everything here is plain
 * data so the admin form and tests can read it without the components.
 */
export type LayoutMeta = {
  name: string;
  label: string;
  description: string;
  /**
   * The header starts solid instead of transparent over the hero. Needed for
   * any layout whose top is light or shorter than most of the screen.
   */
  headerStartSolid: boolean;
  /** Header links in this layout's page order. Each one shows only when its section renders. */
  navOrder: readonly NavKey[];
  /** Renders the portraits section (#couple). */
  showsCouple: boolean;
  /** The story section (#story) shows the dated milestones, not only the story text. */
  showsMilestones: boolean;
  /** "dark" layouts swap a light theme for its dark variant. */
  scheme: "theme" | "dark";
  /** Opening screen suggested in admin when this layout is picked. */
  defaultOpening: OpeningName;
  /** Themes the admin picker suggests for this layout. */
  recommendedThemes: readonly ThemeName[];
};

export const LAYOUTS = {
  classic: {
    name: "classic",
    label: "Classic",
    description: "Full-screen cover photo, framed invitation card, timeline and carousel gallery.",
    headerStartSolid: false,
    navOrder: ["invitation", "story", "schedule", "venues", "gallery", "gifts", "rsvp"],
    showsCouple: false,
    showsMilestones: false,
    scheme: "theme",
    defaultOpening: "netela",
    recommendedThemes: ["tibeb", "meskel", "buna", "lalibela", "ivory"],
  },
  editorial: {
    name: "editorial",
    label: "Editorial",
    description: "Magazine style: split hero with the date in large numerals, oval portraits, a timeline of the day, mosaic gallery and a dated love story.",
    headerStartSolid: true,
    navOrder: ["invitation", "couple", "schedule", "venues", "gallery", "story", "rsvp", "gifts"],
    showsCouple: true,
    showsMilestones: true,
    scheme: "theme",
    defaultOpening: "envelope",
    recommendedThemes: ["ivory", "blush", "tibeb", "dusty"],
  },
} as const satisfies Record<string, LayoutMeta>;

export type LayoutName = keyof typeof LAYOUTS;

export const LAYOUT_NAMES = Object.keys(LAYOUTS) as LayoutName[];
export const LAYOUT_LIST: LayoutMeta[] = LAYOUT_NAMES.map((name) => LAYOUTS[name]);
export const DEFAULT_LAYOUT: LayoutName = "classic";

export function isLayoutName(value: unknown): value is LayoutName {
  return typeof value === "string" && Object.hasOwn(LAYOUTS, value);
}

/** Unknown or missing names fall back to the classic layout so old rows keep rendering. */
export function getLayout(name: string | null | undefined): LayoutName {
  return isLayoutName(name) ? name : DEFAULT_LAYOUT;
}
