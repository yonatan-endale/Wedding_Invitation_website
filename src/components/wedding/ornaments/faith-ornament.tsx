import type { CSSProperties, ReactNode } from "react";
import type { Ornament } from "@/lib/appearance";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* The couple's faith ornament, a small symbol over their names, drawn  */
/* only when they chose one. Every glyph sits in the same 64×64 box and */
/* is filled in currentColor (the theme's metal unless the caller sets  */
/* a colour); openwork is cut out with the even-odd rule. Drawn to stay */
/* legible from 32px up.                                                */
/* ------------------------------------------------------------------ */

const C = 32;
/** Glyphs with four-fold symmetry draw the top quarter and turn it. */
const TURNS = [0, 90, 180, 270];

/** A diamond centred on (x, y), as a closed subpath. */
const diamond = (x: number, y: number, r: number) => `M${x} ${y - r}L${x + r} ${y}L${x} ${y + r}L${x - r} ${y}Z`;

/** A circle round the centre as a closed subpath, so it can cut a hole in an even-odd path. */
const circle = (r: number) => `M${C - r} ${C}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;

/*
 * Orthodox: an Ethiopian processional cross. Four flared arms in outline, an
 * inner cross with a pierced jewel at its heart showing through the openwork,
 * three bosses on every arm end and a small lattice diamond in each angle.
 */
const ORTHODOX = (
  <>
    <path
      d="M27 27 22.5 6.5H41.5L37 27 57.5 22.5V41.5L37 37 41.5 57.5H22.5L27 37 6.5 41.5V22.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
    />
    {TURNS.map((turn) => (
      <g key={turn} transform={`rotate(${turn} ${C} ${C})`}>
        <rect x="30.3" y="10.5" width="3.4" height="17.5" />
        <circle cx="32" cy="4.3" r="2.3" />
        <circle cx="22.3" cy="5.7" r="2.1" />
        <circle cx="41.7" cy="5.7" r="2.1" />
        <path d={diamond(20.4, 20.4, 2.2)} />
      </g>
    ))}
    <path fillRule="evenodd" d={`${diamond(C, C, 4.6)}${diamond(C, C, 2)}`} />
  </>
);

/** Protestant: a plain Latin cross. */
const PROTESTANT = <path d="M29.5 6H34.5V19.5H47V24.5H34.5V58H29.5V24.5H17V19.5H29.5Z" />;

/** Sixteen teeth on the rim pointing in, the zigzag row of a woven basket. */
const TEETH = Array.from({ length: 16 }, (_, i) => {
  const at = (step: number, r: number) => {
    const angle = ((i + step) / 16) * 2 * Math.PI - Math.PI / 2;
    return `${(C + r * Math.cos(angle)).toFixed(2)} ${(C + r * Math.sin(angle)).toFixed(2)}`;
  };
  return `M${at(-0.5, 26.6)}L${at(0, 20.6)}L${at(0.5, 26.6)}Z`;
}).join("");

/** The eight-pointed star is a square and a diamond laid over each other, each pierced the same. */
const STAR_HOLE = `${circle(5)}${circle(2.4)}`;
const STAR = 13.6;
const STAR_SIDE = STAR * Math.SQRT1_2;

/*
 * Harari: a rosette after the woven baskets hung on the walls of Harari
 * homes, a pierced eight-pointed star inside a zigzag band and two rims.
 * No cross and no script.
 */
const HARARI = (
  <>
    <path fillRule="evenodd" d={`${circle(29.5)}${circle(27.8)}`} />
    <path d={TEETH} />
    <path fillRule="evenodd" d={`${circle(19.2)}${circle(17.6)}`} />
    <path
      fillRule="evenodd"
      d={`M${C - STAR_SIDE} ${C - STAR_SIDE}H${C + STAR_SIDE}V${C + STAR_SIDE}H${C - STAR_SIDE}Z${STAR_HOLE}`}
    />
    <path fillRule="evenodd" d={`${diamond(C, C, STAR)}${STAR_HOLE}`} />
  </>
);

const GLYPHS: Record<Exclude<Ornament, "none">, ReactNode> = {
  orthodox: ORTHODOX,
  protestant: PROTESTANT,
  harari: HARARI,
};

/**
 * The faith symbol the couple chose, or nothing for "none". Decorative. It
 * only ever fades in; pass reveal={false} where the screen around it already
 * has its own entrance, like an opening. Size it with a class, e.g. size-10.
 */
export function FaithOrnament({
  ornament,
  reveal = true,
  className,
  style,
}: {
  ornament: Ornament;
  reveal?: boolean;
  className?: string;
  /** For a stagger index (--i) inside a data-reveal-group. */
  style?: CSSProperties;
}) {
  if (ornament === "none") return null;
  return (
    <svg
      aria-hidden
      viewBox="0 0 64 64"
      fill="currentColor"
      data-reveal={reveal ? "fade" : undefined}
      className={cn("block shrink-0 text-metal", className)}
      style={style}
    >
      {GLYPHS[ornament]}
    </svg>
  );
}
