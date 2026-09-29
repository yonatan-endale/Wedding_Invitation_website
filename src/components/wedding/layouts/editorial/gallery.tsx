"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Lightbox, type GalleryPhoto } from "../../lightbox";
import { SectionHeading, WeddingImage } from "../../primitives";

/** A mosaic on a dark band. Every fifth photo, starting with the first, takes two rows. */
export function EditorialGallery({ photos, names }: { photos: GalleryPhoto[]; names: string }) {
  const t = useTranslations("gallery");
  const [open, setOpen] = useState<number | null>(null);
  if (photos.length === 0) return null;

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="bg-ink px-5 pt-20 pb-28 text-paper sm:px-8 sm:pt-28 sm:pb-36">
      <div className="mx-auto max-w-6xl">
        <SectionHeading id="gallery-heading" className="text-center">
          {t("heading")}
        </SectionHeading>
        <ul className="mt-12 grid grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-3 md:gap-4">
          {photos.map((photo, index) => (
            <li key={photo.id} className={cn("relative aspect-[4/5] md:aspect-auto", index % 5 === 0 && "md:row-span-2")}>
              <button
                type="button"
                onClick={() => setOpen(index)}
                aria-label={t("open", { index: index + 1 })}
                className="group absolute inset-0 overflow-hidden bg-paper/10"
              >
                <WeddingImage
                  src={photo.url}
                  alt={photo.caption || `${names} ${index + 1}`}
                  fill
                  sizes="(min-width: 1024px) 400px, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <Lightbox photos={photos} names={names} index={open} onIndexChange={setOpen} />
    </section>
  );
}
