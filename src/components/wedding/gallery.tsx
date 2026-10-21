"use client";

import AutoScroll from "embla-carousel-auto-scroll";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { localeDir, type Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";
import { Lightbox, roundButton, type GalleryPhoto } from "./lightbox";
import { useMotionPaused } from "./motion/motion-toggle";
import { SectionHeading, WeddingImage } from "./primitives";

export type { GalleryPhoto } from "./lightbox";

type Props = {
  photos: GalleryPhoto[];
  names: string;
  /**
   * The couple's "drifting gallery" switch: the photos slide slowly and endlessly.
   * Hovering, focusing or touching pauses them, guests can still swipe and use
   * the arrows, and it never moves for reduced motion, while the site's motion is
   * paused, off screen or in a hidden tab. Its own pause button covers WCAG 2.2.2.
   */
  drift?: boolean;
};

export function GallerySection({ photos, names, drift = false }: Props) {
  const t = useTranslations("gallery");
  const locale = useLocale() as Locale;
  const plugins = useMemo(
    () =>
      drift
        ? [
            AutoScroll({
              playOnInit: false,
              speed: 0.6,
              startDelay: 1500,
              stopOnMouseEnter: true,
              stopOnFocusIn: true,
              // Keep drifting after a swipe: it picks up again after startDelay.
              stopOnInteraction: false,
            }),
          ]
        : [],
    [drift],
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", direction: localeDir(locale), ...(drift ? { loop: true } : { containScroll: "trimSnaps" }) },
    plugins,
  );
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(photos.length > 1);
  const [open, setOpen] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const motionPaused = useMotionPaused();
  // Starts false on the server and in the first client render, so the pause button never mismatches.
  const [canDrift, setCanDrift] = useState(false);
  const [guestPaused, setGuestPaused] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const section = useRef<HTMLElement>(null);

  useEffect(() => setCanDrift(drift && photos.length > 1 && !reduceMotion && !motionPaused), [drift, photos.length, reduceMotion, motionPaused]);

  useEffect(() => {
    if (!drift || !section.current) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    observer.observe(section.current);
    const onVisibility = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [drift]);

  // The lightbox open also stops the drift, so the strip doesn't move behind it.
  const playing = canDrift && !guestPaused && onScreen && tabVisible && open === null;
  useEffect(() => {
    const autoScroll = emblaApi?.plugins()?.autoScroll;
    if (!autoScroll) return;
    if (playing) autoScroll.play();
    else autoScroll.stop();
  }, [emblaApi, playing]);

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
    <section ref={section} id="gallery" aria-labelledby="gallery-heading" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        {/* Only the heading row reveals. The carousel below is never transformed, so Embla can measure and drag it. */}
        <div data-reveal-group className="flex items-end justify-between gap-6">
          <SectionHeading id="gallery-heading">{t("heading")}</SectionHeading>
          {photos.length > 1 ? (
            <div data-reveal="fade" style={{ "--i": 1 } as CSSProperties} className="flex shrink-0 gap-2">
              {canDrift ? (
                <button
                  type="button"
                  onClick={() => setGuestPaused((paused) => !paused)}
                  aria-label={guestPaused ? t("play") : t("pause")}
                  aria-pressed={guestPaused}
                  className={cn(roundButton, "border-ink/25 hover:border-ink")}
                >
                  {guestPaused ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canPrev}
                aria-label={t("previous")}
                className={cn(roundButton, "border-ink/25 hover:border-ink")}
              >
                <ChevronLeft aria-hidden className="size-5 rtl:-scale-x-100" />
              </button>
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canNext}
                aria-label={t("next")}
                className={cn(roundButton, "border-ink/25 hover:border-ink")}
              >
                <ChevronRight aria-hidden className="size-5 rtl:-scale-x-100" />
              </button>
            </div>
          ) : null}
        </div>

        <div ref={emblaRef} className="mt-10 overflow-hidden">
          <ul className="-ms-4 flex touch-pan-y">
            {photos.map((photo, index) => (
              <li key={photo.id} className="min-w-0 shrink-0 grow-0 basis-[82%] ps-4 sm:basis-[46%] lg:basis-[31%]">
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
