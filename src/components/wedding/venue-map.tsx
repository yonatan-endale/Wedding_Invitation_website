"use client";

import { MapPin } from "lucide-react";
import { useState } from "react";
import { buttonOutline, buttonPrimary } from "./primitives";

type Props = {
  name: string;
  href: string | null;
  embedSrc: string | null;
  labels: { open: string; show: string; hide: string; title: string };
};

/** The embedded map is open from the start; the button lets a guest collapse it. It still loads lazily. */
export function VenueMap({ href, embedSrc, labels }: Props) {
  const [showMap, setShowMap] = useState(true);

  return (
    <div className="mt-6">
      <div className="flex flex-wrap gap-3">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={buttonPrimary}>
            <MapPin aria-hidden className="size-4" />
            {labels.open}
          </a>
        ) : null}
        {embedSrc ? (
          <button type="button" aria-expanded={showMap} onClick={() => setShowMap((v) => !v)} className={buttonOutline}>
            {showMap ? labels.hide : labels.show}
          </button>
        ) : null}
      </div>
      {showMap && embedSrc ? (
        <iframe
          title={labels.title}
          src={embedSrc}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="mt-5 aspect-[4/3] w-full border border-rule bg-rule"
        />
      ) : null}
    </div>
  );
}
