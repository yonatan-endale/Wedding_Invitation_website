"use client";

import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { useEffect, useState, useTransition } from "react";
import { setLocale } from "@/actions/locale";
import type { Locale } from "@/lib/localized";
import { cn } from "@/lib/utils";

export function LanguageToggle({ tone = "ink" }: { tone?: "ink" | "light" }) {
  const locale = useLocale();
  const t = useTranslations("language");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function choose(next: Locale) {
    if (next === locale) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      aria-busy={pending}
      className={cn(
        "inline-flex items-center rounded-full border p-0.5 text-sm backdrop-blur-sm transition-opacity",
        tone === "light" ? "border-white/40 bg-black/15 text-white" : "border-rule bg-paper/80 text-ink",
        pending && "opacity-60",
      )}
    >
      {(["en", "am"] as const).map((option) => {
        const active = locale === option;
        return (
          <button
            key={option}
            type="button"
            lang={option}
            aria-pressed={active}
            aria-label={t(option)}
            onClick={() => choose(option)}
            className={cn(
              "min-h-9 min-w-11 rounded-full px-3 transition-colors",
              active && (tone === "light" ? "bg-white text-black" : "bg-ink text-paper"),
            )}
          >
            {option === "en" ? "EN" : "አማ"}
          </button>
        );
      })}
    </div>
  );
}

export type NavLink = { id: string; label: string };

export function SiteHeader({ monogram, links }: { monogram: string; links: NavLink[] }) {
  const t = useTranslations("nav");
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,color,border-color] duration-300",
        solid ? "border-b border-rule bg-paper/95 text-ink" : "border-b border-transparent text-white",
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <a href="#top" className="font-display text-xl tracking-wide">
          {monogram}
        </a>

        <nav aria-label={t("label")} className="hidden lg:block">
          <ul className="flex items-center gap-7 text-base">
            {links.map((link) => (
              <li key={link.id}>
                <a href={`#${link.id}`} className="transition-opacity hover:opacity-70">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle tone={solid ? "ink" : "light"} />
          <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Dialog.Trigger
              className="flex size-11 items-center justify-center rounded-full lg:hidden"
              aria-label={t("menu")}
            >
              <Menu aria-hidden className="size-6" />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
              <Dialog.Content
                aria-describedby={undefined}
                className="wedding fixed inset-x-0 top-0 z-50 border-b border-rule px-5 pt-4 pb-10 shadow-xl sm:px-8"
              >
                <div className="flex items-center justify-between">
                  <Dialog.Title className="font-display text-xl">{monogram}</Dialog.Title>
                  <Dialog.Close className="flex size-11 items-center justify-center rounded-full" aria-label={t("close")}>
                    <X aria-hidden className="size-6" />
                  </Dialog.Close>
                </div>
                <nav aria-label={t("label")} className="mt-6">
                  <ul className="space-y-1">
                    {links.map((link) => (
                      <li key={link.id}>
                        <a
                          href={`#${link.id}`}
                          onClick={() => setMenuOpen(false)}
                          className="block py-2 font-display text-3xl"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
