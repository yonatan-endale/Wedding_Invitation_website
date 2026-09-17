import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CoupleDetailsForm } from "@/components/admin/couple-details-form";
import { siteLinks } from "@/lib/site-links";

export const metadata: Metadata = { title: "New couple" };

export default async function NewCouplePage() {
  const { pattern } = await siteLinks("{slug}");

  return (
    <div className="grid gap-6">
      <Link href="/admin" className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> All couples
      </Link>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">New couple</h1>
        <p className="mt-1 text-muted-foreground">
          Start with the basics. You can add the story, photos, schedule and gifts next. The site stays a draft until you publish it.
        </p>
      </div>
      <div className="rounded-xl border bg-background p-4 sm:p-6">
        <CoupleDetailsForm
          timeZones={Intl.supportedValuesOf("timeZone")}
          uploadsEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)}
          siteBase={pattern}
        />
      </div>
    </div>
  );
}
