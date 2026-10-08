import { getTranslations } from "next-intl/server";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { GalleryPhoto } from "../../gallery";
import { LightboxGroup } from "../../kit/lightbox-group";
import { SectionHeading, WeddingImage, buttonOutline } from "../../primitives";
import { PRINTS_SHOWN, dealFans } from "./fan";
import styles from "./flatlay.module.css";

type Props = { photos: GalleryPhoto[]; names: string };

/**
 * The photos as prints with white borders, dealt into small overlapping fans
 * on the linen. Every print is a real button that opens the shared viewer
 * (through LightboxGroup, so the page stays server rendered); hover or focus
 * lifts a print out of its fan. Twelve prints at most, then a button opens
 * the viewer at the thirteenth.
 */
export async function FlatlayGallery({ photos, names }: Props) {
  if (photos.length === 0) return null;
  const t = await getTranslations("gallery");
  const tMore = await getTranslations("layouts.flatlay");
  const fans = dealFans(photos.length);
  // One fan alone, two side by side, three in a row, four as two pairs.
  const cols = fans.length === 4 ? 2 : fans.length;

  return (
    <section id="gallery" aria-labelledby="gallery-heading" className={cn(styles.onLinen, "px-4 py-20 sm:px-8 sm:py-28")}>
      <SectionHeading id="gallery-heading" className="text-center">
        {t("heading")}
      </SectionHeading>
      <LightboxGroup photos={photos} label={names} className="mt-12 sm:mt-16">
        <ul className={styles.fans} style={{ "--cols": cols } as CSSProperties}>
          {fans.map((fan) => (
            <li key={fan.start} className={styles.fan} style={{ "--fan-h": fan.height } as CSSProperties}>
              <ul>
                {fan.poses.map((pose, offset) => {
                  const index = fan.start + offset;
                  const photo = photos[index];
                  const style = { "--x": pose.left, "--y": pose.top, "--w": pose.width, "--r": pose.rotate, "--z": pose.z } as CSSProperties;
                  return (
                    <li key={photo.id} className={styles.printSpot} style={style}>
                      <button
                        type="button"
                        data-lightbox-index={index}
                        aria-label={t("open", { index: index + 1 })}
                        className={cn(styles.printButton, styles.photo)}
                      >
                        <span className="relative block aspect-[4/5] overflow-hidden bg-rule">
                          <WeddingImage
                            src={photo.url}
                            alt={photo.caption || `${names} ${index + 1}`}
                            fill
                            sizes={fans.length === 1 && fan.poses.length === 1 ? "18rem" : "(min-width: 768px) 13rem, 52vw"}
                            className="object-cover"
                          />
                        </span>
                        {photo.caption ? (
                          <span className="absolute inset-x-[5%] bottom-0 flex h-[17%] items-center justify-center overflow-hidden px-1 text-center font-cormorant text-[clamp(0.8rem,3.4cqw,1rem)] leading-tight text-[#3a352e] italic [&:lang(am)]:not-italic">
                            <span className="line-clamp-2">{photo.caption}</span>
                          </span>
                        ) : null}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ul>
        {photos.length > PRINTS_SHOWN ? (
          <div className="mt-12 text-center">
            <button type="button" data-lightbox-index={PRINTS_SHOWN} className={buttonOutline}>
              {tMore("allPhotos", { count: photos.length })}
            </button>
          </div>
        ) : null}
      </LightboxGroup>
    </section>
  );
}
