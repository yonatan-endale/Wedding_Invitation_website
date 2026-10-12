/**
 * Google Fonts for next/og images, which need raw font data rather than CSS.
 * Google serves TrueType when the request has no browser user agent. Both
 * loaders return null when offline or when the font has none of the
 * characters, so the image falls back to another font.
 */

const family = (name: string) => `family=${encodeURIComponent(name).replace(/%20/g, "+")}`;

async function fetchFont(query: string): Promise<ArrayBuffer | null> {
  try {
    // force-cache keeps the stylesheet and font in Next's data cache across requests and instances.
    const css = await (await fetch(`https://fonts.googleapis.com/css2?${query}`, { cache: "force-cache" })).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    const response = await fetch(url, { cache: "force-cache" });
    return response.ok ? await response.arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** The font cut down to just the characters in `text`; small, for images whose text rarely changes. */
export async function loadGoogleFont(name: string, text: string): Promise<ArrayBuffer | null> {
  if (!text.trim()) return null;
  return fetchFont(`${family(name)}&text=${encodeURIComponent(text)}`);
}

const fullFonts = new Map<string, Promise<ArrayBuffer | null>>();

/**
 * The whole font, fetched once per server instance, for images whose text
 * changes with every request (a guest's name). A failed fetch is retried next time.
 */
export function loadFullGoogleFont(name: string): Promise<ArrayBuffer | null> {
  let pending = fullFonts.get(name);
  if (!pending) {
    pending = fetchFont(family(name)).then((data) => {
      if (!data) fullFonts.delete(name);
      return data;
    });
    fullFonts.set(name, pending);
  }
  return pending;
}
