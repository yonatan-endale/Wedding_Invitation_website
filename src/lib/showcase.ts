import type { EventType } from "./event-types";
import { LAYOUT_NAMES, LAYOUTS, type LayoutName } from "./layout";
import { openingsFor, type OpeningName } from "./opening";
import { getTheme, type Theme, type ThemeName } from "./theme";

/**
 * The public designs page: every layout, shown on a fictional demo site. A demo
 * is a published site with "showcase mode" on, so the page can try any layout,
 * theme and opening on it with the preview query options. The demo data lives
 * in public/examples/showcase-*.json (seed with `pnpm db:seed:example`).
 */
export const SHOWCASE_KINDS = ["wedding", "graduation", "birthday", "baptism"] as const satisfies readonly EventType[];
export type ShowcaseKind = (typeof SHOWCASE_KINDS)[number];

export const DEMO_SLUGS: Record<ShowcaseKind, string> = {
  wedding: "demo-wedding",
  graduation: "demo-graduation",
  birthday: "demo-birthday",
  baptism: "demo-christening",
};

export type ShowcaseDesign = {
  layout: LayoutName;
  kind: ShowcaseKind;
  demoSlug: string;
  /** Where the preview opens: the layout's own suggestion. */
  defaultOpening: OpeningName;
  defaultTheme: ThemeName;
  /** Themes that suit the layout, the first being the default. */
  themes: (Theme & { name: ThemeName })[];
  openings: readonly OpeningName[];
  scheme: "theme" | "dark";
};

function kindOf(layout: LayoutName): ShowcaseKind {
  const types = LAYOUTS[layout].eventTypes as readonly EventType[];
  const kind = types.find((type): type is ShowcaseKind => (SHOWCASE_KINDS as readonly string[]).includes(type));
  if (!kind) throw new Error(`Layout ${layout} is not drawn for any showcase kind`);
  return kind;
}

/** Every layout once, in the order the registry lists them, weddings first. */
export const SHOWCASE: readonly ShowcaseDesign[] = LAYOUT_NAMES.map((layout) => {
  const meta = LAYOUTS[layout];
  const kind = kindOf(layout);
  const themes = meta.recommendedThemes.map((name) => ({ ...getTheme(name), name }));
  return {
    layout,
    kind,
    demoSlug: DEMO_SLUGS[kind],
    defaultOpening: meta.defaultOpening,
    defaultTheme: meta.recommendedThemes[0],
    themes,
    openings: openingsFor(kind),
    scheme: meta.scheme,
  };
}).sort((a, b) => SHOWCASE_KINDS.indexOf(a.kind) - SHOWCASE_KINDS.indexOf(b.kind));

/** The address a preview loads: the demo site, looking the way the visitor chose. Replays the opening. */
export function previewHref(design: ShowcaseDesign, look: { theme: ThemeName; opening: OpeningName }): string {
  const params = new URLSearchParams({ layout: design.layout, theme: look.theme, opening: look.opening, replay: "1" });
  return `/s/${design.demoSlug}?${params.toString()}`;
}

export function posterSrc(layout: LayoutName): string {
  return `/showcase/posters/${layout}.webp`;
}
