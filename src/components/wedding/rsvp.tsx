import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import type { Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import { SectionHeading, sectionPadding } from "./primitives";
import { RsvpForm } from "./rsvp-form";

type Props = { site: SiteData; locale: Locale };

export async function RsvpSection({ site, locale }: Props) {
  const { couple } = site;
  if (!couple.rsvpEnabled) return null;
  const t = await getTranslations("rsvp");
  const deadline = couple.rsvpDeadline;
  const closed = deadline !== null && new Date(deadline).getTime() < Date.now();

  return (
    <section id="rsvp" aria-labelledby="rsvp-heading" className={cn(sectionPadding, "border-t border-rule bg-sheet")}>
      <div className="mx-auto max-w-xl">
        <SectionHeading id="rsvp-heading" className="text-center">
          {t("heading")}
        </SectionHeading>
        {closed ? (
          <p className="mt-6 text-center text-ink-soft">{t("closed")}</p>
        ) : (
          <>
            <p className="mt-5 text-center text-ink-soft">
              {t("intro")}
              {deadline ? (
                <span className="block">{t("replyBy", { date: formatWeddingDate(deadline, couple.timezone, locale) })}</span>
              ) : null}
            </p>
            <RsvpForm slug={couple.slug} />
          </>
        )}
      </div>
    </section>
  );
}
