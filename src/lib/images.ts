const OPTIMIZABLE_HOSTS = [/^images\.unsplash\.com$/, /\.public\.blob\.vercel-storage\.com$/];

/** next/image only optimizes hosts listed in next.config.ts; anything else must be served unoptimized. */
export function canOptimizeImage(src: string): boolean {
  // Vector art is already as small as it gets, and the optimizer refuses SVG.
  if (/\.svg(\?|#|$)/i.test(src)) return false;
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && OPTIMIZABLE_HOSTS.some((host) => host.test(url.hostname));
  } catch {
    return false;
  }
}
