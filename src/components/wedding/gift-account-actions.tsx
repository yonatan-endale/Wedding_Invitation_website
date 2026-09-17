"use client";

import { Check, Copy, QrCode } from "lucide-react";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { buttonOutline } from "./primitives";

export function GiftAccountActions({ number, withQr }: { number: string; withQr: boolean }) {
  const t = useTranslations("gifts");
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const digits = number.replace(/\s+/g, "");

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(digits);
      setCopied(true);
    } catch {
      toast.error(t("copyFailed"));
    }
  }

  return (
    <div className="mt-auto pt-6">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={copy} className={buttonOutline}>
          {copied ? <Check aria-hidden className="size-4" /> : <Copy aria-hidden className="size-4" />}
          <span aria-live="polite">{copied ? t("copied") : t("copy")}</span>
        </button>
        {withQr ? (
          <button type="button" onClick={() => setShowQr((v) => !v)} aria-expanded={showQr} className={buttonOutline}>
            <QrCode aria-hidden className="size-4" />
            {showQr ? t("hideQr") : t("showQr")}
          </button>
        ) : null}
      </div>
      {withQr && showQr ? (
        <div className="mt-5 inline-block bg-white p-3">
          <QRCodeSVG value={digits} size={168} marginSize={0} title={t("qrAlt", { number })} />
        </div>
      ) : null}
    </div>
  );
}
