"use client";

import { Download } from "lucide-react";
import { importCoupleFromJson } from "@/actions/admin";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Field, FieldError, FormSection, SubmitButton } from "./fields";
import { useAdminForm } from "./use-action-feedback";

const EXAMPLE = `{
  "couple": {
    "slug": "hanna-dawit",
    "partnerOne": { "en": "Hanna", "am": "ሐና" },
    "partnerTwo": { "en": "Dawit", "am": "ዳዊት" },
    "weddingAt": "2026-10-24T15:00",
    "timezone": "Africa/Addis_Ababa",
    "city": { "en": "Addis Ababa", "am": "አዲስ አበባ" }
  },
  "venues": [{ "name": { "en": "Holy Trinity Cathedral" } }],
  "events": [{ "title": { "en": "Vow ceremony" }, "startsAt": "2026-10-24T15:00", "venue": 0 }],
  "photos": ["https://example.com/photo.jpg"],
  "gifts": [{ "kind": "bank", "provider": "CBE", "accountName": "Hanna Tesfaye", "accountNumber": "1000123456789" }]
}`;

export function CoupleImportForm() {
  const { pending, onSubmit, errors } = useAdminForm(importCoupleFromJson);
  const problems = errors.file ? errors.file.split("\n") : [];

  return (
    <form onSubmit={onSubmit} className="grid gap-8" noValidate>
      <FormSection
        title="File"
        description="One JSON file with the couple, venues, schedule, photos and gift accounts. Every field the admin tabs have is supported."
      >
        <Field label="Couple file" htmlFor="file" hint="A .json file up to 1 MB.">
          <Input
            id="file"
            name="file"
            type="file"
            accept="application/json,.json"
            required
            aria-invalid={problems.length ? true : undefined}
            aria-describedby={problems.length ? "file-problems" : undefined}
          />
        </Field>
        {problems.length ? (
          <div id="file-problems" className="grid gap-1 rounded-md border border-destructive/40 bg-destructive/5 p-3">
            <p className="text-sm font-medium text-destructive">
              {problems.length === 1 ? "Fix this before importing:" : `Fix these ${problems.length} problems before importing:`}
            </p>
            <ul className="grid gap-1 text-sm text-destructive">
              {problems.map((problem) => (
                <li key={problem} className="font-mono text-xs break-words">
                  {problem}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <label className="flex items-start gap-3 rounded-lg border p-4">
          <Switch name="replace" value="on" className="mt-0.5" />
          <span className="grid gap-1">
            <span className="text-sm font-medium">Replace the existing couple with this link</span>
            <span className="text-sm text-muted-foreground">
              If a couple already uses the same link, delete it first. That removes its photos, schedule, gifts and every RSVP.
            </span>
          </span>
        </label>
        <FieldError message={errors.replace} />
      </FormSection>

      <FormSection title="Format" description="Times without an offset are read in the couple's time zone. Events point at venues by their position in the list, starting at 0.">
        <details className="rounded-lg border">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium">What the file looks like</summary>
          <pre className="overflow-x-auto border-t px-4 py-3 font-mono text-xs leading-relaxed">{EXAMPLE}</pre>
        </details>
        <a
          href="/examples/couple.json"
          download
          className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          <Download className="size-4" aria-hidden /> Download a full example
        </a>
      </FormSection>

      <div>
        <SubmitButton pending={pending}>Import couple</SubmitButton>
      </div>
    </form>
  );
}
