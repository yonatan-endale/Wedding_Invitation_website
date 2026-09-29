import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { Countdown } from "../../countdown";
import { SectionHeading } from "../../primitives";

export async function EditorialCountdown({ site }: { site: SiteData }) {
  const t = await getTranslations("countdown");
  return (
    <section aria-labelledby="countdown-heading" className="border-t border-rule px-5 py-16 sm:py-24">
      <SectionHeading id="countdown-heading" className="text-center">
        {t("heading")}
      </SectionHeading>
      <div className="mt-8">
        <Countdown target={site.couple.weddingAt} serverNow={new Date().toISOString()} captionId="countdown-caption" />
      </div>
    </section>
  );
}
