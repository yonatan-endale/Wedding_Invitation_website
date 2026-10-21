import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import { LightboxGroup } from "../../kit/lightbox-group";
import type { GalleryPhoto } from "../../lightbox";
import { WeddingImage, buttonOutline } from "../../primitives";
import styles from "./brana.module.css";
import { scriptLang } from "./names";
import { BranaHeading, Headpiece, MiniatureFrame, order } from "./ornaments";

type Props = { photos: GalleryPhoto[]; names: string };

/** Miniatures shown on the page; the rest open from the "view all" button in the shared viewer. */
const SHOWN = 12;

/**
 * The photos as the miniatures of the book: each in a frame of red and ink
 * rules with an interlace knot on every corner, in an orderly grid. Every
 * miniature is a real button that opens the shared Lightbox (through
 * LightboxGroup, so the page stays server rendered); captions are written
 * under them in rubric. One photo stands alone, two or three keep to a
 * narrow row, and past twelve a button opens the viewer at the thirteenth.
 */
export async function BranaMiniatures({ photos, names }: Props) {
  if (photos.length === 0) return null;
  const t = await getTranslations("gallery");
  const tb = await getTranslations("layouts.brana");
  const shown = photos.slice(0, SHOWN);
  const count = shown.length;

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="px-4 py-12 sm:px-8 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <Headpiece className="mx-[18px]" />
        <BranaHeading id="gallery-heading" className="mt-12">
          {t("heading")}
        </BranaHeading>
      </div>
      <LightboxGroup photos={photos} label={names} className="mt-14">
        <ul
          className={cn(
            "mx-auto grid gap-x-[clamp(1.25rem,4vw,2.5rem)] gap-y-[clamp(1.75rem,5vw,3rem)] px-[11px]",
            count === 1 && "max-w-[24rem]",
            count === 2 && "max-w-2xl grid-cols-2",
            count === 3 && "max-w-4xl grid-cols-2 sm:grid-cols-3 max-sm:[&>li:last-child]:col-span-2 max-sm:[&>li:last-child]:mx-auto max-sm:[&>li:last-child]:w-[calc(50%-0.75rem)]",
            count >= 4 && "max-w-6xl grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
          )}
        >
          {shown.map((photo, index) => (
            <li key={photo.id} data-reveal="up" style={order(index % 4)} className="min-w-0">
              <button
                type="button"
                data-lightbox-index={index}
                aria-label={t("open", { index: index + 1 })}
                className="group block w-full text-left"
              >
                <MiniatureFrame windowClassName="aspect-[4/5]">
                  <WeddingImage
                    src={photo.url}
                    alt={photo.caption || `${names} ${index + 1}`}
                    fill
                    sizes={count === 1 ? "24rem" : count === 2 ? "(min-width: 672px) 20rem, 45vw" : "(min-width: 1024px) 16rem, (min-width: 640px) 30vw, 45vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </MiniatureFrame>
              </button>
              {photo.caption ? (
                <p
                  lang={scriptLang(photo.caption)}
                  className={cn(styles.rubric, "mt-3 text-center font-cormorant text-[1.05rem] leading-snug font-medium italic ethiopic:not-italic")}
                >
                  {photo.caption}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
        {photos.length > SHOWN ? (
          <div data-reveal="up" className="mt-14 text-center">
            <button type="button" data-lightbox-index={SHOWN} className={buttonOutline}>
              {tb("allPhotos", { count: photos.length })}
            </button>
          </div>
        ) : null}
      </LightboxGroup>
    </section>
  );
}
