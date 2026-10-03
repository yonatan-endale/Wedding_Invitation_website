"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import type { OpeningName } from "@/lib/opening";
import type { OpeningProps } from "./types";

/*
 * One chunk per opening: the page renders the chosen one on the server, and
 * the guest's browser downloads only that one's code.
 */
const OPENINGS: Record<OpeningName, ComponentType<OpeningProps>> = {
  netela: dynamic(() => import("./netela").then((mod) => mod.NetelaOpening)),
};

export function OpeningHost({ name, ...props }: OpeningProps & { name: OpeningName }) {
  const Opening = OPENINGS[name];
  return <Opening {...props} />;
}
