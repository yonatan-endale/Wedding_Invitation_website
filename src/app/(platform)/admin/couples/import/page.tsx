import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CoupleImportForm } from "@/components/admin/couple-import-form";

export const metadata: Metadata = { title: "Import a couple" };

export default function ImportCouplePage() {
  return (
    <div className="grid gap-6">
      <Link href="/admin" className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> All couples
      </Link>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Import a couple</h1>
        <p className="mt-1 text-muted-foreground">
          Upload a JSON file and the whole site is filled in at once. You land on the couple&apos;s page to review it, and it stays a draft until you publish it.
        </p>
      </div>
      <div className="rounded-xl border bg-background p-4 sm:p-6">
        <CoupleImportForm />
      </div>
    </div>
  );
}
