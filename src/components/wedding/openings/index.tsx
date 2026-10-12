"use client";

import type { ComponentType } from "react";
import type { OpeningName } from "@/lib/opening";
import { AdeyOpening } from "./adey";
import { EnvelopeOpening } from "./envelope";
import { NetelaOpening } from "./netela";
import { SealOpening } from "./seal";
import type { OpeningProps } from "./types";

/*
 * Imported statically on purpose. Loading them with next/dynamic gave the
 * server and client different useId values inside the opening, which broke
 * the seal's gradients and Tibeb borders on hydration. The four are small.
 */
const OPENINGS: Record<OpeningName, ComponentType<OpeningProps>> = {
  netela: NetelaOpening,
  seal: SealOpening,
  envelope: EnvelopeOpening,
  adey: AdeyOpening,
};

export function OpeningHost({ name, ...props }: OpeningProps & { name: OpeningName }) {
  const Opening = OPENINGS[name];
  return <Opening {...props} />;
}
