import { cormorant } from "@/app/layout-fonts";
import { cn } from "@/lib/utils";
import { MemoriesSection } from "../../closing";
import { CountdownSection } from "../../countdown-section";
import { GiftsSection } from "../../gifts";
import { StorySection } from "../../invitation";
import { SaveTheDate } from "../../save-the-date";
import { VenuesSection } from "../../schedule";
import type { LayoutProps } from "../types";
import { ArchesCouple } from "./couple";
import { ArchesFooter } from "./footer";
import { ArchesGallery } from "./gallery";
import { ArchesHero } from "./hero";
import { ArchesInvitation } from "./invitation";
import { ArchesRsvp } from "./rsvp";
import { ArchesSchedule } from "./schedule";
import { ArchesVerse } from "./verse";

/**
 * Gilded Arches: ivory and gold, art deco meeting the arched windows of
 * Lalibela. The cover photo in a tall arch before a sunburst, the invitation
 * inside a gold-outlined arch, twin arches for the couple, the day as an
 * arcade, an arch-cropped photo strip and the RSVP in an arched panel. Thin
 * gold keylines throughout; gold is never used for text on the light paper.
 * Cormorant Garamond is loaded for this layout only, and the shared sections'
 * headings take it too so the page speaks with one voice.
 */
export function ArchesLayout({ site, locale, names, photos }: LayoutProps) {
  return (
    <div className={cn(cormorant.variable, "[&_:is(h2,h3)]:font-cormorant")}>
      <main className="relative">
        <ArchesHero site={site} locale={locale} names={names} />
        <ArchesInvitation site={site} locale={locale} />
        <SaveTheDate site={site} locale={locale} names={names} photos={photos} skin="arch" photoPreference="gallery" />
        <CountdownSection site={site} variant="niches" className="pt-4 sm:pt-6" />
        <ArchesCouple site={site} locale={locale} names={names} />
        <ArchesVerse site={site} locale={locale} />
        <ArchesSchedule site={site} locale={locale} />
        <VenuesSection site={site} locale={locale} />
        <ArchesGallery photos={photos} names={`${names.one} & ${names.two}`} />
        <StorySection site={site} locale={locale} />
        <ArchesRsvp site={site} locale={locale} />
        <GiftsSection site={site} locale={locale} />
        <MemoriesSection site={site} locale={locale} />
      </main>
      <ArchesFooter site={site} locale={locale} names={names} />
    </div>
  );
}
