import "server-only";

import { headers } from "next/headers";
import { coupleSiteUrl } from "./tenant";

export async function requestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const local = /(^|\.)localhost(:\d+)?$/.test(host);
  const proto = h.get("x-forwarded-proto") ?? (local ? "http" : "https");
  return `${proto}://${host}`;
}

/**
 * share: the link to send guests (subdomain when a root domain is configured).
 * preview: always-working path link on the current host, also used for drafts.
 * pattern: share link with "{slug}" left in, for showing while typing a new slug.
 */
export async function siteLinks(slug: string) {
  const origin = await requestOrigin();
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || undefined;
  return {
    share: coupleSiteUrl(slug, { rootDomain, origin }),
    preview: `${origin}/s/${slug}`,
    pattern: coupleSiteUrl("{slug}", { rootDomain, origin }),
  };
}
