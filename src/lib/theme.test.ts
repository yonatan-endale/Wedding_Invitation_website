import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast";
import { THEME_LIST, THEME_NAMES, darkVariant, getTheme, layoutPalette, themeCss, themeStyle, type Theme } from "./theme";

describe("getTheme", () => {
  it("returns the named theme", () => {
    expect(getTheme("buna").name).toBe("buna");
  });

  it("falls back to tibeb for unknown and inherited names", () => {
    expect(getTheme("neon").name).toBe("tibeb");
    expect(getTheme(null).name).toBe("tibeb");
    expect(getTheme("toString").name).toBe("tibeb");
    expect(getTheme("__proto__").name).toBe("tibeb");
  });
});

describe("themeStyle", () => {
  it("exposes every theme color as a CSS variable", () => {
    for (const name of THEME_NAMES) {
      const style = themeStyle(name) as Record<string, string>;
      for (const key of ["--w-paper", "--w-ink", "--w-ink-soft", "--w-rule", "--w-sheet", "--w-thread-1", "--w-thread-2", "--w-thread-3", "--w-on-thread-1", "--w-metal", "--w-petal"]) {
        expect(style[key], `${name} ${key}`).toMatch(/^#[0-9a-f]{6}$/i);
      }
    }
  });

  it("offers palettes beyond the Ethiopian set", () => {
    for (const name of ["blush", "ivory", "burgundy", "dusty"]) {
      expect(THEME_NAMES).toContain(name);
    }
    expect((themeStyle("burgundy") as Record<string, string>).colorScheme).toBe("dark");
  });

  it("gives gold themes a gold metal and tizita a silver one", () => {
    expect(getTheme("tibeb").colors.metal).toBe(getTheme("tibeb").colors.thread2);
    expect(getTheme("meskel").colors.metal).toBe(getTheme("meskel").colors.thread1);
    expect(getTheme("tizita").colors.metal).toBe("#c9d2e6");
  });

  it("sets the color scheme so form controls match", () => {
    expect((themeStyle("tizita") as Record<string, string>).colorScheme).toBe("dark");
    expect((themeStyle("tibeb") as Record<string, string>).colorScheme).toBe("light");
  });
});

describe("themeCss", () => {
  it("writes every variable into one :root rule with the scheme and page background", () => {
    const css = themeCss(getTheme("buna"));
    expect(css).toMatch(/^:root\{color-scheme:dark;/);
    expect(css).toContain("--w-metal:#e8c07d");
    expect(css).toContain("--w-petal:");
    expect(css).toContain("body{background:#221712}");
  });
});

type ColorKey = keyof Theme["colors"];

/** Each check: the foreground token, what it sits on, and the minimum ratio. */
const CONTRAST_CHECKS: { label: string; fg: ColorKey; bg: ColorKey | "#000000"; min: number }[] = [
  { label: "ink on paper", fg: "ink", bg: "paper", min: 7 },
  { label: "inkSoft on paper", fg: "inkSoft", bg: "paper", min: 4.5 },
  { label: "onThread1 on thread1", fg: "onThread1", bg: "thread1", min: 4.5 },
  // Gold text sits on dark photo washes, so it has to read on black.
  { label: "metal on black", fg: "metal", bg: "#000000", min: 4.5 },
];

/**
 * Legacy palettes that fail a check today: white on the pale first thread.
 * TODO: darken blush and dusty thread1 (or set a dark onThread1) and empty this.
 * New themes never go here.
 */
const KNOWN_LOW_CONTRAST: Partial<Record<string, readonly ColorKey[]>> = {
  blush: ["onThread1"],
  dusty: ["onThread1"],
};

function ratio(theme: Theme, check: (typeof CONTRAST_CHECKS)[number]): number {
  const bg = check.bg === "#000000" ? check.bg : theme.colors[check.bg];
  return contrastRatio(theme.colors[check.fg], bg);
}

describe("theme contrast", () => {
  const lightThemes = THEME_LIST.filter((theme) => theme.scheme === "light");
  const palettes = [
    ...THEME_LIST.map((theme) => ({ id: theme.name, theme, allow: KNOWN_LOW_CONTRAST[theme.name] ?? [] })),
    ...lightThemes.map((theme) => ({ id: `${theme.name} (dark variant)`, theme: darkVariant(theme), allow: [] as readonly ColorKey[] })),
  ];

  for (const { id, theme, allow } of palettes) {
    for (const check of CONTRAST_CHECKS) {
      if (allow.includes(check.fg)) continue;
      it(`${id}: ${check.label} is at least ${check.min}:1`, () => {
        expect(ratio(theme, check)).toBeGreaterThanOrEqual(check.min);
      });
    }
  }

  it("keeps the allowlist to legacy themes that still fail", () => {
    for (const [name, keys] of Object.entries(KNOWN_LOW_CONTRAST)) {
      expect(["blush", "dusty"], `${name} is not a legacy theme`).toContain(name);
      for (const key of keys ?? []) {
        const check = CONTRAST_CHECKS.find((candidate) => candidate.fg === key);
        expect(check, `${name} ${key}`).toBeDefined();
        // Once a fix lands this fails, as a reminder to drop the entry.
        expect(ratio(getTheme(name), check!), `${name} ${key} passes now; remove it from KNOWN_LOW_CONTRAST`).toBeLessThan(check!.min);
      }
    }
  });
});

describe("new themes", () => {
  it("adds netela, emerald, adey and basalt with the right schemes", () => {
    expect(getTheme("netela").scheme).toBe("light");
    expect(getTheme("emerald").scheme).toBe("dark");
    expect(getTheme("adey").scheme).toBe("light");
    expect(getTheme("basalt").scheme).toBe("light");
    expect(getTheme("emerald").label).toBe("Emerald & Gold");
  });

  it("keeps the researched colours", () => {
    expect(getTheme("netela").colors).toMatchObject({ paper: "#fbf8f1", thread1: "#1f5a43", thread2: "#b8913a", thread3: "#9c3b30", metal: "#b8913a" });
    expect(getTheme("emerald").colors).toMatchObject({
      paper: "#0e2a22",
      sheet: "#123429",
      ink: "#f4ecd6",
      thread1: "#d4af37",
      thread2: "#e9cf7a",
      thread3: "#b5523b",
      petal: "#f2c12e",
      metal: "#d4af37",
    });
    expect(getTheme("adey").colors).toMatchObject({ paper: "#f7f4ea", thread1: "#6f9b7a", thread2: "#e8bf3c", thread3: "#c46a55" });
    expect(getTheme("basalt").colors).toMatchObject({ paper: "#ebe7e1", ink: "#2b2622", thread1: "#5a4a3c", thread2: "#b38b4d", thread3: "#7a3a2a" });
  });

  it("gives every theme a unique name that matches its key and a description", () => {
    expect(new Set(THEME_LIST.map((theme) => theme.name)).size).toBe(THEME_LIST.length);
    for (const name of THEME_NAMES) {
      expect(getTheme(name).name).toBe(name);
      expect(getTheme(name).description.length).toBeGreaterThan(10);
    }
  });
});

describe("darkVariant", () => {
  it("returns dark themes unchanged", () => {
    for (const theme of THEME_LIST.filter((candidate) => candidate.scheme === "dark")) {
      expect(darkVariant(theme)).toBe(theme);
    }
  });

  it("turns a light theme dark without touching the original", () => {
    const tibeb = getTheme("tibeb");
    const before = structuredClone(tibeb);
    const dark = darkVariant(tibeb);
    expect(tibeb).toEqual(before);
    expect(dark.scheme).toBe("dark");
    expect(dark.name).toBe("tibeb");
    expect(dark.colors.paper).not.toBe(tibeb.colors.paper);
  });

  it("derives every token as #rrggbb, with gold as the first thread", () => {
    for (const theme of THEME_LIST.filter((candidate) => candidate.scheme === "light")) {
      const { colors } = darkVariant(theme);
      for (const [key, value] of Object.entries(colors)) expect(value, `${theme.name} ${key}`).toMatch(/^#[0-9a-f]{6}$/);
      expect(colors.thread1).toBe(colors.metal);
      expect(colors.thread2).toBe(colors.metal);
      expect(colors.onThread1).toBe(colors.paper);
      expect(colors.petal).toBe(theme.colors.petal);
    }
  });

  it("uses a near-black paper with a lighter sheet and the theme paper as ink", () => {
    for (const theme of THEME_LIST.filter((candidate) => candidate.scheme === "light")) {
      const { colors } = darkVariant(theme);
      expect(contrastRatio(colors.paper, "#000000"), theme.name).toBeLessThan(1.5);
      expect(contrastRatio(colors.sheet, "#000000"), theme.name).toBeGreaterThan(contrastRatio(colors.paper, "#000000"));
      expect(colors.ink, theme.name).toBe(theme.colors.paper);
    }
  });

  it("keeps the gold and thread3 readable on the sheet", () => {
    for (const theme of THEME_LIST.filter((candidate) => candidate.scheme === "light")) {
      const { colors } = darkVariant(theme);
      expect(contrastRatio(colors.metal, colors.sheet), theme.name).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(colors.inkSoft, colors.sheet), theme.name).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(colors.thread3, colors.sheet), theme.name).toBeGreaterThanOrEqual(3);
    }
  });

  it("writes a dark :root rule", () => {
    expect(themeCss(darkVariant(getTheme("ivory")))).toMatch(/^:root\{color-scheme:dark;/);
  });
});

describe("layoutPalette", () => {
  it("uses the dark variant only for a light theme in a dark layout", () => {
    const ivory = getTheme("ivory");
    const buna = getTheme("buna");
    expect(layoutPalette(ivory, "theme")).toBe(ivory);
    expect(layoutPalette(buna, "theme")).toBe(buna);
    expect(layoutPalette(buna, "dark")).toBe(buna);
    expect(layoutPalette(ivory, "dark")).toEqual(darkVariant(ivory));
  });
});
