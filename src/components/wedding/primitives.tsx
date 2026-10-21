import Image, { type ImageProps } from "next/image";
import type { CSSProperties } from "react";
import { canOptimizeImage } from "@/lib/images";
import { cn } from "@/lib/utils";
import { BORDER_TILES, type BorderTile, type Thread, type TiledBorder } from "@/lib/border-shapes";
import type { BorderStyle } from "@/lib/constants";
import { Tibeb } from "./tibeb";

/* ------------------------------------------------------------------ */
/* Border bands. Tibeb is the woven border of a habesha kemis, floral   */
/* is a rose vine and harag the interlace of Ethiopian manuscripts, all */
/* drawn with CSS masks so each thread takes its colour from the        */
/* couple's theme. Tibeb 2 is the wide band drawn from a real netela,   */
/* in ./tibeb.tsx. Line is two plain rules.                             */
/* ------------------------------------------------------------------ */

type Orientation = "horizontal" | "vertical";

const THREAD_VARS: Record<Thread, string> = {
  thread1: "var(--w-thread-1)",
  thread2: "var(--w-thread-2)",
  thread3: "var(--w-thread-3)",
};

const svg = (body: string, width: number, height: number) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'>${body}</svg>`,
  )}")`;

/** Shapes are authored horizontally; the vertical band transposes x and y. */
const transpose = (body: string) => body.replace(/<g>/g, "<g transform='matrix(0 1 1 0 0 0)'>");

type Mask = { image: string; size: string };

/** One mask per layer in each orientation; the vertical tile is the horizontal one turned on its side. */
const masks = ({ width, height, layers }: BorderTile): Record<Orientation, Mask[]> => ({
  horizontal: layers.map((l) => ({ image: svg(l.shapes, width, height), size: `${width}px ${height}px` })),
  vertical: layers.map((l) => ({ image: svg(transpose(l.shapes), height, width), size: `${height}px ${width}px` })),
});

const MASKS: Record<TiledBorder, Record<Orientation, Mask[]>> = {
  tibeb: masks(BORDER_TILES.tibeb),
  floral: masks(BORDER_TILES.floral),
  harag: masks(BORDER_TILES.harag),
};

/**
 * The couple's border. Thickness comes from the height (horizontal) or width
 * (vertical) class. `columns` only applies to Tibeb 2, where it stacks more
 * woven columns across the band, as on the broad border of a netela. With
 * `reveal` it unrolls from its centre as it scrolls into view.
 */
export function Band({
  variant = "tibeb",
  orientation = "horizontal",
  columns = 1,
  reveal = false,
  className,
}: {
  variant?: BorderStyle;
  orientation?: Orientation;
  columns?: number;
  reveal?: boolean;
  className?: string;
}) {
  const horizontal = orientation === "horizontal";
  const unroll = reveal ? "unroll" : undefined;

  if (variant === "tibeb2") {
    return (
      <div
        aria-hidden
        data-reveal={unroll}
        className={cn("shrink-0", horizontal ? "h-10 w-full" : "h-full w-10", className)}
      >
        <Tibeb orientation={orientation} columns={columns} />
      </div>
    );
  }

  if (variant === "line") {
    return (
      <div
        aria-hidden
        data-reveal={unroll}
        className={cn(
          "flex shrink-0 gap-[5px]",
          horizontal ? "h-7 w-full flex-col justify-center px-6" : "h-full w-7 flex-row justify-center py-6",
          className,
        )}
      >
        <span className={cn("block bg-thread-2", horizontal ? "h-px w-full" : "h-full w-px")} />
        <span className={cn("block bg-thread-2/60", horizontal ? "h-px w-full" : "h-full w-px")} />
      </div>
    );
  }

  const repeat = horizontal ? "repeat-x" : "repeat-y";
  return (
    <div
      aria-hidden
      data-reveal={unroll}
      className={cn("relative shrink-0", horizontal ? "h-7 w-full" : "h-full w-7", className)}
    >
      {BORDER_TILES[variant].layers.map((layer, index) => {
        const mask = MASKS[variant][orientation][index];
        const style: CSSProperties = {
          backgroundColor: THREAD_VARS[layer.thread],
          maskImage: mask.image,
          WebkitMaskImage: mask.image,
          maskRepeat: repeat,
          WebkitMaskRepeat: repeat,
          maskSize: mask.size,
          WebkitMaskSize: mask.size,
          maskPosition: "center",
          WebkitMaskPosition: "center",
        };
        return <span key={layer.thread} className="absolute inset-0" style={style} />;
      })}
    </div>
  );
}

/** The original woven band on its own, for pages that have no couple (landing, not found). */
export function TibebBand(props: { orientation?: Orientation; className?: string }) {
  return <Band variant="tibeb" {...props} />;
}

/** next/image that falls back to an unoptimized image for hosts not listed in next.config.ts. */
export function WeddingImage({ src, alt, ...props }: Omit<ImageProps, "src"> & { src: string }) {
  return <Image src={src} alt={alt} unoptimized={!canOptimizeImage(src)} {...props} />;
}

/**
 * The couple's initials, set huge and very faint behind the page. Sections with
 * their own background (the invitation card, venues, scripture, footer) cover it,
 * so it shows through the open stretches between them.
 */
export function MonogramWatermark({ monogram }: { monogram: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
    >
      <span className="font-display text-[min(30vw,26rem)] leading-none whitespace-nowrap text-ink/4.5">
        {monogram}
      </span>
    </div>
  );
}

/**
 * A section's title, which rises in as it scrolls into view. Pass
 * reveal={false} when it is sticky (a transform would fight the pinning) or
 * when an ancestor already moves it.
 */
export function SectionHeading({
  id,
  children,
  className,
  reveal = true,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  reveal?: boolean;
}) {
  return (
    <h2
      id={id}
      data-reveal={reveal ? "up" : undefined}
      className={cn("font-display text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.05]", className)}
    >
      {children}
    </h2>
  );
}

export const buttonPrimary =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] bg-thread-1 px-6 py-3 text-base font-medium text-on-thread-1 transition-[filter,transform] hover:brightness-110 active:translate-y-px disabled:opacity-60";

export const buttonOutline =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] border border-ink/25 px-5 py-2.5 text-base text-ink transition-colors hover:border-ink hover:bg-ink/[0.04] disabled:opacity-60";

export const sectionPadding = "px-5 py-20 sm:px-8 sm:py-28";

/** Small tracked capitals for labels above headings. Ge'ez is never uppercased or letter-spaced, and is set a size up so it stays legible. */
export const eyebrowClass =
  "text-xs font-medium uppercase tracking-[0.3em] text-ink-soft ethiopic:text-sm ethiopic:tracking-normal ethiopic:normal-case";
