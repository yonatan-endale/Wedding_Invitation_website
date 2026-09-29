import { getTranslations } from "next-intl/server";
import { zonedParts } from "@/lib/datetime";
import {
  ETHIOPIAN_MONTHS_AM,
  ETHIOPIAN_MONTHS_LATIN,
  ethiopianMonth,
  gregorianToEthiopian,
  type EthiopianMonthDay,
} from "@/lib/ethiopian-calendar";
import type { Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatGregorianSpan } from "@/lib/wedding-format";
import { WeddingImage } from "./primitives";

/** The Ethiopian week starts on Sunday. */
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
};

type Props = {
  weddingAt: string;
  timeZone: string;
  locale: Locale;
  /** The couple's cover photo and its focal point; without one the card is plain paper. */
  photo?: { src: string; position: string } | null;
  className?: string;
};

/**
 * The wedding month as it hangs on an Ethiopian wall calendar, with the day
 * marked by a diamond. Each day also carries its Gregorian date in small
 * figures, so guests abroad can find the day on their own calendar. When the
 * couple has a cover photo it fills the card under a dark wash, and the dates
 * turn white to stay readable.
 */
export async function EthiopianCalendar({ weddingAt, timeZone, locale, photo, className }: Props) {
  const t = await getTranslations("countdown");
  const local = zonedParts(new Date(weddingAt), timeZone);
  const wedding = gregorianToEthiopian(local.year, local.month, local.day);
  const days = ethiopianMonth(wedding.year, wedding.month);

  const cells: (EthiopianMonthDay | null)[] = [...Array<null>(days[0].weekday).fill(null), ...days];
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, index) => cells.slice(index * 7, index * 7 + 7));

  const monthAm = ETHIOPIAN_MONTHS_AM[wedding.month - 1];
  const monthLatin = ETHIOPIAN_MONTHS_LATIN[wedding.month - 1];
  const span = formatGregorianSpan(days[0].gregorian, days[days.length - 1].gregorian);

  return (
    <figure
      className={cn(
        "relative isolate mx-auto w-full max-w-sm overflow-hidden px-3 pt-7 pb-5 sm:px-6",
        photo ? "bg-ink text-white [text-shadow:0_1px_3px_rgb(0_0_0/0.7)]" : "border border-rule bg-sheet",
        className,
      )}
    >
      {photo ? (
        <>
          <WeddingImage
            src={photo.src}
            alt=""
            fill
            sizes="(min-width: 640px) 384px, 100vw"
            className="-z-10 object-cover"
            style={{ objectPosition: photo.position }}
          />
          <span aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/65 to-black/75" />
        </>
      ) : null}

      <figcaption className="text-center">
        <span lang="am" className="block font-display text-[clamp(1.75rem,6vw,2.25rem)] leading-none">
          {monthAm} {wedding.year}
        </span>
        <span className={cn("mt-2 block text-sm", photo ? "text-white/80" : "text-ink-soft")}>
          {locale === "am" ? span : `${monthLatin}, ${span}`}
        </span>
      </figcaption>

      <table className="mt-6 w-full table-fixed border-collapse text-center">
        <caption className="sr-only">
          {t("calendarCaption", { month: locale === "am" ? monthAm : monthLatin, year: wedding.year })}
        </caption>
        <thead>
          <tr>
            {WEEKDAYS[locale].map((weekday) => (
              <th
                key={weekday.full}
                scope="col"
                abbr={weekday.full}
                className={cn("pb-2 text-xs font-normal", photo ? "text-white/75" : "text-ink-soft")}
              >
                {weekday.short}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, row) => (
            <tr key={row}>
              {week.map((day, column) => (
                <td key={column} className="h-12 p-0 align-middle">
                  {day ? (
                    <Day day={day} wedding={day.day === wedding.day} onPhoto={Boolean(photo)} label={t("weddingDay")} />
                  ) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function Day({
  day,
  wedding,
  onPhoto,
  label,
}: {
  day: EthiopianMonthDay;
  wedding: boolean;
  onPhoto: boolean;
  label: string;
}) {
  return (
    <span className="relative mx-auto flex size-10 flex-col items-center justify-center">
      {wedding ? <span aria-hidden className="absolute inset-1.5 rotate-45 bg-thread-1" /> : null}
      <span className={cn("relative text-base leading-none tabular-nums", wedding && "font-medium text-on-thread-1")}>
        {day.day}
      </span>
      <span
        className={cn(
          "relative mt-0.5 text-[0.625rem] leading-none tabular-nums",
          wedding ? "text-on-thread-1/80" : onPhoto ? "text-white/75" : "text-ink-soft",
        )}
      >
        {day.gregorian.day}
      </span>
      {wedding ? <span className="sr-only">{label}</span> : null}
    </span>
  );
}
