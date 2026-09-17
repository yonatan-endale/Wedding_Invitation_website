import Image, { type ImageProps } from "next/image";
import type { CSSProperties } from "react";
import { canOptimizeImage } from "@/lib/images";
import { cn } from "@/lib/utils";
import type { BorderStyle } from "@/lib/constants";

/* ------------------------------------------------------------------ */
/* Border bands, drawn with CSS masks so each thread takes its colour   */
/* from the couple's theme. Tibeb is the woven border of a habesha     */
/* kemis; floral is a rose vine; line is two plain rules.              */
/* ------------------------------------------------------------------ */

type Orientation = "horizontal" | "vertical";
type Layer = { color: string; shapes: string };

const svg = (body: string) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'>${body}</svg>`,
  )}")`;

/** Shapes are authored horizontally; the vertical band transposes x and y. */
const transpose = (body: string) => body.replace(/<g>/g, "<g transform='matrix(0 1 1 0 0 0)'>");

const TIBEB: Layer[] = [
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

/** A rosette every tile, joined by a vine with a leaf on each side. */
const FLORAL: Layer[] = [
  {
    color: "var(--w-thread-3)",
    shapes:
      "<g><circle cx='9' cy='11' r='2.6'/><circle cx='9' cy='17' r='2.6'/><circle cx='6' cy='14' r='2.6'/><circle cx='12' cy='14' r='2.6'/><circle cx='7.2' cy='11.9' r='2.2'/><circle cx='10.8' cy='11.9' r='2.2'/><circle cx='7.2' cy='16.1' r='2.2'/><circle cx='10.8' cy='16.1' r='2.2'/></g>",
  },
  {
    color: "var(--w-thread-1)",
    shapes:
      "<g><path d='M17 14c3-4 6-4 8-3-1 3-4 5-8 3z'/><path d='M17 14c3 4 6 4 8 3-1-3-4-5-8-3z'/></g>",
  },
  {
    color: "var(--w-thread-2)",
    shapes:
      "<g><path d='M0 14c4 0 5-3 9-3s5 3 9 3 5-3 10-3v1c-5 0-6 3-10 3s-5-3-9-3-5 3-9 3z'/><circle cx='9' cy='14' r='1.3'/></g>",
  },
];

const MASKS: Record<"tibeb" | "floral", Record<Orientation, string[]>> = {
  tibeb: { horizontal: TIBEB.map((l) => svg(l.shapes)), vertical: TIBEB.map((l) => svg(transpose(l.shapes))) },
  floral: { horizontal: FLORAL.map((l) => svg(l.shapes)), vertical: FLORAL.map((l) => svg(transpose(l.shapes))) },
};

const LAYERS: Record<"tibeb" | "floral", Layer[]> = { tibeb: TIBEB, floral: FLORAL };

export function Band({
  variant = "tibeb",
  orientation = "horizontal",
  className,
}: {
  variant?: BorderStyle;
  orientation?: Orientation;
  className?: string;
}) {
  const horizontal = orientation === "horizontal";

  if (variant === "line") {
    return (
      <div
        aria-hidden
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
    <div aria-hidden className={cn("relative shrink-0", horizontal ? "h-7 w-full" : "h-full w-7", className)}>
      {LAYERS[variant].map((layer, index) => {
        const mask = MASKS[variant][orientation][index];
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

/** The woven band on its own, for pages that have no couple (landing, not found). */
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
