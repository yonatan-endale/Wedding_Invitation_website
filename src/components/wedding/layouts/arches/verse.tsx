import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale, isEthiopic } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { Diamond, eyebrow } from "./ornaments";

type Props = { site: SiteData; locale: Locale };

/** The couple's verse or quote in large Cormorant between two gold rules, on the open page. */
export function ArchesVerse({ site, locale }: Props) {
  const text = pickText(site.couple.scripture, locale);
  if (!text) return null;
  const reference = pickText(site.couple.scriptureRef, locale);

  return (
    <section className="px-5 py-16 sm:px-8 sm:py-20">
      <figure data-reveal-group className="mx-auto max-w-3xl text-center">
        <div data-reveal="rule" aria-hidden className="mx-auto flex w-40 items-center gap-2">
          <span className="h-px flex-1 bg-metal/70" />
          <Diamond className="size-[6px]" />
          <span className="h-px flex-1 bg-metal/70" />
        </div>
        <blockquote
          data-reveal="fade"
          style={{ "--i": 1 } as CSSProperties}
          className={cn(
            "mt-10 font-cormorant text-[clamp(1.6rem,4.4vw,2.5rem)] leading-[1.35]",
            isEthiopic(locale) ? "text-[clamp(1.35rem,3.6vw,2rem)] leading-[1.6]" : "font-light italic",
          )}
        >
          <p>{text}</p>
        </blockquote>
        {reference ? (
          <figcaption data-reveal="up" style={{ "--i": 3 } as CSSProperties} className={cn(eyebrow, "mt-8")}>
            {reference}
          </figcaption>
        ) : null}
      </figure>
    </section>
  );
}
