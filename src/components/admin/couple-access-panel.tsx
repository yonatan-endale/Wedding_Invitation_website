"use client";

import { Copy, KeyRound, Loader2, LockOpen, Send } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createCoupleAccess, revokeCoupleAccess, unlockCoupleAccess } from "@/actions/admin";
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
import { Input } from "@/components/ui/input";
import { telegramShareUrl, whatsappShareUrl } from "@/lib/card-links";
import { reportResult } from "./use-action-feedback";

/** Dates arrive formatted in the couple's time zone. `lockedUntil` is set only while locked. */
export type AccessSummary = { since: string; lastOpened: string | null; lockedUntil: string | null } | null;

/** `enabled` is the couple's page switch in Invitation text; while off, links and sessions don't work. */
type Props = { coupleId: string; coupleNames: string; status: AccessSummary; enabled: boolean };

async function copy(text: string, what: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${what} copied.`);
  } catch {
    toast.error("Couldn't copy. Select it and copy it manually.");
  }
}

/**
 * The couple's private RSVP and wishes page: a secret link plus a passcode,
 * shown once when made. The admin sends them over different channels.
 */
export function CoupleAccessPanel({ coupleId, coupleNames, status, enabled }: Props) {
  const [pending, startTransition] = useTransition();
  const [secret, setSecret] = useState<{ link: string; passcode: string } | null>(null);
  const [confirm, setConfirm] = useState<"rotate" | "revoke" | null>(null);

  const create = () =>
    startTransition(async () => {
      const result = await createCoupleAccess(coupleId);
      if (result.ok) setSecret({ link: result.link, passcode: result.passcode });
      else toast.error(result.message);
    });
  const revoke = () =>
    startTransition(async () => {
      setSecret(null);
      reportResult(await revokeCoupleAccess(coupleId));
    });
  const unlock = () => startTransition(async () => reportResult(await unlockCoupleAccess(coupleId)));

  const linkMessage = (link: string) =>
    `Your private page for the RSVPs and wishes of ${coupleNames}: ${link} I'll send you the passcode separately.`;

  return (
    <section className="rounded-xl border bg-background p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <KeyRound className="size-5" aria-hidden /> Couple&apos;s private page
          </h2>
          <p className="mt-1 max-w-prose text-sm text-muted-foreground">
            The couple reads RSVPs and wishes there and can send guests their cards. No account: a secret link plus a
            passcode. Only their hashes are stored, so they are shown once.
          </p>
          {!enabled ? (
            <p className="mt-3 text-sm">
              <Badge variant="outline">Off</Badge>{" "}
              <span className="text-muted-foreground">
                Turn on <span className="font-medium text-foreground">Couple&apos;s private page</span> in the Invitation text tab
                first.{status ? " The existing link starts working again when you do." : ""}
              </span>
            </p>
          ) : status ? (
            <p className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <Badge variant={status.lockedUntil ? "destructive" : "secondary"}>
                {status.lockedUntil ? `Locked until ${status.lockedUntil}` : "On"}
              </Badge>
              <span className="text-muted-foreground">
                Made {status.since}. {status.lastOpened ? `Last opened ${status.lastOpened}.` : "Not opened yet."}
              </span>
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          {status?.lockedUntil ? (
            <Button type="button" variant="outline" disabled={pending} onClick={unlock}>
              <LockOpen aria-hidden /> Unlock
            </Button>
          ) : null}
          {status ? (
            <>
              <Button type="button" variant="outline" disabled={pending || !enabled} onClick={() => setConfirm("rotate")}>
                New link and passcode
              </Button>
              <Button type="button" variant="ghost" disabled={pending} onClick={() => setConfirm("revoke")}>
                Turn off
              </Button>
            </>
          ) : (
            <Button type="button" disabled={pending || !enabled} onClick={create}>
              {pending ? <Loader2 className="animate-spin" aria-hidden /> : null}
              Create link and passcode
            </Button>
          )}
        </div>
      </div>

      {secret ? (
        <div className="mt-5 grid gap-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
          <p className="text-sm font-medium">
            Copy these now. They won&apos;t be shown again; if they get lost, make a new pair.
          </p>
          <div className="grid gap-1.5">
            <span className="text-sm">Link</span>
            <div className="flex gap-2">
              <Input readOnly value={secret.link} onFocus={(e) => e.currentTarget.select()} className="bg-background font-mono text-xs" />
              <Button type="button" variant="outline" onClick={() => copy(secret.link, "Link")}>
                <Copy aria-hidden /> Copy
              </Button>
            </div>
          </div>
          <div className="grid gap-1.5">
            <span className="text-sm">Passcode</span>
            <div className="flex items-center gap-2">
              <code className="rounded-md border bg-background px-3 py-2 font-mono text-xl tracking-[0.2em]">{secret.passcode}</code>
              <Button type="button" variant="outline" onClick={() => copy(secret.passcode, "Passcode")}>
                <Copy aria-hidden /> Copy
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={whatsappShareUrl(linkMessage(secret.link))} target="_blank" rel="noopener noreferrer">
                <Send aria-hidden /> Send link on WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a
                href={telegramShareUrl(secret.link, `Your private page for the RSVPs and wishes of ${coupleNames}`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Send aria-hidden /> Send link on Telegram
              </a>
            </Button>
          </div>
          <p className="text-sm">
            Send the passcode another way, such as a phone call or an SMS, so one leaked message isn&apos;t enough to get in.
          </p>
        </div>
      ) : null}

      <AlertDialog open={confirm !== null} onOpenChange={(open) => !open && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirm === "rotate" ? "Make a new link and passcode?" : "Turn off the private page?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirm === "rotate"
                ? "The current link and passcode stop working and every device signed in to the page is signed out. Send the couple the new pair."
                : "The link stops working and every device signed in to the page is signed out. RSVPs and wishes are kept."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant={confirm === "revoke" ? "destructive" : "default"}
              onClick={() => (confirm === "rotate" ? create() : revoke())}
            >
              {confirm === "rotate" ? "Make new pair" : "Turn off"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
