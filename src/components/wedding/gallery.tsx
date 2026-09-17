"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dialog } from "radix-ui";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { SectionHeading, WeddingImage } from "./primitives";

export type GalleryPhoto = { id: string; url: string; caption: string };

const roundButton =
  "flex size-12 items-center justify-center rounded-full border transition-colors disabled:pointer-events-none disabled:opacity-30";

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

  const step = useCallback(
    (direction: 1 | -1) => setOpen((index) => (index === null ? index : (index + direction + photos.length) % photos.length)),
    [photos.length],
  );

  if (photos.length === 0) return null;
  const current = open === null ? null : photos[open];

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

      <Dialog.Root open={current !== null} onOpenChange={(value) => !value && setOpen(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/92" />
          <Dialog.Content
            className="fixed inset-0 z-[70] flex flex-col text-white outline-none"
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") step(1);
              if (event.key === "ArrowLeft") step(-1);
            }}
            aria-describedby={undefined}
          >
            <Dialog.Title className="sr-only">
              {current ? current.caption || `${names} ${(open ?? 0) + 1}` : ""}
            </Dialog.Title>
            <div className="flex justify-end p-3">
              <Dialog.Close className={cn(roundButton, "border-white/30 hover:border-white")} aria-label={t("close")}>
                <X aria-hidden className="size-5" />
              </Dialog.Close>
            </div>
            <div className="relative mx-3 flex-1 sm:mx-16">
              {current ? (
                <WeddingImage
                  key={current.id}
                  src={current.url}
                  alt={current.caption || `${names} ${(open ?? 0) + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              ) : null}
            </div>
            <div className="flex items-center justify-center gap-6 p-5">
              <button type="button" onClick={() => step(-1)} aria-label={t("previous")} className={cn(roundButton, "border-white/30 hover:border-white")}>
                <ChevronLeft aria-hidden className="size-5" />
              </button>
              <p className="min-w-20 text-center text-base tabular-nums" aria-live="polite">
                {t("counter", { current: (open ?? 0) + 1, total: photos.length })}
              </p>
              <button type="button" onClick={() => step(1)} aria-label={t("next")} className={cn(roundButton, "border-white/30 hover:border-white")}>
                <ChevronRight aria-hidden className="size-5" />
              </button>
            </div>
            {current?.caption ? <p className="px-6 pb-6 text-center text-white/80">{current.caption}</p> : null}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
