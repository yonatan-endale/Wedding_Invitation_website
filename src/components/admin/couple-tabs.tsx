"use client";

import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type CoupleTab = { value: string; label: string; count?: number; content: ReactNode };

/** Tabs that remember the open tab in the URL (?tab=photos) so refreshes and saves stay put. */
export function CoupleTabs({ tabs, initial }: { tabs: CoupleTab[]; initial: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const value = tabs.some((tab) => tab.value === initial) ? initial : tabs[0].value;

  return (
    <Tabs
      defaultValue={value}
      onValueChange={(next) => router.replace(`${pathname}?tab=${next}`, { scroll: false })}
      className="gap-6"
    >
      <div className="-mx-4 overflow-x-auto px-4">
        <TabsList className="w-max">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              {typeof tab.count === "number" ? <span className="text-muted-foreground tabular-nums">{tab.count}</span> : null}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
