import type { ComponentType } from "react";
import type { LayoutName } from "@/lib/layout";
import { ClassicLayout } from "./classic";
import { EditorialLayout } from "./editorial";
import type { LayoutProps } from "./types";

export type { LayoutProps, SiteNames } from "./types";

export const LAYOUT_COMPONENTS: Record<LayoutName, ComponentType<LayoutProps>> = {
  classic: ClassicLayout,
  editorial: EditorialLayout,
};

/** What the shared shell around a layout needs to know about it. */
export const LAYOUT_SHELL: Record<LayoutName, { headerStartSolid: boolean; withCoupleLink: boolean }> = {
  classic: { headerStartSolid: false, withCoupleLink: false },
  editorial: { headerStartSolid: true, withCoupleLink: true },
};
