/**
 * Page layouts. A layout is a whole component tree for the couple's site;
 * the theme still supplies the colors on top of it.
 */
export type LayoutMeta = {
  name: string;
  label: string;
  description: string;
};

export const LAYOUTS = {
  classic: {
    name: "classic",
    label: "Classic",
    description: "Full-screen cover photo, framed invitation card, timeline and carousel gallery.",
  },
  editorial: {
    name: "editorial",
    label: "Editorial",
    description: "Magazine style: split hero with the date in large numerals, oval portraits, event cards, mosaic gallery and a dated love story.",
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
