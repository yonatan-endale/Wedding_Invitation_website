"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Lightbox, roundButton, type GalleryPhoto } from "./lightbox";
import { SectionHeading, WeddingImage } from "./primitives";

export type { GalleryPhoto } from "./lightbox";

export function GallerySection({ photos, names }: { photos: GalleryPhoto[]; names: string }) {
  const t = useTranslations("gallery");
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(photos.length > 1);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    update();
    emblaApi.on("select", update).on("reInit", update);
    return () => {
      emblaApi.off("select", update).off("reInit", update);
    };
  }, [emblaApi]);

  if (photos.length === 0) return null;

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6">
          <SectionHeading id="gallery-heading">{t("heading")}</SectionHeading>
          {photos.length > 1 ? (
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canPrev}
                aria-label={t("previous")}
                className={cn(roundButton, "border-ink/25 hover:border-ink")}
              >
                <ChevronLeft aria-hidden className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canNext}
                aria-label={t("next")}
                className={cn(roundButton, "border-ink/25 hover:border-ink")}
              >
                <ChevronRight aria-hidden className="size-5" />
              </button>
            </div>
          ) : null}
        </div>

        <div ref={emblaRef} className="mt-10 overflow-hidden">
          <ul className="-ml-4 flex touch-pan-y">
            {photos.map((photo, index) => (
              <li key={photo.id} className="min-w-0 shrink-0 grow-0 basis-[82%] pl-4 sm:basis-[46%] lg:basis-[31%]">
                <button
                  type="button"
                  onClick={() => setOpen(index)}
                  aria-label={t("open", { index: index + 1 })}
                  className="group relative block aspect-[4/5] w-full overflow-hidden bg-rule"
                >
                  <WeddingImage
                    src={photo.url}
                    alt={photo.caption || `${names} ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 82vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </button>
                {photo.caption ? <p className="mt-3 text-base text-ink-soft">{photo.caption}</p> : null}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Lightbox photos={photos} names={names} index={open} onIndexChange={setOpen} />
    </section>
  );
}
