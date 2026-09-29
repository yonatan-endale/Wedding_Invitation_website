import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import type { Locale } from "@/lib/localized";
import { formatWeddingDate } from "@/lib/wedding-format";
import type { GalleryPhoto } from "../../lightbox";
import { SectionHeading, WeddingImage } from "../../primitives";
import { RsvpForm } from "../../rsvp-form";

type Props = { site: SiteData; locale: Locale; photos: GalleryPhoto[] };

/** The RSVP form on a dark panel over a photo: the first gallery photo, else the cover. */
export async function EditorialRsvp({ site, locale, photos }: Props) {
  const { couple } = site;
  if (!couple.rsvpEnabled) return null;
  const t = await getTranslations("rsvp");
  const deadline = couple.rsvpDeadline;
  const closed = deadline !== null && new Date(deadline).getTime() < Date.now();
  const background = photos[0]?.url ?? couple.heroPhotoUrl;

  return (
    <section id="rsvp" aria-labelledby="rsvp-heading" className="relative isolate overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      {background ? (
        <WeddingImage src={background} alt="" fill sizes="100vw" className="-z-20 object-cover" />
      ) : (
        <div aria-hidden className="absolute inset-0 -z-20 bg-thread-1" />
      )}
      <div aria-hidden className="absolute inset-0 -z-10 bg-ink/35" />
      <div className="mx-auto max-w-6xl">
        <div className="ml-auto max-w-2xl bg-ink/85 px-6 py-12 text-paper backdrop-blur-sm sm:px-12 sm:py-14">
          <SectionHeading id="rsvp-heading">{t("heading")}</SectionHeading>
          {closed ? (
            <p className="mt-6 opacity-80">{t("closed")}</p>
          ) : (
            <>
              <p className="mt-5 opacity-80">
                {t("intro")}
                {deadline ? (
                  <span className="block">{t("replyBy", { date: formatWeddingDate(deadline, couple.timezone, locale) })}</span>
                ) : null}
              </p>
              <RsvpForm slug={couple.slug} tone="dark" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
