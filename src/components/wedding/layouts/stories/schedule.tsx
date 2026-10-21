import { MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { getOrnament } from "@/lib/appearance";
import { EventDescription } from "../../event-description";
import { hasEventIcon } from "@/lib/event-kinds";
import { toGeez } from "@/lib/geez";
import { type Locale, isEthiopic } from "@/lib/localized";
import { timelineItems, type TimelineItem } from "@/lib/timeline";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import { EventIcon, EventIconSprite } from "../../ornaments/event-icons";
import { StoryCard, pill } from "./card";
import { scheduleCards } from "./plan";

type Props = { site: SiteData; locale: Locale };

const order = (index: number) => ({ "--i": index }) as CSSProperties;

/* A faint wash of the second thread from the top corner. Inline, so a browser without color-mix keeps the plain paper. */
const WASH: CSSProperties = {
  backgroundImage: "radial-gradient(80% 40% at 100% 0%, color-mix(in oklab, var(--w-thread-2) 16%, transparent), transparent 75%)",
};

/** The event's number for its badge when its kind has no icon: 1, 2, 3, or ፩, ፪, ፫ in Amharic. */
const numeral = (n: number, locale: Locale) => (isEthiopic(locale) ? toGeez(n) : String(n));

/**
 * The day as stories. A short day (up to three events) gets a card per event,
 * each with its icon large in a story ring; a longer one is grouped up to
 * three to a card, down a dotted thread. Every card shows where it sits
 * ("1 of 2"), and the last one closes the day.
 */
export async function StoriesSchedule({ site, locale }: Props) {
  if (site.events.length === 0) return null;
  const [t, tg] = await Promise.all([getTranslations("schedule"), getTranslations("gallery")]);
  const { items, end } = timelineItems(site, locale);
  const sizes = scheduleCards(items.length);
  const solo = sizes.every((size) => size === 1);
  const date = formatWeddingDate(site.couple.weddingAt, site.couple.timezone, locale);
  const closing = end ? t("endAt", { time: end.time }) : t("end");

  let start = 0;
  const cards = sizes.map((size) => {
    const first = start;
    start += size;
    return { first, events: items.slice(first, first + size) };
  });

  return cards.map(({ first, events }, index) => {
    const opening = index === 0;
    const last = index === cards.length - 1;
    return (
      <StoryCard
        key={events[0].id}
        as={opening ? "section" : "div"}
        id={opening ? "schedule" : undefined}
        hash="schedule"
        tone="light"
        labelledBy={opening ? "schedule-heading" : undefined}
        className="bg-paper text-ink"
      >
        <span aria-hidden className="absolute inset-0 -z-10" style={WASH} />
        {opening ? <EventIconSprite kinds={items.map((item) => item.kind)} ornament={getOrnament(site.couple.ornament)} /> : null}

        <div data-reveal-group className={cn("flex flex-1 flex-col px-6 pt-14 pb-10", solo && "items-center text-center")}>
          <div className={cn("flex items-start justify-between gap-4", solo && "flex-col items-center")}>
            <div>
              {opening ? (
                <h2 id="schedule-heading" data-reveal="up" className="font-display text-[clamp(2.1rem,11cqi,2.9rem)] leading-[1.05]">
                  {t("heading")}
                </h2>
              ) : (
                <p data-reveal="up" className="font-display text-[clamp(1.6rem,8cqi,2.1rem)] leading-[1.05]">
                  {t("heading")}
                </p>
              )}
              <p data-reveal="up" style={order(1)} className="mt-1.5 text-base text-ink-soft">
                {date}
              </p>
            </div>
            {cards.length > 1 ? (
              <p
                data-reveal="fade"
                style={order(1)}
                className={cn(pill, "shrink-0 border border-rule bg-sheet px-3 py-1 text-xs text-ink-soft tabular-nums", solo && "order-first mb-4")}
              >
                {tg("counter", { current: index + 1, total: cards.length })}
              </p>
            ) : null}
          </div>

          {solo ? (
            <SoloEvent item={events[0]} number={numeral(first + 1, locale)} collapsible={site.couple.collapsibleEvents} />
          ) : (
            <ol start={first + 1} className="mt-9">
              {events.map((item, row) => (
                <EventRow
                  key={item.id}
                  item={item}
                  number={numeral(first + row + 1, locale)}
                  index={row}
                  thread={row < events.length - 1 || !last}
                  collapsible={site.couple.collapsibleEvents}
                />
              ))}
            </ol>
          )}

          {last ? (
            <p data-reveal="up" style={order(6)} className={cn("mt-8 inline-flex items-center gap-3 text-base text-ink-soft", solo && "mt-10")}>
              <span aria-hidden className="size-[9px] rotate-45 bg-thread-2" />
              {closing}
            </p>
          ) : null}
        </div>
      </StoryCard>
    );
  });
}

/** The event's badge: its icon in the metal, or its number when its kind has none. */
function Badge({ item, number, className, iconClassName, numberClassName }: { item: TimelineItem; number: string; className: string; iconClassName: string; numberClassName: string }) {
  return (
    <span aria-hidden className={cn("relative flex shrink-0 items-center justify-center rounded-full border border-metal/70 bg-sheet", className)}>
      {hasEventIcon(item.kind) ? (
        <EventIcon kind={item.kind} className={cn("text-metal", iconClassName)} />
      ) : (
        <span className={cn("font-display leading-none text-ink", numberClassName)}>{number}</span>
      )}
    </span>
  );
}

/** The start (and end) as text, with the machine-readable start for a ranged event. */
function When({ item }: { item: TimelineItem }) {
  return item.endsAt ? (
    <>
      <time dateTime={item.startsAt} className="sr-only">
        {item.startTime}
      </time>
      <span aria-hidden>{item.time}</span>
    </>
  ) : (
    <time dateTime={item.startsAt}>{item.time}</time>
  );
}

/** The venue as a location sticker, a maps link when there is one. */
function Venue({ item, className }: { item: TimelineItem; className?: string }) {
  if (!item.venue) return null;
  const body = (
    <>
      <MapPin aria-hidden className="size-4 shrink-0 text-thread-1" />
      {item.venue.name}
    </>
  );
  const look = cn(pill, "border border-rule bg-sheet px-3 py-1.5 font-medium text-ink", className);
  return item.venue.href ? (
    <a
      href={item.venue.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(look, "min-h-9 underline decoration-thread-2 decoration-1 underline-offset-4 hover:decoration-ink")}
    >
      {body}
    </a>
  ) : (
    <p className={look}>{body}</p>
  );
}

/** One event on a grouped card: its badge on the thread, then the time, title, venue and note. */
function EventRow({
  item,
  number,
  index,
  thread,
  collapsible,
}: {
  item: TimelineItem;
  number: string;
  index: number;
  thread: boolean;
  collapsible: boolean;
}) {
  return (
    <li data-reveal="up" style={order(index + 2)} className="relative flex gap-4 pb-8 last:pb-0">
      {thread ? <span aria-hidden className="absolute top-12 bottom-1 start-[1.375rem] border-s border-dashed border-metal/60" /> : null}
      <Badge item={item} number={number} className="size-11" iconClassName="size-5" numberClassName="text-lg" />
      <div className="min-w-0 pt-0.5">
        <p className="font-sans text-sm text-ink-soft tabular-nums">
          <When item={item} />
        </p>
        <h3 className="mt-0.5 font-display text-[clamp(1.3rem,6.4cqi,1.65rem)] leading-snug">{item.title}</h3>
        <EventDescription text={item.description} collapsible={collapsible} className="mt-1 text-base text-ink-soft" />
        {item.venue ? <Venue item={item} className="mt-2.5 justify-start text-start" /> : null}
      </div>
    </li>
  );
}

/** One event on a card of its own: the badge large in the middle, the time as a sticker, the title big. */
function SoloEvent({ item, number, collapsible }: { item: TimelineItem; number: string; collapsible: boolean }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-8">
      <span data-reveal="pop" style={order(2)} className="block">
        <Badge item={item} number={number} className="size-24 border-2" iconClassName="size-11" numberClassName="text-4xl" />
      </span>
      <p data-reveal="pop" style={order(3)} className={cn(pill, "mt-7 bg-thread-1 px-4 py-2 text-[0.95rem] text-on-thread-1 tabular-nums")}>
        <When item={item} />
      </p>
      <h3
        data-reveal="up"
        style={order(4)}
        className="mt-5 font-display text-[clamp(1.9rem,10cqi,2.6rem)] leading-[1.1] ethiopic:text-[clamp(1.6rem,8.4cqi,2.2rem)] ethiopic:leading-[1.3]"
      >
        {item.title}
      </h3>
      <EventDescription
        text={item.description}
        collapsible={collapsible}
        data-reveal="up"
        style={order(5)}
        className="mx-auto mt-3 max-w-[34ch] text-ink-soft"
      />
      {item.venue ? (
        <div data-reveal="pop" style={order(5)} className="mt-5">
          <Venue item={item} />
        </div>
      ) : null}
    </div>
  );
}
