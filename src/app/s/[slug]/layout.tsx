import type { ReactNode } from "react";
import { SiteLocalesProvider } from "@/components/wedding/site-locales";
import { getSiteData } from "@/db/queries/site";
import { DEFAULT_SITE_LOCALES } from "@/lib/localized";

export default async function SiteLayout({ children, params }: { children: ReactNode; params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const site = await getSiteData(slug);
  return (
    <SiteLocalesProvider value={{ slug, locales: site?.couple.enabledLocales ?? DEFAULT_SITE_LOCALES }}>
      {children}
    </SiteLocalesProvider>
  );
}
