import { Fragment } from "react";
import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { WeddingImage, sectionPadding } from "../../primitives";
import { eyebrow } from "./shared";

type Props = { site: SiteData; locale: Locale };

/** Oval portraits with the bride and groom captions. Hidden until at least one portrait is set. */
export async function EditorialCouple({ site, locale }: Props) {
  const { couple } = site;
  const partners = [
    {
      key: "one",
      portrait: couple.partnerOnePortraitUrl,
      name: pickText(couple.partnerOneNick, locale) || pickText(couple.partnerOne, locale),
      role: couple.partnerOneRole,
    },
    {
      key: "two",
      portrait: couple.partnerTwoPortraitUrl,
      name: pickText(couple.partnerTwoNick, locale) || pickText(couple.partnerTwo, locale),
      role: couple.partnerTwoRole,
    },
  ].filter((partner): partner is typeof partner & { portrait: string } => Boolean(partner.portrait));
  if (partners.length === 0) return null;
  const t = await getTranslations("couple");

  return (
    <section id="couple" aria-labelledby="couple-heading" className={cn(sectionPadding, "border-t border-rule")}>
      <h2 id="couple-heading" className="sr-only">
        {t("heading")}
      </h2>
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-10 sm:flex-row sm:items-start sm:gap-6 md:gap-12">
        {partners.map((partner, index) => (
          <Fragment key={partner.key}>
            {index > 0 ? (
              <span aria-hidden className="font-display text-[clamp(4rem,10vw,7rem)] leading-none sm:self-center">
                &amp;
              </span>
            ) : null}
            <figure className="w-64 text-center">
              <div className="relative mx-auto aspect-[4/5] w-52 overflow-hidden rounded-[50%] bg-rule ring-1 ring-thread-2 ring-offset-8 ring-offset-paper sm:w-56">
                <WeddingImage src={partner.portrait} alt={partner.name} fill sizes="224px" className="object-cover" />
              </div>
              <figcaption className="mt-8">
                <p className="font-display text-3xl leading-tight">{partner.name}</p>
                <p className={cn(eyebrow, "mt-2")}>{t(partner.role)}</p>
              </figcaption>
            </figure>
          </Fragment>
        ))}
      </div>
    </section>
  );
}
