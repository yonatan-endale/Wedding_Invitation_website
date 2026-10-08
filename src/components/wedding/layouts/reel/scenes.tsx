import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { mapsEmbedUrl, mapsLink } from "@/lib/maps";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import { SectionHeading, WeddingImage, sectionPadding } from "../../primitives";
import { ScheduleTimeline } from "../../schedule";
import { VenueMap } from "../../venue-map";
import { creditCaps } from "./shared";

type Props = { site: SiteData; locale: Locale };

/** Two-digit reel numbers, "01", in the timecode's monospace. */
const reelNumber = (index: number) => String(index + 1).padStart(2, "0");

/** The day's events as "The scenes": the shared timeline beside a heading that stays pinned on wide screens. */
export async function ReelScenes({ site, locale }: Props) {
  if (site.events.length === 0) return null;
  const tr = await getTranslations("layouts.reel");
  const { couple } = site;

  return (
    <section id="schedule" aria-labelledby="schedule-heading" className={cn(sectionPadding, "border-t border-rule")}>
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-16">
        {/* Pinned on wide screens, so it carries no reveal transform. */}
        <div className="self-start md:sticky md:top-28">
          <p className={cn(creditCaps, "text-metal")}>{formatWeddingDate(couple.weddingAt, couple.timezone, locale)}</p>
          <SectionHeading id="schedule-heading" reveal={false} className="mt-4">
            {tr("scenes")}
          </SectionHeading>
          <span aria-hidden className="mt-8 block h-px w-16 bg-metal/60" />
        </div>
        <ScheduleTimeline site={site} locale={locale} />
      </div>
    </section>
  );
}

/**
 * The venues as "Locations": numbered like a shooting schedule, each with its
 * photo letterboxed to 21:9 when there is one, the address and the map.
 */
export async function ReelLocations({ site, locale }: Props) {
  if (site.venues.length === 0) return null;
  const [t, tr] = await Promise.all([getTranslations("venues"), getTranslations("layouts.reel")]);
  const many = site.venues.length > 1;

  return (
    <section id="venues" aria-labelledby="venues-heading" className={cn(sectionPadding, "border-y border-rule bg-sheet")}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="venues-heading">{tr("locations")}</SectionHeading>
        <ol data-reveal-group className={cn("mt-14 grid gap-16", many && "md:grid-cols-2 md:gap-x-12 md:gap-y-16")}>
          {site.venues.map((venue, index) => {
            const name = pickText(venue.name, locale);
            const address = pickText(venue.address, locale);
            const place = { mapsUrl: venue.mapsUrl, lat: venue.lat, lng: venue.lng, address: pickText(venue.address, "en") || name };
            return (
              <li
                key={venue.id}
                data-reveal="up"
                style={{ "--i": Math.min(index, 5) } as CSSProperties}
                className="min-w-0 border-t border-rule pt-6"
              >
                {venue.imageUrl ? (
                  <div className="relative mb-7 aspect-[21/9] overflow-hidden bg-black">
                    <WeddingImage
                      src={venue.imageUrl}
                      alt={name}
                      fill
                      sizes={many ? "(min-width: 768px) 50vw, 100vw" : "100vw"}
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <p aria-hidden className="font-mono text-sm tracking-[0.2em] text-metal tabular-nums">
                  {reelNumber(index)}
                  <span className="mx-3 inline-block h-px w-8 bg-metal/50 align-middle" />
                </p>
                <h3 className="mt-3 font-display text-[clamp(1.75rem,3.5vw,2.25rem)] leading-tight">{name}</h3>
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
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
