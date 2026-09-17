import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { TENANT_HEADER } from "@/lib/constants";
import { resolveTenant, tenantRewritePath } from "@/lib/tenant";

const isAdminRoute = (request: NextRequest) => /^\/(api\/)?admin(\/|$)/.test(request.nextUrl.pathname);

const withClerk = clerkMiddleware(async (auth, request) => {
  if (isAdminRoute(request)) await auth.protect();
});

/** Without Clerk keys the admin can't work; public pages should still render. */
const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  const slug = resolveTenant(request.headers.get("host"), process.env.NEXT_PUBLIC_ROOT_DOMAIN);

  // Guest traffic on <slug>.<root domain> never touches Clerk.
  if (slug) {
    const { pathname, search } = request.nextUrl;
    const target = pathname.startsWith("/api/") ? pathname : tenantRewritePath(slug, pathname);
    const headers = new Headers(request.headers);
    headers.set(TENANT_HEADER, slug);
    return NextResponse.rewrite(new URL(`${target}${search}`, request.url), { request: { headers } });
  }

  // Admin pages and routes still check the signed-in user themselves, so skipping here fails closed.
  if (!clerkConfigured) return NextResponse.next();

  return withClerk(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp3|m4a|ogg|wav)).*)",
    "/(api|trpc)(.*)",
  ],
};
