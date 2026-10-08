import type { CSSProperties } from "react";
import { contrastRatio, mixHex } from "./contrast";

type ThemeColors = {
  paper: string;
  ink: string;
  inkSoft: string;
  rule: string;
  sheet: string;
  thread1: string;
  thread2: string;
  thread3: string;
  onThread1: string;
  /**
   * The gold (silver in tizita) of seals, foil names and gold rules. Decoration
   * on light paper; text in this colour belongs on dark photo washes only.
   */
  metal: string;
  /** Falling petals over the hero photo. */
  petal: string;
};

export type Theme = {
  name: string;
  label: string;
  description: string;
  scheme: "light" | "dark";
  colors: ThemeColors;
};

/**
 * The first nine palettes borrow from Ethiopian weddings; the rest are classic
 * wedding schemes. The three "threads" colour the border band that runs through
 * the site, whichever border style the couple picks.
 */
const THEMES = {
  tibeb: {
    name: "tibeb",
    label: "Tibeb",
    description: "Linen white with the green, gold and red threads of a habesha kemis border.",
    scheme: "light",
    colors: {
      paper: "#f2f4ef",
      ink: "#17261f",
      inkSoft: "#56655c",
      rule: "#d5dbd0",
      sheet: "#fbfcf9",
      thread1: "#1d6b47",
      thread2: "#c49a22",
      thread3: "#a8372c",
      metal: "#c49a22",
      onThread1: "#ffffff",
      petal: "#c94a4a",
    },
  },
  meskel: {
    name: "meskel",
    label: "Meskel",
    description: "Deep highland green lit by yellow adey abeba daisies.",
    scheme: "dark",
    colors: {
      paper: "#102a1e",
      ink: "#f3ebc8",
      inkSoft: "#b9b48f",
      rule: "#2a4636",
      sheet: "#15352a",
      thread1: "#f2c12e",
      thread2: "#7fb069",
      thread3: "#e4572e",
      metal: "#f2c12e",
      onThread1: "#102a1e",
      petal: "#e2604a",
    },
  },
  buna: {
    name: "buna",
    label: "Buna",
    description: "Roasted coffee, copper jebena and a green coffee leaf.",
    scheme: "dark",
    colors: {
      paper: "#221712",
      ink: "#f0e3d3",
      inkSoft: "#b59f8a",
      rule: "#3a2a22",
      sheet: "#2b1e18",
      thread1: "#d08650",
      thread2: "#e8c07d",
      thread3: "#7d9b69",
      metal: "#e8c07d",
      onThread1: "#221712",
      petal: "#c96b6b",
    },
  },
  lalibela: {
    name: "lalibela",
    label: "Lalibela",
    description: "Rose-coloured rock churches, ochre light and a priest's blue robe.",
    scheme: "light",
    colors: {
      paper: "#efe4df",
      ink: "#2e1d1b",
      inkSoft: "#735c57",
      rule: "#dccbc4",
      sheet: "#f7efeb",
      thread1: "#8e3b46",
      thread2: "#b98a4e",
      thread3: "#34566b",
      metal: "#b98a4e",
      onThread1: "#ffffff",
      petal: "#b8515f",
    },
  },
  tizita: {
    name: "tizita",
    label: "Tizita",
    description: "Evening navy with silver and dusty rose, for night receptions.",
    scheme: "dark",
    colors: {
      paper: "#151b2b",
      ink: "#e7e9f1",
      inkSoft: "#9aa3ba",
      rule: "#283149",
      sheet: "#1b2336",
      thread1: "#c9d2e6",
      thread2: "#d6a2ad",
      thread3: "#6f86b8",
      metal: "#c9d2e6",
      onThread1: "#151b2b",
      petal: "#d98a99",
    },
  },
  netela: {
    name: "netela",
    label: "Netela",
    description: "Cotton-white netela with one gold thread at the hem, a deep green and a muted red.",
    scheme: "light",
    colors: {
      paper: "#fbf8f1",
      ink: "#24221d",
      inkSoft: "#6a6457",
      rule: "#e8e0cd",
      sheet: "#fffdf8",
      thread1: "#1f5a43",
      thread2: "#b8913a",
      thread3: "#9c3b30",
      metal: "#b8913a",
      onThread1: "#ffffff",
      petal: "#c9a24e",
    },
  },
  emerald: {
    name: "emerald",
    label: "Emerald & Gold",
    description: "Deep emerald velvet embroidered in gold, like a wedding kaba. Rich and evening.",
    scheme: "dark",
    colors: {
      paper: "#0e2a22",
      ink: "#f4ecd6",
      inkSoft: "#b7b79c",
      rule: "#244a3d",
      sheet: "#123429",
      thread1: "#d4af37",
      thread2: "#e9cf7a",
      thread3: "#b5523b",
      metal: "#d4af37",
      onThread1: "#0e2a22",
      petal: "#f2c12e",
    },
  },
  adey: {
    name: "adey",
    label: "Adey",
    description: "Soft sage, adey abeba yellow and clay, like a tibeb border woven in pastels.",
    scheme: "light",
    colors: {
      paper: "#f7f4ea",
      ink: "#25302a",
      inkSoft: "#5e6a60",
      rule: "#e2dfcf",
      sheet: "#fcfaf3",
      thread1: "#6f9b7a",
      thread2: "#e8bf3c",
      thread3: "#c46a55",
      metal: "#c49a3c",
      // Sage is too light for white text, so labels on it are dark.
      onThread1: "#15211a",
      petal: "#e8bf3c",
    },
  },
  basalt: {
    name: "basalt",
    label: "Basalt",
    description: "The grey stone of Aksum and Gondar, dark carved wood, bronze and an oxblood accent.",
    scheme: "light",
    colors: {
      paper: "#ebe7e1",
      ink: "#2b2622",
      inkSoft: "#635a52",
      rule: "#d6cfc5",
      sheet: "#f5f2ed",
      thread1: "#5a4a3c",
      thread2: "#b38b4d",
      thread3: "#7a3a2a",
      metal: "#b38b4d",
      onThread1: "#ffffff",
      petal: "#b5654f",
    },
  },
  blush: {
    name: "blush",
    label: "Blush",
    description: "Blush pink and champagne gold with a soft warm grey.",
    scheme: "light",
    colors: {
      paper: "#f8eeed",
      ink: "#3d2f30",
      inkSoft: "#776465",
      rule: "#e8d7d5",
      sheet: "#fdf6f5",
      thread1: "#b8737e",
      thread2: "#c8a96a",
      thread3: "#d9a1a8",
      metal: "#c8a96a",
      onThread1: "#ffffff",
      petal: "#d98995",
    },
  },
  ivory: {
    name: "ivory",
    label: "Ivory",
    description: "Ivory and charcoal with one muted gold accent. Very quiet.",
    scheme: "light",
    colors: {
      paper: "#f7f4ee",
      ink: "#2b2a27",
      inkSoft: "#6f6c65",
      rule: "#e2ddd3",
      sheet: "#fcfaf6",
      thread1: "#4a4741",
      thread2: "#b89b5e",
      thread3: "#9a948a",
      metal: "#b89b5e",
      onThread1: "#ffffff",
      petal: "#c9a0a4",
    },
  },
  burgundy: {
    name: "burgundy",
    label: "Burgundy",
    description: "Deep burgundy with cream and gold. Rich and evening.",
    scheme: "dark",
    colors: {
      paper: "#3b1420",
      ink: "#f5e9dc",
      inkSoft: "#c9aaa5",
      rule: "#5a2a37",
      sheet: "#47192a",
      thread1: "#d4a862",
      thread2: "#e8c99a",
      thread3: "#c2626f",
      metal: "#d4a862",
      onThread1: "#3b1420",
      petal: "#e2919c",
    },
  },
  dusty: {
    name: "dusty",
    label: "Dusty blue",
    description: "Dusty blue and slate with a rose accent. Calm and airy.",
    scheme: "light",
    colors: {
      paper: "#eef2f5",
      ink: "#243040",
      inkSoft: "#5f6f80",
      rule: "#d5dee6",
      sheet: "#f7f9fb",
      thread1: "#5b7a99",
      thread2: "#c0a17a",
      thread3: "#c98a94",
      metal: "#c0a17a",
      onThread1: "#ffffff",
      petal: "#d99aa4",
    },
  },
} satisfies Record<string, Theme>;

export type ThemeName = keyof typeof THEMES;
export const THEME_NAMES = Object.keys(THEMES) as ThemeName[];
export const THEME_LIST: Theme[] = Object.values(THEMES);

export function isThemeName(value: unknown): value is ThemeName {
  return typeof value === "string" && Object.hasOwn(THEMES, value);
}

export function getTheme(name: string | null | undefined): Theme {
  return isThemeName(name) ? THEMES[name] : THEMES.tibeb;
}

/** Every theme colour as the CSS variable the wedding pages read. */
export function themeVars(theme: Theme): Record<`--w-${string}`, string> {
  const { colors } = theme;
  return {
    "--w-paper": colors.paper,
    "--w-ink": colors.ink,
    "--w-ink-soft": colors.inkSoft,
    "--w-rule": colors.rule,
    "--w-sheet": colors.sheet,
    "--w-thread-1": colors.thread1,
    "--w-thread-2": colors.thread2,
    "--w-thread-3": colors.thread3,
    "--w-on-thread-1": colors.onThread1,
    "--w-metal": colors.metal,
    "--w-petal": colors.petal,
  };
}

/** The theme as an inline style, for previews that tint one element. */
export function themeStyle(name: string | null | undefined): CSSProperties {
  const theme = getTheme(name);
  return { colorScheme: theme.scheme, ...themeVars(theme) } as CSSProperties;
}

/** The theme as a `:root` rule, injected once at the top of a couple's site. */
export function themeCss(theme: Theme): string {
  const vars = Object.entries(themeVars(theme))
    .map(([key, value]) => `${key}:${value}`)
    .join(";");
  return `:root{color-scheme:${theme.scheme};${vars}}body{background:${theme.colors.paper}}`;
}

/** The near-black a dark variant starts from, before the theme ink tints it. */
const DARK_BASE = "#0b0b0b";

/** Moves `color` toward `toward` in small steps until it reaches `ratio` against `against`. */
function withContrast(color: string, against: string, ratio: number, toward: string): string {
  let result = color;
  for (let step = 1; step <= 20 && contrastRatio(result, against) < ratio; step++) {
    result = mixHex(color, toward, step / 20);
  }
  return result;
}

/**
 * A light theme recoloured for the dark layouts: near-black paper tinted with
 * the theme's ink, the theme's paper as the ink, and the gold doing the work of
 * the first thread. Dark themes come back unchanged. Pure palette maths, so the
 * result is a plain theme `themeCss()` can write out.
 */
export function darkVariant(theme: Theme): Theme {
  if (theme.scheme === "dark") return theme;
  const c = theme.colors;
  const paper = mixHex(DARK_BASE, c.ink, 0.4);
  const ink = withContrast(c.paper, paper, 7, "#ffffff");
  const sheet = mixHex(paper, ink, 0.05);
  // Checked against the lighter sheet, so the colours also read on cards.
  const metal = withContrast(c.metal, sheet, 4.5, "#ffffff");
  return {
    ...theme,
    scheme: "dark",
    colors: {
      paper,
      ink,
      inkSoft: withContrast(mixHex(c.inkSoft, ink, 0.5), sheet, 4.5, ink),
      rule: mixHex(paper, ink, 0.12),
      sheet,
      thread1: metal,
      thread2: metal,
      // A border colour, so it needs the 3:1 of non-text contrast; more would wash it out.
      thread3: withContrast(c.thread3, sheet, 3, ink),
      metal,
      onThread1: paper,
      petal: c.petal,
    },
  };
}

/** The palette a layout shows: a "dark" layout swaps a light theme for its dark variant. */
export function layoutPalette(theme: Theme, layoutScheme: "theme" | "dark"): Theme {
  return layoutScheme === "dark" && theme.scheme === "light" ? darkVariant(theme) : theme;
}
