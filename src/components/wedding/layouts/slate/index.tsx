import { ClassicLayout } from "../classic";
import type { LayoutProps } from "../types";

/** Placeholder until the Slate layout is built; renders Classic. */
export function SlateLayout(props: LayoutProps) {
  return <ClassicLayout {...props} />;
}
