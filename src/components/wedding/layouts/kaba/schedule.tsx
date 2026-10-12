import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { getOrnament } from "@/lib/appearance";
import { EventDescription } from "../../event-description";
import { hasEventIcon } from "@/lib/event-kinds";
import { toGeez } from "@/lib/geez";
import type { Locale } from "@/lib/localized";
import { timelineItems, type TimelineItem } from "@/lib/timeline";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import { FoilText } from "../../kit/foil-text";
import { EventIcon, EventIconSprite } from "../../ornaments/event-icons";
import styles from "./kaba.module.css";
import { KabaHeading, Lozenge, Medallion, kabaEyebrow } from "./ornaments";

type Props = { site: SiteData; locale: Locale };

const order = (index: number) => ({ "--i": index }) as CSSProperties;

/** The light falls from the top right of this panel, the shade pools bottom left. */
const LIGHT = { "--sheen-x": "88%", "--sheen-y": "-4%", "--shade-x": "8%", "--shade-y": "70%", "--fold": "64deg" } as CSSProperties;

/*
 * One row per event. Phones: the marker and its length of rail on the left,
 * the time above the title on the right. Wide screens: the rail down the
 * middle, the time to its left and the event to its right. The marker
 * column spans both rows and stretches to the bottom of the event, so the
 * rail beneath the marker runs on to the next one.
 */
const row = "grid grid-cols-[3.25rem_minmax(0,1fr)] gap-x-4 md:grid-cols-[minmax(0,1fr)_5rem_minmax(0,1.35fr)] md:gap-x-8";
const markerCell = "col-start-1 row-span-2 row-start-1 flex flex-col items-center md:col-start-2";
const timeCell = "col-start-2 row-start-1 md:col-start-1 md:row-span-2 md:pt-3 md:text-right";
const bodyCell = "col-start-2 row-start-2 pb-14 md:col-start-3 md:row-span-2 md:row-start-1 md:pb-16";

/** The time as guests read it, with the start alone for machines; a day other than the wedding's comes first. */
function When({ item, day }: { item: TimelineItem; day: string | null }) {
  const time = item.endsAt ? (
    <>
      <time dateTime={item.startsAt} className="sr-only">
        {item.startTime}
      </time>
      <span aria-hidden>{item.time}</span>
    </>
  ) : (
    <time dateTime={item.startsAt}>{item.time}</time>
  );
  return (
    <p className="text-base text-ink-soft tabular-nums">
      {day ? <span className="block text-ink">{day}</span> : null}
      {time}
    </p>
  );
}

/**
 * The day as a line of gold running stitch down the velvet. Each event
 * hangs on it from a small embroidered roundel holding its kind's icon, or
 * its number (in Ge'ez numerals in Amharic) when it has none; each length of
 * thread sews itself downward as its event comes into view. The Mels, the
 * couple's return to the bride's family, is the one the eye should find: a
 * full medallion that stitches itself in, and the event on an embroidered
 * patch with its title in gold. The end of the day closes on a lozenge.
 */
export async function KabaSchedule({ site, locale }: Props) {
  if (site.events.length === 0) return null;
  const t = await getTranslations("schedule");
  const tk = await getTranslations("layouts.kaba");
  const { couple } = site;
  const { items, end } = timelineItems(site, locale);
  const weddingDay = formatWeddingDate(couple.weddingAt, couple.timezone, locale);

  return (
    <section
      id="schedule"
      aria-labelledby="schedule-heading"
      className={cn(styles.velvet, styles.seams, "px-5 py-24 sm:px-8 sm:py-32")}
      style={LIGHT}
    >
      <KabaHeading id="schedule-heading" kicker={weddingDay}>
        {t("heading")}
      </KabaHeading>
      <EventIconSprite kinds={items.map((item) => item.kind)} ornament={getOrnament(couple.ornament)} />

      <ol className="mx-auto mt-16 max-w-4xl sm:mt-20">
        {items.map((item, index) => {
          const mels = item.kind === "mels";
          const day = formatWeddingDate(item.startsAt, couple.timezone, locale);
          const when = <When item={item} day={day === weddingDay ? null : day} />;
          const venue = item.venue ? (
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
          ) : null;
          const description = (
            <EventDescription
              text={item.description}
              collapsible={site.couple.collapsibleEvents}
              className="mt-2 max-w-[48ch] text-base text-ink-soft"
            />
          );

          return (
            <li key={item.id} data-reveal-group className={cn(styles.step, row)}>
              <div aria-hidden className={markerCell}>
                {mels ? (
                  <Medallion
                    id={`kaba-mels-${item.id}`}
                    className="w-[3.75rem] md:w-[4.75rem]"
                    windowClassName="flex items-center justify-center bg-sheet text-metal"
                  >
                    <EventIcon kind={item.kind} className="size-[1.35rem] md:size-[1.6rem]" />
                  </Medallion>
                ) : (
                  // A roundel: a gold cord ring with a running stitch inside it, on lifted velvet.
                  <span
                    data-reveal="pop"
                    className="relative mt-0.5 flex size-12 shrink-0 items-center justify-center rounded-full border-[1.5px] border-metal bg-sheet text-metal shadow-[0_6px_18px_-8px_rgb(0_0_0/0.8)] md:size-[3.25rem]"
                  >
                    <span className="absolute inset-[3.5px] rounded-full border border-dashed border-metal/85" />
                    {hasEventIcon(item.kind) ? (
                      <EventIcon kind={item.kind} className="relative size-5" />
                    ) : (
                      <span className="relative font-cormorant text-[1.35rem] leading-none font-medium lining-nums [&:lang(am)]:text-[1.3rem]">
                        {locale === "am" ? toGeez(index + 1) : index + 1}
                      </span>
                    )}
                  </span>
                )}
                <span className={cn(styles.rail, "mt-3 min-h-8 flex-1")} />
              </div>

              <div data-reveal="up" style={order(1)} className={cn(timeCell, mels && "md:pt-6")}>
                {when}
              </div>

              <div data-reveal="up" style={order(2)} className={bodyCell}>
                {mels ? (
                  <div className={cn(styles.patch, "mt-2 px-6 py-6 md:mt-0 md:px-8 md:py-7")}>
                    <p className={kabaEyebrow}>{tk("mels")}</p>
                    <h3 className="mt-2 text-[clamp(1.75rem,4vw,2.4rem)] leading-tight [&:lang(am)]:text-[clamp(1.5rem,3.4vw,1.9rem)] [&:lang(am)]:leading-snug">
                      <FoilText>{item.title}</FoilText>
                    </h3>
                    {venue}
                    {description}
                  </div>
                ) : (
                  <>
                    <h3 className="mt-1 text-[clamp(1.4rem,3.2vw,1.8rem)] leading-tight [&:lang(am)]:text-[clamp(1.35rem,3vw,1.65rem)] [&:lang(am)]:leading-snug md:mt-2.5">
                      {item.title}
                    </h3>
                    {venue}
                    {description}
                  </>
                )}
              </div>
            </li>
          );
        })}

        <li data-reveal-group className={row}>
          <div aria-hidden className="col-start-1 flex justify-center pt-2 md:col-start-2">
            <Lozenge reveal className="size-[13px]" />
          </div>
          <p data-reveal="up" style={order(1)} className="col-start-2 text-base text-ink-soft md:col-start-3">
            {end ? t("endAt", { time: end.time }) : t("end")}
          </p>
        </li>
      </ol>
    </section>
  );
}
