import { RESERVED_SLUGS } from "./slug";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function stripPort(host: string) {
  return host.split(":")[0];
}

/**
 * Works out which couple a request is for from its Host header.
 * `demo.localhost:3000` always works in development; production subdomains
 * only resolve when they sit directly under the configured root domain.
 */
export function resolveTenant(host: string | null | undefined, rootDomain: string | undefined): string | null {
  if (!host) return null;
  const hostname = stripPort(host.trim().toLowerCase());

  let candidate: string | null = null;

  if (hostname.endsWith(".localhost")) {
    candidate = hostname.slice(0, -".localhost".length);
  } else if (rootDomain) {
    const root = stripPort(rootDomain.trim().toLowerCase());
    if (hostname.endsWith(`.${root}`)) {
      candidate = hostname.slice(0, -(root.length + 1));
    }
  }

  if (!candidate || candidate.includes(".")) return null;
  if (!SLUG_PATTERN.test(candidate) || RESERVED_SLUGS.has(candidate)) return null;
  return candidate;
}

export type RouteDecision =
  | { kind: "platform" }
  | { kind: "guest" }
  | { kind: "not-found" }
  | { kind: "tenant"; slug: string; path: string };

/** Admin and sign-in only exist on the main domain, never on a couple's subdomain. */
const PLATFORM_ONLY = /^\/(api\/admin|admin|sign-in|sign-up)(\/|$)/;
const COUPLE_PATH = /^\/s(\/|$)/;

/**
 * Decides what the middleware does with a request.
 * - tenant: a couple's subdomain, rewritten to /s/<slug>
 * - guest: /s/<slug> on the main domain with no sign-in session, served without auth
 *   so guests and link-preview crawlers never hit an auth redirect
 * - platform: everything else, including /s/<slug> for a signed-in admin previewing a draft
 */
export function routeRequest(
  host: string | null | undefined,
  pathname: string,
  rootDomain: string | undefined,
  { hasSession = false }: { hasSession?: boolean } = {},
): RouteDecision {
  const slug = resolveTenant(host, rootDomain);
  if (!slug) return COUPLE_PATH.test(pathname) && !hasSession ? { kind: "guest" } : { kind: "platform" };
  if (PLATFORM_ONLY.test(pathname)) return { kind: "not-found" };
  const path = pathname.startsWith("/api/") ? pathname : tenantRewritePath(slug, pathname);
  return { kind: "tenant", slug, path };
}

export function tenantRewritePath(slug: string, pathname: string): string {
  const rest = pathname === "/" ? "" : pathname;
  return `/s/${slug}${rest}`;
}

export function coupleSiteUrl(slug: string, opts: { rootDomain: string | undefined; origin: string }): string {
  const origin = new URL(opts.origin);
  if (!opts.rootDomain) {
    return `${origin.origin}/s/${slug}`;
  }
  const [rootHost, rootPort] = opts.rootDomain.split(":");
  const port = rootPort ? `:${rootPort}` : "";
  return `${origin.protocol}//${slug}.${rootHost}${port}`;
}
