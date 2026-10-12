import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { eyebrowClass } from "../../primitives";

/** The shared eyebrow (already a size up in Amharic, where Ge'ez at 12px is hard to read). */
export const eyebrow = eyebrowClass;

const round = (value: number) => Math.round(value * 100) / 100;
const rad = (degrees: number) => (degrees * Math.PI) / 180;

/*
 * The sunburst is drawn round its centre in a 1000-unit box; the arch it sits
 * behind is 200 units wide, so the box is five arch-widths across. Rays fan
 * over the head of the arch, long and short in turn, starting just outside
 * the arch's keyline.
 */
const RAY_START = 124;
const RAY_LONG = 490;
const RAY_SHORT = 330;
const RAY_FROM = 184;
const RAY_TO = 356;
const RAY_STEP = 4;

const RAYS = (() => {
  const parts: string[] = [];
  for (let index = 0, angle = RAY_FROM; angle <= RAY_TO; index++, angle += RAY_STEP) {
    const end = index % 2 === 0 ? RAY_LONG : RAY_SHORT;
    const x = Math.cos(rad(angle));
    const y = Math.sin(rad(angle));
    parts.push(`M${round(x * RAY_START)} ${round(y * RAY_START)}L${round(x * end)} ${round(y * end)}`);
  }
  return parts.join("");
})();

/** A dotted halo over the arch's head, and a fine ring further out. */
const HALO = "M-112 0A112 112 0 0 1 112 0";
const RING = "M-150 14A150 150 0 0 1 150 14";

/**
 * An art-deco sunburst of fine metal rays behind an arch, fading toward its
 * rim. Its centre is the middle of the box, so place the box's centre on the
 * centre of the arch's semicircle and make it five arch-widths wide. The rays
 * stay above the springing line, clear of text set beside the arch.
 * Decorative only.
 */
export function Sunburst({ id, className, style }: { id: string; className?: string; style?: CSSProperties }) {
  const fade = `${id}-fade`;
  return (
    <svg
      aria-hidden
      viewBox="-500 -500 1000 1000"
      fill="none"
      className={cn("block overflow-visible text-metal", className)}
      style={style}
    >
      <defs>
        <radialGradient id={fade} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="490">
          <stop offset="0.24" stopColor="currentColor" stopOpacity="0.75" />
          <stop offset="0.5" stopColor="currentColor" stopOpacity="0.38" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={RAYS} stroke={`url(#${fade})`} strokeWidth={0.55} strokeLinecap="round" />
      <path d={HALO} stroke="currentColor" strokeOpacity={0.7} strokeWidth={1.7} strokeLinecap="round" strokeDasharray="0 5.5" />
      <path d={RING} stroke="currentColor" strokeOpacity={0.35} strokeWidth={0.5} />
    </svg>
  );
}

/**
 * A small arched window between two fine rules, in metal, that traces itself
 * in above each section title. Decorative only.
 */
export function ArchMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 136 30"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      className={cn("mx-auto block h-[30px] w-[136px] overflow-visible text-metal", className)}
    >
      <path data-reveal="draw" pathLength={1} strokeWidth={1} d="M52 26H2" />
      <path data-reveal="draw" pathLength={1} strokeWidth={1} d="M84 26H134" />
      <path data-reveal="draw" pathLength={1} strokeWidth={1.2} d="M56 27V15A12 12 0 0 1 80 15V27" />
      <path
        data-reveal="draw"
        pathLength={1}
        strokeWidth={0.8}
        strokeOpacity={0.6}
        style={{ "--i": 2 } as CSSProperties}
        d="M61 27V15.5A7 7 0 0 1 75 15.5V27"
      />
    </svg>
  );
}

/** The title of a section: the arch mark over a light Cormorant heading, centred. */
export function ArchTitle({ id, children, className }: { id: string; children: ReactNode; className?: string }) {
  return (
    <div data-reveal-group className={cn("text-center", className)}>
      <ArchMark />
      <h2
        id={id}
        data-reveal="up"
        style={{ "--i": 1 } as CSSProperties}
        className="mt-5 font-cormorant text-[clamp(2.6rem,6.5vw,4.25rem)] leading-[1.02] font-light [&:lang(am)]:text-[clamp(2.1rem,5.4vw,3.25rem)] [&:lang(am)]:leading-[1.2]"
      >
        {children}
      </h2>
    </div>
  );
}

/** A small metal diamond, for keystones and the ends of rules. */
export function Diamond({ className }: { className?: string }) {
  return <span aria-hidden className={cn("block size-[7px] shrink-0 rotate-45 bg-metal", className)} />;
}

/** A fine metal rule with a diamond at each end: the ground line an arch stands on. */
export function Plinth({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("flex items-center", className)}>
      <Diamond className="size-[5px]" />
      <span className="h-px flex-1 bg-metal/70" />
      <Diamond className="size-[5px]" />
    </span>
  );
}

/**
 * The outline of an arch-topped panel: a double metal keyline that follows
 * the arch, a keystone at the apex and diamonds at the feet. Drawn with
 * borders, so it fits a panel of any height. The panel must be at least half
 * as tall as it is wide, so its top stays a semicircle.
 */
export function ArchOutline({ className, inset = 0 }: { className?: string; inset?: number }) {
  return (
    <span aria-hidden className={cn("pointer-events-none absolute", className)} style={{ inset }}>
      <span className="absolute inset-0 rounded-t-[999rem] border border-metal/70" />
      <span className="absolute inset-[6px] rounded-t-[999rem] border border-metal/35" />
      <Diamond className="absolute -top-[3.5px] left-1/2 -translate-x-1/2" />
      <Diamond className="absolute -bottom-[3.5px] -left-[3.5px]" />
      <Diamond className="absolute -right-[3.5px] -bottom-[3.5px]" />
    </span>
  );
}

/*
 * Inline styles on purpose: Tailwind's fallback for color-mix would paint
 * these in full-strength metal where color-mix is unsupported, whereas an
 * inline declaration the browser cannot parse is simply skipped.
 */

/** A soft gilded glow from the head of an arch, for windows without a photo. */
export const GLOW: CSSProperties = {
  backgroundImage:
    "radial-gradient(120% 70% at 50% 0%, color-mix(in oklab, var(--w-metal) 16%, var(--w-sheet)), var(--w-sheet) 72%)",
};
