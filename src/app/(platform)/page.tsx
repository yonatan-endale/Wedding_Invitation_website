import Link from "next/link";
import { TibebBand } from "@/components/wedding/primitives";

export default function Home() {
  return (
    <div className="wedding flex min-h-screen flex-col">
      <TibebBand />
      <main className="flex flex-1 items-center px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-[clamp(2.75rem,8vw,5rem)] leading-[0.95]">Wedding invitations</h1>
          <p className="mt-6 max-w-[48ch] text-xl text-ink-soft">
            Each couple gets their own invitation site with music, RSVP, venue directions, a photo gallery and gift
            details, in English and Amharic.
          </p>
          <p className="mt-6 max-w-[48ch] text-ink-soft">
            If you received an invitation, open the link the couple sent you.
          </p>
          <Link
            href="/admin"
            className="mt-10 inline-flex min-h-12 items-center rounded-[3px] bg-thread-1 px-6 text-base font-medium text-on-thread-1"
          >
            Sign in to manage sites
          </Link>
        </div>
      </main>
      <TibebBand />
    </div>
  );
}
