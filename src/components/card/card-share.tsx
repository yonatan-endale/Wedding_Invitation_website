"use client";

import { Check, Copy, Send, Share2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { buttonOutline } from "@/components/wedding/primitives";
import { telegramShareUrl, whatsappShareUrl } from "@/lib/card-links";
import { cn } from "@/lib/utils";

type Props = { pageUrl: string; imageUrl: string; fileName: string; text: string };

/**
 * Sharing a guest's card. Phones that can share files get the picture itself
 * through the share sheet; everyone gets WhatsApp, Telegram and copy-link.
 */
export function CardShare({ pageUrl, imageUrl, fileName, text }: Props) {
  const t = useTranslations("card");
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => setCanShare(typeof navigator.share === "function"), []);

  async function share() {
    try {
      const blob = await (await fetch(imageUrl)).blob();
      const file = new File([blob], fileName, { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text });
      } else {
        await navigator.share({ text, url: pageUrl });
      }
    } catch {
      // The guest closed the share sheet, or sharing failed; the links below still work.
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(t("copyFailed"), pageUrl);
    }
  }

  const small = cn(buttonOutline, "min-h-11 px-4 text-sm");
  return (
    <div className="grid gap-3">
      {canShare ? (
        <button type="button" onClick={share} className={cn(buttonOutline, "w-full")}>
          <Share2 className="size-4" aria-hidden /> {t("share")}
        </button>
      ) : null}
      <div className="grid grid-cols-3 gap-2">
        <a href={whatsappShareUrl(`${text} ${pageUrl}`)} target="_blank" rel="noopener noreferrer" className={small}>
          <Send className="size-4" aria-hidden /> {t("whatsapp")}
        </a>
        <a href={telegramShareUrl(pageUrl, text)} target="_blank" rel="noopener noreferrer" className={small}>
          <Send className="size-4" aria-hidden /> {t("telegram")}
        </a>
        <button type="button" onClick={copy} className={small} aria-live="polite">
          {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
          {copied ? t("copied") : t("copyLink")}
        </button>
      </div>
    </div>
  );
}
