import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { eyebrow } from "./shared";

type Props = { site: SiteData; locale: Locale; overlap: boolean };

/** The verse or quote on a card that rises out of the gallery band when there is one. */
export function EditorialQuote({ site, locale, overlap }: Props) {
  const text = pickText(site.couple.scripture, locale);
  if (!text) return null;
  const reference = pickText(site.couple.scriptureRef, locale);

  return (
    <section className={cn("px-5 sm:px-8", overlap ? "relative z-10 -mt-16 sm:-mt-20" : "pt-20 sm:pt-28")}>
      <figure className="mx-auto max-w-2xl border border-rule bg-sheet px-8 py-10 text-center sm:px-14 sm:py-14">
        <blockquote className={cn("text-[clamp(1.35rem,3vw,1.9rem)] leading-[1.4]", locale === "am" ? "font-display" : "italic")}>
          <p>{text}</p>
        </blockquote>
        {reference ? <figcaption className={cn(eyebrow, "mt-6")}>{reference}</figcaption> : null}
      </figure>
    </section>
  );
}
