import { useId } from "react";
import { scallopPath } from "@/lib/ornament-geometry";
import { cn } from "@/lib/utils";

const RIM = scallopPath(60, 60, 54, 14, 1.6);

type Props = {
  initials: [string, string];
  /** "&" interlocks the two letters; the Ethiopic wordspace sets them side by side. */
  separator: "&" | "፡";
  /** "ivory" for a pale seal (the opening gates), "wax" for red wax (the envelope). */
  tone?: "ivory" | "wax";
  /** Draw only one half, for a seal that splits along the middle as two doors open. */
  half?: "left" | "right";
  className?: string;
};

/**
 * A round seal with the couple's initials in gold, drawn as SVG so it costs no
 * image download and takes the theme's metal colour. Decorative: the button or
 * dialog around it carries the accessible name. Shared by the wax-seal
 * opening, the envelope opening and the layouts that show a crest.
 */
export function WaxSeal({ initials, separator, tone = "ivory", half, className }: Props) {
  const id = useId().replace(/:/g, "");
  const [one, two] = initials;
  const disc = tone === "wax" ? ["#b8463a", "#7d2620"] : ["#fdfbf6", "#e7dcc6"];
  const clip = half === "left" ? "inset(0 50% 0 0)" : half === "right" ? "inset(0 0 0 50%)" : undefined;

  return (
    <svg aria-hidden viewBox="0 0 120 120" className={cn("block overflow-visible", className)} style={{ clipPath: clip }}>
      <defs>
        <radialGradient id={`${id}-disc`} cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor={disc[0]} />
          <stop offset="100%" stopColor={disc[1]} />
        </radialGradient>
        {/* On the pale disc the gold is deepened so the initials hold 3:1; on red wax it stays bright. */}
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" style={{ stopColor: tone === "wax" ? "color-mix(in oklab, var(--w-metal), white 45%)" : "color-mix(in oklab, var(--w-metal), black 20%)" }} />
          <stop offset="50%" style={{ stopColor: tone === "wax" ? "var(--w-metal)" : "color-mix(in oklab, var(--w-metal), black 40%)" }} />
          <stop offset="100%" style={{ stopColor: tone === "wax" ? "color-mix(in oklab, var(--w-metal), black 30%)" : "color-mix(in oklab, var(--w-metal), black 55%)" }} />
        </linearGradient>
      </defs>
      <path d={RIM} fill={`url(#${id}-disc)`} />
      <path d={RIM} fill="none" stroke="rgb(0 0 0 / 0.08)" strokeWidth="1" />
      <circle cx="60" cy="60" r="44" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="1.4" opacity="0.8" />
      <circle cx="60" cy="60" r="40" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="0.6" strokeDasharray="1 2.4" opacity="0.7" />
      <g fill={`url(#${id}-gold)`} fontFamily="var(--font-display)" textAnchor="middle" dominantBaseline="central">
        {separator === "&" ? (
          <>
            {/* Two capitals overlapping, the way a monogram interlocks them. */}
            <text x="50" y="62" fontSize="46">
              {one}
            </text>
            <text x="71" y="62" fontSize="46">
              {two}
            </text>
          </>
        ) : (
          <>
            <text x="38" y="62" fontSize="32">
              {one}
            </text>
            <text x="60" y="62" fontSize="24">
              {separator}
            </text>
            <text x="82" y="62" fontSize="32">
              {two}
            </text>
          </>
        )}
      </g>
    </svg>
  );
}
