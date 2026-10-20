import { cn } from "@/lib/utils";
import styles from "./tassel.module.css";

/**
 * Leaf angles round the wreath, in degrees counter-clockwise from three
 * o'clock: each branch rises from the foot (near six o'clock) and stops short
 * of the knot at the top, leaving the gap a laurel wreath has.
 */
const LEFT = Array.from({ length: 9 }, (_, index) => 258 - index * 17);
const RIGHT = LEFT.map((angle) => 540 - angle);

/**
 * A laurel wreath around the honorees' initials, hung on a cord from the top of
 * the page with a gold tassel falling from its knot. Decorative; the names
 * beside it carry the meaning. The initials take the page's display face, and
 * three or more set smaller so they still fit inside the wreath.
 */
export function Crest({ initials, className }: { initials: string[]; className?: string }) {
  const letters = initials.join("");
  const size = letters.length <= 2 ? 44 : letters.length === 3 ? 34 : 26;

  return (
    <svg aria-hidden viewBox="0 0 200 260" className={cn("overflow-visible", className)}>
      {/* The cord down from the top of the band to the knot. */}
      <path d="M100 -400V48" stroke="var(--w-metal)" strokeWidth="1.5" />
      <g fill="var(--w-metal)">
        {[LEFT, RIGHT].map((branch, side) =>
          branch.map((angle, index) => {
            const rad = (angle * Math.PI) / 180;
            const x = (100 + 78 * Math.cos(rad)).toFixed(2);
            const y = (140 - 78 * Math.sin(rad)).toFixed(2);
            // Along the circle, splayed a little outward and toward the top.
            const tilt = -angle + (side === 0 ? 28 : -28);
            return (
              <ellipse
                key={`${side}-${index}`}
                cx={x}
                cy={y}
                rx="5"
                ry="12"
                transform={`rotate(${tilt} ${x} ${y})`}
                opacity={0.55 + (index % 3) * 0.15}
              />
            );
          }),
        )}
      </g>
      <circle cx="100" cy="140" r="62" fill="none" stroke="var(--w-metal)" strokeWidth="1.25" />
      <circle cx="100" cy="140" r="57" fill="none" stroke="var(--w-metal)" strokeWidth="0.6" strokeDasharray="1 3" />
      <text
        x="100"
        y="142"
        textAnchor="middle"
        dominantBaseline="central"
        fill="currentColor"
        fontFamily="var(--font-display)"
        fontSize={size}
        letterSpacing={letters.length > 2 ? 2 : 6}
      >
        {letters}
      </text>
      {/* Knot at the top of the wreath, and the tassel swinging from it. */}
      <circle cx="100" cy="52" r="5" fill="var(--w-metal)" />
      <g className={styles.tassel} style={{ transformBox: "view-box", transformOrigin: "100px 52px" }}>
        <path d="M100 52c14 6 26 18 30 34" fill="none" stroke="var(--w-metal)" strokeWidth="1.5" />
        <rect x="125" y="84" width="10" height="8" rx="2" fill="var(--w-metal)" />
        <path d="M124 92h12l4 34h-20Z" fill="var(--w-metal)" />
        <path d="M124 96v28M128 96v30M132 96v30M136 96v28" stroke="var(--w-thread-1)" strokeWidth="0.6" opacity="0.5" />
      </g>
    </svg>
  );
}
