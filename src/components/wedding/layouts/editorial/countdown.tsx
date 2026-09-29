import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import type { Locale } from "@/lib/localized";
import { Countdown } from "../../countdown";
import { EthiopianCalendar } from "../../ethiopian-calendar";
import { SectionHeading } from "../../primitives";

export async function EditorialCountdown({ site, locale }: { site: SiteData; locale: Locale }) {
  const t = await getTranslations("countdown");
  return (
    <section aria-labelledby="countdown-heading" className="border-t border-rule px-5 py-16 sm:py-24">
      <SectionHeading id="countdown-heading" className="text-center">
        {t("heading")}
      </SectionHeading>
      <EthiopianCalendar
        weddingAt={site.couple.weddingAt}
        timeZone={site.couple.timezone}
        locale={locale}
        photo={site.couple.heroPhotoUrl ? { src: site.couple.heroPhotoUrl, position: site.couple.heroPosition } : null}
        className="mt-10"
      />
      <div className="mt-12 sm:mt-14">
        <Countdown target={site.couple.weddingAt} serverNow={new Date().toISOString()} captionId="countdown-caption" />
      </div>
    </section>
  );
}
