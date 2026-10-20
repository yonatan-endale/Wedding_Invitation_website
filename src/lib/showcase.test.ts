import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { LAYOUT_NAMES } from "./layout";
import { isOpeningName } from "./opening";
import { DEMO_SLUGS, SHOWCASE, SHOWCASE_KINDS, previewHref } from "./showcase";
import { isThemeName } from "./theme";

type Messages = { [key: string]: string | Messages };
const load = (locale: string): Messages =>
  JSON.parse(readFileSync(new URL(`../../messages/${locale}.json`, import.meta.url), "utf8"));
const FIELDS = ["feel", "mood", "goodFor", "b1", "b2", "b3"];

describe("showcase", () => {
  it("lists every layout exactly once", () => {
    expect(SHOWCASE.map((d) => d.layout).sort()).toEqual([...LAYOUT_NAMES].sort());
  });

  it("groups designs by kind, weddings first", () => {
    const order = SHOWCASE.map((d) => SHOWCASE_KINDS.indexOf(d.kind));
    expect(order).toEqual([...order].sort((a, b) => a - b));
    expect(SHOWCASE[0].kind).toBe("wedding");
  });

  it("uses a demo site per kind, a real opening and recommended themes", () => {
    for (const design of SHOWCASE) {
      expect(design.demoSlug).toBe(DEMO_SLUGS[design.kind]);
      expect(design.openings).toContain(design.defaultOpening);
      expect(isOpeningName(design.defaultOpening)).toBe(true);
      expect(design.themes.length).toBeGreaterThan(0);
      expect(isThemeName(design.defaultTheme)).toBe(true);
    }
  });

  it("builds a preview address that replays the opening", () => {
    const design = SHOWCASE.find((d) => d.layout === "slate")!;
    const href = previewHref(design, { theme: "slate", opening: "seal" });
    expect(href).toBe("/s/demo-wedding?layout=slate&theme=slate&opening=seal&replay=1");
  });

  it("has its explanation in both languages for every layout", () => {
    for (const locale of ["en", "am"]) {
      const showcase = load(locale).showcase as Messages;
      const layouts = showcase.layouts as Messages;
      for (const layout of LAYOUT_NAMES) {
        const entry = layouts[layout] as Messages | undefined;
        expect(entry, `${locale} ${layout}`).toBeDefined();
        for (const field of FIELDS) expect(typeof entry?.[field], `${locale} ${layout}.${field}`).toBe("string");
      }
    }
  });
});
