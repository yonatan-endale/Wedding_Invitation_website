import { getTranslations } from "next-intl/server";
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
        <Band variant={couple.border} />
        <div className="px-6 py-14 sm:px-16 sm:py-20">
          {couple.heroPhotoUrl ? (
            <div className="mx-auto mb-8 size-28 rounded-full bg-sheet p-1 ring-2 ring-thread-2 sm:size-36">
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
          <p className="text-ink-soft">{hosts}</p>
          <h2 id="invitation-names" className="mt-8 font-display text-[clamp(2.5rem,7vw,4rem)] leading-none">
            {one}
            <span className="mx-3 inline-block align-[0.12em] text-[0.55em]">&amp;</span>
            {two}
          </h2>
          <p className="mx-auto mt-8 max-w-[46ch]">{invitation}</p>

          <div className="mx-auto my-12 h-px w-16 bg-thread-2" aria-hidden />

          <p className="font-display text-[clamp(1.5rem,4vw,2.125rem)] leading-tight">
            {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
          </p>
          {locale === "am" ? (
            <p className="mt-1 text-base text-ink-soft">{formatGregorianDate(couple.weddingAt, couple.timezone)}</p>
          ) : null}
          <p className="mt-3 text-xl">{formatWeddingTime(couple.weddingAt, couple.timezone, locale)}</p>

          {firstVenue ? (
            <p className="mt-8">
              {pickText(firstVenue.name, locale)}
              {firstVenue.address ? (
                <span className="block text-ink-soft">{pickText(firstVenue.address, locale)}</span>
              ) : null}
            </p>
          ) : null}

          {dressCode ? (
            <p className="mx-auto mt-10 max-w-[40ch] text-base">
              <span className="block text-ink-soft">{t("dressCode")}</span>
              {dressCode}
            </p>
          ) : null}
        </div>
        <Band variant={couple.border} />
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
        <SectionHeading id="story-heading" className="self-start md:sticky md:top-28">
          {t("heading")}
        </SectionHeading>
        <div className="max-w-[62ch] space-y-6">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={cn("whitespace-pre-line", index === 0 && "text-[1.3em] leading-[1.55]")}>
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
      <figure className="mx-auto max-w-3xl text-center">
        <blockquote
          className={cn(
            "text-[clamp(1.6rem,4.2vw,2.6rem)] leading-[1.35]",
            locale === "am" ? "font-display" : "italic",
          )}
        >
          <p>{text}</p>
        </blockquote>
        {reference ? <figcaption className="mt-8 text-lg opacity-80">{reference}</figcaption> : null}
      </figure>
    </section>
  );
}
