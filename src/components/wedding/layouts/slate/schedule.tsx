import { Clock, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { getOrnament } from "@/lib/appearance";
import { hasEventIcon } from "@/lib/event-kinds";
import { toGeez } from "@/lib/geez";
import type { Locale } from "@/lib/localized";
import { timelineItems, type TimelineItem } from "@/lib/timeline";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import { EventDescription } from "../../event-description";
import { EventIcon, EventIconSprite } from "../../ornaments/event-icons";
import { SlateHeading, order, slateEyebrow } from "./kit";
import styles from "./slate.module.css";

type Props = { site: SiteData; locale: Locale };

/** The marker column: the icon circle over its length of rail, which runs on to the next event. */
const markerCell = "relative flex flex-col items-center";

/** The time as guests read it (the Ethiopian clock in Amharic), with the start alone for machines. */
function When({ item, day }: { item: TimelineItem; day: string | null }) {
  return (
    // The clock keeps its own column, so a long time wraps beside it instead of dropping below it.
    <p className={cn(slateEyebrow, "flex items-start gap-2 text-(--slate-accent) tabular-nums")}>
      <Clock aria-hidden className="mt-[0.1em] size-3.5 shrink-0" />
      <span className="min-w-0">
        {day ? <span className="text-ink">{day} · </span> : null}
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
      </span>
    </p>
  );
}

/**
 * The day down a rail: each event hangs from a white circle holding its
 * kind's icon in the accent (or its number, in Ge'ez numerals in Amharic,
 * when the kind has no icon), and sits on its own white card with the time
 * in small capitals, the title, the place as a maps link and the details,
 * folded behind "Show details" when the couple chose that. Each length of
 * rail fills with the accent as its event scrolls into view. The day closes
 * on a small diamond.
 */
export async function SlateSchedule({ site, locale }: Props) {
  if (site.events.length === 0) return null;
  const t = await getTranslations("schedule");
  const ts = await getTranslations("layouts.slate");
  const { couple } = site;
  const { items, end } = timelineItems(site, locale);
  const weddingDay = formatWeddingDate(couple.weddingAt, couple.timezone, locale);

  return (
    <section id="schedule" aria-labelledby="schedule-heading" className="px-3 py-16 sm:px-8 sm:py-24">
      <SlateHeading id="schedule-heading" kicker={ts("kicker.schedule")} locale={locale} sub={weddingDay}>
        {t("heading")}
      </SlateHeading>
      <EventIconSprite kinds={items.map((item) => item.kind)} ornament={getOrnament(couple.ornament)} />

      <ol className="mx-auto mt-12 max-w-3xl sm:mt-16">
        {items.map((item, index) => {
          const day = formatWeddingDate(item.startsAt, couple.timezone, locale);
          return (
            <li key={item.id} data-reveal-group className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:gap-x-5">
              <div aria-hidden className={markerCell}>
                <span
                  data-reveal="pop"
                  className="relative z-10 flex size-11 items-center justify-center rounded-full bg-sheet text-(--slate-accent) shadow-[0_0_0_1px_color-mix(in_oklab,var(--slate-accent)_45%,transparent),0_8px_18px_-10px_color-mix(in_oklab,var(--slate-band)_55%,transparent)] sm:size-[3.25rem]"
                >
                  {hasEventIcon(item.kind) ? (
                    <EventIcon kind={item.kind} className="size-5 sm:size-[1.4rem]" />
                  ) : (
                    <span className="font-display text-lg leading-none lining-nums">{locale === "am" ? toGeez(index + 1) : index + 1}</span>
                  )}
                </span>
                {/* The rail: a faint track, and the accent filling it as the event comes into view. */}
                <span className="relative -mt-1 w-px flex-1 bg-rule">
                  <span className={cn(styles.railFill, "absolute inset-0 bg-(--slate-accent)/70")} />
                </span>
              </div>

              <div className="pb-6 sm:pb-8">
                <article data-reveal="up" style={order(1)} className={cn(styles.card, "rounded-[1.25rem] px-5 py-5 sm:px-7 sm:py-6")}>
                  <When item={item} day={day === weddingDay ? null : day} />
                  <h3 className="mt-2 text-[clamp(1.35rem,3.4vw,1.7rem)] leading-snug text-ink [&:lang(am)]:text-[clamp(1.25rem,3.2vw,1.5rem)]">
                    {item.title}
                  </h3>
                  {item.venue ? (
                    <p className="mt-2 flex items-start gap-1.5 text-base text-ink-soft">
                      <MapPin aria-hidden className="mt-[0.3em] size-4 shrink-0 text-(--slate-accent)" />
                      {item.venue.href ? (
                        <a
                          href={item.venue.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-ink underline decoration-(--slate-accent)/60 decoration-1 underline-offset-4 hover:decoration-(--slate-accent)"
                        >
                          {item.venue.name}
                        </a>
                      ) : (
                        <span>{item.venue.name}</span>
                      )}
                    </p>
                  ) : null}
                  <EventDescription
                    text={item.description}
                    collapsible={couple.collapsibleEvents}
                    className="mt-3 max-w-[56ch] text-base text-ink-soft [&_summary]:text-(--slate-accent) [&_summary]:font-sans [&_summary]:font-semibold"
                  />
                </article>
              </div>
            </li>
          );
        })}

        <li data-reveal-group className="grid grid-cols-[2.75rem_minmax(0,1fr)] items-center gap-x-3 sm:grid-cols-[3.25rem_minmax(0,1fr)] sm:gap-x-5">
          <div aria-hidden className="flex justify-center">
            <span data-reveal="pop" className="size-3 rotate-45 bg-(--slate-accent)" />
          </div>
          <p data-reveal="up" style={order(1)} className="text-base text-ink-soft italic [&:lang(am)]:not-italic">
            {end ? t("endAt", { time: end.time }) : t("end")}
          </p>
        </li>
      </ol>
    </section>
  );
}
