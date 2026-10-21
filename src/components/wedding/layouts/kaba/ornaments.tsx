import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { eyebrowClass } from "../../primitives";
import styles from "./kaba.module.css";
import { CORNER, MEDALLION, RULE, WREATH } from "./stitch";

/*
 * Kaba Velvet's gold-thread embroidery. The drawings live once in a hidden
 * sprite (KabaThread, rendered at the top of the layout) and every ornament
 * is a <use> of one of them, revealed through a mask whose single "needle"
 * path traces itself in (data-reveal="draw"), so each motif stitches itself
 * along its spine. Without motion the needle is simply whole and so is the
 * embroidery. All decorative; all server components.
 */

const order = (index: number) => ({ "--i": index }) as CSSProperties;

/** Small gold capitals for labels; Ge'ez keeps its own case and spacing (see eyebrowClass). */
export const kabaEyebrow = cn(eyebrowClass, "text-metal");

/* Couched gold cord: a solid thread with the small dark stitches that hold it down. */
const TICK: CSSProperties = { stroke: "color-mix(in oklab, currentColor, black 62%)" };

function Cord({ d, width }: { d: string; width: number }) {
  return (
    <>
      <path d={d} fill="none" stroke="currentColor" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" strokeWidth={width} strokeDasharray="0.8 2.4" style={TICK} />
    </>
  );
}

const SATIN = "url(#kaba-satin)";

/**
 * The embroidery drawings and the satin gradient, once per page. Width and
 * height 0 rather than display:none, which would break the gradient.
 */
export function KabaThread() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute overflow-hidden text-metal">
      <defs>
        <linearGradient id="kaba-satin" x1="0" y1="0" x2="1" y2="1">
          {/* currentColor (the metal) stands in where color-mix is unsupported. */}
          <stop offset="0" stopColor="currentColor" style={{ stopColor: "color-mix(in oklab, var(--w-metal), white 45%)" }} />
          <stop offset="0.5" stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" style={{ stopColor: "color-mix(in oklab, var(--w-metal), black 28%)" }} />
        </linearGradient>
        <g id="kaba-corner">
          <Cord d={CORNER.vines} width={2.8} />
          <Cord d={CORNER.scrolls} width={2.2} />
          <Cord d={CORNER.jewelSetting} width={1.8} />
          <path d={CORNER.leaves} fill={SATIN} />
          <path d={CORNER.jewel} fill={SATIN} fillRule="evenodd" />
          <path d={CORNER.jewelHeart + CORNER.knots} fill="currentColor" />
        </g>
        <g id="kaba-medallion">
          <Cord d={MEDALLION.rim} width={3} />
          <path d={MEDALLION.petals} fill={SATIN} />
          <path d={MEDALLION.knots} fill="currentColor" />
          <Cord d={MEDALLION.cord} width={2.2} />
          <path d={MEDALLION.stitch} fill="none" stroke="currentColor" strokeWidth={1.2} strokeDasharray="3.6 2.4" strokeLinecap="round" />
        </g>
        <g id="kaba-wreath">
          <path d={WREATH.stem} fill="none" stroke="currentColor" strokeWidth={1.2} />
          <path d={WREATH.leaves} fill={SATIN} />
        </g>
        <g id="kaba-rule">
          <Cord d={RULE.vines} width={2.2} />
          <path d={RULE.leaves} fill={SATIN} />
          <path d={RULE.stitch} fill="none" stroke="currentColor" strokeWidth={1.3} strokeDasharray="5 3.4" strokeLinecap="round" />
          <path d={RULE.jewel} fill={SATIN} fillRule="evenodd" />
          <path d={RULE.knots} fill="currentColor" />
        </g>
      </defs>
    </svg>
  );
}

type StitchedProps = {
  /** Unique on the page: it names the mask. */
  id: string;
  /** Which drawing in KabaThread. */
  art: "kaba-corner" | "kaba-medallion" | "kaba-wreath" | "kaba-rule";
  needle: string;
  /** Wide enough that the needle's stroke covers everything along its route. */
  needleWidth: number;
  width: number;
  height: number;
  className?: string;
  style?: CSSProperties;
  /** Off: the drawing is simply there (it can still fade with a parent). */
  draw?: boolean;
};

/**
 * One embroidered motif that stitches itself in: the drawing masked by its
 * needle, which draws along the motif's route once it scrolls into view. The
 * svg is its own reveal group, so the observer (which cannot see inside a
 * mask) always reaches it. Exactly one animated path.
 */
function Stitched({ id, art, needle, needleWidth, width, height, className, style, draw = true }: StitchedProps) {
  const mask = `${id}-needle`;
  const pad = needleWidth;
  return (
    <svg
      aria-hidden
      data-reveal-group={draw ? "" : undefined}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("block overflow-visible text-metal", className)}
      style={style}
    >
      {draw ? (
        <>
          <mask id={mask} maskUnits="userSpaceOnUse" x={-pad} y={-pad} width={width + 2 * pad} height={height + 2 * pad}>
            <path
              data-reveal="draw"
              pathLength={1}
              d={needle}
              fill="none"
              stroke="#fff"
              strokeWidth={needleWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </mask>
          <use href={`#${art}`} mask={`url(#${mask})`} />
        </>
      ) : (
        <use href={`#${art}`} />
      )}
    </svg>
  );
}

const CORNERS = ["tl", "tr", "bl", "br"] as const;
type Corner = (typeof CORNERS)[number];

/* The drawing is the top-left corner; the others are it flipped. */
const CORNER_PLACE: Record<Corner, string> = {
  tl: "top-(--kaba-corner-inset) left-(--kaba-corner-inset)",
  tr: "top-(--kaba-corner-inset) right-(--kaba-corner-inset) -scale-x-100",
  bl: "bottom-(--kaba-corner-inset) left-(--kaba-corner-inset) -scale-y-100",
  br: "right-(--kaba-corner-inset) bottom-(--kaba-corner-inset) -scale-100",
};

/**
 * An embroidered frame for a panel: a couched gold cord on the edge, a
 * running stitch just inside it and a flourish in each corner that stitches
 * itself in (one animated path per corner). Place it in a relative parent;
 * the corner size comes from --kaba-corner (see kaba.module.css). The lines
 * unroll from the centre, or take `lineClassName` for another entrance.
 */
export function StitchFrame({
  id,
  className,
  corners = true,
  lineReveal = true,
  lineClassName,
}: {
  id: string;
  className?: string;
  corners?: boolean;
  lineReveal?: boolean;
  lineClassName?: string;
}) {
  return (
    <span aria-hidden className={cn(styles.framed, "pointer-events-none absolute inset-0", className)}>
      <span data-reveal={lineReveal ? "unroll" : undefined} className={cn(styles.frame, "absolute inset-0", lineClassName)} />
      {corners
        ? CORNERS.map((corner, index) => (
            <Stitched
              key={corner}
              id={`${id}-${corner}`}
              art="kaba-corner"
              needle={CORNER.needle}
              needleWidth={30}
              width={100}
              height={100}
              className={cn("absolute size-(--kaba-corner)", CORNER_PLACE[corner])}
              style={order(index)}
            />
          ))
        : null}
    </span>
  );
}

/** A lozenge between two short vines, fading out into a running stitch; it stitches itself in from left to right. */
export function StitchRule({ id, className, draw = true }: { id: string; className?: string; draw?: boolean }) {
  return (
    <Stitched
      id={id}
      art="kaba-rule"
      needle={RULE.needle}
      needleWidth={34}
      width={240}
      height={28}
      draw={draw}
      className={cn("mx-auto h-auto w-[min(15rem,72%)]", className)}
    />
  );
}

/**
 * A round embroidered medallion: a couched rim, a band of satin petals with
 * knots between, a cord and a running stitch round the window. Children sit
 * in the window (a photo or initials). With `wreath`, a laurel circles the
 * window too, fading in once the rim is stitched.
 */
export function Medallion({
  id,
  children,
  className,
  draw = true,
  wreath = false,
  windowClassName,
}: {
  id: string;
  children?: ReactNode;
  className?: string;
  draw?: boolean;
  wreath?: boolean;
  windowClassName?: string;
}) {
  const inset = `${((1 - MEDALLION.window) / 2) * 100}%`;
  return (
    <div className={cn("relative aspect-square", className)}>
      {children ? (
        <div className={cn("absolute overflow-hidden rounded-full", windowClassName)} style={{ inset }}>
          {children}
        </div>
      ) : null}
      <Stitched
        id={id}
        art="kaba-medallion"
        needle={MEDALLION.needle}
        needleWidth={28}
        width={200}
        height={200}
        draw={draw}
        className="pointer-events-none absolute inset-0 size-full"
      />
      {wreath ? (
        <svg aria-hidden viewBox="0 0 200 200" data-reveal="fade" style={order(4)} className="pointer-events-none absolute inset-0 size-full text-metal">
          <use href="#kaba-wreath" />
        </svg>
      ) : null}
    </div>
  );
}

/** A centred section title: an optional gold label, the heading in Marcellus, and a stitched rule under it. */
export function KabaHeading({
  id,
  children,
  kicker,
  className,
}: {
  id: string;
  children: ReactNode;
  kicker?: ReactNode;
  className?: string;
}) {
  return (
    <div data-reveal-group className={cn("text-center", className)}>
      {kicker ? (
        <p data-reveal="fade" className={kabaEyebrow}>
          {kicker}
        </p>
      ) : null}
      <h2
        id={id}
        data-reveal="up"
        style={order(1)}
        className={cn(
          "font-display text-[clamp(2.4rem,6.4vw,4rem)] leading-[1.08] ethiopic:text-[clamp(2rem,5.6vw,3.2rem)] ethiopic:leading-[1.25]",
          kicker && "mt-4",
        )}
      >
        {children}
      </h2>
      <StitchRule id={`${id}-rule`} className="mt-6" />
    </div>
  );
}

/** A small gold lozenge, for the ends of rules and the close of the day. `reveal` pops it in. */
export function Lozenge({ className, reveal = false }: { className?: string; reveal?: boolean }) {
  return (
    <span aria-hidden data-reveal={reveal ? "pop" : undefined} className={cn("block size-[9px] shrink-0 rotate-45 bg-metal", className)} />
  );
}

/** A velvet ground for a section that cannot take the class itself; place it in a relative, isolated parent. */
export function VelvetGround({ className, style }: { className?: string; style?: CSSProperties }) {
  return <span aria-hidden className={cn(styles.velvet, styles.seams, "pointer-events-none absolute inset-0", className)} style={style} />;
}
