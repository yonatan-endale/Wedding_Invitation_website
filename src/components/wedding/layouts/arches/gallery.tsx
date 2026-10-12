import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import { ArchFrame } from "../../kit/arch-frame";
import { LightboxGroup } from "../../kit/lightbox-group";
import type { GalleryPhoto } from "../../lightbox";
import { WeddingImage, buttonOutline } from "../../primitives";
import { ArchTitle } from "./ornaments";

type Props = { photos: GalleryPhoto[]; names: string };

/** Photos shown as arches; the rest open from the "view all" button in the shared viewer. */
const SHOWN = 12;

/**
 * The gallery as a row of arched windows, the middle columns set lower so
 * the strip rises and falls like an arcade. Each photo is a real button that
 * opens the shared Lightbox (through LightboxGroup, so the page stays server
 * rendered). Up to twelve show; past that a button opens the viewer at the
 * thirteenth. One photo stands alone, centred; two or three keep to a narrow
 * row.
 */
export async function ArchesGallery({ photos, names }: Props) {
  if (photos.length === 0) return null;
  const t = await getTranslations("gallery");
  const tArches = await getTranslations("layouts.arches");
  const shown = photos.slice(0, SHOWN);
  const count = shown.length;

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="overflow-x-clip px-5 py-20 sm:px-8 sm:py-28">
      <ArchTitle id="gallery-heading">{t("heading")}</ArchTitle>
      <LightboxGroup photos={photos} label={names} className="mt-14">
        <ul
          className={cn(
            "mx-auto grid gap-x-4 gap-y-8 sm:gap-x-6 lg:gap-x-8",
            count === 1 && "max-w-[20rem]",
            count === 2 && "max-w-2xl grid-cols-2 [&>li:nth-child(2)]:mt-10",
            count === 3 &&
              "max-w-4xl grid-cols-2 sm:grid-cols-3 [&>li:nth-child(2)]:mt-10 max-sm:[&>li:nth-child(3)]:col-span-2 max-sm:[&>li:nth-child(3)]:mx-auto max-sm:[&>li:nth-child(3)]:w-[calc(50%-0.5rem)]",
            count >= 4 &&
              "max-w-6xl grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 max-sm:[&>li:nth-child(even)]:mt-10 sm:max-lg:[&>li:nth-child(3n+2)]:mt-12 lg:[&>li:nth-child(even)]:mt-14",
          )}
        >
          {shown.map((photo, index) => (
            <li key={photo.id} className="min-w-0">
              <button
                type="button"
                data-lightbox-index={index}
                aria-label={t("open", { index: index + 1 })}
                className="group block w-full rounded-t-[999rem]"
              >
                <ArchFrame ratio={0.72} reveal className="w-full" windowClassName="bg-rule">
                  <WeddingImage
                    src={photo.url}
                    alt={photo.caption || `${names} ${index + 1}`}
                    fill
                    sizes={count === 1 ? "20rem" : "(min-width: 1024px) 17rem, (min-width: 640px) 30vw, 45vw"}
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                </ArchFrame>
              </button>
              {photo.caption ? <p className="mt-3 text-center text-base text-ink-soft">{photo.caption}</p> : null}
            </li>
          ))}
        </ul>
        {photos.length > SHOWN ? (
          <div data-reveal="up" className="mt-14 text-center">
            <button type="button" data-lightbox-index={SHOWN} className={buttonOutline}>
              {tArches("allPhotos", { count: photos.length })}
            </button>
          </div>
        ) : null}
      </LightboxGroup>
    </section>
  );
}
