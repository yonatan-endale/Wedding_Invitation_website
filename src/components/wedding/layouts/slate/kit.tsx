import type { CSSProperties, ReactNode } from "react";
import { type Locale, isEthiopic } from "@/lib/localized";
import { cn } from "@/lib/utils";
import styles from "./slate.module.css";

export const order = (index: number) => ({ "--i": index }) as CSSProperties;

/** Small tracked capitals in the sans; Ge'ez is never uppercased or spaced out, and is set a size up. */
export const slateEyebrow =
  "font-sans text-xs font-semibold uppercase tracking-[0.2em] ethiopic:text-sm ethiopic:font-medium ethiopic:tracking-normal ethiopic:normal-case";

/**
 * The day and the city: one line on wider screens with a small diamond
 * between them, two lines on a phone so the diamond is never left hanging.
 */
export function DateAndPlace({ date, city, className, style }: { date: string; city: string; className?: string; style?: CSSProperties }) {
  return (
    <p className={cn(slateEyebrow, "lining-nums", className)} style={style}>
      <span className="block sm:inline">{date}</span>
      {city ? (
        <>
          <span aria-hidden className="mx-2.5 hidden size-[5px] rotate-45 bg-(--slate-glow) align-middle sm:inline-block" />
          <span className="sr-only sm:hidden">, </span>
          <span className="mt-1 block sm:mt-0 sm:inline">{city}</span>
        </>
      ) : null}
    </p>
  );
}

/**
 * The script accent line over a serif title. English gets the flowing script;
 * Ge'ez has no script cut, so Amharic pages set the same line in the display face.
 */
export function Kicker({
  locale,
  className,
  style,
  children,
}: {
  locale: Locale;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <p
      data-reveal="up"
      style={style}
      className={cn(
        "text-(--slate-accent)",
        isEthiopic(locale)
          ? "font-display text-[clamp(1.15rem,3.6vw,1.45rem)] leading-snug"
          : "font-script text-[clamp(2rem,6.4vw,2.75rem)] leading-[1.15]",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** A hairline either side of a small diamond, in the accent; it grows from its centre as it comes into view. */
export function Divider({ className, style }: { className?: string; style?: CSSProperties }) {
  return <span aria-hidden data-reveal="rule" style={style} className={cn(styles.divider, className)} />;
}

/** Slate's section heading: the script accent line, the serif title, the divider and an optional line beneath. */
export function SlateHeading({
  id,
  kicker,
  locale,
  sub,
  children,
}: {
  id: string;
  kicker: string;
  locale: Locale;
  sub?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div data-reveal-group className="text-center">
      <Kicker locale={locale}>{kicker}</Kicker>
      <h2
        id={id}
        data-reveal="up"
        style={order(1)}
        className="mt-1 text-[clamp(2rem,5.6vw,3rem)] leading-[1.12] text-ink ethiopic:mt-2 ethiopic:text-[clamp(1.7rem,5vw,2.4rem)] ethiopic:leading-[1.3]"
      >
        {children}
      </h2>
      <Divider className="mt-5" style={order(2)} />
      {sub ? (
        <p data-reveal="up" style={order(3)} className={cn(slateEyebrow, "mt-5 text-ink-soft lining-nums")}>
          {sub}
        </p>
      ) : null}
    </div>
  );
}

/**
 * The couple's initials in a fine ring, with "&" between them (the Ethiopic
 * wordspace in Amharic): in the accent on paper and cards, in white with a
 * glowing ring on the band.
 */
export function Monogram({
  initials,
  locale,
  tone = "paper",
  className,
}: {
  initials: [string, string];
  locale: Locale;
  tone?: "paper" | "band";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full border font-display leading-none whitespace-nowrap",
        tone === "band" ? "border-(--slate-glow) text-white" : "border-(--slate-accent) text-(--slate-accent)",
        className,
      )}
    >
      {initials[0]}
      {isEthiopic(locale) ? (
        <span className="mx-[0.18em]">፡</span>
      ) : (
        <span className={cn("mx-[0.12em] -mt-[0.05em] font-script text-[1.2em]", tone === "band" && "text-(--slate-glow)")}>&amp;</span>
      )}
      {initials[1]}
    </span>
  );
}

/**
 * A shared section set in a white card under Slate's script accent line. The
 * section keeps its own id, heading and content; its top padding, rule and
 * band give way to the card (see .shared), and its heading takes Slate's size
 * and divider.
 */
export function SharedCard({
  kicker,
  locale,
  width = "max-w-3xl",
  className,
  children,
}: {
  kicker: string;
  locale: Locale;
  width?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className="px-3 py-8 sm:px-8 sm:py-12">
      <div className={cn(styles.card, styles.shared, "mx-auto pt-12 sm:pt-16 [&>section]:pb-12 sm:[&>section]:pb-16", width, className)}>
        <Kicker locale={locale} className="mb-1 px-5 text-center ethiopic:mb-2">
          {kicker}
        </Kicker>
        {children}
      </div>
    </div>
  );
}
