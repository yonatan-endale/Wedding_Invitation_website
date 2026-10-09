import type { ComponentType } from "react";
import type { LayoutName } from "@/lib/layout";
import { ArchesLayout } from "./arches";
import { BranaLayout } from "./brana";
import { ClassicLayout } from "./classic";
import { EditorialLayout } from "./editorial";
import { FlatlayLayout } from "./flatlay";
import { KabaLayout } from "./kaba";
import { NoirLayout } from "./noir";
import { ReelLayout } from "./reel";
import { StoriesLayout } from "./stories";
import type { LayoutProps } from "./types";

export type { LayoutProps, SiteNames } from "./types";

/** The component tree for each layout. Header and nav settings live with the metadata in src/lib/layout.ts. */
export const LAYOUT_COMPONENTS: Record<LayoutName, ComponentType<LayoutProps>> = {
  classic: ClassicLayout,
  editorial: EditorialLayout,
  reel: ReelLayout,
  noir: NoirLayout,
  arches: ArchesLayout,
  stories: StoriesLayout,
  flatlay: FlatlayLayout,
  kaba: KabaLayout,
  brana: BranaLayout,
};
