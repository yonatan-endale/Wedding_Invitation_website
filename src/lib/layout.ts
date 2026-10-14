import type { EventType } from "./event-types";
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
  /** The event types this layout is drawn for; the admin picker offers it only to those. */
  eventTypes: readonly EventType[];
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
    eventTypes: ["wedding"],
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
    eventTypes: ["wedding"],
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
    eventTypes: ["wedding"],
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
    eventTypes: ["wedding"],
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
    eventTypes: ["wedding"],
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
    eventTypes: ["wedding"],
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
    eventTypes: ["wedding"],
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
    eventTypes: ["wedding"],
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
    eventTypes: ["wedding"],
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
  slate: {
    name: "slate",
    eventTypes: ["wedding"],
    label: "Slate",
    description:
      "Clean and modern: a full photo cover with RSVP and schedule buttons, script accents over serif headings, cards for the day, a boxed countdown and a framed photo strip.",
    headerStartSolid: false,
    navOrder: ["invitation", "schedule", "venues", "gallery", "story", "rsvp", "gifts"],
    showsCouple: false,
    coupleAlways: false,
    showsMilestones: false,
    scheme: "theme",
    defaultOpening: "envelope",
    recommendedThemes: ["slate", "ivory", "basalt", "emerald"],
  },
  commencement: {
    name: "commencement",
    eventTypes: ["graduation"],
    label: "Commencement",
    description:
      "Clean and modern on a light page: the class year in huge outline behind the graduates' names, each graduate on a mounted diploma card, and the photos in the groups you name.",
    headerStartSolid: true,
    navOrder: ["invitation", "couple", "schedule", "venues", "gallery", "story", "gifts", "rsvp"],
    showsCouple: true,
    coupleAlways: false,
    showsMilestones: false,
    scheme: "theme",
    defaultOpening: "envelope",
    recommendedThemes: ["academy", "laurel", "ivory", "slate"],
  },
  tassel: {
    name: "tassel",
    eventTypes: ["graduation"],
    label: "Tassel",
    description:
      "A deep cover in your first colour with a laurel wreath of initials hung on a gold cord, its tassel swinging as the page opens. Each graduate in an arch, the invitation on a bordered card.",
    headerStartSolid: true,
    navOrder: ["invitation", "couple", "schedule", "venues", "gallery", "story", "gifts", "rsvp"],
    showsCouple: true,
    coupleAlways: false,
    showsMilestones: false,
    scheme: "theme",
    defaultOpening: "adey",
    recommendedThemes: ["academy", "laurel", "emerald", "burgundy"],
  },
  confetti: {
    name: "confetti",
    eventTypes: ["birthday"],
    label: "Confetti",
    description:
      "Bright and warm: the name set huge in a page of confetti in your three colours, which drifts into place as the page opens, with their line on a ribbon.",
    headerStartSolid: true,
    navOrder: ["invitation", "couple", "schedule", "venues", "gallery", "story", "gifts", "rsvp"],
    showsCouple: true,
    coupleAlways: false,
    showsMilestones: false,
    scheme: "theme",
    defaultOpening: "adey",
    recommendedThemes: ["adey", "meskel", "blush", "emerald"],
  },
  milestone: {
    name: "milestone",
    eventTypes: ["birthday"],
    label: "Milestone",
    description:
      "Elegant, for the big numbers: a dark cover with the age in large gold foil between fine rules and the name under it. Without an age in their line it shows the name alone.",
    headerStartSolid: true,
    navOrder: ["invitation", "couple", "schedule", "venues", "gallery", "story", "gifts", "rsvp"],
    showsCouple: true,
    coupleAlways: false,
    showsMilestones: false,
    scheme: "theme",
    defaultOpening: "envelope",
    recommendedThemes: ["burgundy", "emerald", "ivory", "academy"],
  },
  shema: {
    name: "shema",
    eventTypes: ["baptism"],
    label: "Shema",
    description:
      "A christening in white: the cover is a length of woven shema with your border down both edges, the child's name and christening name on it, and the photo in an arch.",
    headerStartSolid: true,
    navOrder: ["invitation", "couple", "schedule", "venues", "gallery", "story", "gifts", "rsvp"],
    showsCouple: true,
    coupleAlways: false,
    showsMilestones: false,
    scheme: "theme",
    defaultOpening: "envelope",
    recommendedThemes: ["ivory", "netela", "dusty", "lalibela"],
  },
} as const satisfies Record<string, LayoutMeta>;

export type LayoutName = keyof typeof LAYOUTS;

export const LAYOUT_NAMES = Object.keys(LAYOUTS) as LayoutName[];
export const LAYOUT_LIST: LayoutMeta[] = LAYOUT_NAMES.map((name) => LAYOUTS[name]);
export const DEFAULT_LAYOUT: LayoutName = "classic";

export function isLayoutName(value: unknown): value is LayoutName {
  return typeof value === "string" && Object.hasOwn(LAYOUTS, value);
}

/** The layouts drawn for an event type, in picker order. */
export function layoutsFor(type: EventType): LayoutMeta[] {
  return LAYOUT_LIST.filter((layout) => layout.eventTypes.includes(type));
}

/**
 * The layout a site renders with. Unknown or missing names fall back to the
 * type's first layout (classic for weddings) so old rows keep rendering, and
 * a layout drawn for another type is never used, so a graduation can't end up
 * in a wedding layout.
 */
export function getLayout(name: string | null | undefined, type: EventType = "wedding"): LayoutName {
  const drawnFor = (layout: LayoutName) => (LAYOUTS[layout] as LayoutMeta).eventTypes.includes(type);
  if (isLayoutName(name) && drawnFor(name)) return name;
  const first = LAYOUT_NAMES.find(drawnFor);
  return first ?? DEFAULT_LAYOUT;
}
