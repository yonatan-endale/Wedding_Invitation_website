import { describe, expect, it, vi } from "vitest";
import { parseCoupleImport } from "./couple-import";

// Graduations open with their first layout; until then this opens the type here
// and draws Classic for it, so the honoree rules can be checked on their own.
vi.mock("@/lib/event-types", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/event-types")>();
  const meta = { ...actual.EVENT_TYPE_META, graduation: { ...actual.EVENT_TYPE_META.graduation, enabled: true } };
  return { ...actual, EVENT_TYPE_META: meta };
});
vi.mock("@/lib/layout", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/layout")>();
  const classic = { ...actual.LAYOUTS.classic, eventTypes: ["wedding", "graduation"] };
  return { ...actual, LAYOUTS: { ...actual.LAYOUTS, classic } };
});

const graduation = {
  couple: { slug: "ruth-mahlet", eventType: "graduation", weddingAt: "2026-10-11T13:00", layout: "classic" },
  honorees: [
    { name: { en: "Ruth", am: "ሩት" }, father: { en: "Solomon" }, headline: { en: "Doctor of Medicine" } },
    { name: { en: "Mahlet" }, headline: { en: "BSc Computer Science" }, subheadline: { en: "Addis Ababa University" } },
  ],
  photos: [{ url: "/a.jpg", groupLabel: { en: "The two of us" } }],
};

function issuesOf(raw: unknown): string[] {
  const result = parseCoupleImport(raw);
  return result.success ? [] : result.issues;
}

describe("parseCoupleImport for honoree sites", () => {
  it("reads the honorees in order and leaves the partners empty", () => {
    const result = parseCoupleImport(graduation);
    if (!result.success) throw new Error(result.issues.join("\n"));
    expect(result.data.couple).toMatchObject({ eventType: "graduation", partnerOne: null, partnerTwo: null });
    expect(result.data.honorees).toEqual([
      {
        name: { en: "Ruth", am: "ሩት" },
        nick: null,
        father: { en: "Solomon" },
        headline: { en: "Doctor of Medicine" },
        subheadline: null,
        story: null,
        portraitUrl: null,
        portraitPosition: "50% 40%",
      },
      expect.objectContaining({ name: { en: "Mahlet" }, subheadline: { en: "Addis Ababa University" } }),
    ]);
    expect(result.data.photos[0].groupLabel).toEqual({ en: "The two of us" });
  });

  it("needs at least one honoree and no partners", () => {
    expect(issuesOf({ ...graduation, honorees: [] })).toEqual(["honorees: A graduation needs 1 to 6 honorees."]);
    expect(issuesOf({ ...graduation, couple: { ...graduation.couple, partnerOne: { en: "Hanna" } } })).toEqual([
      "couple.partnerOne: List the people under honorees instead.",
    ]);
  });

  it("refuses wedding-only layouts and event kinds", () => {
    expect(issuesOf({ ...graduation, couple: { ...graduation.couple, layout: "slate" } })).toEqual([
      "couple.layout: This layout is not drawn for a graduation.",
    ]);
    const events = [{ title: { en: "Mels" }, startsAt: "2026-10-12T13:00", kind: "mels" }];
    expect(issuesOf({ ...graduation, events })).toEqual(["events[0].kind: This kind is not offered for a graduation."]);
  });
});
