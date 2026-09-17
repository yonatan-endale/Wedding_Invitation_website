"use client";

import { Gift, Landmark, Pencil, Plus, Smartphone } from "lucide-react";
import { useState } from "react";
import { saveGiftAccount, saveWishlistItem } from "@/actions/admin";
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
import { GIFT_KINDS } from "@/lib/constants";
import { Field, LocalizedField, NativeSelect, SubmitButton } from "./fields";
import { DeleteButton, MoveButtons } from "./item-actions";
import { MediaField } from "./media-field";
import { useAdminForm } from "./use-action-feedback";

type Account = AdminCouple["giftAccounts"][number];
type WishlistItem = AdminCouple["wishlistItems"][number];

const KIND_LABEL = { bank: "Bank transfer", telebirr: "Telebirr", other: "Other" } as const;

function AccountDialog({ coupleId, account, trigger }: { coupleId: string; account?: Account; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { pending, onSubmit, errors } = useAdminForm(saveGiftAccount.bind(null, coupleId, account?.id ?? null), {
    onSuccess: () => setOpen(false),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{account ? "Edit account" : "Add account"}</DialogTitle>
          <DialogDescription>Guests can copy the number. Telebirr accounts also get a QR code.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-5" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Type" htmlFor="kind" error={errors.kind}>
              <NativeSelect id="kind" name="kind" defaultValue={account?.kind ?? "bank"}>
                {GIFT_KINDS.map((kind) => (
                  <option key={kind} value={kind}>
                    {KIND_LABEL[kind]}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Bank or service" htmlFor="provider" error={errors.provider}>
              <Input id="provider" name="provider" defaultValue={account?.provider} placeholder="Commercial Bank of Ethiopia" />
            </Field>
          </div>
          <Field label="Account holder's name" htmlFor="accountName" error={errors.accountName}>
            <Input id="accountName" name="accountName" defaultValue={account?.accountName} />
          </Field>
          <Field label="Account or phone number" htmlFor="accountNumber" error={errors.accountNumber}>
            <Input id="accountNumber" name="accountNumber" defaultValue={account?.accountNumber} inputMode="numeric" />
          </Field>
          <LocalizedField name="note" label="Note (optional)" defaultValue={account?.note} />
          <DialogFooter>
            <SubmitButton pending={pending}>{account ? "Save account" : "Add account"}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function WishlistDialog({
  coupleId,
  item,
  uploadsEnabled,
  trigger,
}: {
  coupleId: string;
  item?: WishlistItem;
  uploadsEnabled: boolean;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { pending, onSubmit, errors } = useAdminForm(saveWishlistItem.bind(null, coupleId, item?.id ?? null), {
    onSuccess: () => setOpen(false),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{item ? "Edit wishlist item" : "Add wishlist item"}</DialogTitle>
          <DialogDescription>Link to a shop page so guests can buy it directly.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-5" noValidate>
          <LocalizedField name="title" label="Item" defaultValue={item?.title} errors={errors} required />
          <div className="grid gap-4 sm:grid-cols-[1fr_10rem]">
            <Field label="Shop link (optional)" htmlFor="url" error={errors.url}>
              <Input id="url" name="url" type="url" defaultValue={item?.url ?? ""} placeholder="https://" />
            </Field>
            <Field label="Price (optional)" htmlFor="price" error={errors.price}>
              <Input id="price" name="price" defaultValue={item?.price ?? ""} placeholder="ETB 3,500" />
            </Field>
          </div>
          <MediaField
            name="imageUrl"
            label="Picture (optional)"
            kind="image"
            defaultValue={item?.imageUrl}
            uploadsEnabled={uploadsEnabled}
            error={errors.imageUrl}
          />
          <DialogFooter>
            <SubmitButton pending={pending}>{item ? "Save item" : "Add item"}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function GiftsManager({ couple, uploadsEnabled }: { couple: AdminCouple; uploadsEnabled: boolean }) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section className="grid content-start gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-medium">Money gifts</h2>
            <p className="text-sm text-muted-foreground">Bank accounts and Telebirr numbers guests can send to.</p>
          </div>
          <AccountDialog
            coupleId={couple.id}
            trigger={
              <Button type="button" variant="outline">
                <Plus aria-hidden /> Add account
              </Button>
            }
          />
        </div>
        {couple.giftAccounts.length === 0 ? (
          <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            No accounts yet. The gifts section stays hidden until you add an account or wishlist item.
          </p>
        ) : (
          <ul className="grid gap-3">
            {couple.giftAccounts.map((account, index) => {
              const Icon = account.kind === "telebirr" ? Smartphone : Landmark;
              return (
                <li key={account.id} className="flex items-start gap-3 rounded-lg border bg-background p-3">
                  <Icon className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{account.provider}</p>
                    <p className="text-sm text-muted-foreground">
                      {account.accountName}, {account.accountNumber}
                    </p>
                  </div>
                  <div className="flex shrink-0">
                    <MoveButtons list="giftAccounts" id={account.id} first={index === 0} last={index === couple.giftAccounts.length - 1} />
                    <AccountDialog
                      coupleId={couple.id}
                      account={account}
                      trigger={
                        <Button type="button" variant="ghost" size="icon" aria-label={`Edit ${account.provider}`}>
                          <Pencil aria-hidden />
                        </Button>
                      }
                    />
                    <DeleteButton list="giftAccounts" id={account.id} itemLabel={`${account.provider} account`} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="grid content-start gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-medium">Wishlist</h2>
            <p className="text-sm text-muted-foreground">Things guests can buy for the couple.</p>
          </div>
          <WishlistDialog
            coupleId={couple.id}
            uploadsEnabled={uploadsEnabled}
            trigger={
              <Button type="button" variant="outline">
                <Plus aria-hidden /> Add item
              </Button>
            }
          />
        </div>
        {couple.wishlistItems.length === 0 ? (
          <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            Add household items, a honeymoon fund or anything else the couple would love.
          </p>
        ) : (
          <ul className="grid gap-3">
            {couple.wishlistItems.map((item, index) => (
              <li key={item.id} className="flex items-start gap-3 rounded-lg border bg-background p-3">
                <Gift className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{item.title.en}</p>
                  <p className="text-sm text-muted-foreground">{[item.price, item.url ? "Has shop link" : null].filter(Boolean).join(", ") || "No link"}</p>
                </div>
                <div className="flex shrink-0">
                  <MoveButtons list="wishlistItems" id={item.id} first={index === 0} last={index === couple.wishlistItems.length - 1} />
                  <WishlistDialog
                    coupleId={couple.id}
                    item={item}
                    uploadsEnabled={uploadsEnabled}
                    trigger={
                      <Button type="button" variant="ghost" size="icon" aria-label={`Edit ${item.title.en}`}>
                        <Pencil aria-hidden />
                      </Button>
                    }
                  />
                  <DeleteButton list="wishlistItems" id={item.id} itemLabel={item.title.en} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
