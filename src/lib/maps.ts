export type Locatable = {
  mapsUrl?: string | null;
  lat?: number | null;
  lng?: number | null;
  address?: string | null;
};

function hasCoordinates(place: Locatable): place is Locatable & { lat: number; lng: number } {
  return typeof place.lat === "number" && typeof place.lng === "number";
}

function isHttpUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function query(place: Locatable): string | null {
  if (hasCoordinates(place)) return `${place.lat},${place.lng}`;
  const address = place.address?.trim();
  return address ? address : null;
}

/** Link that opens the venue in Google Maps (or the native maps app on phones). */
export function mapsLink(place: Locatable): string | null {
  if (isHttpUrl(place.mapsUrl)) return place.mapsUrl;
  const q = query(place);
  return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : null;
}

/** Keyless Google Maps embed for an iframe. */
export function mapsEmbedUrl(place: Locatable): string | null {
  const q = query(place);
  return q ? `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed` : null;
}
