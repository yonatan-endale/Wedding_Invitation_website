import { getTranslations } from "next-intl/server";
import type { CSSProperties, ReactNode } from "react";
import type { SiteData } from "@/db/queries/site";
import { getCalendarStyle } from "@/lib/appearance";
import type { Locale } from "@/lib/localized";
import { buildMonthGrid, calendarViews, markerFor, type CalendarSystem, type MarkerShape } from "@/lib/month-grid";
import { pickSaveTheDatePhoto, type BackdropPhoto } from "@/lib/save-the-date";
import { graphemes } from "@/lib/text";
import { cn } from "@/lib/utils";
import { formatSaveTheDate } from "@/lib/wedding-format";
import type { GalleryPhoto } from "../gallery";
import { ArchFrame } from "../kit/arch-frame";
import { Crest } from "../kit/crest";
import { KeylineFrame } from "../kit/keyline-frame";
import brana from "../layouts/brana/brana.module.css";
import { Headpiece, MiniatureFrame } from "../layouts/brana/ornaments";
import { Medallion, StitchFrame, VelvetGround } from "../layouts/kaba/ornaments";
import type { SiteNames } from "../layouts/types";
import { WeddingImage } from "../primitives";
import { AddToCalendar } from "../add-to-calendar";
import { CalendarViews } from "./calendar-views";
import { MonthTable, type Numerals } from "./month-table";

/**
 * How the save-the-date is dressed in each layout:
 * - cinema: the couple's photo full-bleed under a dark wash (Classic, Reel)
 * - editorial: a split page, photo beside the calendar on the sheet colour
 * - noir: typographic on the page's dark paper, a crest, metal type and a gold-framed grid
 * - arch: light paper, the grid on an arched sheet panel with a gold keyline and a small arched photo
 * - card (Flat-lay Suite): a printed card of its own height, a double rule inset from the edge, letterpressed title
 * - story (Stories): a story card, the photo full-bleed, SAVE THE DATE as a white sticker, the month on frosted glass
 * - velvet (Kaba Velvet): the calendar on velvet in a gold-thread frame under a stitched medallion; it
 *   uses the thread sprite the Kaba layout renders once per page
 * - manuscript (Brana Manuscript): on the parchment under a harag headpiece, the title in red rubric, a
 *   small framed miniature, the month ruled like a computus table; it uses the knot sprite and the
 *   --brana-* colours the Brana layout sets on its root
 */
export type SaveTheDateSkin = "cinema" | "editorial" | "noir" | "arch" | "story" | "card" | "velvet" | "manuscript";

type Props = {
  site: SiteData;
  locale: Locale;
  names: SiteNames;
  photos: GalleryPhoto[];
  skin?: SaveTheDateSkin;
  /** Layouts whose hero already shows the cover full-screen ask for a gallery photo instead. */
  photoPreference?: "hero" | "gallery";
  /** Show a photo at all. On by default, except for noir, which is typographic unless asked. */
  showPhoto?: boolean;
  marker?: MarkerShape;
  /**
   * How the days in the grid are written. "geez" (the manuscript skin) writes each day in Ge'ez
   * numerals, labelled with the plain number, with the plain figure small beneath.
   */
  numerals?: Numerals;
};

type Tone = "light" | "ink";

/** Per-skin type colours and fonts; cinema and editorial keep their original classes. */
const SKINS: Record<SaveTheDateSkin, { tone: Tone; compact: boolean; title: string; names: string; date: string }> = {
  cinema: {
    tone: "light",
    compact: false,
    title: "font-display",
    // Gold lifted toward white keeps 4.5:1 over a bright photo under the wash.
    names: "text-[color-mix(in_oklab,var(--w-metal)_60%,white)]",
    date: "font-display",
  },
  editorial: { tone: "ink", compact: true, title: "font-display text-ink", names: "text-ink-soft", date: "font-display text-ink" },
  // Metal type is only used here because noir sits on the page's dark paper.
  noir: { tone: "ink", compact: false, title: "font-display text-metal", names: "text-metal", date: "font-display foil-text foil-sheen" },
  arch: {
    tone: "ink",
    compact: true,
    title: "font-cormorant font-light text-ink",
    names: "text-ink-soft",
    date: "font-cormorant font-medium lining-nums text-ink",
  },
  // A story card: SAVE THE DATE as a white text sticker over the photo. Sizes follow the card (cqi), not the window.
  story: {
    tone: "light",
    compact: false,
    title:
      "mx-auto w-fit rounded-[0.4em] bg-white px-[0.5em] py-[0.28em] font-display text-[#141210] text-[clamp(1.45rem,8.4cqi,2.35rem)] tracking-[0.12em] shadow-[0_10px_30px_-12px_rgb(0_0_0/0.55)] [&:lang(am)]:text-[clamp(1.35rem,7.6cqi,2.1rem)]",
    names:
      "mt-3 text-[clamp(0.95rem,4.4cqi,1.15rem)] text-[color-mix(in_oklab,var(--w-metal)_60%,white)] [text-shadow:0_1px_6px_rgb(0_0_0/0.7)]",
    date: "mt-5 font-display text-[clamp(1.3rem,7.2cqi,1.95rem)] [&:lang(am)]:text-[clamp(1.2rem,6.4cqi,1.7rem)]",
  },
  // A printed card: ink on the sheet, the title letterpressed into it (a static shadow, never animated).
  card: {
    tone: "ink",
    compact: true,
    title:
      "font-display text-ink [text-shadow:0_1px_0_color-mix(in_oklab,var(--w-sheet),white_70%),0_-1px_0_rgb(0_0_0/0.07)]",
    names: "text-ink-soft",
    date: "font-display text-ink",
  },
  // Kaba Velvet is always dark, so metal type sits on the velvet as it does on noir's paper.
  velvet: { tone: "ink", compact: false, title: "font-display text-metal", names: "text-metal", date: "font-display foil-text" },
  // Brana Manuscript: the title in the layout's red rubric (which it checks for contrast), the rest in ink.
  manuscript: {
    tone: "ink",
    compact: true,
    title: "font-cormorant font-medium text-[var(--brana-rubric,var(--w-thread-3))]",
    names: "font-[family-name:var(--brana-display,var(--font-display))] font-medium tracking-[0.22em] text-ink-soft",
    date: "font-cormorant font-medium lining-nums text-ink",
  },
};

/**
 * The full-screen save-the-date: a big SAVE THE DATE, the names, the wedding
 * month with the day marked, and the date over a gold rule, dressed per skin.
 * The couple chooses the Ethiopian grid, the Gregorian one, or both with a
 * switch. The section is a data-stage, so it plays its entrance once when it
 * scrolls into view (see globals.css); every skin keeps the std-* classes.
 */
export async function SaveTheDate({
  site,
  locale,
  names,
  photos,
  skin = "cinema",
  photoPreference = "hero",
  showPhoto = skin !== "noir",
  marker,
  numerals = "arabic",
}: Props) {
  const t = await getTranslations("saveTheDate");
  const { couple } = site;
  const look = SKINS[skin];
  const tone = look.tone;
  const { initial, available } = calendarViews(getCalendarStyle(couple.calendarStyle), locale);
  const shape = marker ?? markerFor(couple.border);
  const photo = showPhoto
    ? pickSaveTheDatePhoto(
        couple,
        photos.map((p) => p.url),
        photoPreference,
      )
    : null;
  const separator = locale === "am" ? "፡" : "&";

  const views: Partial<Record<CalendarSystem, ReactNode>> = {};
  for (const system of available) {
    views[system] = <MonthView site={site} locale={locale} system={system} marker={shape} skin={skin} numerals={numerals} t={t} />;
  }

  const heading = (
    <>
      <StdTitle id="save-the-date-title" text={t("title")} locale={locale} compact={look.compact} className={look.title} />
      <p
        className={cn(
          "std-names mt-5 font-sans text-[clamp(0.95rem,2.5vw,1.4rem)] tracking-[0.3em] [&:lang(am)]:tracking-normal",
          look.names,
        )}
      >
        {t("couple", { one: names.firstOne, two: names.firstTwo })}
      </p>
    </>
  );
  const calendar = (
    <>
      <CalendarViews
        // A new language or calendar setting starts the switch over on the server's choice.
        key={`${locale}-${available.join("-")}`}
        initial={initial}
        views={views}
        tone={tone}
        labels={{ group: t("switchLabel"), ethiopian: t("ethiopian"), gregorian: t("gregorian") }}
      />
      {/* Under the month in every skin, when the couple turned "Add to calendar" on. */}
      <AddToCalendar site={site} locale={locale} className="mt-7" />
    </>
  );

  if (skin === "card") {
    // A printed card, its own height: a double rule inset from the edge, and the photo, if any, as a small print at its head.
    return (
      <section
        id="save-the-date"
        data-stage
        aria-labelledby="save-the-date-title"
        className="std relative isolate bg-sheet px-[clamp(1.1rem,5vw,3.25rem)] pt-[clamp(3rem,9vw,4.5rem)] pb-[clamp(2.5rem,7vw,3.75rem)] text-center text-ink"
      >
        <span aria-hidden className="std-frame pointer-events-none absolute inset-[clamp(0.55rem,2vw,0.9rem)] border border-metal/60">
          <span className="absolute inset-[3px] border border-metal/30" />
        </span>
        {photo ? (
          <div className="mx-auto mb-9 w-[min(44%,11rem)] -rotate-2 bg-white p-[5%] pb-[16%] shadow-[0_10px_18px_-8px_rgb(40_30_20/0.35)]">
            <div className="relative aspect-[4/5] overflow-hidden bg-rule">
              <Backdrop photo={photo} sizes="11rem" />
            </div>
          </div>
        ) : null}
        <div className="relative">
          {heading}
          <div className="mt-8">{calendar}</div>
        </div>
      </section>
    );
  }

  if (skin === "manuscript") {
    // A page of the Brana book: a harag headpiece, the photo as a small framed miniature, then the ruled month.
    return (
      <section
        id="save-the-date"
        data-stage
        aria-labelledby="save-the-date-title"
        className="std relative isolate overflow-x-clip px-4 py-12 text-center text-ink sm:px-8 sm:py-16 lg:py-20"
      >
        <div className="mx-auto w-full max-w-[40rem]">
          <Headpiece reveal={false} className="std-frame mx-[18px] mb-12" />
          {photo ? (
            <MiniatureFrame className="std-frame mx-auto mb-10 w-[min(40%,10rem)]" windowClassName="aspect-[4/5]">
              <Backdrop photo={photo} sizes="10rem" />
            </MiniatureFrame>
          ) : null}
          {heading}
          <div className="mt-10">{calendar}</div>
        </div>
      </section>
    );
  }

  if (skin === "editorial") {
    return (
      <section
        id="save-the-date"
        data-stage
        aria-labelledby="save-the-date-title"
        className={cn("std grid min-h-svh overflow-x-clip border-t border-rule bg-sheet", photo && "lg:grid-cols-2")}
      >
        {photo ? (
          <div className="relative min-h-[42svh] overflow-hidden">
            <Backdrop photo={photo} sizes="(min-width: 1024px) 50vw, 100vw" />
          </div>
        ) : null}
        <div className="flex items-center justify-center px-4 py-16 sm:px-10">
          <div className="w-full max-w-[34rem] text-center">
            {heading}
            <div className="mt-9">{calendar}</div>
          </div>
        </div>
      </section>
    );
  }

  if (skin === "noir") {
    return (
      <section
        id="save-the-date"
        data-stage
        aria-labelledby="save-the-date-title"
        className="std relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-paper px-4 py-20 text-ink sm:py-28"
      >
        {photo ? (
          <>
            <Backdrop photo={photo} sizes="100vw" className="-z-10" />
            {/* Nearly opaque: the photo is a texture, the metal type keeps the dark paper's contrast. */}
            <span aria-hidden className="absolute inset-0 -z-10 bg-paper/90" />
          </>
        ) : null}
        <span aria-hidden className="absolute inset-0 -z-10" style={NOIR_GLOW} />
        <div className="w-full max-w-[44rem] text-center">
          <Crest initials={names.initials} separator={separator} id="std-crest" className="mx-auto mb-7 w-[clamp(4.5rem,14vw,6.5rem)]" />
          {heading}
          <div className="mt-10">{calendar}</div>
        </div>
      </section>
    );
  }

  if (skin === "velvet") {
    return (
      <section
        id="save-the-date"
        data-stage
        aria-labelledby="save-the-date-title"
        className="std relative isolate flex min-h-svh items-center justify-center overflow-x-clip px-3 py-20 text-ink sm:px-6 sm:py-28"
      >
        <VelvetGround className="-z-10" />
        {/* The calendar on the velvet inside a gold-thread frame, under a medallion with a photo or the initials. */}
        <div className="relative w-full max-w-[44rem] px-[clamp(1.1rem,5vw,3.5rem)] pt-[clamp(2.75rem,8vw,4.25rem)] pb-[clamp(2.25rem,6vw,3.5rem)] text-center">
          <StitchFrame id="std-velvet-frame" lineReveal={false} lineClassName="std-frame" />
          <Medallion id="std-velvet-medallion" draw={false} className="std-frame mx-auto mb-8 w-[clamp(6rem,22vw,8rem)]" windowClassName="bg-sheet">
            {photo ? (
              <Backdrop photo={photo} sizes="6rem" />
            ) : (
              <span aria-hidden className="flex size-full items-center justify-center font-display text-[clamp(1.4rem,5vw,1.9rem)] leading-none text-metal">
                {names.initials[0]}
                <span className="mx-1 font-cormorant text-[0.7em] italic [&:lang(am)]:not-italic">{separator}</span>
                {names.initials[1]}
              </span>
            )}
          </Medallion>
          {heading}
          <div className="mt-10">{calendar}</div>
        </div>
      </section>
    );
  }

  if (skin === "arch") {
    return (
      <section
        id="save-the-date"
        data-stage
        aria-labelledby="save-the-date-title"
        className="std relative isolate flex min-h-svh items-center justify-center overflow-x-clip bg-paper px-4 py-20 text-ink sm:py-28"
      >
        <div className="relative w-full max-w-[40rem] text-center">
          {/* Top padding in % of the width keeps the window clear of the arch's shoulders at any size. */}
          <div className="relative rounded-t-[999rem] bg-sheet px-[clamp(0.6rem,4vw,2.5rem)] pt-[9%] pb-10 sm:pb-14">
            <ArchPanelOrnament />
            <div className="relative">
              <ArchFrame keyline ratio={3 / 4} className="mx-auto mb-9 w-[min(46%,13rem)]" windowClassName="bg-rule">
                {photo ? (
                  <Backdrop photo={photo} sizes="(min-width: 640px) 13rem, 46vw" />
                ) : (
                  <span
                    aria-hidden
                    className="flex size-full items-center justify-center bg-paper font-display text-[clamp(1.75rem,7vw,2.75rem)] leading-none text-ink"
                  >
                    {names.initials[0]}
                    <span className="mx-1.5 font-cormorant text-[0.7em] text-ink-soft italic">{separator}</span>
                    {names.initials[1]}
                  </span>
                )}
              </ArchFrame>
              {heading}
              <div className="mt-9">{calendar}</div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (skin === "story") {
    // Fills its story card (a flex column), so no height of its own. The month sits on frosted glass.
    return (
      <section
        id="save-the-date"
        data-stage
        aria-labelledby="save-the-date-title"
        className="std @container relative isolate flex flex-1 flex-col items-center justify-center overflow-hidden px-3 pt-11 pb-6 text-white"
      >
        {photo ? <Backdrop photo={photo} sizes="(min-width: 48rem) 34rem, 100vw" className="-z-10" /> : null}
        {/* Light enough at the top that the photo still reads, darkest at the foot behind the date. */}
        <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/45 via-black/35 to-black/80" />
        <div className="w-full max-w-[26rem] text-center">
          {heading}
          <div className="std-frame mt-5 rounded-[1.75rem] border border-white/20 bg-black/30 px-2 pt-4 pb-4 backdrop-blur-md [text-shadow:0_1px_3px_rgb(0_0_0/0.5)]">
            {calendar}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="save-the-date"
      data-stage
      aria-labelledby="save-the-date-title"
      className="std relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-[#0d0c0b] px-4 py-20 text-white"
    >
      {photo ? <Backdrop photo={photo} sizes="100vw" className="-z-10" /> : null}
      {/* Dark enough that white and gold text stay readable over the brightest photo. */}
      <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/75 via-black/70 to-black/80" />
      <div className="w-full max-w-[44rem] text-center [text-shadow:0_1px_3px_rgb(0_0_0/0.6)]">
        {heading}
        <div className="mt-9">{calendar}</div>
      </div>
    </section>
  );
}

/*
 * Decorative gradients stay inline styles: Tailwind's fallback for color-mix
 * would paint them in full-strength metal where color-mix is unsupported,
 * whereas an inline declaration the browser cannot parse is simply skipped.
 */

/** A faint warm light behind noir's crest and title. */
const NOIR_GLOW: CSSProperties = {
  backgroundImage: "radial-gradient(60% 45% at 50% 42%, color-mix(in oklab, var(--w-metal) 10%, transparent), transparent)",
};

/** Rays fan out from the arch's centre behind the window, fading toward the rim. */
const SUNBURST: CSSProperties = {
  backgroundImage: [
    "radial-gradient(circle farthest-side at 50% 100%, var(--w-sheet) 30%, transparent 48%, transparent 70%, var(--w-sheet) 96%)",
    "repeating-conic-gradient(from -0.3deg at 50% 100%, color-mix(in oklab, var(--w-metal) 45%, transparent) 0deg 0.6deg, transparent 0.6deg 6deg)",
  ].join(", "),
};

/**
 * The arch panel's decoration: a deco sunburst in its head and a double gold
 * keyline that follows the arch, inset so the curves stay concentric.
 */
function ArchPanelOrnament() {
  return (
    <span aria-hidden className="std-frame pointer-events-none absolute inset-0">
      <span className="absolute inset-0 overflow-hidden rounded-t-[999rem]">
        <span className="absolute inset-x-0 top-0 aspect-[2/1]" style={SUNBURST} />
      </span>
      <span className="absolute inset-2 rounded-t-[999rem] border border-metal/60" />
      <span className="absolute inset-[13px] rounded-t-[999rem] border border-metal/30" />
    </span>
  );
}

function Backdrop({ photo, sizes, className }: { photo: BackdropPhoto; sizes: string; className?: string }) {
  return (
    <div aria-hidden className={cn("std-photo absolute inset-0", className)}>
      <WeddingImage src={photo.src} alt="" fill sizes={sizes} className="object-cover" style={{ objectPosition: photo.position }} />
    </div>
  );
}

/**
 * SAVE THE DATE, one span per character so the letters can draw together from
 * wide spacing (moved with transforms, never by animating letter-spacing).
 * Words stay unbroken; screen readers get the plain text. Font and colour
 * come from the skin.
 */
function StdTitle({
  id,
  text,
  locale,
  compact,
  className,
}: {
  id: string;
  text: string;
  locale: Locale;
  compact: boolean;
  className: string;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  const total = words.reduce((count, word) => count + graphemes(word, locale).length, 0);
  let index = 0;
  return (
    <h2
      id={id}
      className={cn(
        "std-title leading-[1.05] uppercase [&:lang(am)]:tracking-normal",
        compact
          ? "text-[clamp(2rem,7vw,3.1rem)] tracking-[0.12em] lg:text-[clamp(2rem,3.4vw,3.1rem)] [&:lang(am)]:text-[clamp(2rem,6vw,2.8rem)]"
          : "text-[clamp(2.1rem,7.4vw,4.6rem)] tracking-[0.16em] [&:lang(am)]:text-[clamp(2.1rem,7vw,4rem)]",
        className,
      )}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, w) => (
          <span key={w}>
            {w > 0 ? " " : null}
            <span className="inline-block whitespace-nowrap">
              {graphemes(word, locale).map((char) => {
                const offset = index++ - (total - 1) / 2;
                return (
                  <span key={offset} className="std-char inline-block" style={{ "--o": offset } as CSSProperties}>
                    {char}
                  </span>
                );
              })}
            </span>
          </span>
        ))}
      </span>
    </h2>
  );
}

type Translate = Awaited<ReturnType<typeof getTranslations<"saveTheDate">>>;

/** One calendar's month label, grid, big date and gold rule, with the other calendar's date beneath. */
function MonthView({
  site,
  locale,
  system,
  marker,
  skin,
  numerals,
  t,
}: {
  site: SiteData;
  locale: Locale;
  system: CalendarSystem;
  marker: MarkerShape;
  skin: SaveTheDateSkin;
  numerals: Numerals;
  t: Translate;
}) {
  const { weddingAt, timezone } = site.couple;
  const { tone, date: dateClass } = SKINS[skin];
  const grid = buildMonthGrid(weddingAt, timezone, system);
  const month = system === "ethiopian" && locale === "en" ? grid.monthLatin! : grid.monthName;
  const caption =
    system === "ethiopian"
      ? t("captionEthiopian", { month, year: grid.year })
      : t("captionGregorian", { month, year: grid.year });
  const other: CalendarSystem = system === "ethiopian" ? "gregorian" : "ethiopian";
  const monthLabel =
    system === "ethiopian" ? (
      <>
        {/* Ge'ez gets its own language tag and no wide tracking, even on English pages. */}
        <span lang="am" className="tracking-normal">
          {grid.monthName} {grid.year}
        </span>
        {locale === "en" ? ` · ${grid.monthLatin}` : null}
      </>
    ) : (
      `${grid.monthName} ${grid.year}`
    );

  const table = (
    <>
      <p
        className={cn(
          "std-month mb-4 font-sans text-xs tracking-[0.25em] uppercase [&:lang(am)]:tracking-normal",
          tone === "light" ? "text-white/85" : "text-ink-soft",
        )}
      >
        {monthLabel}
      </p>
      <div className="mx-auto w-full max-w-[min(92vw,40rem)]">
        <MonthTable
          grid={grid}
          locale={locale}
          marker={marker}
          caption={caption}
          weddingDayLabel={t("weddingDay")}
          tone={tone}
          numerals={numerals}
        />
      </div>
    </>
  );

  return (
    <>
      {skin === "manuscript" ? (
        // Ruled like a computus table, in a frame of red and ink rules.
        <div className="relative px-[clamp(0.5rem,2.5vw,1.5rem)] pt-6 pb-4">
          <span aria-hidden className={cn(brana.calendarFrame, "std-frame")} />
          <div className={cn(brana.calendar, "relative")}>{table}</div>
        </div>
      ) : skin === "noir" ? (
        <KeylineFrame double corners inset={0} lineClassName="std-frame" className="px-[clamp(0.5rem,3vw,2rem)] pt-7 pb-5">
          {table}
        </KeylineFrame>
      ) : (
        table
      )}
      <p
        className={cn(
          "std-date mt-10 text-[clamp(1.6rem,5.2vw,3rem)] leading-tight tracking-[0.08em] uppercase",
          "[&:lang(am)]:text-[clamp(1.35rem,4.6vw,2.4rem)] [&:lang(am)]:tracking-normal",
          dateClass,
        )}
        // Noir's foil sheen waits until the date has typed itself out.
        style={skin === "noir" ? ({ "--sheen-delay": "3.2s" } as CSSProperties) : undefined}
      >
        {formatSaveTheDate(weddingAt, timezone, locale, system)}
      </p>
      <span
        aria-hidden
        className="std-rule mx-auto mt-6 block h-px w-[min(80%,36rem)] bg-[linear-gradient(90deg,transparent,var(--w-metal),transparent)]"
      />
      <p className={cn("std-alt mt-4 font-sans text-sm", tone === "light" ? "text-white/85" : "text-ink-soft")}>
        {formatSaveTheDate(weddingAt, timezone, locale, other)}
      </p>
    </>
  );
}
