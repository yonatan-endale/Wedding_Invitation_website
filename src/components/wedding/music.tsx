"use client";

import { Play } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type MusicState = { available: boolean; playing: boolean; play: () => void; toggle: () => void };

const MusicContext = createContext<MusicState>({
  available: false,
  playing: false,
  play: () => {},
  toggle: () => {},
});

export const useMusic = () => useContext(MusicContext);

/**
 * Browsers block autoplay, so music starts when a guest opens the invitation
 * (a click) and can be paused from the floating button.
 */
export function MusicProvider({ src, children }: { src: string | null; children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.7;
    audio.play().catch(() => setPlaying(false));
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) play();
    else audio.pause();
  }, [play]);

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") audioRef.current?.pause();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  const value = useMemo(() => ({ available: Boolean(src), playing, play, toggle }), [src, playing, play, toggle]);

  return (
    <MusicContext value={value}>
      {children}
      {src ? (
        <audio
          ref={audioRef}
          src={src}
          loop
          preload="none"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
      ) : null}
    </MusicContext>
  );
}

export function MusicButton({ title }: { title: string | null }) {
  const t = useTranslations("music");
  const { available, playing, toggle } = useMusic();
  if (!available) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? t("pause") : t("play")}
      title={title ? t("nowPlaying", { title }) : undefined}
      className="fixed right-4 bottom-4 z-40 flex size-14 items-center justify-center rounded-full bg-thread-1 text-on-thread-1 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.45)] transition-transform hover:scale-105 active:scale-95 sm:right-6 sm:bottom-6"
    >
      {playing ? (
        <span aria-hidden className="flex h-5 items-end gap-[3px]">
          {[0, 0.25, 0.5, 0.15].map((delay, index) => (
            <span
              key={index}
              className="block h-full w-[3px] origin-bottom rounded-full bg-current"
              style={{ animation: `music-bar 0.9s ease-in-out ${delay}s infinite` }}
            />
          ))}
        </span>
      ) : (
        <Play aria-hidden className="ml-0.5 size-5 fill-current" />
      )}
    </button>
  );
}
