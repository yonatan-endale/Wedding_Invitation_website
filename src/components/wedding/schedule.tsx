import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { mapsEmbedUrl, mapsLink } from "@/lib/maps";
import { cn } from "@/lib/utils";
import { formatWeddingDate, formatWeddingTime } from "@/lib/wedding-format";
import { SectionHeading, WeddingImage, sectionPadding } from "./primitives";
import { VenueMap } from "./venue-map";

type Props = { site: SiteData; locale: Locale };

export async function ScheduleSection({ site, locale }: Props) {
  const { couple, events, venues } = site;
  if (events.length === 0) return null;
  const t = await getTranslations("schedule");
  const venuesById = new Map(venues.map((v) => [v.id, v]));

  return (
    <section id="schedule" aria-labelledby="schedule-heading" className={sectionPadding}>
      <div className="mx-auto max-w-3xl">
        <SectionHeading id="schedule-heading">{t("heading")}</SectionHeading>
        <p className="mt-3 text-ink-soft">{formatWeddingDate(couple.weddingAt, couple.timezone, locale)}</p>

        <ol className="relative mt-14 ml-1 border-l border-rule">
          {events.map((event) => {
            const venue = event.venueId ? venuesById.get(event.venueId) : undefined;
            const href = venue
              ? mapsLink({ mapsUrl: venue.mapsUrl, lat: venue.lat, lng: venue.lng, address: pickText(venue.address, "en") })
              : null;
            const description = pickText(event.description, locale);
            return (
              <li key={event.id} className="relative pb-12 pl-8 last:pb-0 sm:pl-12">
                <span aria-hidden className="absolute top-[0.7rem] -left-[5px] size-[9px] rotate-45 bg-thread-2" />
                <p className="text-base text-ink-soft tabular-nums">
                  <time dateTime={event.startsAt}>{formatWeddingTime(event.startsAt, couple.timezone, locale)}</time>
                </p>
                <h3 className="mt-1 font-display text-[clamp(1.5rem,3.5vw,2rem)]">{pickText(event.title, locale)}</h3>
                {description ? <p className="mt-2 max-w-[52ch]">{description}</p> : null}
                {venue ? (
                  <p className="mt-2 text-base">
                    {href ? (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-thread-2 decoration-2 underline-offset-4 hover:decoration-ink"
                      >
                        {pickText(venue.name, locale)}
                      </a>
                    ) : (
                      pickText(venue.name, locale)
                    )}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export async function VenuesSection({ site, locale }: Props) {
  if (site.venues.length === 0) return null;
  const t = await getTranslations("venues");

  return (
    <section id="venues" aria-labelledby="venues-heading" className={cn(sectionPadding, "border-y border-rule bg-sheet")}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="venues-heading">{t("heading")}</SectionHeading>
        <div className={cn("mt-12 grid gap-14", site.venues.length > 1 && "md:grid-cols-2 md:gap-10")}>
          {site.venues.map((venue) => {
            const name = pickText(venue.name, locale);
            const address = pickText(venue.address, locale);
            const place = { mapsUrl: venue.mapsUrl, lat: venue.lat, lng: venue.lng, address: pickText(venue.address, "en") || name };
            return (
              <article key={venue.id}>
                {venue.imageUrl ? (
                  <div className="relative aspect-[4/3] overflow-hidden bg-rule">
                    <WeddingImage
                      src={venue.imageUrl}
                      alt={name}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <h3 className="mt-6 font-display text-[clamp(1.75rem,3.5vw,2.25rem)] leading-tight">{name}</h3>
                {address ? <p className="mt-1 text-ink-soft">{address}</p> : null}
                <VenueMap
                  name={name}
                  href={mapsLink(place)}
                  embedSrc={mapsEmbedUrl(place)}
                  labels={{
                    open: t("openMaps"),
                    show: t("showMap"),
                    hide: t("hideMap"),
                    title: t("mapTitle", { name }),
                  }}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
