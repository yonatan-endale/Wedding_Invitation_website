import { ArrowUp } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { getOrnament } from "@/lib/appearance";
import { LAYOUTS } from "@/lib/layout";
import { pickText, type Locale, isEthiopic } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import { FaithOrnament } from "../../ornaments/faith-ornament";
import { Band } from "../../primitives";
import { sectionLinks } from "../../site-links";
import type { SiteNames } from "../types";
import { DateAndPlace, Divider, Kicker, order, slateEyebrow } from "./kit";
import styles from "./slate.module.css";

type Props = { site: SiteData; locale: Locale; names: SiteNames };

/**
 * The close, on the deep band under the couple's border: their faith
 * ornament if they chose one, a script "Thank you", the names, the day and
 * the city, their verse if they gave one, small links to the sections that
 * are on the page, and a last line signed with their names.
 */
export async function SlateFooter({ site, locale, names }: Props) {
  const t = await getTranslations("layouts.slate");
  const tNav = await getTranslations("nav");
  const { couple } = site;
  const city = pickText(couple.city, locale);
  const scripture = pickText(couple.scripture, locale);
  const reference = pickText(couple.scriptureRef, locale);
  // The same links as the header, so every one points at a section that renders.
  const links = sectionLinks(site, locale, (key) => tNav(key), LAYOUTS.slate);

  return (
    <footer className={cn(styles.onBand, "relative isolate overflow-hidden")}>
      <Band variant={couple.border} />
      <div data-reveal-group className="mx-auto max-w-3xl px-5 pt-16 pb-28 text-center sm:pt-20">
        <FaithOrnament ornament={getOrnament(couple.ornament)} className="mx-auto mb-6 size-9 sm:size-10" />
        <Kicker locale={locale}>{t("kicker.thanks")}</Kicker>
        <p
          data-reveal="up"
          style={order(1)}
          className="mt-1 font-display text-[clamp(2rem,6vw,3.1rem)] leading-[1.15] ethiopic:mt-2 ethiopic:text-[clamp(1.6rem,5vw,2.4rem)] ethiopic:leading-[1.35]"
        >
          {names.firstOne}
          <span className={cn("mx-[0.28em] text-(--slate-glow)", isEthiopic(locale) ? "text-[0.75em]" : "font-script text-[1.05em]")}>&amp;</span>
          {names.firstTwo}
        </p>
        <div data-reveal="up" style={order(2)}>
          <DateAndPlace date={formatWeddingDate(couple.weddingAt, couple.timezone, locale)} city={city} className="mt-4 text-(--slate-glow)" />
        </div>

        {scripture ? (
          <figure data-reveal="up" style={order(3)} className="mx-auto mt-10 max-w-[46ch]">
            <blockquote
              className={cn(
                "text-[clamp(1.1rem,2.8vw,1.3rem)] leading-relaxed text-ink-soft",
                isEthiopic(locale) ? "font-display" : "italic",
              )}
            >
              <p>{scripture}</p>
            </blockquote>
            {reference ? <figcaption className={cn(slateEyebrow, "mt-4 text-(--slate-glow)")}>{reference}</figcaption> : null}
          </figure>
        ) : null}

        <Divider className="mt-12" style={order(4)} />

        {links.length > 0 ? (
          <nav aria-label={t("footerNav")} data-reveal="up" style={order(5)} className="mt-9">
            <ul className="flex flex-wrap justify-center gap-x-1 gap-y-1">
              {links.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className={cn(slateEyebrow, "inline-flex min-h-11 items-center rounded-full px-3.5 text-ink-soft transition-colors hover:bg-white/10 hover:text-ink")}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div data-reveal="up" style={order(6)} className="mt-10 flex flex-col items-center gap-4 border-t border-rule pt-8">
          <p className="text-base text-ink-soft">{t("signature", { one: names.firstOne, two: names.firstTwo })}</p>
          <a
            href="#top"
            className={cn(slateEyebrow, "inline-flex min-h-11 items-center gap-2 rounded-full border border-rule px-4 text-ink-soft transition-colors hover:border-ink hover:text-ink")}
          >
            <ArrowUp aria-hidden className="size-3.5" />
            {t("backToTop")}
          </a>
        </div>
      </div>
    </footer>
  );
}
