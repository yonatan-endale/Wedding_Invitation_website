import type { GalleryPhoto } from "@/components/wedding/lightbox";

export type PhotoGroup = { label: string; photos: { photo: GalleryPhoto; index: number }[] };

/**
 * The photos in the admin's order, cut into runs that share a group heading.
 * Photos without one gather under an unlabelled run, so a site that never
 * names a group gets one plain grid. `index` is the photo's place in the whole
 * list, for the lightbox that steps through all of them.
 */
export function groupPhotos(photos: GalleryPhoto[]): PhotoGroup[] {
  const groups: PhotoGroup[] = [];
  photos.forEach((photo, index) => {
    const label = photo.group?.trim() ?? "";
    const last = groups.at(-1);
    if (last && last.label === label) last.photos.push({ photo, index });
    else groups.push({ label, photos: [{ photo, index }] });
  });
  return groups;
}
