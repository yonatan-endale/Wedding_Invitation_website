import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import type { Locale } from "@/lib/localized";
import { EventDescription } from "../../event-description";
import { timelineItems } from "@/lib/timeline";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import { niche } from "./numerals";
import { ArchTitle, Diamond } from "./ornaments";

type Props = { site: SiteData; locale: Locale };

/**
 * The day as an arcade: each event in its own arch-topped niche, numbered in
 * the head of the arch (Roman numerals, Ge'ez in Amharic), with the time,
 * title, venue and description beneath. Phones get a list, each event beside
 * a small numbered niche on a fine metal line; wider screens line the niches
 * up like a cloister. The end of the day closes the arcade on a gold rule.
 */
export async function ArchesSchedule({ site, locale }: Props) {
  if (site.events.length === 0) return null;
  const t = await getTranslations("schedule");
  const { couple } = site;
  const { items, end } = timelineItems(site, locale);
  const count = items.length;
  // The list and the ground line under it share one width.
  const width =
    count === 1 ? "max-w-sm" : count === 2 ? "max-w-3xl" : count === 4 ? "max-w-6xl lg:max-w-4xl" : "max-w-6xl";

  return (
    <section id="schedule" aria-labelledby="schedule-heading" className="px-5 py-20 sm:px-8 sm:py-28">
      <ArchTitle id="schedule-heading">{t("heading")}</ArchTitle>
      <p data-reveal="up" style={{ "--i": 2 } as CSSProperties} className="mt-3 text-center text-ink-soft">
        {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
      </p>

      <ol
        className={cn(
          "mx-auto mt-14 grid md:gap-x-6 md:gap-y-10 lg:gap-x-8",
          width,
          count === 2 && "md:grid-cols-2",
          count >= 3 && "md:grid-cols-2 lg:grid-cols-3",
          // Four niches read better as a pair of pairs than as three and one.
          count === 4 && "lg:grid-cols-2",
        )}
      >
        {items.map((item, index) => {
          const last = index === count - 1;
          return (
            <li
              key={item.id}
              data-reveal="up"
              style={{ "--i": index % 3 } as CSSProperties}
              className={cn(
                "relative grid grid-cols-[3.75rem_minmax(0,1fr)] gap-x-5",
                "md:flex md:flex-col md:items-center md:rounded-t-[999rem] md:border md:border-metal/60 md:bg-sheet md:px-7 md:pt-[15%] md:pb-10 md:text-center",
              )}
            >
              {/* The inner keyline of the niche, concentric with its border. */}
              <span aria-hidden className="pointer-events-none absolute inset-[6px] hidden rounded-t-[999rem] border border-metal/30 md:block" />

              <div aria-hidden className="flex flex-col items-center md:block">
                <span
                  className={cn(
                    "flex h-[4.75rem] w-full items-end justify-center rounded-t-full border border-metal/60 bg-sheet pb-2.5 font-cormorant text-[1.45rem] leading-none font-medium",
                    "md:h-auto md:w-auto md:border-0 md:bg-transparent md:p-0 md:text-[clamp(2.25rem,3.4vw,2.9rem)] md:font-light",
                  )}
                >
                  {niche(index + 1, locale)}
                </span>
                {last ? null : <span className="mt-2 w-px flex-1 bg-metal/45 md:hidden" />}
              </div>

              <div className={cn("min-w-0 pt-1 md:flex md:flex-col md:items-center md:pt-0", last ? "pb-2" : "pb-10 md:pb-0")}>
                <span aria-hidden className="mt-4 mb-5 hidden w-12 items-center gap-1.5 md:flex">
                  <span className="h-px flex-1 bg-metal/70" />
                  <Diamond className="size-[5px]" />
                  <span className="h-px flex-1 bg-metal/70" />
                </span>
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
                <h3 className="mt-1.5 font-cormorant text-[clamp(1.5rem,3.2vw,1.95rem)] leading-[1.15] font-medium ethiopic:text-[clamp(1.3rem,2.8vw,1.6rem)] ethiopic:leading-snug">
                  {item.title}
                </h3>
                {item.venue ? (
                  <p className="mt-2 text-base">
                    {item.venue.href ? (
                      <a
                        href={item.venue.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-metal decoration-1 underline-offset-4 hover:decoration-ink"
                      >
                        {item.venue.name}
                      </a>
                    ) : (
                      item.venue.name
                    )}
                  </p>
                ) : null}
                <EventDescription
                  text={item.description}
                  collapsible={site.couple.collapsibleEvents}
                  className="mt-3 max-w-[40ch] text-base text-ink-soft"
                />
              </div>
            </li>
          );
        })}
      </ol>

      {/* The ground line the arcade stands on, and the close of the day. */}
      <div data-reveal-group className={cn("mx-auto mt-12 md:mt-14", width)}>
        <div data-reveal="rule" aria-hidden className="flex items-center gap-3">
          <span className="h-px flex-1 bg-metal/60" />
          <Diamond />
          <span className="h-px flex-1 bg-metal/60" />
        </div>
        <p data-reveal="up" style={{ "--i": 2 } as CSSProperties} className="mt-4 text-center text-base text-ink-soft">
          {end ? t("endAt", { time: end.time }) : t("end")}
        </p>
      </div>
    </section>
  );
}
