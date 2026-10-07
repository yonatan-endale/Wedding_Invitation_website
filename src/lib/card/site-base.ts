import "server-only";

import { headers } from "next/headers";
import { TENANT_HEADER } from "@/lib/constants";
import { requestOrigin } from "@/lib/site-links";

/**
 * The couple's site link as the visitor reached it: the subdomain root when the
 * request came in on <slug>.<root domain>, otherwise /s/<slug> on this host.
 * Card, pass and private-page links are built on it, so they stay on that host.
 */
export async function siteBaseFromRequest(slug: string): Promise<string> {
  const origin = await requestOrigin();
  const onSubdomain = (await headers()).get(TENANT_HEADER) === slug;
  return onSubdomain ? origin : `${origin}/s/${slug}`;
}
