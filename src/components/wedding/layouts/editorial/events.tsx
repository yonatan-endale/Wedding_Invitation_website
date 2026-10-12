import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import { SectionHeading, sectionPadding } from "../../primitives";
import { ScheduleTimeline } from "../../schedule";

type Props = { site: SiteData; locale: Locale };

/**
 * The day's events on the same timeline as the Classic layout, under a centred
 * heading, with the dress code after. The timeline brings its own motion; the
 * date and the dress code rise in around it.
 */
export async function EditorialEvents({ site, locale }: Props) {
  const { couple, events } = site;
  if (events.length === 0) return null;
  const [t, ti] = await Promise.all([getTranslations("schedule"), getTranslations("invitation")]);
  const dressCode = pickText(couple.dressCode, locale);

  return (
    <section id="schedule" aria-labelledby="schedule-heading" className={cn(sectionPadding, "border-t border-rule")}>
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <SectionHeading id="schedule-heading">{t("heading")}</SectionHeading>
          <p data-reveal="up" style={{ "--i": 1 } as CSSProperties} className="mt-3 text-ink-soft">
            {formatWeddingDate(couple.weddingAt, couple.timezone, locale)}
          </p>
        </div>

        <ScheduleTimeline site={site} locale={locale} className="mx-auto mt-14 max-w-xl" />

        {dressCode ? (
          <p data-reveal="up" className="mx-auto mt-12 max-w-[40ch] text-center">
            <span className="block text-ink-soft">{ti("dressCode")}</span>
            {dressCode}
          </p>
        ) : null}
      </div>
    </section>
  );
}
