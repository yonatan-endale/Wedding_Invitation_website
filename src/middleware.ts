import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { TENANT_HEADER } from "@/lib/constants";
import { routeRequest } from "@/lib/tenant";

const isAdminRoute = (request: NextRequest) => /^\/(api\/)?admin(\/|$)/.test(request.nextUrl.pathname);

const withClerk = clerkMiddleware(async (auth, request) => {
  if (isAdminRoute(request)) await auth.protect();
});

/** Clerk session and dev-browser cookies; guests visiting a couple site have none of these. */
const SESSION_COOKIE = /^(__session|__client_uat|__clerk_db_jwt)/;

/** Without Clerk keys the admin can't work; public pages should still render. */
const clerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);

export default function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname, search } = request.nextUrl;
  const hasSession = request.cookies.getAll().some((cookie) => SESSION_COOKIE.test(cookie.name));
  const route = routeRequest(request.headers.get("host"), pathname, process.env.NEXT_PUBLIC_ROOT_DOMAIN, { hasSession });

  // Admin and sign-in live only on the main domain.
  if (route.kind === "not-found") return new NextResponse("Not found", { status: 404 });

  // Guest traffic on <slug>.<root domain> never touches Clerk.
  if (route.kind === "tenant") {
    const headers = new Headers(request.headers);
    headers.set(TENANT_HEADER, route.slug);
    return NextResponse.rewrite(new URL(`${route.path}${search}`, request.url), { request: { headers } });
  }

  if (route.kind === "guest") return NextResponse.next();

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
