import type { ComponentType } from "react";
import type { LayoutName } from "@/lib/layout";
import { ClassicLayout } from "./classic";
import { EditorialLayout } from "./editorial";
import type { LayoutProps } from "./types";

export type { LayoutProps, SiteNames } from "./types";

/** The component tree for each layout. Header and nav settings live with the metadata in src/lib/layout.ts. */
export const LAYOUT_COMPONENTS: Record<LayoutName, ComponentType<LayoutProps>> = {
  classic: ClassicLayout,
  editorial: EditorialLayout,
};
