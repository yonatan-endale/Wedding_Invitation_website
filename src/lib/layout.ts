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
  /**
   * The couple section renders even without portraits (Reel's posters and the
   * Arches' twin arches fall back to the cover photo or an initial), so the
   * header links to it. Otherwise it needs at least one portrait.
   */
  coupleAlways: boolean;
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
    coupleAlways: false,
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
    coupleAlways: false,
    showsMilestones: true,
    scheme: "theme",
    defaultOpening: "envelope",
    recommendedThemes: ["ivory", "blush", "tibeb", "dusty"],
  },
  reel: {
    name: "reel",
    label: "Reel",
    description:
      "Cinematic and dark: a letterboxed cover with opening credits, the couple as the stars, the day as scenes, a film-strip gallery and end credits.",
    headerStartSolid: false,
    navOrder: ["invitation", "couple", "schedule", "venues", "gallery", "story", "rsvp", "gifts"],
    showsCouple: true,
    coupleAlways: true,
    showsMilestones: true,
    scheme: "dark",
    defaultOpening: "seal",
    recommendedThemes: ["meskel", "buna", "tizita", "burgundy", "emerald"],
  },
  noir: {
    name: "noir",
    label: "Noir & Gold",
    description: "Black tie: a gold crest monogram, gold-foil names, a framed gallery wall and black-metal gift cards.",
    headerStartSolid: false,
    navOrder: ["invitation", "schedule", "venues", "gallery", "story", "gifts", "rsvp"],
    showsCouple: false,
    coupleAlways: false,
    showsMilestones: false,
    scheme: "dark",
    defaultOpening: "seal",
    recommendedThemes: ["burgundy", "tizita", "buna", "emerald"],
  },
  arches: {
    name: "arches",
    label: "Gilded Arches",
    description:
      "Ivory and gold: the cover photo in an arched window, twin arches for the couple, an arcade of events and an arch-cropped photo strip.",
    headerStartSolid: true,
    navOrder: ["invitation", "couple", "schedule", "venues", "gallery", "story", "rsvp", "gifts"],
    showsCouple: true,
    coupleAlways: true,
    showsMilestones: false,
    scheme: "theme",
    defaultOpening: "seal",
    recommendedThemes: ["ivory", "netela", "lalibela", "basalt"],
  },
  stories: {
    name: "stories",
    label: "Stories",
    description:
      "Tap through it like stories on a phone: one full-screen card at a time for the cover, the invitation, the day, the photos and the RSVP, with progress bars and arrow keys.",
    headerStartSolid: true,
    navOrder: ["invitation", "schedule", "venues", "gallery", "story", "rsvp", "gifts"],
    showsCouple: false,
    coupleAlways: false,
    showsMilestones: true,
    scheme: "theme",
    defaultOpening: "adey",
    recommendedThemes: ["blush", "ivory", "tibeb", "meskel", "adey"],
  },
  flatlay: {
    name: "flatlay",
    label: "Flat-lay Suite",
    description:
      "A stationery suite laid out on linen: a sealed envelope, then the invitation, schedule, details and RSVP cards stacking over each other as you scroll, and fanned photo prints.",
    headerStartSolid: true,
    navOrder: ["invitation", "schedule", "venues", "rsvp", "gifts", "gallery", "story"],
    showsCouple: false,
    coupleAlways: false,
    showsMilestones: false,
    scheme: "theme",
    defaultOpening: "envelope",
    recommendedThemes: ["ivory", "netela", "blush", "adey"],
  },
  kaba: {
    name: "kaba",
    label: "Kaba Velvet",
    description:
      "Regal and always dark, like a groom's velvet kaba: deep velvet, gold-thread embroidery that stitches itself in, a stitched timeline that marks the Mels, and a stitched monogram.",
    headerStartSolid: false,
    navOrder: ["invitation", "schedule", "venues", "gallery", "story", "gifts", "rsvp"],
    showsCouple: false,
    coupleAlways: false,
    showsMilestones: false,
    scheme: "dark",
    defaultOpening: "netela",
    recommendedThemes: ["emerald", "burgundy", "meskel", "tizita"],
  },
  brana: {
    name: "brana",
    label: "Brana Manuscript",
    description:
      "An illuminated Ge'ez manuscript on parchment: harag headpieces, the names in red rubric, Ge'ez numerals, the day as a canon table and a colophon at the end.",
    headerStartSolid: true,
    navOrder: ["invitation", "schedule", "venues", "gallery", "story", "rsvp", "gifts"],
    showsCouple: false,
    coupleAlways: false,
    showsMilestones: true,
    scheme: "theme",
    defaultOpening: "netela",
    recommendedThemes: ["netela", "ivory", "lalibela", "basalt"],
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
