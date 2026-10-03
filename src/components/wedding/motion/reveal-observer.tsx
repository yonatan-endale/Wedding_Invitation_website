"use client";

import { useEffect } from "react";
import { useIntroOpen } from "../intro/intro-context";

const TARGETS = "[data-reveal-group], [data-reveal]:not([data-reveal-group] [data-reveal]), [data-stage]";

/**
 * Plays the CSS reveals in globals.css. Server components mark elements with
 * data-reveal (or a data-reveal-group parent, or data-stage for choreographed
 * sections); this one observer sets data-shown the first time each one scrolls
 * into view, then lets it go. It waits for the opening screen so entrances are
 * not spent behind it, and also catches elements added later, for example after
 * the language switch re-renders the page.
 */
export function RevealObserver() {
  const introOpen = useIntroOpen();

  useEffect(() => {
    const root = document.documentElement;
    // If hydration took longer than the CSS failsafe, the content is already
    // visible; keep what is on screen visible instead of hiding it again.
    if (performance.now() > 2300) {
      for (const element of document.querySelectorAll<HTMLElement>(TARGETS)) {
        if (element.getBoundingClientRect().top < window.innerHeight) element.setAttribute("data-shown", "");
      }
    }
    root.dataset.revealReady = "";
  }, []);

  useEffect(() => {
    if (!introOpen) return;
    const show = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.setAttribute("data-shown", "");
        observer.unobserve(entry.target);
      }
    };
    const elements = new IntersectionObserver(show, { rootMargin: "0px 0px -10% 0px", threshold: 0 });
    const stages = new IntersectionObserver(show, { threshold: 0.3 });
    const watch = (element: Element) => {
      if (element.hasAttribute("data-shown")) return;
      (element.hasAttribute("data-stage") ? stages : elements).observe(element);
    };
    document.querySelectorAll(TARGETS).forEach(watch);

    const added = new MutationObserver((records) => {
      for (const record of records) {
        record.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches(TARGETS)) watch(node);
          node.querySelectorAll(TARGETS).forEach(watch);
        });
      }
    });
    added.observe(document.body, { childList: true, subtree: true });

    return () => {
      elements.disconnect();
      stages.disconnect();
      added.disconnect();
    };
  }, [introOpen]);

  return null;
}
