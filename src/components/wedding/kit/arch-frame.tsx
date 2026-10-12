import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Keyline geometry is drawn in a box this many units wide; the height follows the ratio. */
const UNITS = 320;
/** Outer and inner keylines, and the window, sit this far inside the frame (in units). */
const OUTER = 1;
const INNER = 6.5;
const WINDOW = 13;

const round = (value: number) => Math.round(value * 100) / 100;

/**
 * One half of an arch, inset `inset` units inside a UNITS × height box: from
 * the apex round the shoulder, down the side and along the foot to the
 * middle. Two mirrored halves draw outwards from the apex at the same time
 * and meet at the foot.
 */
export function halfArchPath(height: number, inset: number, side: "left" | "right"): string {
  const middle = UNITS / 2;
  const radius = middle - inset;
  const shoulder = inset + radius;
  const x = side === "right" ? UNITS - inset : inset;
  const sweep = side === "right" ? 1 : 0;
  return `M${middle} ${inset}A${round(radius)} ${round(radius)} 0 0 ${sweep} ${x} ${shoulder}V${round(height - inset)}H${middle}`;
}

type Props = {
  children?: ReactNode;
  className?: string;
  /**
   * Width over height. The frame keeps this shape (it sets aspect-ratio), so
   * size it by width only. Clamped to 0.4–1.6 so the top stays a semicircle.
   */
  ratio?: number;
  /** Draws a double gold keyline around the window that traces itself in (data-reveal="draw"). */
  keyline?: boolean;
  /**
   * The content rises into the window by transform only. Leave it off for a
   * hero or any photo that may be the largest paint; use the hero-photo
   * class on the image there instead.
   */
  reveal?: boolean;
  /** Classes for the clipped window, e.g. a background colour behind a loading photo. */
  windowClassName?: string;
};

/**
 * An arched window: a semicircle over a rectangle, the shape of church
 * windows in Lalibela and the gates of Gondar. Content (usually a
 * WeddingImage with `fill`) is clipped to the arch with border-radius, so
 * it works at any size; the optional keyline is an SVG drawn for the same
 * ratio, so it stays concentric with the window. A server component.
 */
export function ArchFrame({ children, className, ratio = 3 / 4, keyline = false, reveal = false, windowClassName }: Props) {
  const shape = Math.min(1.6, Math.max(0.4, ratio));
  const height = UNITS / shape;
  // Inset percentages: left/right resolve against the width, top/bottom against the height.
  const windowInset: CSSProperties = keyline
    ? { inset: `${round((WINDOW / height) * 100)}% ${round((WINDOW / UNITS) * 100)}%` }
    : { inset: 0 };

  return (
    <div className={cn("relative", className)} style={{ aspectRatio: shape }}>
      <div
        className={cn("absolute isolate overflow-hidden rounded-t-[999rem]", windowClassName)}
        style={windowInset}
      >
        <div data-reveal={reveal ? "arch" : undefined} className="absolute inset-0">
          {children}
        </div>
      </div>
      {keyline ? (
        <svg
          aria-hidden
          data-reveal-group
          viewBox={`0 0 ${UNITS} ${round(height)}`}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          className="pointer-events-none absolute inset-0 size-full overflow-visible text-metal"
        >
          {(["left", "right"] as const).map((side) => (
            <g key={side}>
              <path data-reveal="draw" pathLength={1} strokeWidth={1.5} d={halfArchPath(height, OUTER, side)} />
              <path
                data-reveal="draw"
                pathLength={1}
                strokeWidth={0.8}
                strokeOpacity={0.7}
                style={{ "--i": 2 } as CSSProperties}
                d={halfArchPath(height, INNER, side)}
              />
            </g>
          ))}
        </svg>
      ) : null}
    </div>
  );
}
