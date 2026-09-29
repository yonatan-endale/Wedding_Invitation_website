import type { SiteData } from "@/db/queries/site";
import type { Locale } from "@/lib/localized";
import type { GalleryPhoto } from "../gallery";

/** The couple's names in the forms the page uses: first names, full names and the monogram. */
export type SiteNames = {
  one: string;
  two: string;
  firstOne: string;
  firstTwo: string;
  monogram: string;
};

export type LayoutProps = {
  site: SiteData;
  locale: Locale;
  names: SiteNames;
  photos: GalleryPhoto[];
};
