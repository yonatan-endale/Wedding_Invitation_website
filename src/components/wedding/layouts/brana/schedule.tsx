import { getTranslations } from "next-intl/server";
import type { CSSProperties, ReactNode } from "react";
import type { SiteData } from "@/db/queries/site";
import { getOrnament } from "@/lib/appearance";
import { hasEventIcon } from "@/lib/event-kinds";
import type { Locale } from "@/lib/localized";
import { timelineItems, type TimelineItem } from "@/lib/timeline";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import { EventIcon, EventIconSprite } from "../../ornaments/event-icons";
import styles from "./brana.module.css";
import { BranaHeading, GeezNumeral, Headpiece, SectionMark, order } from "./ornaments";

type Props = { site: SiteData; locale: Locale };

/** Column widths in percent: number, time, event and, when any event has one, place. */
const WITH_PLACE = [9, 25, 38, 28];
const WITHOUT_PLACE = [11, 32, 57];

/** The time as guests read it, with the start alone for machines; a day other than the wedding's comes first. */
function When({ item, day }: { item: TimelineItem; day: string | null }) {
  return (
    <>
      {day ? <span className="block text-ink">{day}</span> : null}
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
    </>
  );
}

function Place({ venue }: { venue: TimelineItem["venue"] }) {
  if (!venue) return null;
  return venue.href ? (
    <a
      href={venue.href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-(--brana-rubric) decoration-1 underline-offset-4 hover:decoration-ink"
    >
      {venue.name}
    </a>
  ) : (
    <>{venue.name}</>
  );
}

function Title({ item, children }: { item: TimelineItem; children: ReactNode }) {
  return (
    <span className="flex items-start gap-2.5">
      {hasEventIcon(item.kind) ? <EventIcon kind={item.kind} className="mt-[0.3em] size-[1.05em] shrink-0 text-(--brana-rubric)" /> : null}
      <span className="min-w-0">{children}</span>
    </span>
  );
}

/**
 * The day as a canon table, after the Eusebian canon tables that open
 * Ethiopian gospel books: the events in a ruled table under a great red arch
 * and a small arch for each column, gold pillars with capitals between the
 * columns and a harag plinth beneath. Each event is numbered in Ge'ez, with
 * its time, its title (and its kind's icon) and its place; the place column
 * only appears when an event has one. Phones get a list, each event under a
 * small arch of its own. The end of the day closes the table.
 */
export async function BranaCanon({ site, locale }: Props) {
  if (site.events.length === 0) return null;
  const t = await getTranslations("schedule");
  const tb = await getTranslations("layouts.brana");
  const { couple } = site;
  const { items, end } = timelineItems(site, locale);
  const weddingDay = formatWeddingDate(couple.weddingAt, couple.timezone, locale);
  const withPlace = items.some((item) => item.venue);
  const widths = withPlace ? WITH_PLACE : WITHOUT_PLACE;
  const cols = { "--cols": widths.map((width) => `${width}%`).join(" ") } as CSSProperties;
  const otherDay = (item: TimelineItem) => {
    const day = formatWeddingDate(item.startsAt, couple.timezone, locale);
    return day === weddingDay ? null : day;
  };
  // Where each pillar stands, as a share of the width: the edges and every column boundary.
  const pillars = widths.reduce<number[]>((at, width) => [...at, at[at.length - 1] + width], [0]);

  return (
    <section id="schedule" aria-labelledby="schedule-heading" className="px-4 py-12 sm:px-8 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <Headpiece className="mx-[18px]" />
        <BranaHeading id="schedule-heading" className="mt-12">
          {t("heading")}
        </BranaHeading>
        <p data-reveal="up" style={order(2)} className="mt-4 text-center text-ink-soft">
          {weddingDay}
        </p>
      </div>
      <EventIconSprite kinds={items.map((item) => item.kind)} ornament={getOrnament(couple.ornament)} />

      {/* Wide screens: the table under its arcade. */}
      <div className="mx-auto mt-14 hidden max-w-5xl md:block">
        <div aria-hidden data-reveal-group className={styles.arcade} style={cols}>
          <span data-reveal="fade" className={styles.greatArch}>
            <span className={styles.keystone} />
          </span>
          {widths.map((width, index) => (
            <span key={index} data-reveal="up" style={order(1 + index)} className={styles.smallArch} />
          ))}
          {pillars.map((at) => (
            <span key={at} className={styles.capital} style={{ left: `${at}%` }} />
          ))}
        </div>
        <table className={styles.canon}>
          <caption className="sr-only">{t("heading")}</caption>
          <colgroup>
            {widths.map((width, index) => (
              <col key={index} style={{ width: `${width}%` }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th scope="col">
                <span className="sr-only">{tb("number")}</span>
                <span aria-hidden>№</span>
              </th>
              <th scope="col">{tb("time")}</th>
              <th scope="col">{tb("event")}</th>
              {withPlace ? <th scope="col">{tb("place")}</th> : null}
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} data-reveal="up" style={order(Math.min(index, 6))}>
                <td className="text-[1.45rem] leading-tight text-(--brana-rubric)">
                  <GeezNumeral value={index + 1} />
                </td>
                <td className="pt-[1.2rem] text-base text-ink-soft tabular-nums">
                  <When item={item} day={otherDay(item)} />
                </td>
                <td>
                  <Title item={item}>
                    <span className="block font-cormorant text-[1.45rem] leading-snug font-medium [&:lang(am)]:text-[1.25rem]">{item.title}</span>
                    {item.description ? <span className="mt-1 block text-base text-ink-soft">{item.description}</span> : null}
                  </Title>
                </td>
                {withPlace ? (
                  <td className="pt-[1.2rem] text-base">
                    <Place venue={item.venue} />
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
        <Headpiece className="mx-[18px] mt-0" />
      </div>

      {/* Phones: each event under a small arch, numbered in its head. */}
      <ol className="mx-auto mt-12 max-w-md md:hidden">
        {items.map((item, index) => (
          <li
            key={item.id}
            data-reveal="up"
            className={cn("grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-4 pb-6", index > 0 && "border-t border-(--brana-rule) pt-6")}
          >
            <span className={cn(styles.niche, "text-[1.3rem] leading-none text-(--brana-rubric)")}>
              <GeezNumeral value={index + 1} />
            </span>
            <div className="min-w-0 pt-1">
              <p className="text-base text-ink-soft tabular-nums">
                <When item={item} day={otherDay(item)} />
              </p>
              <h3 className="mt-1 font-cormorant text-[1.45rem] leading-snug font-medium [&:lang(am)]:text-[1.25rem]">
                <Title item={item}>{item.title}</Title>
              </h3>
              {item.venue ? (
                <p className="mt-1 text-base">
                  <Place venue={item.venue} />
                </p>
              ) : null}
              {item.description ? <p className="mt-1 text-base text-ink-soft">{item.description}</p> : null}
            </div>
          </li>
        ))}
      </ol>

      <div data-reveal-group className="mx-auto mt-10 max-w-md text-center md:mt-8">
        <SectionMark />
        <p data-reveal="up" style={order(1)} className={cn(styles.rubric, "mt-2 font-cormorant text-[1.3rem] font-medium [&:lang(am)]:text-[1.15rem]")}>
          {end ? t("endAt", { time: end.time }) : t("end")}
        </p>
      </div>
    </section>
  );
}
