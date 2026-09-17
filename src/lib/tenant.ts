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
