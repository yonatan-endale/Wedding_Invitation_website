import { describe, expect, it } from "vitest";
import { NAV_KEYS } from "./nav";
import { isOpeningName } from "./opening";
import { isThemeName } from "./theme";
import { EVENT_TYPE_META, EVENT_TYPES } from "./event-types";
import { LAYOUT_LIST, LAYOUT_NAMES, getLayout, isLayoutName, layoutsFor } from "./layout";

describe("getLayout", () => {
  it("returns the named layout", () => {
    expect(getLayout("editorial")).toBe("editorial");
  });

  it("falls back to classic for unknown or missing names", () => {
    expect(getLayout("magazine")).toBe("classic");
    expect(getLayout(null)).toBe("classic");
    expect(getLayout(undefined)).toBe("classic");
  });

  it("keeps a layout drawn for one event type away from the others", () => {
    expect(getLayout("slate", "wedding")).toBe("slate");
    for (const type of EVENT_TYPES) {
      const layout = getLayout("slate", type);
      if (layoutsFor(type).length > 0) expect(LAYOUT_LIST.find((meta) => meta.name === layout)?.eventTypes, type).toContain(type);
    }
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

describe("layoutsFor", () => {
  it("draws every wedding layout for weddings", () => {
    const wedding = LAYOUT_LIST.filter((layout) => layout.eventTypes.includes("wedding"));
    expect(layoutsFor("wedding")).toEqual(wedding);
    expect(wedding.map((layout) => layout.name).slice(0, 2)).toEqual(["classic", "editorial"]);
  });

  it("gives every open event type at least one layout", () => {
    for (const type of EVENT_TYPES) {
      if (EVENT_TYPE_META[type].enabled) expect(layoutsFor(type).length, type).toBeGreaterThan(0);
    }
  });

  it("tags every layout with at least one event type", () => {
    for (const layout of LAYOUT_LIST) expect(layout.eventTypes.length, layout.name).toBeGreaterThan(0);
  });
});
