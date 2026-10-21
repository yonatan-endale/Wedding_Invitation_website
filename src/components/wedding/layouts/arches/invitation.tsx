import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale, usesEthiopianCalendar } from "@/lib/localized";
import { fullName } from "@/lib/names";
import { cn } from "@/lib/utils";
import { formatGregorianDate, formatWeddingDate, formatWeddingTime } from "@/lib/wedding-format";
import { ArchMark, ArchOutline, Diamond, eyebrow } from "./ornaments";

type Props = { site: SiteData; locale: Locale };

const step = (index: number) => ({ "--i": index }) as CSSProperties;

/**
 * The formal invitation inside a tall gold-outlined arch, with the same
 * content as the shared InvitationCard: hosts, full names, the invitation,
 * date and time, the first venue and the dress code. The head of the arch
 * holds the arch mark and the eyebrow; the text starts below its shoulders.
 */
export async function ArchesInvitation({ site, locale }: Props) {
  const t = await getTranslations("invitation");
  const { couple, venues } = site;
  const one = fullName(couple.partnerOne, couple.partnerOneFather, locale);
  const two = fullName(couple.partnerTwo, couple.partnerTwoFather, locale);
  const hosts = pickText(couple.hosts, locale) || t("hostsFallback");
  const invitation = pickText(couple.invitation, locale) || t("defaultText");
  const dressCode = pickText(couple.dressCode, locale);
  const firstVenue = venues[0];

  return (
    <section id="invitation" aria-labelledby="invitation-names" className="px-5 pt-20 pb-4 sm:px-8 sm:pt-28 sm:pb-8">
      <div className="relative mx-auto max-w-[36rem] text-center">
        <ArchOutline />
        {/* Top padding in % of the width keeps the first lines inside the arch's head at any size. */}
        <div data-reveal-group className="relative px-6 pt-[17%] pb-14 sm:px-14 sm:pb-16">
          <ArchMark />
          <p data-reveal="fade" style={step(1)} className={cn(eyebrow, "mt-5")}>
            {t("eyebrow")}
          </p>
          <p data-reveal="up" style={step(2)} className="mt-8 text-ink-soft">
            {hosts}
          </p>
          <h2
            id="invitation-names"
            data-reveal="up"
            style={step(3)}
            className="mt-6 font-cormorant text-[clamp(2.4rem,8vw,3.6rem)] leading-[1.02] font-light ethiopic:text-[clamp(2rem,6.5vw,2.9rem)] ethiopic:leading-[1.2]"
          >
            <span className="block">{one}</span>
            <span className="my-1 block text-[0.55em] text-ink-soft italic">&amp;</span>
            <span className="block">{two}</span>
          </h2>
          <p data-reveal="up" style={step(4)} className="mx-auto mt-7 max-w-[40ch]">
            {invitation}
          </p>

          <div data-reveal="rule" style={step(5)} aria-hidden className="mx-auto my-10 flex w-28 items-center gap-2">
            <span className="h-px flex-1 bg-metal/70" />
            <Diamond className="size-[6px]" />
            <span className="h-px flex-1 bg-metal/70" />
          </div>

          <p
            data-reveal="up"
            style={step(6)}
            className="font-cormorant text-[clamp(1.6rem,5vw,2.1rem)] leading-tight font-medium lining-nums ethiopic:text-[clamp(1.35rem,4.4vw,1.75rem)]"
          >
            {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
          </p>
          {usesEthiopianCalendar(locale) ? (
            <p data-reveal="up" style={step(7)} className="mt-1 text-base text-ink-soft">
              {formatGregorianDate(couple.weddingAt, couple.timezone)}
            </p>
          ) : null}
          <p data-reveal="up" style={step(7)} className="mt-2 text-lg">
            {formatWeddingTime(couple.weddingAt, couple.timezone, locale)}
          </p>

          {firstVenue ? (
            <p data-reveal="up" style={step(8)} className="mt-7">
              {pickText(firstVenue.name, locale)}
              {firstVenue.address ? (
                <span className="block text-base text-ink-soft">{pickText(firstVenue.address, locale)}</span>
              ) : null}
            </p>
          ) : null}

          {dressCode ? (
            <p data-reveal="up" style={step(9)} className="mx-auto mt-8 max-w-[38ch] text-base">
              <span className={cn(eyebrow, "mb-1 block")}>{t("dressCode")}</span>
              {dressCode}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
