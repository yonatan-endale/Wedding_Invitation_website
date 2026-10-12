"use client";

import { Check, Copy, Download, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { guestCardLinks, whatsappShareUrl } from "@/lib/card-links";
import { cn } from "@/lib/utils";

type Props = { siteBase: string; token: string; phone: string; coupleNames: string };

const action =
  "inline-flex min-h-9 items-center gap-1.5 rounded-full border border-rule px-3 text-sm transition-colors hover:border-ink/40 hover:bg-ink/[0.04]";

/** The couple downloads a guest's card or sends it to them on WhatsApp. */
export function GuestCardActions({ siteBase, token, phone, coupleNames }: Props) {
  const t = useTranslations("couplePortal");
  const [copied, setCopied] = useState(false);
  const links = guestCardLinks(siteBase, token);

  async function copy() {
    try {
      await navigator.clipboard.writeText(links.page);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(t("copyFailed"), links.page);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <a href={links.download} download className={action}>
        <Download className="size-4" aria-hidden /> {t("downloadCard")}
      </a>
      <a
        href={whatsappShareUrl(t("cardShareText", { couple: coupleNames, url: links.page }), phone)}
        target="_blank"
        rel="noopener noreferrer"
        className={action}
      >
        <Send className="size-4" aria-hidden /> {t("sendWhatsApp")}
      </a>
      <button type="button" onClick={copy} className={cn(action)} aria-live="polite">
        {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
        {copied ? t("copied") : t("copyCardLink")}
      </button>
    </div>
  );
}
