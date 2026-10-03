import { describe, expect, it } from "vitest";
import { EVENT_KINDS, EVENT_KIND_META, getEventKind, isEventKind } from "./event-kinds";

describe("event kinds", () => {
  it("fall back to other for unknown or missing kinds", () => {
    expect(getEventKind("party")).toBe("other");
    expect(getEventKind(undefined)).toBe("other");
    expect(getEventKind("mels")).toBe("mels");
  });

  it("reject inherited names", () => {
    expect(isEventKind("toString")).toBe(false);
  });

  it("give every kind except other a bilingual default title", () => {
    for (const kind of EVENT_KINDS) {
      const { label, title } = EVENT_KIND_META[kind];
      expect(label).toBeTruthy();
      if (kind === "other") {
        expect(title).toBeNull();
      } else {
        expect(title?.en).toBeTruthy();
        expect(title?.am).toBeTruthy();
      }
    }
  });
});
