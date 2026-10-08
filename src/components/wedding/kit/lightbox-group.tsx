"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { Lightbox, type GalleryPhoto } from "../lightbox";

type Props = {
  photos: GalleryPhoto[];
  /** The couple's names; the viewer's fallback alt text is "<label> <n>". */
  label: string;
  children: ReactNode;
  className?: string;
};

/**
 * Lets a server-rendered gallery open the shared Lightbox. Any button inside
 * with data-lightbox-index="n" opens photo n of `photos`; one click listener
 * on this wrapper handles them all, and real buttons keep the keyboard
 * working. The children stay server components.
 */
export function LightboxGroup({ photos, label, children, className }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest<HTMLElement>("[data-lightbox-index]");
    if (!trigger || !event.currentTarget.contains(trigger)) return;
    const index = Number(trigger.dataset.lightboxIndex);
    if (!Number.isInteger(index) || index < 0 || index >= photos.length) return;
    event.preventDefault();
    setOpen(index);
  };

  return (
    // Clicks bubble here from the photo buttons, which handle the keyboard themselves.
    <div className={className} onClick={onClick}>
      {children}
      <Lightbox photos={photos} names={label} index={open} onIndexChange={setOpen} />
    </div>
  );
}
