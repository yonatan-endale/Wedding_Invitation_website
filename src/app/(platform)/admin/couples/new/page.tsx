import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CoupleDetailsForm } from "@/components/admin/couple-details-form";
import { ENABLED_EVENT_TYPES, EVENT_TYPE_META, getEventType } from "@/lib/event-types";
import { siteLinks } from "@/lib/site-links";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "New site" };

type Props = { searchParams: Promise<{ type?: string }> };

export default async function NewCouplePage({ searchParams }: Props) {
  const { pattern } = await siteLinks("{slug}");
  const requested = getEventType((await searchParams).type);
  const eventType = EVENT_TYPE_META[requested].enabled ? requested : "wedding";

  return (
    <div className="grid gap-6">
      <Link href="/admin" className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> All sites
      </Link>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New site</h1>
        <p className="mt-1 text-muted-foreground">
          Start with the basics. You can add the story, photos, schedule and gifts next. The site stays a draft until you publish it.
        </p>
      </div>
      {ENABLED_EVENT_TYPES.length > 1 ? (
        <nav aria-label="What the site celebrates" className="flex flex-wrap gap-2">
          {ENABLED_EVENT_TYPES.map((type) => (
            <Link
              key={type}
              href={`/admin/couples/new?type=${type}`}
              aria-current={type === eventType ? "page" : undefined}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm",
                type === eventType ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted",
              )}
            >
              {EVENT_TYPE_META[type].label}
            </Link>
          ))}
        </nav>
      ) : null}
      <div className="rounded-xl border bg-background p-4 sm:p-6">
        {/* Keyed by type so switching types starts a fresh form. */}
        <CoupleDetailsForm
          key={eventType}
          eventType={eventType}
          timeZones={Intl.supportedValuesOf("timeZone")}
          uploadsEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)}
          siteBase={pattern}
        />
      </div>
    </div>
  );
}
