const OPTIMIZABLE_HOSTS = [/^images\.unsplash\.com$/, /\.public\.blob\.vercel-storage\.com$/];

/** next/image only optimizes hosts listed in next.config.ts; anything else must be served unoptimized. */
export function canOptimizeImage(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    const url = new URL(src);
    return url.protocol === "https:" && OPTIMIZABLE_HOSTS.some((host) => host.test(url.hostname));
  } catch {
    return false;
  }
}
