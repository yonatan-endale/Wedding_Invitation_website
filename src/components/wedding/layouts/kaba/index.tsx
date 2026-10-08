import { cormorant } from "@/app/layout-fonts";
import { cn } from "@/lib/utils";
import { MemoriesSection } from "../../closing";
import { CountdownSection } from "../../countdown-section";
import { GiftsSection } from "../../gifts";
import { StorySection } from "../../invitation";
import { RsvpSection } from "../../rsvp";
import { SaveTheDate } from "../../save-the-date";
import { VenuesSection } from "../../schedule";
import type { LayoutProps } from "../types";
import { KabaFooter } from "./footer";
import { KabaGallery } from "./gallery";
import { KabaHero, KabaInvitation } from "./hero";
import styles from "./kaba.module.css";
import { KabaThread } from "./ornaments";
import { KabaSchedule } from "./schedule";
import { KabaVerse } from "./verse";

/**
 * Kaba Velvet: regal and always dark, after the velvet cape a Habesha groom
 * (and bride) wears. Deep velvet from the theme's paper, gold-thread
 * embroidery that stitches itself in, a cover with a fringed hem, the
 * invitation on an embroidered panel, the save-the-date in a gold-thread
 * frame, a stitched countdown, the day on a running stitch with the Mels
 * marked, an embroidered frame round the gallery and a stitched monogram to
 * close. Server components throughout; it adds no script of its own.
 */
export function KabaLayout({ site, locale, names, photos }: LayoutProps) {
  return (
    <div className={cn(cormorant.variable, styles.root)}>
      <KabaThread />
      <main className="relative z-10">
        <KabaHero site={site} locale={locale} names={names} />
        <KabaInvitation site={site} locale={locale} />
        <SaveTheDate site={site} locale={locale} names={names} photos={photos} skin="velvet" photoPreference="gallery" />
        <CountdownSection site={site} variant="stitch" className="py-20 sm:py-24" />
        <KabaSchedule site={site} locale={locale} />
        <VenuesSection site={site} locale={locale} />
        <KabaGallery photos={photos} names={`${names.one} & ${names.two}`} />
        <StorySection site={site} locale={locale} />
        <KabaVerse site={site} locale={locale} />
        <GiftsSection site={site} locale={locale} />
        <RsvpSection site={site} locale={locale} />
        <MemoriesSection site={site} locale={locale} />
      </main>
      <KabaFooter site={site} locale={locale} names={names} />
    </div>
  );
}
