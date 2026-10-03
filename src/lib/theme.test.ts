import { describe, expect, it } from "vitest";
import { THEME_NAMES, getTheme, themeCss, themeStyle } from "./theme";

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
