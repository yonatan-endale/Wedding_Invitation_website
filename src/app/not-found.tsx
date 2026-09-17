import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 text-center">
      <div className="max-w-sm">
        <h1 className="text-2xl font-semibold">Page not found</h1>
        <p className="mt-3 text-muted-foreground">Check the address, or go back to the start.</p>
        <Link href="/" className="mt-6 inline-block underline underline-offset-4">
          Go to the home page
        </Link>
      </div>
    </main>
  );
}
