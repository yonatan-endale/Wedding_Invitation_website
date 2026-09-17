import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-16">
      <SignIn forceRedirectUrl="/admin" signUpForceRedirectUrl="/admin" />
    </main>
  );
}
