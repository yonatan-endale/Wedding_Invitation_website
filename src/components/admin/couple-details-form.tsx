"use client";

import { useState } from "react";
import { createCouple, updateCoupleDetails } from "@/actions/admin";
import { Input } from "@/components/ui/input";
import type { AdminCouple } from "@/db/queries/admin";
import { DEFAULT_TIMEZONE, HERO_POSITIONS } from "@/lib/constants";
import { toDateTimeLocalValue } from "@/lib/datetime";
import { slugify } from "@/lib/slug";
import { THEME_LIST } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { Field, FormSection, LocalizedField, NativeSelect, SubmitButton } from "./fields";
import { MediaField } from "./media-field";
import { useAdminForm } from "./use-action-feedback";

type Props = {
  couple?: AdminCouple;
  timeZones: string[];
  uploadsEnabled: boolean;
  siteBase: string;
};

export function CoupleDetailsForm({ couple, timeZones, uploadsEnabled, siteBase }: Props) {
  const editing = Boolean(couple);
  const action = couple ? updateCoupleDetails.bind(null, couple.id) : createCouple;
  const { pending, onSubmit, errors } = useAdminForm(action);

  const [slug, setSlug] = useState(couple?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(editing);
  const [names, setNames] = useState({ one: couple?.partnerOne.en ?? "", two: couple?.partnerTwo.en ?? "" });

  function updateName(which: "one" | "two", value: string) {
    const next = { ...names, [which]: value };
    setNames(next);
    if (!slugTouched) setSlug(slugify([next.one, next.two].filter(Boolean).join(" ")));
  }

  const timezone = couple?.timezone ?? DEFAULT_TIMEZONE;

  return (
    <form onSubmit={onSubmit} className="grid gap-8" noValidate>
      <FormSection title="Couple" description="Names appear in the opening screen, hero and footer.">
        <div className="grid gap-4 md:grid-cols-2">
          {(["one", "two"] as const).map((which) => {
            const key = which === "one" ? "partnerOne" : "partnerTwo";
            const existing = couple?.[key];
            return (
              <fieldset key={which} className="grid gap-3 rounded-lg border p-4">
                <legend className="px-1 text-sm font-medium">{which === "one" ? "First partner" : "Second partner"}</legend>
                <Field label="Name in English" htmlFor={`${key}-en`} error={errors[`${key}.en`]}>
                  <Input
                    id={`${key}-en`}
                    name={`${key}.en`}
                    defaultValue={existing?.en}
                    onChange={(event) => updateName(which, event.target.value)}
                    aria-invalid={errors[`${key}.en`] ? true : undefined}
                    autoComplete="off"
                  />
                </Field>
                <Field label="Name in Amharic (optional)" htmlFor={`${key}-am`}>
                  <Input id={`${key}-am`} name={`${key}.am`} lang="am" defaultValue={existing?.am} autoComplete="off" />
                </Field>
              </fieldset>
            );
          })}
        </div>
        <Field
          label="Site link"
          htmlFor="slug"
          error={errors.slug}
          hint={
            <>
              Guests will open <span className="font-medium text-foreground">{siteBase.replace("{slug}", slug || "your-link")}</span>
            </>
          }
        >
          <Input
            id="slug"
            name="slug"
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(event.target.value.toLowerCase());
            }}
            aria-invalid={errors.slug ? true : undefined}
            autoComplete="off"
            spellCheck={false}
          />
        </Field>
      </FormSection>

      <FormSection title="Date and place" description="Times are entered in the wedding's local time.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Wedding date and time" htmlFor="weddingAt" error={errors.weddingAt} hint="Usually the ceremony start.">
            <Input
              id="weddingAt"
              name="weddingAt"
              type="datetime-local"
              defaultValue={couple ? toDateTimeLocalValue(couple.weddingAt, couple.timezone) : ""}
              aria-invalid={errors.weddingAt ? true : undefined}
            />
          </Field>
          <Field label="Time zone" htmlFor="timezone" error={errors.timezone}>
            <NativeSelect id="timezone" name="timezone" defaultValue={timezone}>
              {timeZones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone.replace(/_/g, " ")}
                </option>
              ))}
            </NativeSelect>
          </Field>
        </div>
        <LocalizedField name="city" label="City" defaultValue={couple?.city} placeholder={{ en: "Addis Ababa", am: "አዲስ አበባ" }} />
      </FormSection>

      <FormSection title="Look and sound" description="Pick a palette, the cover photo and the song that plays when guests open the invitation.">
        <fieldset className="grid gap-3">
          <legend className="mb-2 text-sm font-medium">Theme</legend>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {THEME_LIST.map((theme) => (
              <label
                key={theme.name}
                className="flex cursor-pointer gap-3 rounded-lg border p-3 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/20"
              >
                <input
                  type="radio"
                  name="theme"
                  value={theme.name}
                  defaultChecked={(couple?.theme ?? "tibeb") === theme.name}
                  className="mt-1"
                />
                <span className="grid gap-2">
                  <span className="flex items-center gap-2">
                    <span className="flex overflow-hidden rounded border" aria-hidden>
                      {[theme.colors.paper, theme.colors.thread1, theme.colors.thread2, theme.colors.thread3].map((color, index) => (
                        <span key={index} className="block size-5" style={{ backgroundColor: color }} />
                      ))}
                    </span>
                    <span className="font-medium">{theme.label}</span>
                  </span>
                  <span className="text-sm text-muted-foreground">{theme.description}</span>
                </span>
              </label>
            ))}
          </div>
          {errors.theme ? <p className="text-sm text-destructive">{errors.theme}</p> : null}
        </fieldset>

        <MediaField
          name="heroPhotoUrl"
          label="Cover photo"
          kind="image"
          defaultValue={couple?.heroPhotoUrl}
          uploadsEnabled={uploadsEnabled}
          error={errors.heroPhotoUrl}
          hint="A landscape photo of the couple works best. You can also pick one from the Photos tab."
        />
        <Field
          label="Keep this part of the cover photo visible"
          htmlFor="heroPosition"
          hint="Phones crop the sides of wide photos. Choose where the faces are."
          className="max-w-xs"
        >
          <NativeSelect id="heroPosition" name="heroPosition" defaultValue={couple?.heroPosition ?? HERO_POSITIONS[1].value}>
            {HERO_POSITIONS.map((position) => (
              <option key={position.value} value={position.value}>
                {position.label}
              </option>
            ))}
          </NativeSelect>
        </Field>

        <MediaField
          name="musicUrl"
          label="Background music"
          kind="audio"
          defaultValue={couple?.musicUrl}
          uploadsEnabled={uploadsEnabled}
          error={errors.musicUrl}
          hint="MP3 or M4A, up to 15 MB. Only use music you have the right to share."
        />
        <Field label="Song title" htmlFor="musicTitle" error={errors.musicTitle} className="max-w-md">
          <Input id="musicTitle" name="musicTitle" defaultValue={couple?.musicTitle ?? ""} />
        </Field>
      </FormSection>

      <div className={cn("flex justify-end gap-3", !editing && "sticky bottom-0 -mx-4 border-t bg-background/95 px-4 py-3")}>
        <SubmitButton pending={pending}>{editing ? "Save details" : "Create couple"}</SubmitButton>
      </div>
    </form>
  );
}
