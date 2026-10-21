import { CalendarDays, MapPin } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import type { SiteData } from "@/db/queries/site";
import { getOrnament } from "@/lib/appearance";
import { pickText, type Locale, isEthiopic, usesEthiopianCalendar } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate, formatWeddingTime } from "@/lib/wedding-format";
import { FaithOrnament } from "../../ornaments/faith-ornament";
import type { SiteNames } from "../types";
import { Divider, Kicker, Monogram, order, slateEyebrow } from "./kit";
import styles from "./slate.module.css";

type Props = { site: SiteData; locale: Locale; names: SiteNames };

/** An icon in a soft accent circle, over a label and its lines. */
function Fact({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-2 text-center">
      <span aria-hidden className="flex size-10 items-center justify-center rounded-full bg-(--slate-accent)/10 text-(--slate-accent)">
        {icon}
      </span>
      <p className={cn(slateEyebrow, "mt-3 text-ink-soft")}>{label}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

/**
 * The invitation as a white card: the couple's faith ornament if they chose
 * one, the monogram in a fine ring, the script accent line over the full
 * names, the divider, the hosts and the words, and then the day (in both
 * calendars, with the time) beside the place.
 */
export async function SlateInvitation({ site, locale, names }: Props) {
  const t = await getTranslations("invitation");
  const ts = await getTranslations("layouts.slate");
  const { couple, venues } = site;
  const ornament = getOrnament(couple.ornament);
  const hosts = pickText(couple.hosts, locale) || t("hostsFallback");
  const invitation = pickText(couple.invitation, locale) || t("defaultText");
  const dressCode = pickText(couple.dressCode, locale);
  const firstVenue = venues[0];
  const venueName = firstVenue ? pickText(firstVenue.name, locale) : "";
  const venueAddress = firstVenue ? pickText(firstVenue.address, locale) : "";
  const city = pickText(couple.city, locale);
  // The other calendar under the date, so Ethiopian and international guests both recognise the day.
  const otherDate =
    usesEthiopianCalendar(locale) ? formatGregorianDate(couple.weddingAt, couple.timezone) : formatEthiopianDateLine(couple.weddingAt, couple.timezone);

  return (
    <section id="invitation" aria-labelledby="invitation-heading" className="px-3 pt-16 pb-6 sm:px-8 sm:pt-24 sm:pb-10">
      <div className={cn(styles.card, "mx-auto max-w-3xl px-6 pt-12 pb-10 text-center sm:px-14 sm:pt-16 sm:pb-12")}>
        <div data-reveal-group>
          <FaithOrnament ornament={ornament} className="mx-auto mb-6 size-9 sm:size-10" />
          <div data-reveal="pop" className="mx-auto w-fit">
            <Monogram initials={names.initials} locale={locale} className="size-16 text-[1.05rem] sm:size-[4.5rem] sm:text-[1.15rem]" />
          </div>
          <Kicker locale={locale} style={order(1)} className="mt-6">
            {ts("kicker.invitation")}
          </Kicker>
          <h2
            id="invitation-heading"
            data-reveal="up"
            style={order(2)}
            className="mx-auto mt-1 text-[clamp(1.85rem,5.4vw,2.85rem)] leading-[1.15] text-ink ethiopic:mt-2 ethiopic:text-[clamp(1.55rem,4.6vw,2.2rem)] ethiopic:leading-[1.35]"
          >
            {/* One name a line on phones ("One" / "& Two"), one line from tablets up. */}
            <span className="block md:inline">{names.one}</span>{" "}
            <span className="block md:inline">
              <span className={cn("me-[0.3em] text-(--slate-accent) md:ms-[0.05em]", isEthiopic(locale) ? "text-[0.8em]" : "font-script text-[1.05em]")}>&amp;</span>
              {names.two}
            </span>
          </h2>
          <Divider className="mt-6" style={order(3)} />

          <p data-reveal="up" style={order(4)} className="mt-7 text-ink-soft italic ethiopic:not-italic">
            {hosts}
          </p>
          <p
            data-reveal="up"
            style={order(5)}
            className="mx-auto mt-3 max-w-[44ch] text-[clamp(1.15rem,2.6vw,1.3rem)] leading-relaxed ethiopic:text-[clamp(1.05rem,2.4vw,1.2rem)]"
          >
            {invitation}
          </p>
        </div>

        <div
          data-reveal-group
          className={cn(
            "mt-10 grid gap-8 border-t border-rule pt-9 sm:gap-6",
            firstVenue && "sm:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)]",
          )}
        >
          <div data-reveal="up">
            <Fact icon={<CalendarDays className="size-[1.15rem]" />} label={ts("when")}>
              <p className="font-display text-[1.3rem] leading-snug lining-nums ethiopic:text-[1.2rem]">
                {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
              </p>
              <p lang={usesEthiopianCalendar(locale) ? "en" : "am"} className="mt-0.5 text-base text-ink-soft">
                {otherDate}
              </p>
              <p className="mt-0.5 text-base text-ink-soft lining-nums">{formatWeddingTime(couple.weddingAt, couple.timezone, locale)}</p>
            </Fact>
          </div>
          {firstVenue ? (
            <>
              <span aria-hidden className="hidden bg-rule sm:block" />
              <div data-reveal="up" style={order(1)}>
                <Fact icon={<MapPin className="size-[1.15rem]" />} label={ts("where")}>
                  <p className="font-display text-[1.3rem] leading-snug ethiopic:text-[1.2rem]">{venueName}</p>
                  {venueAddress ? <p className="mt-0.5 text-base text-ink-soft">{venueAddress}</p> : null}
                  {!venueAddress && city ? <p className="mt-0.5 text-base text-ink-soft">{city}</p> : null}
                </Fact>
              </div>
            </>
          ) : null}
        </div>

        {dressCode ? (
          <p data-reveal="up" className="mx-auto mt-9 max-w-[44ch] rounded-2xl bg-paper px-5 py-4 text-base">
            <span className={cn(slateEyebrow, "mb-1 block text-ink-soft")}>{t("dressCode")}</span>
            {dressCode}
          </p>
        ) : null}
      </div>
    </section>
  );
}
