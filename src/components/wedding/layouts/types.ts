import type { SiteData } from "@/db/queries/site";
import type { Locale } from "@/lib/localized";
import type { GalleryPhoto } from "../gallery";

/** The couple's names in the forms the page uses: first names, full names, initials and the monogram. */
export type SiteNames = {
  one: string;
  two: string;
  firstOne: string;
  firstTwo: string;
  /** First initials in the page's language, e.g. ["H", "D"] or ["ሐ", "ዳ"]. */
  initials: [string, string];
  /** "H & D" */
  monogram: string;
};

export type LayoutProps = {
  site: SiteData;
  locale: Locale;
  names: SiteNames;
  photos: GalleryPhoto[];
};
