import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { GalleryPhoto } from "../../gallery";
import { KeylineFrame } from "../../kit/keyline-frame";
import { LightboxGroup } from "../../kit/lightbox-group";
import { WeddingImage, buttonOutline } from "../../primitives";
import styles from "./noir.module.css";
import { NoirHeading } from "./ornaments";
import { WALL_SIZE, placement } from "./wall";

/** The placement as custom properties for .piece in noir.module.css. */
function pieceStyle(index: number, count: number): { style: CSSProperties; wide: boolean; large: boolean } {
  const { col, cols, row, rows, wide, large } = placement(index, count);
  const style = {
    "--d-col": `${col} / span ${cols}`,
    "--d-row": `${row} / span ${rows}`,
    "--m-span": wide ? 2 : 1,
    "--m-ratio": wide ? (count === 1 ? "4 / 5" : "3 / 2") : "3 / 4",
    "--i": index % 5,
  } as CSSProperties;
  return { style, wide, large };
}

/**
 * A salon wall: the photos hung in thin double gold frames on the dark
 * paper, in varied shapes and sizes, the large pieces marked with corner
 * diamonds. Every frame is a real button that opens the shared viewer; the
 * wall itself stays a server component inside LightboxGroup.
 */
export async function NoirGallery({ photos, names }: { photos: GalleryPhoto[]; names: string }) {
  if (photos.length === 0) return null;
  const t = await getTranslations("gallery");
  const tn = await getTranslations("layouts.noir");
  const hung = photos.slice(0, WALL_SIZE);
  const rest = photos.length - hung.length;

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className="overflow-x-clip px-5 py-24 sm:px-8 sm:py-32">
      <NoirHeading id="gallery-heading">{t("heading")}</NoirHeading>
      <LightboxGroup photos={photos} label={names} className="mx-auto mt-16 max-w-6xl px-2 sm:mt-20">
        <ul className={cn(styles.wall, hung.length === 1 && "mx-auto max-w-md lg:max-w-none")}>
          {hung.map((photo, index) => {
            const { style, wide, large } = pieceStyle(index, hung.length);
            return (
              <li key={photo.id} data-reveal="scale" style={style} className={styles.piece}>
                {/* The keylines hang just outside the photo, so the dark paper shows between them like a mat. */}
                <KeylineFrame inset={-9} double corners={large} className="size-full">
                  <button
                    type="button"
                    data-lightbox-index={index}
                    aria-label={t("open", { index: index + 1 })}
                    className="group relative block size-full overflow-hidden bg-sheet"
                  >
                    <WeddingImage
                      src={photo.url}
                      alt={photo.caption || `${names} ${index + 1}`}
                      fill
                      sizes={wide ? "(min-width: 1024px) 460px, 100vw" : "(min-width: 1024px) 460px, 50vw"}
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    {photo.caption ? (
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pt-10 pb-3 text-start font-cormorant text-base leading-snug text-white italic ethiopic:not-italic">
                        {photo.caption}
                      </span>
                    ) : null}
                  </button>
                </KeylineFrame>
              </li>
            );
          })}
        </ul>
        {rest > 0 ? (
          <div className="mt-14 text-center">
            <button type="button" data-lightbox-index={hung.length} className={cn(buttonOutline, "border-metal/60 hover:border-metal")}>
              {tn("morePhotos", { count: rest })}
            </button>
          </div>
        ) : null}
      </LightboxGroup>
    </section>
  );
}
