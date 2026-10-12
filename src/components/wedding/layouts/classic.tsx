import { MemoriesSection, SiteFooter } from "../closing";
import { CountdownSection } from "../countdown-section";
import { GallerySection } from "../gallery";
import { GiftsSection } from "../gifts";
import { Hero } from "../hero";
import { InvitationCard, ScriptureSection, StorySection } from "../invitation";
import { MonogramWatermark } from "../primitives";
import { RsvpSection } from "../rsvp";
import { SaveTheDate } from "../save-the-date";
import { ScheduleSection, VenuesSection } from "../schedule";
import type { LayoutProps } from "./types";

/**
 * The original layout: full-screen cover, framed invitation card, the
 * full-screen save-the-date, timeline, carousel gallery. The invitation card
 * sits between the two full-screen photos so they never follow each other.
 */
export function ClassicLayout({ site, locale, names, photos }: LayoutProps) {
  return (
    <>
      <MonogramWatermark monogram={names.monogram} />
      <main className="relative z-10">
        <Hero site={site} locale={locale} />
        <InvitationCard site={site} locale={locale} />
        <SaveTheDate site={site} locale={locale} names={names} photos={photos} skin="cinema" photoPreference="gallery" />
        <CountdownSection site={site} />
        <StorySection site={site} locale={locale} />
        <ScriptureSection site={site} locale={locale} />
        <ScheduleSection site={site} locale={locale} />
        <VenuesSection site={site} locale={locale} />
        <GallerySection photos={photos} names={`${names.one} & ${names.two}`} drift={site.couple.galleryDrift} />
        <GiftsSection site={site} locale={locale} />
        <RsvpSection site={site} locale={locale} />
        <MemoriesSection site={site} locale={locale} />
      </main>
      <SiteFooter site={site} locale={locale} />
    </>
  );
}
