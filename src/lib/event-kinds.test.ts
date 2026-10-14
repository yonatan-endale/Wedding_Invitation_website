import { describe, expect, it } from "vitest";
import { ORNAMENTS } from "./appearance";
import { EVENT_TYPES } from "./event-types";
import {
  EVENT_KINDS,
  EVENT_KIND_META,
  eventIconFor,
  getEventKind,
  hasEventIcon,
  isEventKind,
  kindsFor,
  titleForKind,
} from "./event-kinds";

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

describe("titleForKind", () => {
  const empty = { en: "", am: "" };

  it("fills an empty title with the kind's default in both languages", () => {
    expect(titleForKind(empty, "other", "buna")).toEqual({ en: "Coffee ceremony", am: "የቡና ሥነ ሥርዓት" });
  });

  it("replaces the previous kind's default when the admin changes their mind", () => {
    const reception = titleForKind(empty, "other", "reception");
    expect(titleForKind(reception, "reception", "mels")).toEqual({ en: "Mels", am: "መልስ" });
    // Untouched apart from stray spaces still counts as the default.
    expect(titleForKind({ en: " Reception ", am: reception.am }, "reception", "mels").en).toBe("Mels");
  });

  it("never overwrites what the admin wrote, language by language", () => {
    expect(titleForKind({ en: "Dinner at Sheraton", am: "" }, "other", "reception")).toEqual({
      en: "Dinner at Sheraton",
      am: "የሠርግ ግብዣ",
    });
    expect(titleForKind({ en: "Reception", am: "ራት" }, "reception", "mels")).toEqual({ en: "Mels", am: "ራት" });
    // A title that matches some other kind's default was still typed for this event.
    expect(titleForKind({ en: "Telosh", am: "" }, "reception", "mels").en).toBe("Telosh");
  });

  it("leaves the title alone when switching to other, which has no default", () => {
    const title = { en: "Reception", am: "የሠርግ ግብዣ" };
    expect(titleForKind(title, "reception", "other")).toEqual(title);
    expect(titleForKind(empty, "reception", "other")).toEqual(empty);
  });
});

describe("eventIconFor", () => {
  it("draws a cross or a crescent only for the couple who chose that faith's ornament", () => {
    expect(eventIconFor("ceremony_orthodox", "orthodox")).toBe("orthodox-cross");
    expect(eventIconFor("ceremony_protestant", "protestant")).toBe("cross");
    expect(eventIconFor("nikah", "harari")).toBe("crescent");
  });

  it("falls back to a church without a cross, or rings, for every other ornament", () => {
    for (const ornament of ["none", "protestant", "harari"] as const) {
      expect(eventIconFor("ceremony_orthodox", ornament)).toBe("church");
    }
    for (const ornament of ["none", "orthodox", "harari"] as const) {
      expect(eventIconFor("ceremony_protestant", ornament)).toBe("church");
    }
    for (const ornament of ["none", "orthodox", "protestant"] as const) {
      expect(eventIconFor("nikah", ornament)).toBe("rings");
    }
  });

  it("keeps faith imagery away from every other kind, whatever the ornament", () => {
    const faith = new Set(["orthodox-cross", "cross", "crescent"]);
    const gated = new Set(["ceremony_orthodox", "ceremony_protestant", "nikah"]);
    for (const kind of EVENT_KINDS.filter((k) => !gated.has(k))) {
      const icons = new Set(ORNAMENTS.map((ornament) => eventIconFor(kind, ornament)));
      expect(icons.size).toBe(1);
      expect(faith.has([...icons][0])).toBe(false);
    }
    expect(eventIconFor("other", "none")).toBe("diamond");
    expect(eventIconFor("buna", "orthodox")).toBe("jebena");
  });
});

describe("hasEventIcon", () => {
  it("leaves events of kind other without an icon, so older timelines are unchanged", () => {
    expect(hasEventIcon("other")).toBe(false);
    for (const kind of EVENT_KINDS.filter((k) => k !== "other")) expect(hasEventIcon(kind), kind).toBe(true);
  });
});

describe("kindsFor", () => {
  it("offers weddings the wedding kinds, in the original order", () => {
    expect(kindsFor("wedding")).toEqual(EVENT_KINDS.slice(0, EVENT_KINDS.indexOf("other") + 1));
  });

  it("offers every kind to at least one event type", () => {
    for (const kind of EVENT_KINDS) expect(EVENT_TYPES.some((type) => kindsFor(type).includes(kind)), kind).toBe(true);
  });

  it("gives every type known kinds, once each, ending with other", () => {
    for (const type of EVENT_TYPES) {
      const kinds = kindsFor(type);
      for (const kind of kinds) expect(isEventKind(kind), `${type} ${kind}`).toBe(true);
      expect(new Set(kinds).size, type).toBe(kinds.length);
      expect(kinds.at(-1), type).toBe("other");
    }
  });

  it("keeps wedding-only ceremonies off graduations", () => {
    expect(kindsFor("graduation")).not.toContain("mels");
    expect(kindsFor("graduation")).not.toContain("ceremony_orthodox");
  });
});
