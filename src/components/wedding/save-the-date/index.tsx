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
import type { SiteNames } from "../layouts/types";
import { WeddingImage } from "../primitives";
import { CalendarViews } from "./calendar-views";
import { MonthTable } from "./month-table";

/** How the save-the-date is dressed in each layout. */
export type SaveTheDateSkin = "cinema" | "editorial";

type Props = {
  site: SiteData;
  locale: Locale;
  names: SiteNames;
  photos: GalleryPhoto[];
  skin?: SaveTheDateSkin;
  /** Layouts whose hero already shows the cover full-screen ask for a gallery photo instead. */
  photoPreference?: "hero" | "gallery";
  marker?: MarkerShape;
};

type Tone = "light" | "ink";

/**
 * The full-screen save-the-date: the couple's photo under a dark wash, a big
 * SAVE THE DATE, the names in gold, the wedding month with the day marked, and
 * the date over a gold rule. The couple chooses the Ethiopian grid, the
 * Gregorian one, or both with a switch. The section is a data-stage, so it
 * plays its entrance once when it scrolls into view (see globals.css).
 */
export async function SaveTheDate({ site, locale, names, photos, skin = "cinema", photoPreference = "hero", marker }: Props) {
  const t = await getTranslations("saveTheDate");
  const { couple } = site;
  const tone: Tone = skin === "cinema" ? "light" : "ink";
  const { initial, available } = calendarViews(getCalendarStyle(couple.calendarStyle), locale);
  const shape = marker ?? markerFor(couple.border);
  const photo = pickSaveTheDatePhoto(
    couple,
    photos.map((p) => p.url),
    photoPreference,
  );

  const views: Partial<Record<CalendarSystem, ReactNode>> = {};
  for (const system of available) {
    views[system] = <MonthView site={site} locale={locale} system={system} marker={shape} tone={tone} t={t} />;
  }

  const heading = (
    <>
      <StdTitle id="save-the-date-title" text={t("title")} locale={locale} tone={tone} compact={skin === "editorial"} />
      <p
        className={cn(
          "std-names mt-5 font-sans text-[clamp(0.95rem,2.5vw,1.4rem)] tracking-[0.3em] [&:lang(am)]:tracking-normal",
          // Gold lifted toward white keeps 4.5:1 over a bright photo under the wash.
          tone === "light" ? "text-[color-mix(in_oklab,var(--w-metal)_60%,white)]" : "text-ink-soft",
        )}
      >
        {t("couple", { one: names.firstOne, two: names.firstTwo })}
      </p>
    </>
  );
  const calendar = (
    <CalendarViews
      // A new language or calendar setting starts the switch over on the server's choice.
      key={`${locale}-${available.join("-")}`}
      initial={initial}
      views={views}
      tone={tone}
      labels={{ group: t("switchLabel"), ethiopian: t("ethiopian"), gregorian: t("gregorian") }}
    />
  );

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
 * Words stay unbroken; screen readers get the plain text.
 */
function StdTitle({ id, text, locale, tone, compact }: { id: string; text: string; locale: Locale; tone: Tone; compact: boolean }) {
  const words = text.split(/\s+/).filter(Boolean);
  const total = words.reduce((count, word) => count + graphemes(word, locale).length, 0);
  let index = 0;
  return (
    <h2
      id={id}
      className={cn(
        "std-title font-display leading-[1.05] uppercase [&:lang(am)]:tracking-normal",
        compact
          ? "text-[clamp(2rem,7vw,3.1rem)] tracking-[0.12em] lg:text-[clamp(2rem,3.4vw,3.1rem)] [&:lang(am)]:text-[clamp(2rem,6vw,2.8rem)]"
          : "text-[clamp(2.1rem,7.4vw,4.6rem)] tracking-[0.16em] [&:lang(am)]:text-[clamp(2.1rem,7vw,4rem)]",
        tone === "ink" && "text-ink",
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
  tone,
  t,
}: {
  site: SiteData;
  locale: Locale;
  system: CalendarSystem;
  marker: MarkerShape;
  tone: Tone;
  t: Translate;
}) {
  const { weddingAt, timezone } = site.couple;
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

  return (
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
        <MonthTable grid={grid} locale={locale} marker={marker} caption={caption} weddingDayLabel={t("weddingDay")} tone={tone} />
      </div>
      <p
        className={cn(
          "std-date mt-10 font-display text-[clamp(1.6rem,5.2vw,3rem)] leading-tight tracking-[0.08em] uppercase",
          "[&:lang(am)]:text-[clamp(1.35rem,4.6vw,2.4rem)] [&:lang(am)]:tracking-normal",
          tone === "ink" && "text-ink",
        )}
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
