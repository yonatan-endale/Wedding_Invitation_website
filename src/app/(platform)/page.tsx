import Link from "next/link";
import { TibebBand } from "@/components/wedding/primitives";
import { ENABLED_EVENT_TYPES, type EventType } from "@/lib/event-types";

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

export default function Home() {
  return (
    <div className="wedding flex min-h-screen flex-col">
      <TibebBand />
      <main className="flex flex-1 items-center px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-[clamp(2.75rem,8vw,5rem)] leading-[0.95]">Invitations for every celebration</h1>
          <p className="mt-6 max-w-[48ch] text-xl text-ink-soft">
            Each celebration gets its own invitation site with music, RSVP, venue directions, a photo gallery and gift details,
            in English and Amharic, with the date in both calendars.
          </p>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2">
            {ENABLED_EVENT_TYPES.map((type) => (
              <li key={type} className="border-t border-rule pt-4">
                <h2 className="font-display text-2xl">{KINDS[type].title}</h2>
                <p className="mt-2 text-ink-soft">{KINDS[type].body}</p>
              </li>
            ))}
          </ul>
          <p className="mt-12 max-w-[48ch] text-ink-soft">If you received an invitation, open the link you were sent.</p>
          <Link
            href="/admin"
            className="mt-8 inline-flex min-h-12 items-center rounded-[3px] bg-thread-1 px-6 text-base font-medium text-on-thread-1"
          >
            Sign in to manage sites
          </Link>
        </div>
      </main>
      <TibebBand />
    </div>
  );
}
