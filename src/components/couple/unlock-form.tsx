"use client";

import { useTranslations } from "next-intl";
import { useActionState, useEffect, useId, useState } from "react";
import { unlockPortal, type UnlockState } from "@/actions/couple-portal";
import { buttonPrimary } from "@/components/wedding/primitives";
import { cn } from "@/lib/utils";

const initialState: UnlockState = { status: "idle" };

/** Reads the secret from the link's #k= fragment, which never reaches the server or a Referer header. */
function readLinkToken(): string {
  return /(?:^#|&)k=([A-Za-z0-9_-]{20,100})/.exec(window.location.hash)?.[1] ?? "";
}

export function UnlockForm({ slug }: { slug: string }) {
  const t = useTranslations("couplePortal");
  const id = useId();
  // null until the browser has read the address; the server never sees the fragment.
  const [token, setToken] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(unlockPortal.bind(null, slug), initialState);

  useEffect(() => {
    const read = () => {
      const found = readLinkToken();
      setToken((current) => found || current || "");
      // Take the secret out of the address bar and this history entry. Deferred, because the
      // router writes its own URL (fragment included) into history after child effects run.
      if (found) setTimeout(() => window.history.replaceState(null, "", window.location.pathname + window.location.search), 0);
    };
    read();
    // Pasting the link into a tab that already shows this page changes only the fragment.
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  if (token === null) return null;
  if (!token) return <p className="mx-auto mt-8 max-w-[36ch] text-center text-ink-soft">{t("noLink")}</p>;

  const error = state.status === "error" ? state.error : null;
  return (
    <form action={formAction} className="mx-auto mt-8 grid max-w-sm gap-5">
      <p className="text-center">{t("unlockIntro")}</p>
      <input type="hidden" name="token" value={token} />
      <div>
        <label htmlFor={`${id}-passcode`} className="mb-2 block text-base">
          {t("passcode")}
        </label>
        <input
          id={`${id}-passcode`}
          name="passcode"
          required
          autoFocus
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={20}
          placeholder="XXXX-XXXX"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="block w-full rounded-[3px] border border-rule bg-paper px-4 py-3 text-center font-mono text-xl tracking-[0.2em] text-ink uppercase outline-none focus:border-thread-1 aria-invalid:border-thread-3"
        />
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-center text-base text-thread-3">
          {t(`errors.${error}`)}
        </p>
      ) : null}
      <button type="submit" disabled={pending} className={cn(buttonPrimary, "w-full")}>
        {pending ? t("unlocking") : t("unlock")}
      </button>
    </form>
  );
}
