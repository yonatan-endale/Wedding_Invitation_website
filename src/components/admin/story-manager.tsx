"use client";

import { BookOpen, Pencil, Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { saveMilestone } from "@/actions/admin";
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
import { Input } from "@/components/ui/input";
import type { AdminCouple } from "@/db/queries/admin";
import { formatCalendarDate } from "@/lib/wedding-format";
import { Field, LocalizedField, SubmitButton } from "./fields";
import { DeleteButton, MoveButtons } from "./item-actions";
import { MediaField } from "./media-field";
import { useAdminForm } from "./use-action-feedback";

type Milestone = AdminCouple["storyMilestones"][number];

function MilestoneDialog({
  couple,
  milestone,
  uploadsEnabled,
  trigger,
}: {
  couple: AdminCouple;
  milestone?: Milestone;
  uploadsEnabled: boolean;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { pending, onSubmit, errors } = useAdminForm(saveMilestone.bind(null, couple.id, milestone?.id ?? null), {
    onSuccess: () => setOpen(false),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{milestone ? "Edit chapter" : "Add chapter"}</DialogTitle>
          <DialogDescription>A dated moment in your story: how you met, the proposal, the engagement.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-5" noValidate>
          <Field label="Date" htmlFor="happenedOn" error={errors.happenedOn} className="max-w-xs">
            <Input id="happenedOn" name="happenedOn" type="date" defaultValue={milestone?.happenedOn ?? ""} />
          </Field>
          <LocalizedField name="title" label="Title" defaultValue={milestone?.title} errors={errors} required />
          <LocalizedField name="body" label="A few lines (optional)" defaultValue={milestone?.body} multiline rows={3} />
          <MediaField
            name="imageUrl"
            label="Photo (optional)"
            kind="image"
            defaultValue={milestone?.imageUrl}
            uploadsEnabled={uploadsEnabled}
            error={errors.imageUrl}
          />
          <DialogFooter>
            <SubmitButton pending={pending}>{milestone ? "Save chapter" : "Add chapter"}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function StoryManager({ couple, uploadsEnabled }: { couple: AdminCouple; uploadsEnabled: boolean }) {
  const milestones = couple.storyMilestones;

  return (
    <section className="grid content-start gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-medium">Chapters</h2>
          <p className="text-sm text-muted-foreground">
            Shown as a dated timeline in the Editorial layout. The Classic layout uses the story text from the Invitation
            text tab.
          </p>
        </div>
        <MilestoneDialog
          couple={couple}
          uploadsEnabled={uploadsEnabled}
          trigger={
            <Button type="button" variant="outline">
              <Plus aria-hidden /> Add chapter
            </Button>
          }
        />
      </div>
      {milestones.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Add how you met, the proposal and the engagement, each with a date and a photo.
        </p>
      ) : (
        <ul className="grid gap-3">
          {milestones.map((milestone, index) => (
            <li key={milestone.id} className="flex items-start gap-3 rounded-lg border bg-background p-3">
              {milestone.imageUrl ? (
                <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image src={milestone.imageUrl} alt="" fill sizes="56px" unoptimized className="object-cover" />
                </div>
              ) : (
                <BookOpen className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">{formatCalendarDate(milestone.happenedOn, "en")}</p>
                <p className="font-medium">{milestone.title.en}</p>
                {milestone.body?.en ? <p className="line-clamp-2 text-sm text-muted-foreground">{milestone.body.en}</p> : null}
              </div>
              <div className="flex shrink-0">
                <MoveButtons list="storyMilestones" id={milestone.id} first={index === 0} last={index === milestones.length - 1} />
                <MilestoneDialog
                  couple={couple}
                  milestone={milestone}
                  uploadsEnabled={uploadsEnabled}
                  trigger={
                    <Button type="button" variant="ghost" size="icon" aria-label={`Edit ${milestone.title.en}`}>
                      <Pencil aria-hidden />
                    </Button>
                  }
                />
                <DeleteButton list="storyMilestones" id={milestone.id} itemLabel={milestone.title.en} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
