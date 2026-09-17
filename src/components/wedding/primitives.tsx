import Image, { type ImageProps } from "next/image";
import type { CSSProperties } from "react";
import { canOptimizeImage } from "@/lib/images";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Tibeb: the woven border of a habesha kemis, drawn with CSS masks so  */
/* each thread takes its colour from the couple's theme.               */
/* ------------------------------------------------------------------ */

type Orientation = "horizontal" | "vertical";

const svg = (body: string) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'>${body}</svg>`,
  )}")`;

/** Shapes are authored horizontally; the vertical band transposes x and y. */
const transpose = (body: string) =>
  body.replace(/<g>/g, "<g transform='matrix(0 1 1 0 0 0)'>");

const LAYERS: { color: string; shapes: string }[] = [
  {
    color: "var(--w-thread-1)",
    shapes:
      "<g><rect y='4' width='28' height='1'/><rect y='23' width='28' height='1'/><path fill-rule='evenodd' d='M7 7l7 7-7 7-7-7zM7 10.5l3.5 3.5-3.5 3.5-3.5-3.5z'/></g>",
  },
  {
    color: "var(--w-thread-3)",
    shapes:
      "<g><rect x='20' y='8' width='2' height='12'/><rect x='15' y='13' width='12' height='2'/><circle cx='7' cy='14' r='1.5'/></g>",
  },
  {
    color: "var(--w-thread-2)",
    shapes:
      "<g><rect width='28' height='2'/><rect y='26' width='28' height='2'/><rect x='20.25' y='13.25' width='1.5' height='1.5'/><rect x='14.5' y='13' width='1' height='2'/></g>",
  },
];

const MASKS: Record<Orientation, string[]> = {
  horizontal: LAYERS.map((layer) => svg(layer.shapes)),
  vertical: LAYERS.map((layer) => svg(transpose(layer.shapes))),
};

export function TibebBand({
  orientation = "horizontal",
  className,
}: {
  orientation?: Orientation;
  className?: string;
}) {
  const repeat = orientation === "horizontal" ? "repeat-x" : "repeat-y";
  return (
    <div
      aria-hidden
      className={cn("relative shrink-0", orientation === "horizontal" ? "h-7 w-full" : "h-full w-7", className)}
    >
      {LAYERS.map((layer, index) => {
        const mask = MASKS[orientation][index];
        const style: CSSProperties = {
          backgroundColor: layer.color,
          maskImage: mask,
          WebkitMaskImage: mask,
          maskRepeat: repeat,
          WebkitMaskRepeat: repeat,
          maskSize: "28px 28px",
          WebkitMaskSize: "28px 28px",
          maskPosition: "center",
          WebkitMaskPosition: "center",
        };
        return <span key={layer.color} className="absolute inset-0" style={style} />;
      })}
    </div>
  );
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
      <span className="font-display text-[min(58vw,26rem)] leading-none whitespace-nowrap text-ink/4.5">
        {monogram}
      </span>
    </div>
  );
}

export function SectionHeading({ id, children, className }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <h2 id={id} className={cn("font-display text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.05]", className)}>
      {children}
    </h2>
  );
}

export const buttonPrimary =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] bg-thread-1 px-6 py-3 text-base font-medium text-on-thread-1 transition-[filter,transform] hover:brightness-110 active:translate-y-px disabled:opacity-60";

export const buttonOutline =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[3px] border border-ink/25 px-5 py-2.5 text-base text-ink transition-colors hover:border-ink hover:bg-ink/[0.04] disabled:opacity-60";

export const sectionPadding = "px-5 py-20 sm:px-8 sm:py-28";
