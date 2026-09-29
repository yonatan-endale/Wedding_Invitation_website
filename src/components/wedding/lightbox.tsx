"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dialog } from "radix-ui";
import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { WeddingImage } from "./primitives";

export type GalleryPhoto = { id: string; url: string; caption: string };

export const roundButton =
  "flex size-12 items-center justify-center rounded-full border transition-colors disabled:pointer-events-none disabled:opacity-30";

type Props = {
  photos: GalleryPhoto[];
  names: string;
  /** Index of the open photo, or null when closed. */
  index: number | null;
  onIndexChange: (index: number | null) => void;
};

/** Full-screen photo viewer shared by every gallery style. Arrow keys and the buttons step through. */
export function Lightbox({ photos, names, index, onIndexChange }: Props) {
  const t = useTranslations("gallery");
  const step = useCallback(
    (direction: 1 | -1) => {
      if (index === null) return;
      onIndexChange((index + direction + photos.length) % photos.length);
    },
    [index, onIndexChange, photos.length],
  );

  const current = index === null ? null : photos[index];
  const label = current ? current.caption || `${names} ${(index ?? 0) + 1}` : "";

  return (
    <Dialog.Root open={current !== null} onOpenChange={(value) => !value && onIndexChange(null)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-black/92" />
        <Dialog.Content
          className="fixed inset-0 z-[70] flex flex-col text-white outline-none"
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") step(1);
            if (event.key === "ArrowLeft") step(-1);
          }}
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">{label}</Dialog.Title>
          <div className="flex justify-end p-3">
            <Dialog.Close className={cn(roundButton, "border-white/30 hover:border-white")} aria-label={t("close")}>
              <X aria-hidden className="size-5" />
            </Dialog.Close>
          </div>
          <div className="relative mx-3 flex-1 sm:mx-16">
            {current ? (
              <WeddingImage key={current.id} src={current.url} alt={label} fill sizes="100vw" className="object-contain" />
            ) : null}
          </div>
          <div className="flex items-center justify-center gap-6 p-5">
            <button type="button" onClick={() => step(-1)} aria-label={t("previous")} className={cn(roundButton, "border-white/30 hover:border-white")}>
              <ChevronLeft aria-hidden className="size-5" />
            </button>
            <p className="min-w-20 text-center text-base tabular-nums" aria-live="polite">
              {t("counter", { current: (index ?? 0) + 1, total: photos.length })}
            </p>
            <button type="button" onClick={() => step(1)} aria-label={t("next")} className={cn(roundButton, "border-white/30 hover:border-white")}>
              <ChevronRight aria-hidden className="size-5" />
            </button>
          </div>
          {current?.caption ? <p className="px-6 pb-6 text-center text-white/80">{current.caption}</p> : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
