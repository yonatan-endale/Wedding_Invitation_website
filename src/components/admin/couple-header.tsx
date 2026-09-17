"use client";

import { ArrowLeft, Copy, ExternalLink, Loader2, MoreHorizontal, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { deleteCouple, setCoupleStatus } from "@/actions/admin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CoupleStatus } from "@/lib/constants";
import { reportResult } from "./use-action-feedback";

type Props = {
  id: string;
  names: string;
  dateLine: string;
  status: CoupleStatus;
  shareUrl: string;
  previewUrl: string;
};

export function CoupleHeader({ id, names, dateLine, status, shareUrl, previewUrl }: Props) {
  const [pending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const published = status === "published";
  const shareText = `You're invited to the wedding of ${names}. ${shareUrl}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied.");
    } catch {
      toast.error("Couldn't copy. Select the link and copy it manually.");
    }
  }

  return (
    <div className="grid gap-5">
      <Link href="/admin" className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden /> All couples
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{names}</h1>
            <Badge variant={published ? "default" : "secondary"}>{published ? "Published" : "Draft"}</Badge>
          </div>
          <p className="mt-1 text-muted-foreground">{dateLine}</p>
          <p className="mt-2 truncate text-sm">
            <a href={published ? shareUrl : previewUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
              {published ? shareUrl : `${previewUrl} (preview)`}
            </a>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline">
            <a href={published ? shareUrl : previewUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden /> {published ? "Open site" : "Preview"}
            </a>
          </Button>
          <Button type="button" variant="outline" onClick={copyLink} disabled={!published} title={published ? undefined : "Publish first"}>
            <Copy aria-hidden /> Copy link
          </Button>
          <Button
            type="button"
            variant={published ? "outline" : "default"}
            disabled={pending}
            onClick={() =>
              startTransition(async () => reportResult(await setCoupleStatus(id, published ? "draft" : "published")))
            }
          >
            {pending ? <Loader2 className="animate-spin" aria-hidden /> : null}
            {published ? "Unpublish" : "Publish"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="ghost" size="icon" aria-label="More actions">
                <MoreHorizontal aria-hidden />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild disabled={!published}>
                <a href={`https://wa.me/?text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer">
                  <Send aria-hidden /> Share on WhatsApp
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild disabled={!published}>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`You're invited to the wedding of ${names}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Send aria-hidden /> Share on Telegram
                </a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onSelect={() => setConfirmDelete(true)}>
                <Trash2 aria-hidden /> Delete couple
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {names}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the site, photos list, schedule, gifts and every RSVP. Guests with the link will see
              a “not available” page. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep couple</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => startTransition(async () => reportResult(await deleteCouple(id)))}
            >
              Delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
