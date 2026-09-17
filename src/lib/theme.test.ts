import { describe, expect, it } from "vitest";
import { THEME_NAMES, getTheme, themeStyle } from "./theme";

describe("getTheme", () => {
  it("returns the named theme", () => {
    expect(getTheme("buna").name).toBe("buna");
  });

  it("falls back to tibeb for unknown names", () => {
    expect(getTheme("neon").name).toBe("tibeb");
    expect(getTheme(null).name).toBe("tibeb");
  });
});

describe("themeStyle", () => {
  it("exposes every theme color as a CSS variable", () => {
    for (const name of THEME_NAMES) {
      const style = themeStyle(name) as Record<string, string>;
      for (const key of ["--w-paper", "--w-ink", "--w-ink-soft", "--w-rule", "--w-sheet", "--w-thread-1", "--w-thread-2", "--w-thread-3", "--w-on-thread-1"]) {
        expect(style[key], `${name} ${key}`).toMatch(/^#[0-9a-f]{6}$/i);
      }
    }
  });

  it("sets the color scheme so form controls match", () => {
    expect((themeStyle("tizita") as Record<string, string>).colorScheme).toBe("dark");
    expect((themeStyle("tibeb") as Record<string, string>).colorScheme).toBe("light");
  });
});
