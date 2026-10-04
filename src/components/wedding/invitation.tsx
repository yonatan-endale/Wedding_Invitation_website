import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { fullName } from "@/lib/names";
import { cn } from "@/lib/utils";
import { formatGregorianDate, formatWeddingDate, formatWeddingTime } from "@/lib/wedding-format";
import { Band, SectionHeading, WeddingImage, sectionPadding } from "./primitives";

type Props = { site: SiteData; locale: Locale };

export async function InvitationCard({ site, locale }: Props) {
  const t = await getTranslations("invitation");
  const { couple, venues } = site;
  const one = fullName(couple.partnerOne, couple.partnerOneFather, locale);
  const two = fullName(couple.partnerTwo, couple.partnerTwoFather, locale);
  const hosts = pickText(couple.hosts, locale) || t("hostsFallback");
  const invitation = pickText(couple.invitation, locale) || t("defaultText");
  const dressCode = pickText(couple.dressCode, locale);
  const firstVenue = venues[0];

  return (
    <section id="invitation" aria-labelledby="invitation-names" className={sectionPadding}>
      <div className="mx-auto max-w-2xl border border-rule bg-sheet text-center">
        <Band variant={couple.border} reveal />
        {/* The lines rise one after another, and the gold rule draws between the words and the day. */}
        <div data-reveal-group className="px-6 py-14 sm:px-16 sm:py-20">
          {couple.heroPhotoUrl ? (
            <div
              data-reveal="scale"
              className="mx-auto mb-8 size-28 rounded-full bg-sheet p-1 ring-2 ring-thread-2 sm:size-36"
            >
              <div className="relative size-full overflow-hidden rounded-full bg-rule">
                <WeddingImage
                  src={couple.heroPhotoUrl}
                  alt={`${one} & ${two}`}
                  fill
                  sizes="144px"
                  className="object-cover"
                  style={{ objectPosition: couple.heroPosition }}
                />
              </div>
            </div>
          ) : null}
          <p data-reveal="up" style={{ "--i": 1 } as CSSProperties} className="text-ink-soft">
            {hosts}
          </p>
          <h2
            id="invitation-names"
            data-reveal="up"
            style={{ "--i": 2 } as CSSProperties}
            className="mt-8 font-display text-[clamp(2.5rem,7vw,4rem)] leading-none"
          >
            {one}
            <span className="mx-3 inline-block align-[0.12em] text-[0.55em]">&amp;</span>
            {two}
          </h2>
          <p data-reveal="up" style={{ "--i": 3 } as CSSProperties} className="mx-auto mt-8 max-w-[46ch]">
            {invitation}
          </p>

          <div
            data-reveal="rule"
            style={{ "--i": 4 } as CSSProperties}
            className="mx-auto my-12 h-px w-16 bg-thread-2"
            aria-hidden
          />

          <p
            data-reveal="up"
            style={{ "--i": 5 } as CSSProperties}
            className="font-display text-[clamp(1.5rem,4vw,2.125rem)] leading-tight"
          >
            {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
          </p>
          {locale === "am" ? (
            <p data-reveal="up" style={{ "--i": 6 } as CSSProperties} className="mt-1 text-base text-ink-soft">
              {formatGregorianDate(couple.weddingAt, couple.timezone)}
            </p>
          ) : null}
          <p data-reveal="up" style={{ "--i": 6 } as CSSProperties} className="mt-3 text-xl">
            {formatWeddingTime(couple.weddingAt, couple.timezone, locale)}
          </p>

          {firstVenue ? (
            <p data-reveal="up" style={{ "--i": 7 } as CSSProperties} className="mt-8">
              {pickText(firstVenue.name, locale)}
              {firstVenue.address ? (
                <span className="block text-ink-soft">{pickText(firstVenue.address, locale)}</span>
              ) : null}
            </p>
          ) : null}

          {dressCode ? (
            <p data-reveal="up" style={{ "--i": 8 } as CSSProperties} className="mx-auto mt-10 max-w-[40ch] text-base">
              <span className="block text-ink-soft">{t("dressCode")}</span>
              {dressCode}
            </p>
          ) : null}
        </div>
        <Band variant={couple.border} reveal />
      </div>
    </section>
  );
}

export async function StorySection({ site, locale }: Props) {
  const story = pickText(site.couple.story, locale);
  if (!story) return null;
  const t = await getTranslations("story");
  const paragraphs = story
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section id="story" aria-labelledby="story-heading" className={cn(sectionPadding, "border-t border-rule")}>
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-16">
        {/* The heading is pinned on wide screens, so only the paragraphs beside it move. */}
        <SectionHeading id="story-heading" reveal={false} className="self-start md:sticky md:top-28">
          {t("heading")}
        </SectionHeading>
        <div data-reveal-group className="max-w-[62ch] space-y-6">
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              data-reveal="up"
              style={{ "--i": Math.min(index, 6) } as CSSProperties}
              className={cn("whitespace-pre-line", index === 0 && "text-[1.3em] leading-[1.55]")}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ScriptureSection({ site, locale }: Props) {
  const text = pickText(site.couple.scripture, locale);
  if (!text) return null;
  const reference = pickText(site.couple.scriptureRef, locale);

  return (
    <section className="bg-thread-1 px-5 py-20 text-on-thread-1 sm:px-8 sm:py-28">
      <figure data-reveal-group className="mx-auto max-w-3xl text-center">
        <blockquote
          data-reveal="fade"
          className={cn(
            "text-[clamp(1.6rem,4.2vw,2.6rem)] leading-[1.35]",
            locale === "am" ? "font-display" : "italic",
          )}
        >
          <p>{text}</p>
        </blockquote>
        {reference ? (
          <figcaption data-reveal="up" style={{ "--i": 4 } as CSSProperties} className="mt-8 text-lg text-on-thread-1/80">
            {reference}
          </figcaption>
        ) : null}
      </figure>
    </section>
  );
}
