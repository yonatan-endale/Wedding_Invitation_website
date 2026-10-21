import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { LayoutProps } from "@/components/wedding/layouts/types";
import { MemoriesSection } from "@/components/wedding/closing";
import { CountdownSection } from "@/components/wedding/countdown-section";
import { GiftsSection } from "@/components/wedding/gifts";
import { StorySection } from "@/components/wedding/invitation";
import { WeddingImage, eyebrowClass } from "@/components/wedding/primitives";
import { RsvpSection } from "@/components/wedding/rsvp";
import { SaveTheDate } from "@/components/wedding/save-the-date";
import { ScheduleSection, VenuesSection } from "@/components/wedding/schedule";
import { pickText, usesEthiopianCalendar } from "@/lib/localized";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate, weddingDateParts } from "@/lib/wedding-format";
import { EventFooter } from "../../event-footer";
import { EventInvitation } from "../../event-invitation";
import { GroupedGallery } from "../../grouped-gallery";
import { HonoreeSection, honoreeAnchor } from "../../honorees";

/**
 * Commencement: a graduation on ivory, built around the class year. The year
 * is set huge in outline behind the graduates' names, each name a link down to
 * that graduate's card with the degree under it. Then the invitation as a
 * letter, the graduates on mounted diploma cards, the save-the-date, the day,
 * the photos in the groups the family named, and the replies.
 */
export async function CommencementLayout({ site, locale, names, photos }: LayoutProps) {
  const { couple, honorees } = site;
  const t = await getTranslations("layouts.commencement");
  const year = weddingDateParts(couple.eventAt, couple.timezone, locale).year;
  const otherCalendar =
    usesEthiopianCalendar(locale)
      ? formatGregorianDate(couple.eventAt, couple.timezone)
      : formatEthiopianDateLine(couple.eventAt, couple.timezone);
  const tagline = pickText(couple.tagline, locale);

  return (
    <>
      <main className="relative z-10">
        <header className="relative overflow-hidden px-5 pt-28 sm:px-10 sm:pt-36">
          <div className="mx-auto max-w-5xl">
            <p data-reveal="up" className={eyebrowClass}>
              {t("classOf", { year })}
            </p>
            <h1 className="mt-6 grid gap-6 sm:gap-8">
              {honorees.map((honoree, index) => (
                <a
                  key={honoree.id}
                  href={`#${honoreeAnchor(index)}`}
                  data-reveal="up"
                  style={{ "--i": index + 1 } as CSSProperties}
                  className="group block w-fit rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                >
                  <span className="block font-display text-[clamp(3rem,11vw,6.5rem)] leading-[0.95] group-hover:text-thread-1">
                    {pickText(honoree.nick, locale) || pickText(honoree.name, locale)}
                  </span>
                  {pickText(honoree.headline, locale) ? (
                    <span className="mt-2 block font-display text-[clamp(1.125rem,2.6vw,1.5rem)] text-ink-soft italic ethiopic:not-italic">
                      {pickText(honoree.headline, locale)}
                    </span>
                  ) : null}
                </a>
              ))}
            </h1>
            {tagline ? (
              <p data-reveal="up" style={{ "--i": honorees.length + 1 } as CSSProperties} className="mt-10 max-w-[38ch] text-lg">
                {tagline}
              </p>
            ) : null}
            <p
              data-reveal="up"
              style={{ "--i": honorees.length + 2 } as CSSProperties}
              className="mt-10 border-t border-rule pt-5"
            >
              <span className="block font-display text-[clamp(1.25rem,3vw,1.75rem)]">
                {formatWeddingDate(couple.eventAt, couple.timezone, locale)}
              </span>
              <span className="block text-ink-soft">{otherCalendar}</span>
            </p>
            {/* The class year, the one loud thing on the page: outline numerals closing the cover, cut off by its edge. */}
            <span
              aria-hidden
              className="-mb-[0.36em] mt-6 block text-end font-display text-[clamp(7rem,34vw,24rem)] leading-none text-transparent select-none sm:-mt-10"
              style={{ WebkitTextStroke: "1.5px color-mix(in oklab, var(--w-metal) 75%, transparent)" }}
            >
              {year}
            </span>
          </div>
        </header>

        {couple.heroPhotoUrl ? (
          <div className="px-5 sm:px-10">
            <div data-reveal="fade" className="relative mx-auto aspect-[3/2] max-w-5xl overflow-hidden bg-rule sm:aspect-[21/9]">
              <WeddingImage
                src={couple.heroPhotoUrl}
                alt={names.one}
                fill
                priority
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
                style={{ objectPosition: couple.heroPosition }}
              />
            </div>
          </div>
        ) : null}

        <EventInvitation site={site} locale={locale} look="letter" />
        <HonoreeSection honorees={honorees} locale={locale} look="diploma" className="border-t border-rule bg-sheet" />
        <SaveTheDate site={site} locale={locale} names={names} photos={photos} skin="editorial" photoPreference="gallery" />
        <CountdownSection site={site} />
        <ScheduleSection site={site} locale={locale} />
        <VenuesSection site={site} locale={locale} />
        <GroupedGallery photos={photos} names={names.one} heading={t("gallery")} look="frames" className="bg-sheet" />
        <StorySection site={site} locale={locale} />
        <GiftsSection site={site} locale={locale} />
        <RsvpSection site={site} locale={locale} />
        <MemoriesSection site={site} locale={locale} />
      </main>
      <EventFooter site={site} locale={locale} />
    </>
  );
}
