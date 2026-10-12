import { HERO_POSITIONS } from "./constants";

type PhotoSource = { calendarPhotoUrl: string | null; heroPhotoUrl: string | null; heroPosition: string };

export type BackdropPhoto = { src: string; position: string };

const CENTER = HERO_POSITIONS[1].value;

/**
 * The save-the-date background: the couple's chosen photo, else the preferred
 * source, else the other one. Layouts whose hero already fills the screen with
 * the cover photo prefer a gallery photo, so the same picture doesn't show
 * twice in a row; that gallery photo is never the cover itself.
 */
export function pickSaveTheDatePhoto(
  couple: PhotoSource,
  galleryUrls: string[],
  prefer: "hero" | "gallery",
): BackdropPhoto | null {
  if (couple.calendarPhotoUrl) return { src: couple.calendarPhotoUrl, position: CENTER };
  const hero = couple.heroPhotoUrl ? { src: couple.heroPhotoUrl, position: couple.heroPosition } : null;
  const galleryUrl = galleryUrls.find((url) => url !== couple.heroPhotoUrl);
  const gallery = galleryUrl ? { src: galleryUrl, position: CENTER } : null;
  return prefer === "gallery" ? (gallery ?? hero) : (hero ?? gallery);
}
