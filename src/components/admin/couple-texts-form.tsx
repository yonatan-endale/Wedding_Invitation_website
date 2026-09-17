"use client";

import { updateCoupleTexts } from "@/actions/admin";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { AdminCouple } from "@/db/queries/admin";
import { toDateTimeLocalValue } from "@/lib/datetime";
import { Field, FormSection, LocalizedField, SubmitButton } from "./fields";
import { useAdminForm } from "./use-action-feedback";

export function CoupleTextsForm({ couple }: { couple: AdminCouple }) {
  const { pending, onSubmit, errors } = useAdminForm(updateCoupleTexts.bind(null, couple.id));

  return (
    <form onSubmit={onSubmit} className="grid gap-8" noValidate>
      <FormSection title="Invitation" description="Leave a field empty to hide it or use the default wording.">
        <LocalizedField
          name="tagline"
          label="Short line above the names"
          defaultValue={couple.tagline}
          placeholder={{ en: "Two families, one table.", am: "ሁለት ቤተሰብ፣ አንድ ማዕድ።" }}
        />
        <LocalizedField
          name="hosts"
          label="Hosts"
          defaultValue={couple.hosts}
          hint="Shown above the names on the invitation card. Default: “Together with their families”."
        />
        <LocalizedField name="invitation" label="Invitation text" defaultValue={couple.invitation} multiline rows={3} />
        <LocalizedField name="dressCode" label="Dress code" defaultValue={couple.dressCode} />
      </FormSection>

      <FormSection title="Story and scripture">
        <LocalizedField
          name="story"
          label="Our story"
          defaultValue={couple.story}
          multiline
          rows={8}
          hint="Leave a blank line between paragraphs."
        />
        <LocalizedField name="scripture" label="Verse or quote" defaultValue={couple.scripture} multiline rows={3} />
        <LocalizedField
          name="scriptureRef"
          label="Verse reference"
          defaultValue={couple.scriptureRef}
          placeholder={{ en: "Song of Songs 8:7", am: "መኃልየ መኃልይ 8፥7" }}
        />
      </FormSection>

      <FormSection title="RSVP and sharing">
        <label className="flex items-center justify-between gap-4 rounded-lg border p-4">
          <span>
            <span className="block text-sm font-medium">Collect RSVPs</span>
            <span className="block text-sm text-muted-foreground">Turn off to hide the RSVP form.</span>
          </span>
          <Switch name="rsvpEnabled" defaultChecked={couple.rsvpEnabled} value="on" />
        </label>
        <Field
          label="RSVP deadline (optional)"
          htmlFor="rsvpDeadline"
          error={errors.rsvpDeadline}
          hint={`In ${couple.timezone.replace(/_/g, " ")} time. The form closes after this.`}
          className="max-w-xs"
        >
          <Input
            id="rsvpDeadline"
            name="rsvpDeadline"
            type="datetime-local"
            defaultValue={couple.rsvpDeadline ? toDateTimeLocalValue(couple.rsvpDeadline, couple.timezone) : ""}
          />
        </Field>
        <LocalizedField
          name="giftNote"
          label="Gift message"
          defaultValue={couple.giftNote}
          multiline
          rows={3}
          hint="Shown above the bank and Telebirr details."
        />
        <Field
          label="Telegram link for guest photos (optional)"
          htmlFor="telegramUrl"
          error={errors.telegramUrl}
          hint="A group, channel or bot link like https://t.me/your_group. Leave empty to hide."
        >
          <Input id="telegramUrl" name="telegramUrl" type="url" defaultValue={couple.telegramUrl ?? ""} placeholder="https://t.me/" />
        </Field>
      </FormSection>

      <div className="flex justify-end">
        <SubmitButton pending={pending}>Save text</SubmitButton>
      </div>
    </form>
  );
}
