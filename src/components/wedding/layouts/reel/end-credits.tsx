import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatGregorianDate, formatWeddingDate } from "@/lib/wedding-format";
import type { SiteNames } from "../types";
import { CreditRow } from "./credits";
import { creditCaps } from "./shared";
import styles from "./reel.module.css";

type Props = { site: SiteData; locale: Locale; names: SiteNames };

/**
 * End credits on black: who stars, when and where, who hosts, and the last
 * card, "And so it begins". The lines fade in one after another; only at the
 * rich level does the column also roll up, once.
 */
export async function ReelEndCredits({ site, locale, names }: Props) {
  const [tr, tf] = await Promise.all([getTranslations("layouts.reel"), getTranslations("footer")]);
  const { couple } = site;
  const hosts = pickText(couple.hosts, locale) || tf("families");
  const venues = site.venues.map((venue) => ({ id: venue.id, name: pickText(venue.name, locale) })).filter((venue) => venue.name);

  return (
    <footer className="relative overflow-clip bg-black px-5 pt-28 pb-36 text-center text-ink sm:px-8 sm:pt-36 sm:pb-44">
      <span aria-hidden className={cn(styles.grain, "absolute inset-0 opacity-[0.1]")} />
      <div data-reveal-group className="relative mx-auto max-w-3xl">
        <div className={styles.roll}>
          <p data-reveal="fade" className={cn(creditCaps, "text-metal")}>
            {tr("starring")}
          </p>
          <p
            data-reveal="fade"
            style={{ "--i": 1 } as CSSProperties}
            className="mt-6 font-display text-[clamp(1.75rem,4.5vw,2.75rem)] leading-[1.15]"
          >
            <span className="block">{names.one}</span>
            <span className="my-1 block text-[0.5em] text-metal">&amp;</span>
            <span className="block">{names.two}</span>
          </p>

          <dl className="mt-16 space-y-7 sm:space-y-5">
            <CreditRow index={2} label={tr("date")}>
              {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
              {locale === "am" ? (
                <span className="block text-ink-soft">{formatGregorianDate(couple.weddingAt, couple.timezone)}</span>
              ) : null}
            </CreditRow>
            {venues.length > 0 ? (
              <CreditRow index={3} label={venues.length > 1 ? tr("locations") : tr("venue")}>
                {venues.map((venue) => (
                  <span key={venue.id} className="block">
                    {venue.name}
                  </span>
                ))}
              </CreditRow>
            ) : null}
          </dl>

          <p data-reveal="fade" style={{ "--i": 4 } as CSSProperties} className="mx-auto mt-16 max-w-[52ch] text-ink-soft">
            {hosts}
          </p>

          <span
            aria-hidden
            data-reveal="rule"
            style={{ "--i": 5 } as CSSProperties}
            className="mx-auto my-16 block h-px w-20 bg-metal/60"
          />

          <p
            data-reveal="fade"
            style={{ "--i": 6 } as CSSProperties}
            className="font-display text-[clamp(2.5rem,8vw,5rem)] leading-[1.05] text-[color-mix(in_oklab,var(--w-metal)_60%,white)]"
          >
            {tr("ending")}
          </p>
        </div>
      </div>
    </footer>
  );
}
