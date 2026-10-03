import { describe, expect, it } from "vitest";
import { DEFAULT_OPENING, OPENING_LIST, OPENING_NAMES, getOpening, isOpeningName } from "./opening";

describe("getOpening", () => {
  it("returns the named opening", () => {
    for (const name of OPENING_NAMES) expect(getOpening(name)).toBe(name);
  });

  it("falls back to the netela for unknown or missing names", () => {
    expect(DEFAULT_OPENING).toBe("netela");
    expect(getOpening("fireworks")).toBe("netela");
    expect(getOpening(null)).toBe("netela");
    expect(getOpening(undefined)).toBe("netela");
  });
});

describe("isOpeningName", () => {
  it("accepts every registered opening and nothing inherited", () => {
    for (const name of OPENING_NAMES) expect(isOpeningName(name)).toBe(true);
    expect(isOpeningName("toString")).toBe(false);
    expect(isOpeningName(7)).toBe(false);
  });

  it("lists each opening with a label and description for the admin picker", () => {
    expect(OPENING_LIST.map((o) => o.name)).toEqual(OPENING_NAMES);
    for (const opening of OPENING_LIST) {
      expect(opening.label).toBeTruthy();
      expect(opening.description).toBeTruthy();
    }
  });
});
