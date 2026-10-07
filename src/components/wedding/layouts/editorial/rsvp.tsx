import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import type { Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import type { GalleryPhoto } from "../../lightbox";
import { SectionHeading, WeddingImage } from "../../primitives";
import { RsvpForm } from "../../rsvp-form";

type Props = { site: SiteData; locale: Locale; photos: GalleryPhoto[] };

/** Split RSVP: a photo on one side (the first gallery photo, else the cover), the form on a dark panel on the other. */
export async function EditorialRsvp({ site, locale, photos }: Props) {
  const { couple } = site;
  if (!couple.rsvpEnabled) return null;
  const t = await getTranslations("rsvp");
  const deadline = couple.rsvpDeadline;
  const closed = deadline !== null && new Date(deadline).getTime() < Date.now();
  const galleryPhoto = photos[0]?.url;
  const background = galleryPhoto ?? couple.heroPhotoUrl;

  return (
    <section id="rsvp" aria-labelledby="rsvp-heading" className={cn("grid bg-ink text-paper", background && "lg:grid-cols-2")}>
      {background ? (
        // On wide screens the photo fills its column for the full height of the form,
        // so photo and form move together (a pinned photo made the form seem to scroll on its own).
        <div className="relative">
          <div className="relative aspect-[4/3] sm:aspect-[3/2] lg:absolute lg:inset-0 lg:aspect-auto">
            <WeddingImage
              src={background}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              // Gallery photos have no focal point; faces usually sit above the middle.
              style={{ objectPosition: galleryPhoto ? "50% 30%" : couple.heroPosition }}
            />
          </div>
        </div>
      ) : null}
      <div className="flex flex-col justify-center px-5 py-16 sm:px-10 sm:py-20 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-xl">
          <SectionHeading id="rsvp-heading">{t("heading")}</SectionHeading>
          {/* The reveal ends at full opacity, so these lines dim through their colour instead of opacity-80. */}
          {closed ? (
            <p data-reveal="up" style={{ "--i": 1 } as CSSProperties} className="mt-6 text-paper/80">
              {t("closed")}
            </p>
          ) : (
            <>
              <p data-reveal="up" style={{ "--i": 1 } as CSSProperties} className="mt-5 text-paper/80">
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
