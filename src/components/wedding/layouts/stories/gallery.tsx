import { Expand } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { GalleryPhoto } from "../../gallery";
import { LightboxGroup } from "../../kit/lightbox-group";
import { WeddingImage } from "../../primitives";
import type { SiteNames } from "../types";
import { Initials, Scrims, StoryCard, StoryRing, darkGround, pill } from "./card";
import { PHOTO_CARDS } from "./plan";

const order = (index: number) => ({ "--i": index }) as CSSProperties;

/**
 * The photos as stories, one to a card, filling it, each under a story
 * header (the couple's avatar, "Gallery" and "3 of 12"). A tap on the left
 * or right of a photo steps back or on, as on a phone; the round button in
 * the corner is a real button that opens the photo whole in the shared
 * viewer (LightboxGroup, so the cards stay server rendered). Past six
 * photos, the last card offers the rest in the viewer.
 */
export async function StoriesGallery({ photos, names, separator }: { photos: GalleryPhoto[]; names: SiteNames; separator: string }) {
  if (photos.length === 0) return null;
  const [t, ts] = await Promise.all([getTranslations("gallery"), getTranslations("layouts.stories")]);
  const shown = photos.slice(0, PHOTO_CARDS);
  const rest = photos.length > shown.length;
  const label = `${names.one} & ${names.two}`;

  return (
    <LightboxGroup photos={photos} label={label}>
      {shown.map((photo, index) => {
        const opening = index === 0;
        return (
          <StoryCard
            key={photo.id}
            as={opening ? "section" : "div"}
            id={opening ? "gallery" : undefined}
            hash="gallery"
            tone="dark"
            tap
            labelledBy={opening ? "gallery-heading" : undefined}
            className={darkGround}
          >
            <WeddingImage
              src={photo.url}
              alt={photo.caption || `${label} ${index + 1}`}
              fill
              sizes="(min-width: 48rem) 34rem, 100vw"
              className="-z-20 object-cover"
              style={{ objectPosition: "50% 30%" }}
            />
            <Scrims foot="h-[42%]" />

            {/* The story header, as on the cover: avatar, "Gallery" and where this photo sits. */}
            <div className="flex items-center justify-between gap-3 px-4 pt-9">
              <div className="flex min-w-0 items-center gap-2.5 font-sans text-sm leading-tight [text-shadow:0_1px_4px_rgb(0_0_0/0.5)]">
                <StoryRing className="size-10" ground="bg-[#110f0e]">
                  <Initials initials={names.initials} separator={separator} className="text-[0.9rem]" />
                </StoryRing>
                {opening ? (
                  <h2 id="gallery-heading" className="font-sans font-semibold">
                    {t("heading")}
                  </h2>
                ) : (
                  <p className="font-semibold">{t("heading")}</p>
                )}
                <p className="text-white/80 tabular-nums">{t("counter", { current: index + 1, total: photos.length })}</p>
              </div>
              <button
                type="button"
                data-lightbox-index={index}
                aria-label={t("open", { index: index + 1 })}
                className="flex size-11 shrink-0 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              >
                <Expand aria-hidden className="size-5" />
              </button>
            </div>

            <div data-reveal-group className="mt-auto flex flex-col items-center gap-3 px-6 pt-10 pb-8 text-center">
              {photo.caption ? (
                <p data-reveal="up" className="max-w-[30ch] text-[1.05rem] [text-shadow:0_1px_8px_rgb(0_0_0/0.6)]">
                  {photo.caption}
                </p>
              ) : null}
              {rest && index === shown.length - 1 ? (
                <div data-reveal="up" style={order(2)}>
                  <button
                    type="button"
                    data-lightbox-index={shown.length}
                    className={cn(pill, "min-h-11 bg-white/95 px-5 text-[#141210] hover:bg-white")}
                  >
                    {ts("allPhotos", { count: photos.length })}
                  </button>
                </div>
              ) : null}
            </div>
          </StoryCard>
        );
      })}
    </LightboxGroup>
  );
}
