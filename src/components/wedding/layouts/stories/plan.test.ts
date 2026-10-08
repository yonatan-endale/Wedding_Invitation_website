import { describe, expect, it } from "vitest";
import { PHOTO_CARDS, balancedChunks, cardCount, scheduleCards, storyParagraphs } from "./plan";

type Site = Parameters<typeof cardCount>[0];

describe("balancedChunks", () => {
  it("splits evenly, fuller cards first", () => {
    expect(balancedChunks(6, 3)).toEqual([3, 3]);
    expect(balancedChunks(7, 3)).toEqual([3, 2, 2]);
    expect(balancedChunks(4, 3)).toEqual([2, 2]);
    expect(balancedChunks(10, 3)).toEqual([3, 3, 2, 2]);
  });

  it("returns nothing for nothing", () => {
    expect(balancedChunks(0, 3)).toEqual([]);
  });

  it("always adds up to the count and never passes the maximum", () => {
    for (let count = 1; count <= 30; count++) {
      const chunks = balancedChunks(count, 3);
      expect(chunks.reduce((a, b) => a + b, 0)).toBe(count);
      expect(Math.max(...chunks)).toBeLessThanOrEqual(3);
    }
  });
});

describe("scheduleCards", () => {
  it("gives a short day one card per event", () => {
    expect(scheduleCards(0)).toEqual([]);
    expect(scheduleCards(1)).toEqual([1]);
    expect(scheduleCards(3)).toEqual([1, 1, 1]);
  });

  it("groups a long day", () => {
    expect(scheduleCards(4)).toEqual([2, 2]);
    expect(scheduleCards(6)).toEqual([3, 3]);
  });
});

describe("storyParagraphs", () => {
  it("splits on blank lines and drops empty ones", () => {
    expect(storyParagraphs("One\n\n  \n\nTwo\nstill two")).toEqual(["One", "Two\nstill two"]);
    expect(storyParagraphs("   ")).toEqual([]);
  });
});

describe("cardCount", () => {
  const bare = {
    couple: { story: { en: "" }, rsvpEnabled: false },
    events: [],
    venues: [],
    milestones: [],
    giftAccounts: [],
    wishlistItems: [],
  } as unknown as Site;

  it("always has the cover, invitation, save-the-date, countdown and thank-you cards", () => {
    expect(cardCount(bare, "en", 0)).toBe(5);
  });

  it("adds a card for each section that renders", () => {
    const site = {
      ...bare,
      couple: { story: { en: "We met.\n\nWe married." }, rsvpEnabled: true },
      events: Array.from({ length: 6 }, (_, id) => ({ id })),
      venues: [{ id: 1 }],
      milestones: [{ id: 1 }, { id: 2 }],
      giftAccounts: [{ id: 1 }],
    } as unknown as Site;
    // 5 always + 2 schedule + venues + photos (capped) + story text + 2 milestones + RSVP + gifts.
    expect(cardCount(site, "en", 12)).toBe(5 + 2 + 1 + PHOTO_CARDS + 1 + 2 + 1 + 1);
  });

  it("falls back to the other language's story", () => {
    const site = { ...bare, couple: { story: { en: "", am: "ታሪክ" }, rsvpEnabled: false } } as unknown as Site;
    expect(cardCount(site, "en", 0)).toBe(6);
  });
});
