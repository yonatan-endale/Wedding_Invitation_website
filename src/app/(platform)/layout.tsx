import { ClerkProvider } from "@clerk/nextjs";

/**
 * Landing page, admin and sign-in. Couple sites under /s/[slug] sit outside this
 * group so guests never download Clerk.
 */
export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <ClerkProvider>{children}</ClerkProvider>;
}
