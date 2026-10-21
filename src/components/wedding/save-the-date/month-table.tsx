import type { CSSProperties } from "react";
import { toGeez } from "@/lib/geez";
import type { Locale } from "@/lib/localized";
import type { MarkerShape, MonthCell, MonthGrid } from "@/lib/month-grid";
import { cn } from "@/lib/utils";

/** How the days are written: plain figures, or Ge'ez numerals with the plain figure small beneath (the manuscript skin). */
export type Numerals = "arabic" | "geez";

/** The Ethiopian week starts on Sunday, like the Gregorian one. */
const WEEKDAYS: Record<Locale, { short: string; full: string }[]> = {
  am: [
    { short: "እሑ", full: "እሑድ" },
    { short: "ሰኞ", full: "ሰኞ" },
    { short: "ማክ", full: "ማክሰኞ" },
    { short: "ረቡ", full: "ረቡዕ" },
    { short: "ሐሙ", full: "ሐሙስ" },
    { short: "ዓር", full: "ዓርብ" },
    { short: "ቅዳ", full: "ቅዳሜ" },
  ],
  en: [
    { short: "Sun", full: "Sunday" },
    { short: "Mon", full: "Monday" },
    { short: "Tue", full: "Tuesday" },
    { short: "Wed", full: "Wednesday" },
    { short: "Thu", full: "Thursday" },
    { short: "Fri", full: "Friday" },
    { short: "Sat", full: "Saturday" },
  ],
  ar: [
    { short: "أحد", full: "الأحد" },
    { short: "اثنين", full: "الاثنين" },
    { short: "ثلاثاء", full: "الثلاثاء" },
    { short: "أربعاء", full: "الأربعاء" },
    { short: "خميس", full: "الخميس" },
    { short: "جمعة", full: "الجمعة" },
    { short: "سبت", full: "السبت" },
  ],
  ti: [
    { short: "ሰን", full: "ሰንበት" },
    { short: "ሰኑ", full: "ሰኑይ" },
    { short: "ሰሉ", full: "ሰሉስ" },
    { short: "ረቡ", full: "ረቡዕ" },
    { short: "ሓሙ", full: "ሓሙስ" },
    { short: "ዓር", full: "ዓርቢ" },
    { short: "ቀዳ", full: "ቀዳም" },
  ],
  om: [
    { short: "Dil", full: "Dilbata" },
    { short: "Wix", full: "Wiixata" },
    { short: "Kib", full: "Kibxata" },
    { short: "Rob", full: "Roobii" },
    { short: "Kam", full: "Kamiisa" },
    { short: "Jim", full: "Jimaata" },
    { short: "San", full: "Sanbata" },
  ],
};

/** Marker outlines in a 40×40 box; the same path draws the stroke and the soft fill. */
const MARKER_PATHS: Record<MarkerShape, string> = {
  diamond: "M20 2.5 37.5 20 20 37.5 2.5 20Z",
  circle: "M20 3a17 17 0 1 1 0 34a17 17 0 1 1 0-34Z",
  heart: "M20 35C7 26 2.5 18.5 5.5 11.5 8.3 5 16 4.8 20 11c4-6.2 11.7-6 14.5.5 3 7-1.5 14.5-14.5 23.5Z",
  square: "M5 5h30v30H5Z",
};

type Props = {
  grid: MonthGrid;
  locale: Locale;
  marker: MarkerShape;
  caption: string;
  weddingDayLabel: string;
  /** "light" for white type over a photo, "ink" for theme ink on paper. */
  tone: "light" | "ink";
  numerals?: Numerals;
};

/** The wedding month as a real table, with each day's date in the other calendar in small figures. */
export function MonthTable({ grid, locale, marker, caption, weddingDayLabel, tone, numerals = "arabic" }: Props) {
  return (
    <table className="w-full table-fixed border-collapse text-center">
      <caption className="sr-only">{caption}</caption>
      <thead>
        <tr>
          {WEEKDAYS[locale].map((weekday, index) => (
            <th
              key={weekday.full}
              scope="col"
              abbr={weekday.full}
              style={{ "--c": index } as CSSProperties}
              className={cn(
                "std-weekday pb-3 font-sans text-[clamp(0.7rem,2.3vw,0.95rem)] font-semibold tracking-[0.08em] uppercase ethiopic:tracking-normal",
                tone === "light" ? "text-white" : "text-ink-soft",
              )}
            >
              {weekday.short}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {grid.weeks.map((week, row) => (
          <tr key={row}>
            {week.map((cell, column) => (
              <td key={column} className="h-[clamp(2.75rem,9vw,4.4rem)] p-0 align-middle">
                {cell ? (
                  <DayCell cell={cell} delay={row + column} marker={marker} label={weddingDayLabel} tone={tone} numerals={numerals} />
                ) : null}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function DayCell({
  cell,
  delay,
  marker,
  label,
  tone,
  numerals,
}: {
  cell: MonthCell;
  delay: number;
  marker: MarkerShape;
  label: string;
  tone: "light" | "ink";
  numerals: Numerals;
}) {
  return (
    <span
      style={{ "--d": delay } as CSSProperties}
      className={cn("std-day relative mx-auto flex size-[clamp(2.5rem,8.4vw,3.75rem)] flex-col items-center justify-center", cell.wedding && "std-wedding")}
    >
      {cell.wedding ? (
        <>
          <span aria-hidden className="std-glow absolute -inset-[45%] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--w-metal)_55%,transparent),transparent)] opacity-0" />
          <svg aria-hidden viewBox="0 0 40 40" className="absolute inset-0 size-full overflow-visible text-metal">
            <path className="std-mark-fill" d={MARKER_PATHS[marker]} fill="currentColor" opacity={tone === "light" ? 0.28 : 0.2} />
            <path
              className="std-mark-line"
              d={MARKER_PATHS[marker]}
              pathLength={1}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
            />
          </svg>
        </>
      ) : null}
      {numerals === "geez" ? (
        <>
          {/* Read as the plain number: speech engines rarely voice Ge'ez numerals. The small figure beneath is for the eye. */}
          <span
            lang="am"
            role="img"
            aria-label={String(cell.day)}
            className="relative font-[family-name:var(--font-abyssinica)] text-[clamp(1.05rem,3.7vw,1.6rem)] leading-none whitespace-nowrap"
          >
            {toGeez(cell.day)}
          </span>
          <span
            aria-hidden
            className={cn(
              "relative mt-1 font-sans text-[clamp(0.55rem,1.6vw,0.66rem)] leading-none tabular-nums",
              cell.wedding ? "text-ink" : "text-ink-soft",
            )}
          >
            {cell.day}
          </span>
        </>
      ) : (
        <>
          <span className={cn("relative font-sans text-[clamp(1rem,3.4vw,1.5rem)] leading-none tabular-nums", cell.wedding && "font-semibold")}>
            {cell.day}
          </span>
          <span
            className={cn(
              "relative mt-1 font-sans text-[clamp(0.55rem,1.7vw,0.7rem)] leading-none tabular-nums",
              tone === "light" ? "text-white/80" : cell.wedding ? "text-ink" : "text-ink-soft",
            )}
          >
            {cell.other}
          </span>
        </>
      )}
      {cell.wedding ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
