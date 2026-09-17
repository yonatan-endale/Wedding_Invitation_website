import { SignOutButton, UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { isAdminEmail } from "@/lib/admin";
import { getSignedInUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSignedInUser();
  if (!user) redirect("/sign-in");

  if (!isAdminEmail(user.email, process.env.ADMIN_EMAILS)) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 font-sans">
        <div className="max-w-md rounded-xl border bg-background p-8 text-center">
          <h1 className="text-xl font-semibold">This account can&apos;t manage sites</h1>
          <p className="mt-3 text-muted-foreground">
            You&apos;re signed in as {user.email}. Only emails listed in ADMIN_EMAILS can open the admin. Sign out and use an
            admin account.
          </p>
          <SignOutButton redirectUrl="/sign-in">
            <Button className="mt-6">Sign out</Button>
          </SignOutButton>
        </div>
      </main>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-muted/40 font-sans">
        <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/admin" className="font-semibold tracking-tight">
              Wedding sites
            </Link>
            <UserButton />
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </TooltipProvider>
  );
}
