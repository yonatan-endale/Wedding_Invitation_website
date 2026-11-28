import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import { KeylineFrame } from "@/components/wedding/kit/keyline-frame";
import { SectionHeading, WeddingImage, sectionPadding } from "@/components/wedding/primitives";
import type { SiteHonoree } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { firstGrapheme, fullName } from "@/lib/names";
import { cn } from "@/lib/utils";

type Props = {
  honorees: SiteHonoree[];
  locale: Locale;
  /**
   * "diploma": side-by-side cards with the portrait in a fine double frame, the
   * way a diploma is mounted. "arch": one per row, the portrait in an arch,
   * alternating sides. "tribute": everything centred inside a fine gold keyline
   * with corner diamonds, the portrait in an arch above the name; without a
   * portrait it is a nameplate, with no empty frame standing in for the photo.
   */
  look: "diploma" | "arch" | "tribute";
  /** Rewrites the first short line before it shows, e.g. a bare "100" as "100 years". */
  headlineText?: (headline: string) => string;
  /** Small labels before the two short lines, where they need saying ("Godparents"). */
  labels?: { headline?: string; subheadline?: string };
  className?: string;
};

/** The anchor for one honoree, so the hero can link straight to their card. */
export const honoreeAnchor = (index: number) => `honoree-${index + 1}`;

/**
 * Each person the site celebrates: portrait, name, the two short lines the
 * admin filled in (a degree and a school, say) and a few lines of their story.
 * A missing portrait shows the first letter of the name instead.
 */
export async function HonoreeSection({ honorees, locale, look, labels, headlineText, className }: Props) {
  if (honorees.length === 0) return null;
  const t = await getTranslations("honorees");

  return (
    <section id="couple" aria-labelledby="honorees-heading" className={cn(sectionPadding, className)}>
      <div className="mx-auto max-w-5xl">
        <SectionHeading id="honorees-heading" className="text-center">
          {t("heading", { count: honorees.length })}
        </SectionHeading>
        <ul
          className={cn(
            "mt-14 grid gap-14",
            look === "diploma" && honorees.length > 1 && "sm:grid-cols-2 sm:gap-x-10",
            look === "diploma" && honorees.length > 2 && "lg:grid-cols-3",
            look === "tribute" && honorees.length > 1 && "lg:grid-cols-2 lg:gap-x-10",
          )}
        >
          {honorees.map((honoree, index) => (
            <Honoree
              key={honoree.id}
              honoree={honoree}
              index={index}
              locale={locale}
              look={look}
              labels={labels}
              headlineText={headlineText}
            />
          ))}
        </ul>
      </div>
    </section>
  );
}

function Honoree({
  honoree,
  index,
  locale,
  look,
  labels,
  headlineText,
}: {
  honoree: SiteHonoree;
  index: number;
  locale: Locale;
  look: Props["look"];
  labels: Props["labels"];
  headlineText: Props["headlineText"];
}) {
  const name = fullName(honoree.name, honoree.father, locale);
  const rawHeadline = pickText(honoree.headline, locale);
  const headline = rawHeadline && headlineText ? headlineText(rawHeadline) : rawHeadline;
  const subheadline = pickText(honoree.subheadline, locale);
  const story = pickText(honoree.story, locale);
  const flip = look === "arch" && index % 2 === 1;

  const portrait = (
    <div
      className={cn(
        "relative mx-auto w-full overflow-hidden bg-rule",
        look === "diploma" ? "aspect-[4/5] max-w-sm" : "aspect-[3/4] max-w-xs rounded-t-full",
      )}
    >
      {honoree.portraitUrl ? (
        <WeddingImage
          src={honoree.portraitUrl}
          alt={name}
          fill
          sizes="(min-width: 640px) 360px, 90vw"
          className="object-cover"
          style={{ objectPosition: honoree.portraitPosition }}
        />
      ) : (
        <span aria-hidden className="absolute inset-0 grid place-items-center font-display text-[6rem] text-ink/20">
          {firstGrapheme(pickText(honoree.name, locale))}
        </span>
      )}
    </div>
  );

  if (look === "tribute") {
    return (
      <li id={honoreeAnchor(index)} data-reveal="up" style={{ "--i": index % 3 } as CSSProperties} className="scroll-mt-24">
        <KeylineFrame inset={10} double corners className="mx-auto h-full max-w-2xl">
          <div className="px-8 py-14 text-center sm:px-16 sm:py-20">
            {honoree.portraitUrl ? (
              <div className="relative mx-auto mb-10 aspect-[3/4] w-full max-w-64 overflow-hidden rounded-t-full bg-rule">
                <WeddingImage
                  src={honoree.portraitUrl}
                  alt={name}
                  fill
                  sizes="256px"
                  className="object-cover"
                  style={{ objectPosition: honoree.portraitPosition }}
                />
              </div>
            ) : null}
            <h3 className="font-display text-[clamp(2.25rem,6vw,3.25rem)] leading-[1.1]">{name}</h3>
            {headline ? (
              <p className="mt-4 font-display text-[clamp(1.375rem,3.5vw,1.75rem)] text-[color-mix(in_oklab,var(--w-metal),var(--w-ink)_45%)]">
                {labels?.headline ? <span className="block font-sans text-sm text-ink-soft">{labels.headline}</span> : null}
                {headline}
              </p>
            ) : null}
            {subheadline ? (
              <p className="mt-2 text-lg text-ink-soft">
                {labels?.subheadline ? <span className="block text-sm">{labels.subheadline}</span> : null}
                {subheadline}
              </p>
            ) : null}
            {story ? (
              <>
                <div aria-hidden className="mx-auto my-8 h-px w-14 bg-metal" />
                <p className="mx-auto max-w-[44ch] text-lg leading-relaxed whitespace-pre-line">{story}</p>
              </>
            ) : null}
          </div>
        </KeylineFrame>
      </li>
    );
  }

  return (
    <li
      id={honoreeAnchor(index)}
      data-reveal="up"
      style={{ "--i": index % 3 } as CSSProperties}
      className={cn(
        "scroll-mt-24",
        look === "arch" && "grid items-center gap-8 sm:grid-cols-2 sm:gap-14",
      )}
    >
      <div className={cn(look === "diploma" && "border border-metal/60 p-2 outline outline-1 outline-offset-4 outline-metal/30", flip && "sm:order-2")}>
        {portrait}
      </div>
      <div className={cn("text-center", look === "diploma" ? "mt-8" : "sm:text-start")}>
        <h3 className="font-display text-[clamp(1.875rem,4vw,2.5rem)] leading-tight">{name}</h3>
        {headline ? <p className="mt-3 font-display text-lg text-[color-mix(in_oklab,var(--w-metal),var(--w-ink)_45%)] italic ethiopic:not-italic">
            {labels?.headline ? <span className="block font-sans text-sm text-ink-soft not-italic">{labels.headline}</span> : null}
            {headline}
          </p> : null}
        {subheadline ? (
          <p className="mt-1 text-ink-soft">
            {labels?.subheadline ? <span className="block text-sm">{labels.subheadline}</span> : null}
            {subheadline}
          </p>
        ) : null}
        {story ? <p className="mx-auto mt-5 max-w-[42ch] text-base leading-relaxed whitespace-pre-line sm:mx-0">{story}</p> : null}
      </div>
    </li>
  );
}
