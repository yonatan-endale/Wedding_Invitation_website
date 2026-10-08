import type { CSSProperties } from "react";
import { getTranslations } from "next-intl/server";
import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { firstGrapheme, fullName } from "@/lib/names";
import { cn } from "@/lib/utils";
import { formatWeddingDate } from "@/lib/wedding-format";
import type { GalleryPhoto } from "../../gallery";
import { SectionHeading, WeddingImage, sectionPadding } from "../../primitives";
import { posterPhotos, type PosterPhoto } from "./poster-photos";
import { creditCaps } from "./shared";
import styles from "./reel.module.css";

type Props = { site: SiteData; locale: Locale; photos: GalleryPhoto[] };

/**
 * "Starring": the couple as two film posters, each with the partner's first
 * and father's names and their role. Always shown: without photos the posters
 * are typographic, a large initial in the theme's metal.
 */
export async function ReelCouple({ site, locale, photos }: Props) {
  const [t, tr] = await Promise.all([getTranslations("couple"), getTranslations("layouts.reel")]);
  const { couple } = site;
  const [photoOne, photoTwo] = posterPhotos(couple, photos.map((photo) => photo.url));
  const date = formatWeddingDate(couple.weddingAt, couple.timezone, locale);
  const partners = [
    {
      key: "one",
      first: pickText(couple.partnerOne, locale),
      father: pickText(couple.partnerOneFather, locale),
      full: fullName(couple.partnerOne, couple.partnerOneFather, locale),
      role: couple.partnerOneRole,
      photo: photoOne,
    },
    {
      key: "two",
      first: pickText(couple.partnerTwo, locale),
      father: pickText(couple.partnerTwoFather, locale),
      full: fullName(couple.partnerTwo, couple.partnerTwoFather, locale),
      role: couple.partnerTwoRole,
      photo: photoTwo,
    },
  ];

  return (
    <section id="couple" aria-labelledby="couple-heading" className={cn(sectionPadding, "overflow-x-clip")}>
      <div className="mx-auto max-w-5xl">
        <SectionHeading id="couple-heading" className="text-center">
          {tr("starring")}
        </SectionHeading>
        <div data-reveal-group className="mt-14 grid justify-items-center gap-10 sm:mt-16 sm:grid-cols-2 sm:gap-8 lg:gap-14">
          {partners.map((partner, index) => (
            <Poster
              key={partner.key}
              index={index}
              first={partner.first}
              father={partner.father}
              full={partner.full}
              role={t(partner.role)}
              photo={partner.photo}
              date={date}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type PosterProps = {
  index: number;
  first: string;
  father: string;
  full: string;
  role: string;
  photo: PosterPhoto | null;
  date: string;
};

/** One portrait poster, 2:3: the role at the top, the name over the lower third, the date as a billing line. */
function Poster({ index, first, father, full, role, photo, date }: PosterProps) {
  const gold = "text-[color-mix(in_oklab,var(--w-metal)_55%,white)]";
  return (
    <figure
      data-reveal="scale"
      style={{ "--i": index * 2 } as CSSProperties}
      className="group relative isolate aspect-[2/3] w-full max-w-[22rem] overflow-hidden bg-black text-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
    >
      {photo ? (
        <WeddingImage
          src={photo.src}
          // A borrowed photo may not show this partner, so it is decoration; the name is in the caption.
          alt={photo.portrait ? full : ""}
          fill
          sizes="(min-width: 640px) 352px, calc(100vw - 2.5rem)"
          className="-z-20 object-cover grayscale-[0.85] transition-transform duration-[1.4s] ease-out group-hover:scale-[1.04]"
          style={{ objectPosition: photo.position }}
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 -z-20 flex items-start justify-center overflow-hidden bg-[radial-gradient(ellipse_at_50%_28%,color-mix(in_oklab,var(--w-thread-1)_32%,#000)_0%,#000_78%)] pt-[12%]"
        >
          <span className="font-display text-[clamp(11rem,52vw,15rem)] leading-none text-metal/30">{firstGrapheme(first)}</span>
        </div>
      )}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(0,0,0,0.95)_0%,rgba(0,0,0,0.78)_28%,rgba(0,0,0,0.2)_52%,rgba(0,0,0,0)_66%,rgba(0,0,0,0.5)_100%)]"
      />
      <span aria-hidden className={cn(styles.grain, "absolute inset-0 -z-10")} />
      {/* A hairline keyline inside the edge, as on a printed one-sheet. */}
      <span aria-hidden className="pointer-events-none absolute inset-3 border border-white/20" />

      <p className={cn(creditCaps, gold, "absolute inset-x-0 top-0 px-6 pt-9 text-center")}>{role}</p>

      <figcaption className="absolute inset-x-0 bottom-0 px-6 pb-9 text-center">
        <h3 className="font-display text-[clamp(2.75rem,10vw,4rem)] leading-[0.95] [overflow-wrap:anywhere]">{first}</h3>
        {father ? (
          <p className="mt-3 text-sm tracking-[0.42em] text-white/85 uppercase [&:lang(am)]:text-base [&:lang(am)]:tracking-normal [&:lang(am)]:normal-case">
            {father}
          </p>
        ) : null}
        <p aria-hidden className={cn(creditCaps, "mx-auto mt-6 max-w-[16rem] border-t border-white/25 pt-3 text-white/60")}>
          {date}
        </p>
      </figcaption>
    </figure>
  );
}
