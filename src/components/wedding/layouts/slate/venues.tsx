import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { mapsEmbedUrl, mapsLink } from "@/lib/maps";
import { cn } from "@/lib/utils";
import { WeddingImage } from "../../primitives";
import { VenueMap } from "../../venue-map";
import { SlateHeading, order } from "./kit";
import styles from "./slate.module.css";

type Props = { site: SiteData; locale: Locale };

/**
 * One white card per venue: its photo if it has one, a pin in an accent
 * circle, the name and address, then the shared map island (a "Directions"
 * button to the maps link and the embedded map, which a guest can fold away).
 */
export async function SlateVenues({ site, locale }: Props) {
  if (site.venues.length === 0) return null;
  const t = await getTranslations("venues");
  const tSchedule = await getTranslations("schedule");
  const ts = await getTranslations("layouts.slate");
  const several = site.venues.length > 1;

  return (
    <section id="venues" aria-labelledby="venues-heading" className="px-3 py-16 sm:px-8 sm:py-24">
      <SlateHeading id="venues-heading" kicker={ts("kicker.venues")} locale={locale}>
        {t("heading")}
      </SlateHeading>
      <div data-reveal-group className={cn("mx-auto mt-12 grid gap-6 sm:mt-16 sm:gap-8", several ? "max-w-6xl md:grid-cols-2" : "max-w-2xl")}>
        {site.venues.map((venue, index) => {
          const name = pickText(venue.name, locale);
          const address = pickText(venue.address, locale);
          const place = { mapsUrl: venue.mapsUrl, lat: venue.lat, lng: venue.lng, address: pickText(venue.address, "en") || name };
          return (
            <article
              key={venue.id}
              data-reveal="up"
              style={order(Math.min(index, 4))}
              className={cn(styles.card, styles.venue, "flex flex-col overflow-hidden")}
            >
              {venue.imageUrl ? (
                <div className="relative aspect-[16/9] bg-rule">
                  <WeddingImage src={venue.imageUrl} alt={name} fill sizes={several ? "(min-width: 768px) 36rem, 100vw" : "(min-width: 672px) 42rem, 100vw"} className="object-cover" />
                </div>
              ) : null}
              <div className="flex flex-1 flex-col px-5 pt-6 pb-6 sm:px-8 sm:pt-8 sm:pb-8">
                <div className="flex items-start gap-4">
                  <span aria-hidden className="flex size-11 shrink-0 items-center justify-center rounded-full bg-(--slate-accent)/10 text-(--slate-accent)">
                    <MapPin className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[clamp(1.4rem,3.4vw,1.75rem)] leading-tight text-ink [&:lang(am)]:text-[clamp(1.3rem,3.2vw,1.55rem)] [&:lang(am)]:leading-snug">
                      {name}
                    </h3>
                    {address ? <p className="mt-1 text-base text-ink-soft">{address}</p> : null}
                  </div>
                </div>
                <VenueMap
                  name={name}
                  href={mapsLink(place)}
                  embedSrc={mapsEmbedUrl(place)}
                  labels={{
                    open: tSchedule("directions"),
                    show: t("showMap"),
                    hide: t("hideMap"),
                    title: t("mapTitle", { name }),
                  }}
                />
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
