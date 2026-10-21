"use client";

import { Pencil, Plus, UserRound } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { saveHonoree } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { AdminCouple } from "@/db/queries/admin";
import { HERO_POSITIONS } from "@/lib/constants";
import { EVENT_TYPE_META } from "@/lib/event-types";
import { Field, LocalizedField, NativeSelect, SubmitButton } from "./fields";
import { DeleteButton, MoveButtons } from "./item-actions";
import { MediaField } from "./media-field";
import { useAdminForm } from "./use-action-feedback";

type Honoree = AdminCouple["honorees"][number];

function HonoreeDialog({
  couple,
  honoree,
  uploadsEnabled,
  trigger,
}: {
  couple: AdminCouple;
  honoree?: Honoree;
  uploadsEnabled: boolean;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { pending, onSubmit, errors } = useAdminForm(saveHonoree.bind(null, couple.id, honoree?.id ?? null), {
    onSuccess: () => setOpen(false),
  });
  const meta = EVENT_TYPE_META[couple.eventType];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{honoree ? `Edit ${honoree.name.en}` : "Add a person"}</DialogTitle>
          <DialogDescription>Shown on their own card, in the order of the list.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-5" noValidate>
          <LocalizedField name="name" label="First name" defaultValue={honoree?.name} errors={errors} required />
          <LocalizedField
            name="father"
            label="Father's name (optional)"
            defaultValue={honoree?.father}
            hint="Makes the full name on the invitation and footer."
          />
          <LocalizedField
            name="nick"
            label="Nickname (optional)"
            defaultValue={honoree?.nick}
            hint="Shown on the cover instead of the first name."
          />
          {meta.headlineLabel ? (
            <LocalizedField name="headline" label={`${meta.headlineLabel} (optional)`} defaultValue={honoree?.headline} />
          ) : null}
          {meta.subheadlineLabel ? (
            <LocalizedField name="subheadline" label={`${meta.subheadlineLabel} (optional)`} defaultValue={honoree?.subheadline} />
          ) : null}
          <LocalizedField
            name="story"
            label="A few lines about them (optional)"
            defaultValue={honoree?.story}
            errors={errors}
            multiline
            rows={4}
          />
          <MediaField
            name="portraitUrl"
            label="Portrait (optional)"
            kind="image"
            defaultValue={honoree?.portraitUrl}
            uploadsEnabled={uploadsEnabled}
            error={errors.portraitUrl}
            hint="A portrait-shaped photo works best. Without one the card shows their first initial."
          />
          <Field label="Keep this part of the portrait visible" htmlFor="portraitPosition" error={errors.portraitPosition} className="max-w-xs">
            <NativeSelect id="portraitPosition" name="portraitPosition" defaultValue={honoree?.portraitPosition ?? HERO_POSITIONS[1].value}>
              {HERO_POSITIONS.map((position) => (
                <option key={position.value} value={position.value}>
                  {position.label}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <DialogFooter>
            <SubmitButton pending={pending}>{honoree ? "Save" : "Add person"}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/** The people a non-wedding site celebrates, in the order their cards appear. */
export function HonoreesManager({ couple, uploadsEnabled }: { couple: AdminCouple; uploadsEnabled: boolean }) {
  const list = couple.honorees;
  const meta = EVENT_TYPE_META[couple.eventType];
  const full = list.length >= meta.honorees.max;

  return (
    <section className="grid content-start gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-medium">People</h2>
          <p className="text-sm text-muted-foreground">
            Everyone this {meta.label.toLowerCase()} celebrates, up to {meta.honorees.max}. The cover lists them in this order.
          </p>
        </div>
        <HonoreeDialog
          couple={couple}
          uploadsEnabled={uploadsEnabled}
          trigger={
            <Button type="button" variant="outline" disabled={full} title={full ? `Up to ${meta.honorees.max} people` : undefined}>
              <Plus aria-hidden /> Add person
            </Button>
          }
        />
      </div>
      <ul className="grid gap-3">
        {list.map((honoree, index) => (
          <li key={honoree.id} className="flex items-start gap-3 rounded-lg border bg-background p-3">
            {honoree.portraitUrl ? (
              <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image src={honoree.portraitUrl} alt="" fill sizes="56px" unoptimized className="object-cover" />
              </div>
            ) : (
              <UserRound className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden />
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium">{[honoree.name.en, honoree.father?.en].filter(Boolean).join(" ")}</p>
              {honoree.headline?.en || honoree.subheadline?.en ? (
                <p className="text-sm text-muted-foreground">
                  {[honoree.headline?.en, honoree.subheadline?.en].filter(Boolean).join(", ")}
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0">
              <MoveButtons list="honorees" id={honoree.id} first={index === 0} last={index === list.length - 1} />
              <HonoreeDialog
                couple={couple}
                honoree={honoree}
                uploadsEnabled={uploadsEnabled}
                trigger={
                  <Button type="button" variant="ghost" size="icon" aria-label={`Edit ${honoree.name.en}`}>
                    <Pencil aria-hidden />
                  </Button>
                }
              />
              {list.length > 1 ? <DeleteButton list="honorees" id={honoree.id} itemLabel={honoree.name.en} /> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
