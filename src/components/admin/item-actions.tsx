"use client";

import { ArrowDown, ArrowUp, Loader2, Trash2 } from "lucide-react";
import { useTransition } from "react";
import { deleteListItem, moveListItem, type DeletableList, type SortableList } from "@/actions/admin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { reportResult } from "./use-action-feedback";

export function MoveButtons({ list, id, first, last }: { list: SortableList; id: string; first: boolean; last: boolean }) {
  const [pending, startTransition] = useTransition();
  const move = (direction: "up" | "down") =>
    startTransition(async () => reportResult(await moveListItem(list, id, direction)));

  return (
    <>
      <Button type="button" variant="ghost" size="icon" disabled={first || pending} onClick={() => move("up")} aria-label="Move up">
        <ArrowUp aria-hidden />
      </Button>
      <Button type="button" variant="ghost" size="icon" disabled={last || pending} onClick={() => move("down")} aria-label="Move down">
        <ArrowDown aria-hidden />
      </Button>
    </>
  );
}

export function DeleteButton({
  list,
  id,
  itemLabel,
  description,
}: {
  list: DeletableList;
  id: string;
  itemLabel: string;
  description?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="ghost" size="icon" disabled={pending} aria-label={`Remove ${itemLabel}`}>
          {pending ? <Loader2 className="animate-spin" aria-hidden /> : <Trash2 aria-hidden />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {itemLabel}?</AlertDialogTitle>
          <AlertDialogDescription>{description ?? "This can't be undone."}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => startTransition(async () => reportResult(await deleteListItem(list, id)))}
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
