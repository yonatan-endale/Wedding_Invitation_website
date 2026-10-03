"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useMusic } from "../music";
import { openedKey } from "./opened-key";

export type IntroPhase = "shown" | "opening" | "done";

type IntroState = { phase: IntroPhase; open: () => void; finish: () => void };

const IntroContext = createContext<IntroState>({ phase: "done", open: () => {}, finish: () => {} });

export const useIntro = () => useContext(IntroContext);

/** True once the guest has tapped open (or skipped the opening on a return visit). */
export const useIntroOpen = () => useIntro().phase !== "shown";

/**
 * The opening screen's lifecycle, shared by every opening: shown, then opening
 * while it animates away, then done. The boot script has already marked
 * <html data-intro="done"> for guests who opened it earlier in this browser
 * session, so they never see it. While the opening is up, the page behind is
 * locked and inert; afterwards focus moves to the top of the site.
 */
export function IntroProvider({ slug, children }: { slug: string; children: ReactNode }) {
  const { play } = useMusic();
  const [phase, setPhase] = useState<IntroPhase>("shown");
  const openedNow = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    // On a very slow load the CSS failsafe may already have hidden the opening
    // (it waits 8s for hydration). The guest is using the page by then, so
    // treat it as dismissed instead of bringing it back. Checked before
    // data-hydrated is set, because that attribute cancels the failsafe.
    const cover = document.querySelector<HTMLElement>("[data-opening]");
    if (cover && getComputedStyle(cover).visibility === "hidden") root.dataset.intro = "done";
    root.dataset.hydrated = "";
    if (root.dataset.intro === "done") setPhase("done");
    else root.dataset.intro = "shown";
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const site = document.getElementById("site");
    if (phase === "done" || root.dataset.intro === "done") return;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    if (site) site.inert = true;
    return () => {
      root.style.overflow = previous;
      if (site) site.inert = false;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== "done" || !openedNow.current) return;
    // A link to a section (e.g. #rsvp) lands there; otherwise the guest starts at the top.
    let hash = window.location.hash.slice(1);
    try {
      hash = decodeURIComponent(hash);
    } catch {
      // A malformed escape in a shared link: use the raw fragment.
    }
    const linked = hash ? document.getElementById(hash) : null;
    linked?.scrollIntoView();
    const target = linked ?? document.getElementById("top");
    if (target) {
      if (!target.hasAttribute("tabindex") && !target.matches("a[href], button, input, select, textarea")) {
        target.setAttribute("tabindex", "-1");
      }
      target.focus({ preventScroll: true });
    }
  }, [phase]);

  const open = useCallback(() => {
    // First, and synchronously: browsers only allow audio inside the tap itself.
    play();
    try {
      window.sessionStorage.setItem(openedKey(slug), "1");
    } catch {
      // Storage can be blocked; the opening simply shows again next time.
    }
    openedNow.current = true;
    document.documentElement.dataset.intro = "opening";
    setPhase("opening");
  }, [play, slug]);

  const finish = useCallback(() => {
    document.documentElement.dataset.intro = "done";
    setPhase("done");
  }, []);

  const value = useMemo(() => ({ phase, open, finish }), [phase, open, finish]);
  return <IntroContext value={value}>{children}</IntroContext>;
}
