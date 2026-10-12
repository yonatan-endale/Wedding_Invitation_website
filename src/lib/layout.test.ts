import { describe, expect, it } from "vitest";
import { NAV_KEYS } from "./nav";
import { isOpeningName } from "./opening";
import { isThemeName } from "./theme";
import { LAYOUT_LIST, LAYOUT_NAMES, getLayout, isLayoutName } from "./layout";

describe("getLayout", () => {
  it("returns the named layout", () => {
    expect(getLayout("editorial")).toBe("editorial");
  });

  it("falls back to classic for unknown or missing names", () => {
    expect(getLayout("magazine")).toBe("classic");
    expect(getLayout(null)).toBe("classic");
    expect(getLayout(undefined)).toBe("classic");
  });
});

describe("isLayoutName", () => {
  it("accepts every registered layout and nothing else", () => {
    for (const name of LAYOUT_NAMES) expect(isLayoutName(name)).toBe(true);
    expect(isLayoutName("toString")).toBe(false);
    expect(isLayoutName(3)).toBe(false);
  });

  it("lists each layout with a label and description for the admin picker", () => {
    expect(LAYOUT_LIST.map((l) => l.name)).toEqual(LAYOUT_NAMES);
    expect(LAYOUT_NAMES.slice(0, 2)).toEqual(["classic", "editorial"]);
    for (const layout of LAYOUT_LIST) {
      expect(layout.label).toBeTruthy();
      expect(layout.description).toBeTruthy();
    }
  });
});

describe("layout metadata", () => {
  it("lists nav keys once each, always starting with the invitation", () => {
    for (const layout of LAYOUT_LIST) {
      expect(layout.navOrder[0], layout.name).toBe("invitation");
      expect(new Set(layout.navOrder).size, layout.name).toBe(layout.navOrder.length);
      for (const key of layout.navOrder) expect(NAV_KEYS).toContain(key);
    }
  });

  it("links the portraits only from layouts that render them", () => {
    for (const layout of LAYOUT_LIST) {
      expect(layout.navOrder.includes("couple"), layout.name).toBe(layout.showsCouple);
    }
  });

  it("suggests an opening and themes that exist", () => {
    for (const layout of LAYOUT_LIST) {
      expect(isOpeningName(layout.defaultOpening), layout.name).toBe(true);
      expect(layout.recommendedThemes.length, layout.name).toBeGreaterThan(0);
      for (const theme of layout.recommendedThemes) expect(isThemeName(theme), `${layout.name} ${theme}`).toBe(true);
    }
  });
});
