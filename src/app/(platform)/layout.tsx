import { ClerkProvider } from "@clerk/nextjs";

/**
 * Admin and sign-in. The couple sites under /s/[slug] and the public pages (the
 * home page and the designs page) sit outside this group, so visitors never
 * download Clerk.
 */
export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
