import { getTranslations } from "next-intl/server";
import { TibebBand } from "@/components/wedding/primitives";

export default async function CoupleNotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="wedding flex min-h-screen flex-col">
      <TibebBand />
      <main className="flex flex-1 items-center justify-center px-5 py-24 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-[clamp(2.25rem,6vw,3.25rem)] leading-tight">{t("title")}</h1>
          <p className="mt-5 text-ink-soft">{t("body")}</p>
        </div>
      </main>
      <TibebBand />
    </div>
  );
}
