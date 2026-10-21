import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { LayoutProps } from "@/components/wedding/layouts/types";
import { MemoriesSection } from "@/components/wedding/closing";
import { CountdownSection } from "@/components/wedding/countdown-section";
import { GiftsSection } from "@/components/wedding/gifts";
import { StorySection } from "@/components/wedding/invitation";
import { Band, eyebrowClass } from "@/components/wedding/primitives";
import { RsvpSection } from "@/components/wedding/rsvp";
import { SaveTheDate } from "@/components/wedding/save-the-date";
import { ScheduleSection, VenuesSection } from "@/components/wedding/schedule";
import { pickText, usesEthiopianCalendar } from "@/lib/localized";
import { initialsOf, joinNames } from "@/lib/names";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate, weddingDateParts } from "@/lib/wedding-format";
import { EventFooter } from "../../event-footer";
import { EventInvitation } from "../../event-invitation";
import { GroupedGallery } from "../../grouped-gallery";
import { HonoreeSection } from "../../honorees";
import { Crest } from "./crest";

/**
 * Tassel: a graduation in the colours of a gown. The cover is a deep band in
 * the theme's first thread with a laurel wreath of the graduates' initials
 * hung on a gold cord, its tassel swinging once as the page opens, and the
 * couple's chosen border along its foot. Then the invitation as a bordered
 * card, each graduate in an arch on alternating sides, the save-the-date, the
 * day, the photos in their groups and the replies.
 */
export async function TasselLayout({ site, locale, names, photos }: LayoutProps) {
  const { couple, honorees } = site;
  const t = await getTranslations("layouts.tassel");
  const firstNames = honorees.map((honoree) => pickText(honoree.nick, locale) || pickText(honoree.name, locale));
  const year = weddingDateParts(couple.eventAt, couple.timezone, locale).year;
  const otherCalendar =
    usesEthiopianCalendar(locale) ? formatGregorianDate(couple.eventAt, couple.timezone) : formatEthiopianDateLine(couple.eventAt, couple.timezone);
  const tagline = pickText(couple.tagline, locale);

  return (
    <>
      <main className="relative z-10">
        <header className="relative isolate overflow-hidden bg-thread-1 text-on-thread-1">
          <div className="flex min-h-[86svh] flex-col items-center justify-center px-5 pt-24 pb-16 text-center">
            <Crest initials={initialsOf(firstNames)} className="w-[min(52vw,13rem)] text-on-thread-1" />
            <p data-reveal="up" className={`${eyebrowClass} mt-8 text-on-thread-1/80`}>
              {t("graduates", { year, count: honorees.length })}
            </p>
            <h1
              data-reveal="up"
              style={{ "--i": 1 } as CSSProperties}
              className="mt-4 max-w-4xl font-display text-[clamp(2.75rem,9vw,5.5rem)] leading-[1.02]"
            >
              {joinNames(firstNames)}
            </h1>
            {tagline ? (
              <p data-reveal="up" style={{ "--i": 2 } as CSSProperties} className="mt-6 max-w-[40ch] text-lg text-on-thread-1/85">
                {tagline}
              </p>
            ) : null}
            <p data-reveal="up" style={{ "--i": 3 } as CSSProperties} className="mt-8">
              <span className="block font-display text-[clamp(1.25rem,3vw,1.75rem)]">
                {formatWeddingDate(couple.eventAt, couple.timezone, locale)}
              </span>
              <span className="block text-on-thread-1/80">{otherCalendar}</span>
            </p>
          </div>
          <Band variant={couple.border} />
        </header>

        <EventInvitation site={site} locale={locale} look="card" />
        <HonoreeSection honorees={honorees} locale={locale} look="arch" className="bg-sheet" />
        <SaveTheDate site={site} locale={locale} names={names} photos={photos} skin="cinema" photoPreference="hero" />
        <CountdownSection site={site} />
        <ScheduleSection site={site} locale={locale} />
        <VenuesSection site={site} locale={locale} />
        <GroupedGallery photos={photos} names={names.one} heading={t("gallery")} look="plain" />
        <StorySection site={site} locale={locale} />
        <GiftsSection site={site} locale={locale} />
        <RsvpSection site={site} locale={locale} />
        <MemoriesSection site={site} locale={locale} />
      </main>
      <EventFooter site={site} locale={locale} />
    </>
  );
}
