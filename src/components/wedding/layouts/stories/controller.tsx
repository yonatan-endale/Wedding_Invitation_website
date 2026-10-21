"use client";

import { useEffect, useState } from "react";
import styles from "./controller.module.css";

type Props = {
  /** The cards on the page, counted on the server so the bar is there before scripts run. */
  count: number;
  labels: { previous: string; next: string };
};

/** Arrow keys stay with these: typing, pickers, radio groups and dialogs keep their own. */
const KEEPS_KEYS =
  "input,textarea,select,[contenteditable],iframe,[role=dialog],[role=listbox],[role=menu],[role=radiogroup],[role=slider],[role=spinbutton],[role=tablist]";
/** A tap on one of these does its own thing, never a step. */
const CONTROLS = "a,button,input,select,textarea,label,summary,iframe,[role=button]";
const KEYS: Partial<Record<string, 1 | -1>> = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 };

const cards = () => [...document.querySelectorAll<HTMLElement>("[data-story-card]")];

/** Where a snapped card's top rests: its scroll-margin-top, under the header. */
const restLine = (card: HTMLElement) => parseFloat(getComputedStyle(card).scrollMarginTop) || 0;

/** A move in flight. Quick presses count on from its target, not from wherever the smooth scroll has got to. */
let flight = { index: 0, until: 0 };

/** The card resting at the top: the last one whose top has reached the rest line. */
function currentIndex(list: HTMLElement[]): number {
  if (performance.now() < flight.until) return flight.index;
  const line = restLine(list[0]) + 4;
  let index = 0;
  list.forEach((card, i) => {
    if (card.getBoundingClientRect().top <= line) index = i;
  });
  return index;
}

/** Scrolls the window (never an inner box) to a card; instantly when motion is reduced or paused. */
function go(list: HTMLElement[], index: number, focus: boolean): boolean {
  const card = list[index];
  if (!card) return false;
  const still = document.documentElement.hasAttribute("data-motion-off") || matchMedia("(prefers-reduced-motion: reduce)").matches;
  flight = { index, until: performance.now() + (still ? 0 : 700) };
  card.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
  // Tab carries on from the card on screen.
  if (focus) card.focus({ preventScroll: true });
  return true;
}

/**
 * One card back or on. A key first reads through a card taller than the
 * screen: it returns false and the page scrolls as usual. The buttons move
 * whole cards, and "back" from inside a long card returns to its top first.
 */
function step(direction: 1 | -1, key: boolean): boolean {
  const list = cards();
  if (!list.length) return false;
  const index = currentIndex(list);
  if (performance.now() >= flight.until) {
    const box = list[index].getBoundingClientRect();
    const inside = box.top < restLine(list[index]) - 4;
    if (key && (direction > 0 ? box.bottom > innerHeight + 4 : inside)) return false;
    if (direction < 0 && inside) return go(list, index, key);
  }
  return go(list, index + direction, key);
}

/**
 * The stories' controls, the only client code the layout adds: a progress
 * bar with a segment per card (filled up to the current one), arrow and
 * page keys that move card by card without taking them from form fields,
 * taps on the left or right third of a photo card, up and down buttons
 * beside the column on wide screens, and the address bar's #hash kept on
 * the current card. Nothing ever moves on by itself. One
 * IntersectionObserver finds the current card; the window does the
 * scrolling, so the header links, reveals and music button work as usual.
 */
export function StoryController({ count, labels }: Props) {
  const [on, setOn] = useState(0);
  const [tone, setTone] = useState("dark");

  useEffect(() => {
    let first = true;
    let timer = 0;
    // A thin line two fifths of the way down the window: the card crossing it is the current one.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const card = entry.target as HTMLElement;
          setOn(cards().indexOf(card));
          setTone(card.dataset.tone || "dark");
          // The first report is the page as it loaded; leave a #hash the guest arrived with alone.
          if (first) continue;
          window.clearTimeout(timer);
          timer = window.setTimeout(() => {
            const hash = card.dataset.hash ? `#${card.dataset.hash}` : "";
            if (hash !== location.hash) history.replaceState(history.state, "", hash || location.pathname + location.search);
          }, 400);
        }
        first = false;
      },
      { rootMargin: "-40% 0px -59% 0px" },
    );
    cards().forEach((card) => observer.observe(card));

    const onKey = (event: KeyboardEvent) => {
      const direction = KEYS[event.key];
      const target = event.target;
      if (!direction || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (target instanceof Element && target.closest(KEEPS_KEYS)) return;
      // Not while the opening screen covers the page, or a dialog (the photo viewer, the menu) holds it.
      if (document.documentElement.dataset.intro === "shown" || document.body.hasAttribute("data-scroll-locked")) return;
      if (step(direction, true)) event.preventDefault();
    };

    const onTap = (event: MouseEvent) => {
      const target = event.target;
      if (event.button || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (!(target instanceof Element) || target.closest(CONTROLS) || String(getSelection())) return;
      const card = target.closest<HTMLElement>("[data-tap]");
      if (!card) return;
      const box = card.getBoundingClientRect();
      // Measured from where the line starts, so the back zone is on the right in Arabic.
      const fromLeft = (event.clientX - box.left) / box.width;
      const across = getComputedStyle(card).direction === "rtl" ? 1 - fromLeft : fromLeft;
      const list = cards();
      if (across < 1 / 3) go(list, list.indexOf(card) - 1, false);
      else if (across > 2 / 3) go(list, list.indexOf(card) + 1, false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onTap);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onTap);
    };
  }, [count]);

  return (
    <>
      {/* Decorative: the header links, the keys, the buttons and plain scrolling all reach every card. */}
      <div aria-hidden className={styles.bar} data-tone={tone}>
        {Array.from({ length: count }, (_, index) => (
          <span key={index} className={styles.segment} data-on={index <= on ? "" : undefined}>
            <span />
          </span>
        ))}
      </div>
      <div className={styles.nav}>
        <button type="button" className={styles.button} aria-label={labels.previous} disabled={on < 1} onClick={() => step(-1, false)}>
          <svg aria-hidden viewBox="0 0 24 24">
            <path d="m6 15 6-6 6 6" />
          </svg>
        </button>
        <button type="button" className={styles.button} aria-label={labels.next} disabled={on >= count - 1} onClick={() => step(1, false)}>
          <svg aria-hidden viewBox="0 0 24 24">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      </div>
    </>
  );
}
