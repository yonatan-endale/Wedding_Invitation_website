"use client";

import { useEffect } from "react";

/**
 * Writes each held card's height to its --h, so a card taller than the
 * screen is held only once its foot is in view and every line of it can be
 * read first (see .hold in flatlay.module.css). Renders nothing; without it
 * the cards simply scroll.
 */
export function StackHeights() {
  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>("[data-hold]");
    const observer = new ResizeObserver((entries) => {
      for (const { target } of entries) {
        const card = target as HTMLElement;
        // offsetHeight is the laid-out height, unaffected by the card's turn or scale.
        card.style.setProperty("--h", `${card.offsetHeight}px`);
      }
    });
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return null;
}
