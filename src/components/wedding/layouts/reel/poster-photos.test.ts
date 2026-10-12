import { describe, expect, it } from "vitest";
import { posterPhotos } from "./poster-photos";

const base = {
  heroPhotoUrl: null as string | null,
  heroPosition: "50% 40%",
  calendarPhotoUrl: null as string | null,
  partnerOnePortraitUrl: null as string | null,
  partnerTwoPortraitUrl: null as string | null,
};

describe("posterPhotos", () => {
  it("uses each partner's portrait when set", () => {
    const [one, two] = posterPhotos({ ...base, partnerOnePortraitUrl: "a.jpg", partnerTwoPortraitUrl: "b.jpg" }, ["g1.jpg"]);
    expect(one).toMatchObject({ src: "a.jpg", portrait: true });
    expect(two).toMatchObject({ src: "b.jpg", portrait: true });
  });

  it("falls back to the cover, then a gallery photo the save-the-date did not use", () => {
    const [one, two] = posterPhotos({ ...base, heroPhotoUrl: "hero.jpg" }, ["g1.jpg", "g2.jpg"]);
    expect(one).toEqual({ src: "hero.jpg", position: "50% 40%", portrait: false });
    // g1 is the save-the-date's backdrop (photoPreference "gallery").
    expect(two).toMatchObject({ src: "g2.jpg", portrait: false });
  });

  it("crops the cover from both sides when it is the only photo", () => {
    const [one, two] = posterPhotos({ ...base, heroPhotoUrl: "hero.jpg" }, []);
    expect(one).toMatchObject({ src: "hero.jpg", position: "28% 40%" });
    expect(two).toMatchObject({ src: "hero.jpg", position: "72% 40%" });
  });

  it("reuses the save-the-date's photo only when nothing else is left", () => {
    const [one, two] = posterPhotos(base, ["g1.jpg"]);
    expect(one).toMatchObject({ src: "g1.jpg", position: "28% 30%" });
    expect(two).toMatchObject({ src: "g1.jpg", position: "72% 30%" });
  });

  it("is typographic with no photos at all", () => {
    expect(posterPhotos(base, [])).toEqual([null, null]);
  });

  it("never borrows the portrait the other partner already shows", () => {
    const [one, two] = posterPhotos({ ...base, partnerTwoPortraitUrl: "b.jpg" }, []);
    expect(one).toBeNull();
    expect(two).toMatchObject({ src: "b.jpg", portrait: true });
  });
});
