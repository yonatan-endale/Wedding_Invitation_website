import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { mapsLink } from "@/lib/maps";
import { cn } from "@/lib/utils";
import { formatWeddingDate, formatWeddingTime, formatWeddingTimeRange } from "@/lib/wedding-format";
import { SectionHeading, buttonOutline, sectionPadding } from "../../primitives";

type Props = { site: SiteData; locale: Locale };

/** One card per event with its time, venue and a link to the map. */
export async function EditorialEvents({ site, locale }: Props) {
  const { couple, events, venues } = site;
  if (events.length === 0) return null;
  const [t, ti] = await Promise.all([getTranslations("schedule"), getTranslations("invitation")]);
  const venuesById = new Map(venues.map((v) => [v.id, v]));
  const dressCode = pickText(couple.dressCode, locale);

  return (
    <section id="schedule" aria-labelledby="schedule-heading" className={cn(sectionPadding, "border-t border-rule")}>
      <div className="mx-auto max-w-5xl text-center">
        <SectionHeading id="schedule-heading" className="text-center">
          {t("heading")}
        </SectionHeading>
        <p className="mt-3 text-ink-soft">{formatWeddingDate(couple.weddingAt, couple.timezone, locale)}</p>

        <ul className={cn("mx-auto mt-14 grid gap-6", events.length > 1 ? "md:grid-cols-2" : "max-w-md")}>
          {events.map((event) => {
            const venue = event.venueId ? venuesById.get(event.venueId) : undefined;
            const href = venue
              ? mapsLink({ mapsUrl: venue.mapsUrl, lat: venue.lat, lng: venue.lng, address: pickText(venue.address, "en") })
              : null;
            const description = pickText(event.description, locale);
            const address = venue ? pickText(venue.address, locale) : "";
            return (
              <li key={event.id} className="flex flex-col items-center border border-rule bg-sheet px-6 py-10 sm:px-10">
                <h3 className="font-display text-[clamp(1.75rem,3.5vw,2.25rem)] leading-tight">{pickText(event.title, locale)}</h3>
                <p className="mt-5 text-base tabular-nums">
                  {event.endsAt ? (
                    <>
                      <time dateTime={event.startsAt} className="sr-only">
                        {formatWeddingTime(event.startsAt, couple.timezone, locale)}
                      </time>
                      <span aria-hidden>{formatWeddingTimeRange(event.startsAt, event.endsAt, couple.timezone, locale)}</span>
                    </>
                  ) : (
                    <time dateTime={event.startsAt}>{formatWeddingTime(event.startsAt, couple.timezone, locale)}</time>
                  )}
                </p>
                {venue ? (
                  <p className="mt-4">
                    {pickText(venue.name, locale)}
                    {address ? <span className="block text-base text-ink-soft">{address}</span> : null}
                  </p>
                ) : null}
                {description ? <p className="mt-4 max-w-[44ch] text-base text-ink-soft">{description}</p> : null}
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className={cn(buttonOutline, "mt-8")}>
                    <MapPin aria-hidden className="size-4" />
                    {t("viewLocation")}
                  </a>
                ) : null}
              </li>
            );
          })}
        </ul>

        {dressCode ? (
          <p className="mx-auto mt-12 max-w-[40ch]">
            <span className="block text-ink-soft">{ti("dressCode")}</span>
            {dressCode}
          </p>
        ) : null}
      </div>
    </section>
  );
}
