import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./stories.module.css";

type Props = {
  as?: "section" | "div" | "footer";
  id?: string;
  /**
   * The address bar's #hash while this card is current. Defaults to the id;
   * follow-on cards (the second schedule card, the photos after the first)
   * repeat their section's, and the cover has none.
   */
  hash?: string;
  /** "dark" for photo and colour cards (the progress bar turns white), "light" for paper. */
  tone: "dark" | "light";
  /** Photo cards: a tap on the left or right third steps back or forward, like stories on a phone. */
  tap?: boolean;
  /** Holds a shared section, which brings its own heading, id and padding. */
  shared?: boolean;
  labelledBy?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

/**
 * One full-screen card. The window scrolls and snaps gently to each card's
 * top; StoryController finds the cards by data-story-card, reads their tone
 * and hash, and focuses them (tabIndex -1) when the arrow keys move on, so
 * Tab carries on from the card on screen. A server component.
 */
export function StoryCard({ as: Tag = "section", id, hash = id, tone, tap, shared, labelledBy, className, style, children }: Props) {
  return (
    <Tag
      id={id}
      tabIndex={-1}
      aria-labelledby={labelledBy}
      data-story-card=""
      data-hash={hash}
      data-tone={tone}
      data-tap={tap ? "" : undefined}
      className={cn(styles.card, shared && styles.shared, className)}
      style={style}
    >
      {children}
    </Tag>
  );
}

/** A pill-shaped sticker, set in the sans like a phone's own labels. */
export const pill =
  "inline-flex max-w-full items-center justify-center gap-1.5 rounded-[1.25rem] px-3.5 py-1.5 text-center font-sans text-sm leading-snug font-semibold";

/** The near-black under photo and colour cards, so white type always holds its contrast whatever the theme. */
export const darkGround = "bg-[#110f0e] text-white";

/** Photo scrims: dark at the top behind the bar, and deeper at the foot behind the words. */
export function Scrims({ foot = "h-[62%]" }: { foot?: string }) {
  return (
    <>
      <span aria-hidden className="absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-black/55 to-transparent" />
      <span aria-hidden className={cn("absolute inset-x-0 bottom-0 -z-10 bg-gradient-to-t from-black/85 via-black/45 to-transparent", foot)} />
    </>
  );
}

/*
 * The ring round a story avatar, in the theme's threads and metal. A plain
 * conic gradient of theme colours, so it needs no fallback.
 */
const RING: CSSProperties = {
  backgroundImage:
    "conic-gradient(from 210deg, var(--w-metal), var(--w-thread-1), var(--w-thread-3), var(--w-thread-2), var(--w-metal))",
};

/**
 * A round avatar inside the story ring: a photo (pass a WeddingImage with
 * `fill`) or the couple's initials. `ground` is the thin gap between the ring
 * and the picture, the colour of the card behind. Decorative unless the
 * image inside carries alt text. Size it with a size-* class.
 */
export function StoryRing({ children, className, ground }: { children: ReactNode; className?: string; ground: string }) {
  return (
    <span className={cn("block shrink-0 rounded-full p-[2.5px]", className)} style={RING}>
      <span className={cn("block size-full rounded-full p-[2.5px]", ground)}>
        <span className="relative flex size-full items-center justify-center overflow-hidden rounded-full bg-sheet text-ink">
          {children}
        </span>
      </span>
    </span>
  );
}

/** The couple's initials for an avatar without a photo: "D & S", or "ዳ ፡ ሲ" in Amharic. */
export function Initials({ initials, separator, className }: { initials: [string, string]; separator: string; className?: string }) {
  return (
    <span aria-hidden className={cn("font-display leading-none whitespace-nowrap", className)}>
      {initials[0]}
      <span className="mx-[0.12em] text-[0.62em] text-ink-soft">{separator}</span>
      {initials[1]}
    </span>
  );
}
