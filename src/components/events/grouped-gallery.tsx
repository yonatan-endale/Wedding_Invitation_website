"use client";

import { useTranslations } from "next-intl";
import { useState, type CSSProperties } from "react";
import { Lightbox, type GalleryPhoto } from "@/components/wedding/lightbox";
import { SectionHeading, WeddingImage, eyebrowClass } from "@/components/wedding/primitives";
import { cn } from "@/lib/utils";
import { groupPhotos } from "./group-photos";

type Props = {
  photos: GalleryPhoto[];
  /** For the lightbox's labels on photos without a caption. */
  names: string;
  heading?: string;
  /** "frames" puts each photo on a white mount; "plain" lets it run to the edge of its cell. */
  look?: "frames" | "plain";
  className?: string;
};

/**
 * The photos as grids under the headings the admin gave them ("The two of us",
 * "With Mum and Dad"), in the admin's order. A photo opens full screen, and the
 * lightbox steps through every group, not only the one it was opened from.
 */
export function GroupedGallery({ photos, names, heading, look = "frames", className }: Props) {
  const t = useTranslations("gallery");
  const [open, setOpen] = useState<number | null>(null);
  if (photos.length === 0) return null;
  const groups = groupPhotos(photos);

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className={cn("px-5 py-20 sm:px-8 sm:py-28", className)}>
      <div className="mx-auto max-w-5xl">
        <SectionHeading id="gallery-heading" className="text-center">
          {heading ?? t("heading")}
        </SectionHeading>
        <div className="mt-12 grid gap-14">
          {groups.map((group, groupIndex) => (
            <div key={groupIndex} className="grid gap-5">
              {group.label ? (
                <h3 data-reveal="up" className={cn(eyebrowClass, "text-center")}>
                  {group.label}
                </h3>
              ) : null}
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5">
                {group.photos.map(({ photo, index }, position) => (
                  <li
                    key={photo.id}
                    data-reveal="up"
                    style={{ "--i": position % 3 } as CSSProperties}
                    className={cn(look === "frames" && "bg-sheet p-2 shadow-[0_1px_2px_rgb(0_0_0/0.08),0_8px_24px_-12px_rgb(0_0_0/0.25)] sm:p-3")}
                  >
                    <button
                      type="button"
                      onClick={() => setOpen(index)}
                      aria-label={t("open", { index: index + 1 })}
                      className="group relative block aspect-[4/5] w-full overflow-hidden bg-rule focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink"
                    >
                      <WeddingImage
                        src={photo.url}
                        alt={photo.caption}
                        fill
                        sizes="(min-width: 640px) 33vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                      />
                    </button>
                    {photo.caption ? <p className="mt-2 text-center text-sm text-ink-soft">{photo.caption}</p> : null}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <Lightbox photos={photos} names={names} index={open} onIndexChange={setOpen} />
    </section>
  );
}
