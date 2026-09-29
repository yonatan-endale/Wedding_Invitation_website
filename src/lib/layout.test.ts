import { describe, expect, it } from "vitest";
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
    expect(LAYOUT_LIST.map((l) => l.name)).toEqual(["classic", "editorial"]);
    for (const layout of LAYOUT_LIST) {
      expect(layout.label).toBeTruthy();
      expect(layout.description).toBeTruthy();
    }
  });
});
