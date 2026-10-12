import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import type { Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import styles from "./brana.module.css";
import { nameLang, scribedName, type ScribedName } from "./names";
import { GeezNumeral, Headpiece, SectionMark, order } from "./ornaments";
import { ethiopianYear } from "./year";

type Props = { site: SiteData; locale: Locale };

function FullName({ name }: { name: ScribedName }) {
  return (
    <span className="block">
      {name.geez ? (
        <span lang="am" className={cn(styles.geez, "block text-[clamp(1.6rem,5vw,2.1rem)] leading-snug")}>
          {name.geez}
        </span>
      ) : null}
      {name.latin ? (
        <span lang={nameLang(name.latin)} className={cn(name.geez ? styles.heroGloss : "block text-[clamp(1.7rem,5vw,2.3rem)] leading-tight", "block")}>
          {name.latin}
        </span>
      ) : null}
    </span>
  );
}

/**
 * The colophon, as a scribe closes a book: a harag tailpiece, the closing
 * formula, the couple's full names in rubric (Ge'ez above Latin, as on the
 * opening page), the day, and "written in the year …" with the wedding's
 * year in the Ethiopian calendar, in Ge'ez numerals with the plain figures
 * beside them. Then the families' line.
 */
export async function BranaColophon({ site, locale }: Props) {
  const tb = await getTranslations("layouts.brana");
  const t = await getTranslations("footer");
  const { couple } = site;
  const one = scribedName(couple.partnerOne, couple.partnerOneFather);
  const two = scribedName(couple.partnerTwo, couple.partnerTwoFather);
  const year = ethiopianYear(couple.weddingAt, couple.timezone);

  return (
    <footer className="relative px-4 pt-16 pb-32 sm:px-8 sm:pt-20">
      <div className="mx-auto max-w-2xl">
        <Headpiece className="mx-auto w-[min(16rem,62%)]" />
        <div data-reveal-group className={cn(styles.colophon, "mt-14 px-6 py-12 text-center sm:px-14 sm:py-14")}>
          <p data-reveal="up" className="mx-auto max-w-[30ch] font-cormorant text-[clamp(1.3rem,3.4vw,1.6rem)] leading-snug font-medium italic [&:lang(am)]:max-w-[32ch] [&:lang(am)]:text-[clamp(1.1rem,2.8vw,1.3rem)] [&:lang(am)]:leading-relaxed [&:lang(am)]:not-italic">
            {tb("colophon")}
          </p>
          <SectionMark className="mt-7 text-[1.35rem]" />
          <p data-reveal="up" style={order(1)} className={cn(styles.rubric, styles.display, "mt-6 font-medium")}>
            <FullName name={one} />
            <span className="my-2 block font-cormorant text-[1.25rem] text-ink italic [&:lang(am)]:not-italic">{locale === "am" ? "እና" : "&"}</span>
            <FullName name={two} />
          </p>
          <p data-reveal="up" style={order(2)} className="mt-8 text-base lining-nums">
            {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
          </p>
          <p data-reveal="up" style={order(3)} className="mt-2 text-base text-ink-soft">
            {tb.rich("writtenIn", {
              year: () => (
                <span className="whitespace-nowrap text-ink">
                  <GeezNumeral value={year} className="text-[1.2em]" />{" "}
                  <span aria-hidden className="text-sm text-ink-soft tabular-nums">
                    ({year})
                  </span>
                </span>
              ),
            })}
          </p>
        </div>
        <p data-reveal="up" className="mx-auto mt-10 max-w-[40ch] text-center text-base text-ink-soft">
          {t("families")}
        </p>
        <div aria-hidden className="mt-6 text-center">
          <SectionMark />
          <SectionMark className="mx-3" />
          <SectionMark />
        </div>
      </div>
    </footer>
  );
}
