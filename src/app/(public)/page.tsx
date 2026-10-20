import Link from "next/link";
import { TibebBand } from "@/components/wedding/primitives";
import { ENABLED_EVENT_TYPES, type EventType } from "@/lib/event-types";
import { safeHttpUrl } from "@/lib/safe-url";

/** What each kind of site holds, in a line. Only the open types are listed. */
const KINDS: Record<EventType, { title: string; body: string }> = {
  wedding: {
    title: "Weddings",
    body: "The couple, the day from telosh to mels, venues, gifts and an RSVP, with ten layouts to choose from.",
  },
  graduation: {
    title: "Graduations",
    body: "One graduate or several, each with their degree and school, the photos along the way and a family lunch to RSVP to.",
  },
  birthday: { title: "Birthdays", body: "The birthday person, the party and the RSVP." },
  baptism: { title: "Baptisms", body: "The child, the church service and the feast after." },
  engagement: { title: "Engagements", body: "Telosh and kelebet, the families and the RSVP." },
};

/** Where "Ask for your invitation" leads (a Telegram link, a phone link, a form). Unset, the section shows the text only. */
const CONTACT_URL = safeHttpUrl(process.env.NEXT_PUBLIC_CONTACT_URL);

export default function Home() {
  return (
    <div className="wedding flex min-h-screen flex-col">
      <TibebBand />
      <main className="flex flex-1 items-center px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-[clamp(2.75rem,8vw,5rem)] leading-[0.95]">Invitations for every celebration</h1>
          <p className="mt-6 max-w-[48ch] text-xl text-ink-soft">
            Each celebration gets its own invitation site with music, RSVP, venue directions, a photo gallery and gift details, in
            English and Amharic, with the date in both calendars.
          </p>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {ENABLED_EVENT_TYPES.map((type) => (
              <li key={type} className="border-t border-rule pt-4">
                <h2 className="font-display text-2xl">{KINDS[type].title}</h2>
                <p className="mt-2 text-ink-soft">{KINDS[type].body}</p>
              </li>
            ))}
          </ul>
          <Link
            href="/designs"
            className="mt-10 inline-flex min-h-12 items-center rounded-[3px] bg-thread-1 px-6 text-base font-medium text-on-thread-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            See our designs
          </Link>

          <section id="ask" aria-labelledby="ask-heading" className="mt-16 scroll-mt-8 border-t border-rule pt-8">
            <h2 id="ask-heading" className="font-display text-2xl">
              Ask for your invitation
            </h2>
            <p className="mt-3 max-w-[48ch] text-ink-soft">
              We build each invitation with you, free of charge. Tell us about your celebration and which design you like.
            </p>
            {CONTACT_URL ? (
              <a
                href={CONTACT_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-5 inline-flex min-h-12 items-center rounded-[3px] border border-ink/25 px-6 text-base hover:border-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
              >
                Get in touch
              </a>
            ) : null}
          </section>

          <p className="mt-16 max-w-[48ch] text-ink-soft">If you received an invitation, open the link you were sent.</p>
          <Link href="/admin" className="mt-4 inline-block text-sm text-ink-soft underline underline-offset-4">
            Sign in to manage sites
          </Link>
        </div>
      </main>
      <TibebBand />
    </div>
  );
}
