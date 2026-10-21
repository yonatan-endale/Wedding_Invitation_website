import { describe, expect, it } from "vitest";
import { ENABLED_EVENT_TYPES, EVENT_TYPES, EVENT_TYPE_META, getEventType, isEventType, usesHonorees } from "./event-types";

describe("getEventType", () => {
  it("returns a known type", () => {
    expect(getEventType("graduation")).toBe("graduation");
  });

  it("treats unknown and missing types as weddings", () => {
    expect(getEventType("party")).toBe("wedding");
    expect(getEventType(null)).toBe("wedding");
    expect(getEventType(undefined)).toBe("wedding");
    expect(isEventType("toString")).toBe(false);
  });
});

describe("event type metadata", () => {
  it("keeps weddings open", () => {
    expect(ENABLED_EVENT_TYPES).toContain("wedding");
  });

  it("gives honoree types a sensible range and couple types none", () => {
    for (const type of EVENT_TYPES) {
      const meta = EVENT_TYPE_META[type];
      expect(meta.label, type).toBeTruthy();
      if (usesHonorees(type)) {
        expect(meta.honorees.min, type).toBeGreaterThanOrEqual(1);
        expect(meta.honorees.max, type).toBeGreaterThanOrEqual(meta.honorees.min);
      } else {
        expect(meta.honorees, type).toEqual({ min: 0, max: 0 });
        expect(meta.headlineLabel, type).toBeNull();
      }
    }
  });

  it("models weddings and engagements as couples", () => {
    expect(usesHonorees("wedding")).toBe(false);
    expect(usesHonorees("engagement")).toBe(false);
    expect(usesHonorees("graduation")).toBe(true);
  });
});
