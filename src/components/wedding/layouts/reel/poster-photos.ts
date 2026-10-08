import type { SiteData } from "@/db/queries/site";
import { pickSaveTheDatePhoto } from "@/lib/save-the-date";

export type PosterPhoto = { src: string; position: string; portrait: boolean };

type Source = Pick<SiteData["couple"], "heroPhotoUrl" | "heroPosition" | "calendarPhotoUrl" | "partnerOnePortraitUrl" | "partnerTwoPortraitUrl">;

/** Where a photo's x position is set, keeping its y: "50% 40%" with x 28% is "28% 40%". */
function withX(position: string, x: string): string {
  const [, y = "50%"] = position.split(/\s+/);
  return `${x} ${y}`;
}

/**
 * A photo for each "Starring" poster: the partner's portrait, else the cover
 * photo, else a gallery photo, never the same one twice and the
 * save-the-date's photo only when nothing else is left. With a single photo
 * to share, both posters crop it, one from each side. Null means a
 * typographic poster.
 */
export function posterPhotos(couple: Source, galleryUrls: string[]): [PosterPhoto | null, PosterPhoto | null] {
  const hero = couple.heroPhotoUrl;
  const used = pickSaveTheDatePhoto(couple, galleryUrls, "gallery")?.src;
  const others = galleryUrls.filter((url) => url !== hero);
  const gallery = [...others.filter((url) => url !== used), ...others.filter((url) => url === used)];
  const pool: PosterPhoto[] = [
    ...(hero ? [{ src: hero, position: couple.heroPosition, portrait: false }] : []),
    // Gallery photos have no focal point; faces usually sit above the middle.
    ...gallery.map((src) => ({ src, position: "50% 30%", portrait: false })),
  ];
  const portrait = (src: string | null): PosterPhoto | null => (src ? { src, position: "50% 25%", portrait: true } : null);

  const one = portrait(couple.partnerOnePortraitUrl) ?? pool[0] ?? null;
  const two = portrait(couple.partnerTwoPortraitUrl) ?? pool.find((photo) => photo.src !== one?.src) ?? null;
  if (one && !two && !one.portrait) {
    return [
      { ...one, position: withX(one.position, "28%") },
      { ...one, position: withX(one.position, "72%") },
    ];
  }
  return [one, two];
}
