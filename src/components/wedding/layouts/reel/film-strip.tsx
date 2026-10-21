import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import type { GalleryPhoto } from "../../gallery";
import { LightboxGroup } from "../../kit/lightbox-group";
import { SectionHeading, WeddingImage } from "../../primitives";
import { StripControls } from "./strip-controls";
import styles from "./reel.module.css";

const STRIP_ID = "reel-strip";

/**
 * "Stills": the photos on a strip of film, sprocket holes along both edges,
 * that scrolls sideways on its own (snapping frame by frame) and never widens
 * the page. Each frame is a real button that opens the shared lightbox.
 */
export async function ReelGallery({ photos, names }: { photos: GalleryPhoto[]; names: string }) {
  if (photos.length === 0) return null;
  const [t, tr] = await Promise.all([getTranslations("gallery"), getTranslations("layouts.reel")]);

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="overflow-x-clip border-t border-rule py-20 sm:py-28">
      <div className="mx-auto flex max-w-6xl items-end justify-between gap-6 px-5 sm:px-8">
        <SectionHeading id="gallery-heading">{tr("stills")}</SectionHeading>
        {photos.length > 1 ? <StripControls target={STRIP_ID} previous={t("previous")} next={t("next")} /> : null}
      </div>

      <LightboxGroup photos={photos} label={names} className="mt-10 sm:mt-12">
        {/* The strip unrolls from its centre as it scrolls into view. */}
        <div data-reveal="unroll">
          <div
            id={STRIP_ID}
            role="group"
            aria-labelledby="gallery-heading"
            className={cn(styles.strip, styles.edge, "snap-x snap-mandatory overflow-x-auto")}
          >
            <ul className={cn(styles.film, "relative flex w-max gap-3 py-[30px] sm:gap-4")}>
              <span aria-hidden className={cn(styles.sprockets, "absolute inset-x-0 top-1 h-[22px] bg-ink/55")} />
              <span aria-hidden className={cn(styles.sprockets, "absolute inset-x-0 bottom-1 h-[22px] bg-ink/55")} />
              {photos.map((photo, index) => (
                <li key={photo.id} className="relative w-[min(68vw,18rem)] shrink-0 snap-start sm:w-[19rem]">
                  <button
                    type="button"
                    data-lightbox-index={index}
                    aria-label={t("open", { index: index + 1 })}
                    className="group relative block aspect-[4/5] w-full overflow-hidden bg-rule"
                  >
                    <WeddingImage
                      src={photo.url}
                      alt={photo.caption || `${names} ${index + 1}`}
                      fill
                      sizes="(min-width: 640px) 304px, 68vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      style={{ objectPosition: "50% 30%" }}
                    />
                    {/* Frame number, as printed along the film's edge. */}
                    <span
                      aria-hidden
                      className="absolute bottom-2 start-2.5 font-mono text-[0.7rem] tracking-[0.15em] text-[color-mix(in_oklab,var(--w-metal)_70%,white)] tabular-nums [text-shadow:0_1px_4px_rgba(0,0,0,0.8)]"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </LightboxGroup>
    </section>
  );
}
