"use client";

import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { setWishHidden } from "@/actions/couple-portal";
import { cn } from "@/lib/utils";

export function WishToggle({ slug, rsvpId, hidden }: { slug: string; rsvpId: string; hidden: boolean }) {
  const t = useTranslations("couplePortal");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      const result = await setWishHidden(slug, rsvpId, !hidden);
      if (result.ok) router.refresh();
      else toast.error(t("errors.generic"));
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={cn(
        "inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-sm text-ink-soft transition-colors hover:bg-ink/[0.06] hover:text-ink disabled:opacity-50",
      )}
    >
      {hidden ? <Eye className="size-4" aria-hidden /> : <EyeOff className="size-4" aria-hidden />}
      {hidden ? t("unhide") : t("hide")}
    </button>
  );
}
