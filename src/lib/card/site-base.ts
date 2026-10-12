import "server-only";

import { headers } from "next/headers";
import { TENANT_HEADER } from "@/lib/constants";
import { requestOrigin } from "@/lib/site-links";
import { resolveTenant } from "@/lib/tenant";

/**
 * "" on the couple's subdomain, "/s/<slug>" on the main domain: where the
 * couple's pages start on this host. The middleware's tenant header counts only
 * when the Host agrees, so a client can't send the header to the main domain.
 */
export async function sitePathFromRequest(slug: string): Promise<string> {
  const h = await headers();
  const onSubdomain =
    h.get(TENANT_HEADER) === slug && resolveTenant(h.get("host"), process.env.NEXT_PUBLIC_ROOT_DOMAIN) === slug;
  return onSubdomain ? "" : `/s/${slug}`;
}

/**
 * The couple's site link as the visitor reached it: the subdomain root when the
 * request came in on <slug>.<root domain>, otherwise /s/<slug> on this host.
 * Card, pass and private-page links are built on it, so they stay on that host.
 */
export async function siteBaseFromRequest(slug: string): Promise<string> {
  return `${await requestOrigin()}${await sitePathFromRequest(slug)}`;
}
