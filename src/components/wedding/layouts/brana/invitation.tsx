import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale, usesEthiopianCalendar } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate, formatWeddingTime } from "@/lib/wedding-format";
import styles from "./brana.module.css";
import { scriptLang } from "./names";
import { BranaHeading, Headpiece, SectionMark, order } from "./ornaments";

type Props = { site: SiteData; locale: Locale };

/** Past this many characters the invitation reads well in two columns on wide screens. */
const TWO_COLUMNS = 320;

/**
 * The invitation set as a page of the book: a harag headpiece, the title in
 * rubric, the hosts as the incipit in red, the couple's words in black ink
 * (in two ruled columns on wide screens when they run long), then the
 * particulars as a small ruled list: the day in both calendars, the hour,
 * the place and the dress.
 */
export async function BranaInvitation({ site, locale }: Props) {
  const t = await getTranslations("invitation");
  const tb = await getTranslations("layouts.brana");
  const { couple, venues } = site;
  const hosts = pickText(couple.hosts, locale) || t("hostsFallback");
  const invitation = pickText(couple.invitation, locale) || t("defaultText");
  const dressCode = pickText(couple.dressCode, locale);
  const venue = venues[0];
  const venueName = venue ? pickText(venue.name, locale) : "";
  const venueAddress = venue ? pickText(venue.address, locale) : "";
  const long = invitation.length > TWO_COLUMNS;
  const paragraphs = invitation
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  const particulars = [
    {
      key: "date",
      label: tb("date"),
      value: (
        <>
          <span className="block">{formatWeddingDate(couple.weddingAt, couple.timezone, locale)}</span>
          {usesEthiopianCalendar(locale) ? (
            <span className="block text-base text-ink-soft">{formatGregorianDate(couple.weddingAt, couple.timezone)}</span>
          ) : (
            <span lang="am" className="block text-base text-ink-soft">
              {formatEthiopianDateLine(couple.weddingAt, couple.timezone)}
            </span>
          )}
        </>
      ),
    },
    { key: "time", label: tb("time"), value: formatWeddingTime(couple.weddingAt, couple.timezone, locale) },
    venue
      ? {
          key: "place",
          label: tb("place"),
          value: (
            <>
              <span className="block">{venueName}</span>
              {venueAddress ? <span className="block text-base text-ink-soft">{venueAddress}</span> : null}
            </>
          ),
        }
      : null,
    dressCode ? { key: "dress", label: t("dressCode"), value: dressCode } : null,
  ].filter((entry) => entry !== null);

  return (
    <section id="invitation" aria-labelledby="invitation-heading" className="px-4 py-12 sm:px-8 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <Headpiece className="mx-[18px]" />
        <BranaHeading id="invitation-heading" className="mt-12">
          {t("eyebrow")}
        </BranaHeading>

        <div data-reveal-group className="mt-10 text-center">
          <p
            data-reveal="up"
            lang={scriptLang(hosts)}
            className={cn(styles.incipit, "mx-auto max-w-[36ch] text-[clamp(0.95rem,2.4vw,1.1rem)] leading-relaxed ethiopic:text-[clamp(1.1rem,2.8vw,1.3rem)]")}
          >
            {hosts}
          </p>
          <div
            data-reveal="up"
            style={order(1)}
            className={cn(
              "mx-auto mt-5 space-y-4 font-cormorant text-[clamp(1.35rem,3.2vw,1.7rem)] leading-snug font-medium ethiopic:text-[clamp(1.15rem,2.8vw,1.35rem)] ethiopic:leading-relaxed",
              long ? cn(styles.columns, "max-w-[62ch] text-start md:columns-2 md:gap-12") : "max-w-[30ch] ethiopic:max-w-[34ch]",
            )}
          >
            {paragraphs.map((paragraph, index) => (
              <p key={index} lang={scriptLang(paragraph)} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>

          <SectionMark className="mt-10 text-[1.4rem]" />

          <dl className="mx-auto mt-8 max-w-xl border-y border-(--brana-rule) text-center sm:text-start">
            {particulars.map((entry, index) => (
              <div
                key={entry.key}
                data-reveal="up"
                style={order(2 + index)}
                className={cn("py-4 sm:grid sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6", index > 0 && "border-t border-(--brana-rule)")}
              >
                <dt className={cn(styles.incipit, "text-xs leading-6 sm:pt-1 sm:text-end ethiopic:text-sm")}>{entry.label}</dt>
                <dd className="mt-1 text-lg lining-nums sm:mt-0">{entry.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/** The couple's verse, if they gave one, as a rubricated quotation between ፨ marks. Renders nothing without one. */
export function BranaVerse({ site, locale }: Props) {
  const text = pickText(site.couple.scripture, locale);
  if (!text) return null;
  const reference = pickText(site.couple.scriptureRef, locale);

  return (
    <section className="px-4 py-14 sm:px-8 sm:py-20">
      <figure data-reveal-group className="mx-auto max-w-2xl text-center">
        <SectionMark className="text-[1.4rem]" />
        <blockquote
          data-reveal="fade"
          style={order(1)}
          lang={scriptLang(text)}
          className="mt-6 font-cormorant text-[clamp(1.5rem,4vw,2.25rem)] leading-[1.35] font-medium italic ethiopic:text-[clamp(1.25rem,3.2vw,1.7rem)] ethiopic:leading-[1.6] ethiopic:not-italic"
        >
          <p>{text}</p>
        </blockquote>
        {reference ? (
          <figcaption data-reveal="up" style={order(2)} lang={scriptLang(reference)} className={cn(styles.incipit, "mt-6 text-sm ethiopic:text-base")}>
            {reference}
          </figcaption>
        ) : null}
      </figure>
    </section>
  );
}
