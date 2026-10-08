import type { ReactNode } from "react";
import type { Ornament } from "@/lib/appearance";
import { eventIconFor, hasEventIcon, type EventIconName, type EventKind } from "@/lib/event-kinds";
import { cn } from "@/lib/utils";

/** Line drawings on a 24-unit square, stroked 1.5 in currentColor by the symbol around them. */
const DRAWINGS: Record<EventIconName, ReactNode> = {
  // A wrapped gift with a bow, for the telosh.
  gift: (
    <>
      <rect x="3.5" y="8.5" width="17" height="4" rx="1" />
      <path d="M5 12.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19v-6.5M12 8.5v12" />
      <path d="M12 8.5C10 8.5 7.5 7.6 7.5 5.9 7.5 4.8 8.3 4 9.3 4 11 4 12 6.4 12 8.5Zm0 0c2 0 4.5-.9 4.5-2.6 0-1.1-.8-1.9-1.8-1.9C13 4 12 6.4 12 8.5Z" />
    </>
  ),
  // Two rings, one set with a stone.
  rings: (
    <>
      <circle cx="9" cy="15" r="5.5" />
      <circle cx="15.5" cy="13" r="5.5" />
      <path d="M9 9.5 7.6 7.9 9 6.4l1.4 1.5Z" />
    </>
  ),
  // A church with a steeple and no cross, for a ceremony when no faith ornament is chosen.
  church: (
    <>
      <path d="M9.25 20.5V8L12 3.5 14.75 8v12.5M9.25 8h5.5M9.25 12.5l-4.75 3v5M14.75 12.5l4.75 3v5M3 20.5h18" />
      <path d="M11 20.5v-2.5a1 1 0 0 1 2 0v2.5" />
    </>
  ),
  // A budded cross through a lozenge, after the Ethiopian hand cross.
  "orthodox-cross": (
    <>
      <path d="M12 4.5v15M4.5 12h15M12 8.5l3.5 3.5-3.5 3.5L8.5 12Z" />
      <circle cx="12" cy="3.25" r="1.25" />
      <circle cx="12" cy="20.75" r="1.25" />
      <circle cx="3.25" cy="12" r="1.25" />
      <circle cx="20.75" cy="12" r="1.25" />
    </>
  ),
  // A slim plain cross.
  cross: <path d="M12 3v18M7 8.5h10" />,
  crescent: <path d="M10.19 4.1A8.5 8.5 0 1 0 19.9 13.81 7 7 0 0 1 10.19 4.1Z" />,
  camera: (
    <>
      <rect x="3" y="7.5" width="18" height="12.5" rx="2" />
      <path d="m8.5 7.5 1.25-2.5h4.5l1.25 2.5M17.5 10.5h.01" />
      <circle cx="12" cy="13.75" r="3.5" />
    </>
  ),
  // A mesob, the woven table basket, with its domed lid.
  mesob: (
    <>
      <path d="M5.5 11C5.5 6.5 8.5 3.25 12 2.75c3.5.5 6.5 3.75 6.5 8.25M4 11h16" />
      <path d="M5.75 11c.6 2.3 2.9 3.8 4.75 4.4-.4 2.1-1.6 3.9-3.5 5.1h10c-1.9-1.2-3.1-3-3.5-5.1 1.85-.6 4.15-2.1 4.75-4.4" />
      <path d="m8.5 8 1.17-1 1.16 1 1.17-1 1.17 1 1.16-1 1.17 1" />
    </>
  ),
  // Two hands raised, with the blessing falling between them.
  blessing: (
    <>
      <path d="M8.5 21v-3.5L4.6 13a2 2 0 0 1-.5-1.3V8a1.25 1.25 0 0 1 2.5 0v3.5l2.9 2.6" />
      <path d="M15.5 21v-3.5l3.9-4.5a2 2 0 0 0 .5-1.3V8a1.25 1.25 0 0 0-2.5 0v3.5l-2.9 2.6" />
      <path d="M12 3v3M8.75 4.25l1 1.75m5.5-1.75-1 1.75" />
    </>
  ),
  // A path winding home, for the mels.
  home: (
    <>
      <path d="M3.5 10.75 12 3.5l8.5 7.25M5.75 9v7.25h12.5V9M10.75 16.25V13h2.5v3.25" />
      <path d="M12 18.25c-.5 1.5-3 2.1-5.5 2.75" strokeDasharray="0 2.4" />
    </>
  ),
  // Two families meeting.
  families: (
    <>
      <path d="M12 7.1a5.75 5.75 0 0 1 0 9.8 5.75 5.75 0 0 1 0-9.8Z" fill="currentColor" fillOpacity="0.2" stroke="none" />
      <circle cx="9" cy="12" r="5.75" />
      <circle cx="15" cy="12" r="5.75" />
    </>
  ),
  // A jebena, with its handle and spout, and a small cup beside it.
  jebena: (
    <>
      <path d="M7 3.75c.2 2.5.2 5-.75 6.75C4.5 11.5 3.5 13.25 3.5 15.5c0 2.75 2.25 5 5 5s5-2.25 5-5c0-2.25-1-4-2.75-5-.95-1.75-.95-4.25-.75-6.75" />
      <path d="M6.6 6.5c-2.35.25-3.2 2.75-2.25 5.6M12.6 12l3.15-3M16.5 16.25H21l-.6 3.5a1 1 0 0 1-1 .75h-1.3a1 1 0 0 1-1-.75Z" />
    </>
  ),
  diamond: <path d="m12 7.5 4.5 4.5-4.5 4.5L7.5 12Z" />,
};

const symbolId = (kind: EventKind) => `event-icon-${kind}`;

/**
 * The event icons as one hidden sprite of <symbol>s, holding only the kinds
 * the couple's events use. The symbol ids are fixed, so render it once per
 * page. Each symbol is named after its kind and the ornament picks its drawing
 * (see eventIconFor), so EventIcon needs only the kind.
 */
export function EventIconSprite({ kinds, ornament }: { kinds: readonly EventKind[]; ornament: Ornament }) {
  const used = [...new Set(kinds)].filter(hasEventIcon);
  if (used.length === 0) return null;

  return (
    <svg aria-hidden width="0" height="0" className="absolute overflow-hidden">
      {used.map((kind) => (
        <symbol key={kind} id={symbolId(kind)} viewBox="0 0 24 24">
          <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            {DRAWINGS[eventIconFor(kind, ornament)]}
          </g>
        </symbol>
      ))}
    </svg>
  );
}

/** One event's icon from the sprite. Decorative: the event title beside it carries the meaning. */
export function EventIcon({ kind, className }: { kind: EventKind; className?: string }) {
  if (!hasEventIcon(kind)) return null;
  return (
    <svg aria-hidden viewBox="0 0 24 24" className={cn("size-[1em] shrink-0", className)}>
      <use href={`#${symbolId(kind)}`} />
    </svg>
  );
}
