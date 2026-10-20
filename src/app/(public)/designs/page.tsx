import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { DesignsGallery } from "@/components/showcase/designs-gallery";
import { TibebBand } from "@/components/wedding/primitives";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("showcase");
  return { title: t("title"), description: t("intro") };
}

/** Every layout on a fictional demo site, side by side with a plain explanation. */
export default async function DesignsPage() {
  const t = await getTranslations("showcase");
  return (
    <div className="wedding flex min-h-screen flex-col">
      <TibebBand />
      <main id="content" className="flex-1 px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <Link href="/" className="text-sm text-ink-soft underline underline-offset-4">
            {t("back")}
          </Link>
          <h1 className="mt-6 font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.95]">{t("title")}</h1>
          <p className="mt-6 max-w-[56ch] text-xl text-ink-soft">{t("intro")}</p>
          <DesignsGallery />
          <p className="mt-16 border-t border-rule pt-6 text-sm text-ink-soft">{t("example")}</p>
        </div>
      </main>
      <TibebBand />
    </div>
  );
}
