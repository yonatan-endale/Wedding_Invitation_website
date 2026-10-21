import type { CSSProperties, ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale, usesEthiopianCalendar } from "@/lib/localized";
import { fullName } from "@/lib/names";
import { cn } from "@/lib/utils";
import { formatGregorianDate, formatWeddingDate, formatWeddingTime } from "@/lib/wedding-format";
import { creditCaps } from "./shared";
import styles from "./reel.module.css";

type Props = { site: SiteData; locale: Locale };

/**
 * The invitation set like a film's credits: the hosts' line, the couple's
 * full names, the invitation, then the date, time and first venue as credit
 * rows, a label right of centre and the value left of it. Each line fades in
 * after the last; at the rich level the column also rolls up once. All of it
 * is ordinary text in the page, readable at every motion level.
 */
export async function ReelInvitation({ site, locale }: Props) {
  const [t, tr] = await Promise.all([getTranslations("invitation"), getTranslations("layouts.reel")]);
  const { couple, venues } = site;
  const one = fullName(couple.partnerOne, couple.partnerOneFather, locale);
  const two = fullName(couple.partnerTwo, couple.partnerTwoFather, locale);
  const hosts = pickText(couple.hosts, locale) || t("hostsFallback");
  const invitation = pickText(couple.invitation, locale) || t("defaultText");
  const dressCode = pickText(couple.dressCode, locale);
  const venue = venues[0];
  const venueName = venue ? pickText(venue.name, locale) : "";
  const venueAddress = venue ? pickText(venue.address, locale) : "";

  return (
    <section
      id="invitation"
      aria-labelledby="invitation-names"
      className="relative overflow-clip px-5 py-24 sm:px-8 sm:py-36"
    >
      {/* The screen's edges darken a little, as on a projected picture. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_55%,rgba(0,0,0,0.35)_100%)]"
      />
      <div data-reveal-group className="relative mx-auto max-w-3xl text-center">
        <div className={styles.roll}>
          <p data-reveal="fade" className={cn(creditCaps, "text-metal")}>
            {t("eyebrow")}
          </p>
          <p data-reveal="fade" style={{ "--i": 1 } as CSSProperties} className="mx-auto mt-10 max-w-[40ch] text-ink-soft">
            {hosts}
          </p>
          <h2
            id="invitation-names"
            data-reveal="fade"
            style={{ "--i": 2 } as CSSProperties}
            className="mt-10 font-display text-[clamp(2.25rem,6.5vw,4.25rem)] leading-[1.08]"
          >
            <span className="block">{one}</span>
            <span className="my-3 block text-[0.45em] leading-none text-metal">&amp;</span>
            <span className="block">{two}</span>
          </h2>
          <p data-reveal="fade" style={{ "--i": 3 } as CSSProperties} className="mx-auto mt-10 max-w-[44ch] text-[1.1em]">
            {invitation}
          </p>

          <span
            aria-hidden
            data-reveal="rule"
            style={{ "--i": 4 } as CSSProperties}
            className="mx-auto mt-14 mb-12 block h-px w-20 bg-metal/70"
          />

          <dl className="space-y-7 sm:space-y-5">
            <CreditRow index={5} label={tr("date")}>
              {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
              {usesEthiopianCalendar(locale) ? (
                <span className="block text-ink-soft">{formatGregorianDate(couple.weddingAt, couple.timezone)}</span>
              ) : null}
            </CreditRow>
            <CreditRow index={6} label={tr("time")}>
              {formatWeddingTime(couple.weddingAt, couple.timezone, locale)}
            </CreditRow>
            {venueName ? (
              <CreditRow index={7} label={tr("venue")}>
                {venueName}
                {venueAddress ? <span className="block text-ink-soft">{venueAddress}</span> : null}
              </CreditRow>
            ) : null}
            {dressCode ? (
              <CreditRow index={8} label={t("dressCode")}>
                {dressCode}
              </CreditRow>
            ) : null}
          </dl>
        </div>
      </div>
    </section>
  );
}

/**
 * One credit: on wide screens the label sits right-aligned left of the
 * centre line and the value left-aligned right of it, as in end credits;
 * on phones they stack, centred.
 */
export function CreditRow({ label, children, index }: { label: string; children: ReactNode; index: number }) {
  return (
    <div
      data-reveal="fade"
      style={{ "--i": index } as CSSProperties}
      className="grid gap-1.5 sm:grid-cols-2 sm:items-baseline sm:gap-8"
    >
      <dt className={cn(creditCaps, "text-ink-soft sm:text-end")}>{label}</dt>
      <dd className="text-[1.05em] leading-snug sm:text-start">{children}</dd>
    </div>
  );
}
