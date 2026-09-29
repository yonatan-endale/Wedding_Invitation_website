import { MemoriesSection, SiteFooter } from "../closing";
import { GallerySection } from "../gallery";
import { GiftsSection } from "../gifts";
import { CountdownSection, Hero } from "../hero";
import { InvitationCard, ScriptureSection, StorySection } from "../invitation";
import { MonogramWatermark } from "../primitives";
import { RsvpSection } from "../rsvp";
import { ScheduleSection, VenuesSection } from "../schedule";
import type { LayoutProps } from "./types";

/** The original layout: full-screen cover, framed invitation card, timeline, carousel gallery. */
export function ClassicLayout({ site, locale, names, photos }: LayoutProps) {
  return (
    <>
      <MonogramWatermark monogram={names.monogram} />
      <main className="relative z-10">
        <Hero site={site} locale={locale} />
        <CountdownSection site={site} locale={locale} />
        <InvitationCard site={site} locale={locale} />
        <StorySection site={site} locale={locale} />
        <ScriptureSection site={site} locale={locale} />
        <ScheduleSection site={site} locale={locale} />
        <VenuesSection site={site} locale={locale} />
        <GallerySection photos={photos} names={`${names.one} & ${names.two}`} />
        <GiftsSection site={site} locale={locale} />
        <RsvpSection site={site} locale={locale} />
        <MemoriesSection site={site} locale={locale} />
      </main>
      <SiteFooter site={site} locale={locale} />
    </>
  );
}
