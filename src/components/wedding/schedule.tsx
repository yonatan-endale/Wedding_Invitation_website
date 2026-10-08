import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { getMotionLevel, getOrnament } from "@/lib/appearance";
import { pickText, type Locale } from "@/lib/localized";
import { mapsEmbedUrl, mapsLink } from "@/lib/maps";
import { timelineItems } from "@/lib/timeline";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import { TimelineRail } from "./motion/timeline-rail";
import { EventIcon, EventIconSprite } from "./ornaments/event-icons";
import { SectionHeading, WeddingImage, sectionPadding } from "./primitives";
import { VenueMap } from "./venue-map";

type Props = { site: SiteData; locale: Locale };

export async function ScheduleSection({ site, locale }: Props) {
  const { couple, events } = site;
  if (events.length === 0) return null;
  const t = await getTranslations("schedule");

  return (
    <section id="schedule" aria-labelledby="schedule-heading" className={sectionPadding}>
      <div className="mx-auto max-w-3xl">
        <SectionHeading id="schedule-heading">{t("heading")}</SectionHeading>
        <p data-reveal="up" style={{ "--i": 1 } as CSSProperties} className="mt-3 text-ink-soft">
          {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
        </p>
        <ScheduleTimeline site={site} locale={locale} className="mt-14" />
      </div>
    </section>
  );
}

/**
 * The day's events down one rail, each marked with a gold diamond, ending on
 * a larger diamond at the close of the day. Shared by every layout. Each title
 * carries its kind's icon, drawn from one sprite per timeline. The rail draws
 * as the guest scrolls; each event pops its diamond and rises in on its own as
 * it comes into view.
 */
export async function ScheduleTimeline({ site, locale, className }: Props & { className?: string }) {
  if (site.events.length === 0) return null;
  const t = await getTranslations("schedule");
  const { items, end } = timelineItems(site, locale);

  return (
    <TimelineRail level={getMotionLevel(site.couple.motion)} className={cn("ml-1", className)}>
      <EventIconSprite kinds={items.map((item) => item.kind)} ornament={getOrnament(site.couple.ornament)} />
      <ol>
        {items.map((item) => (
          <li key={item.id} data-reveal-group className="relative pb-12 pl-8 sm:pl-12">
            <span
              aria-hidden
              data-reveal="pop"
              className="absolute top-[0.7rem] -left-[4px] size-[9px] rotate-45 bg-thread-2"
            />
            <div data-reveal="up" style={{ "--i": 1 } as CSSProperties}>
              <p className="text-base text-ink-soft tabular-nums">
                {item.endsAt ? (
                  <>
                    <time dateTime={item.startsAt} className="sr-only">
                      {item.startTime}
                    </time>
                    <span aria-hidden>{item.time}</span>
                  </>
                ) : (
                  <time dateTime={item.startsAt}>{item.time}</time>
                )}
              </p>
              <h3 className="relative mt-1 font-display text-[clamp(1.5rem,3.5vw,2rem)]">
                {/* In the gutter beside the rail and as tall as the first line, so the title stays flush with the time. */}
                <span className="absolute top-0 right-full flex h-lh items-center pr-[0.3em] text-metal">
                  <EventIcon kind={item.kind} className="size-[0.75em]" />
                </span>
                {item.title}
              </h3>
              {item.description ? <p className="mt-2 max-w-[52ch]">{item.description}</p> : null}
              {item.venue ? (
                <p className="mt-2 text-base">
                  {item.venue.href ? (
                    <a
                      href={item.venue.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline decoration-thread-2 decoration-2 underline-offset-4 hover:decoration-ink"
                    >
                      {item.venue.name}
                    </a>
                  ) : (
                    item.venue.name
                  )}
                </p>
              ) : null}
            </div>
          </li>
        ))}
        <li data-reveal-group className="relative pl-8 sm:pl-12">
          {/* Pinned to the last line, where the rail ends, in case the label wraps. */}
          <span
            aria-hidden
            data-reveal="pop"
            className="absolute bottom-[0.25rem] -left-[6px] size-[13px] rotate-45 bg-thread-2"
          />
          <p data-reveal="up" style={{ "--i": 1 } as CSSProperties} className="text-base text-ink-soft">
            {end ? t("endAt", { time: end.time }) : t("end")}
          </p>
        </li>
      </ol>
    </TimelineRail>
  );
}

export async function VenuesSection({ site, locale }: Props) {
  if (site.venues.length === 0) return null;
  const t = await getTranslations("venues");

  return (
    <section id="venues" aria-labelledby="venues-heading" className={cn(sectionPadding, "border-y border-rule bg-sheet")}>
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="venues-heading">{t("heading")}</SectionHeading>
        <div data-reveal-group className={cn("mt-12 grid gap-14", site.venues.length > 1 && "md:grid-cols-2 md:gap-10")}>
          {site.venues.map((venue, index) => {
            const name = pickText(venue.name, locale);
            const address = pickText(venue.address, locale);
            const place = { mapsUrl: venue.mapsUrl, lat: venue.lat, lng: venue.lng, address: pickText(venue.address, "en") || name };
            return (
              <article key={venue.id} data-reveal="up" style={{ "--i": Math.min(index, 5) } as CSSProperties}>
                {venue.imageUrl ? (
                  <div data-reveal="wipe" className="relative aspect-[4/3] overflow-hidden bg-rule">
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
