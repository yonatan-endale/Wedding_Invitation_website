import { BORDER_TILE, FLORAL_LAYERS, TIBEB_LAYERS, type Thread } from "@/lib/border-shapes";
import type { BorderStyle } from "@/lib/constants";

type Threads = Record<Thread, string>;

/**
 * The couple's border as a standalone SVG for the card image, which can't use
 * the site's CSS masks. Tibeb and Floral repeat their 28-unit tile as SVG
 * patterns; Line is two thin rules. Tibeb 2 (the wide woven band) uses the
 * Tibeb tile, which keeps the same threads at card size.
 */
export function bandSvg(variant: BorderStyle, threads: Threads, width: number, height: number): string {
  const scale = height / BORDER_TILE;
  const length = width / scale;
  let body: string;

  if (variant === "line") {
    body =
      `<rect x='0' y='${BORDER_TILE / 2 - 2}' width='${length}' height='0.6' fill='${threads.thread2}'/>` +
      `<rect x='0' y='${BORDER_TILE / 2 + 1.4}' width='${length}' height='0.6' fill='${threads.thread2}' fill-opacity='0.6'/>`;
  } else {
    const layers = variant === "floral" ? FLORAL_LAYERS : TIBEB_LAYERS;
    // Centre the tiles along the band, as the site's mask-position: center does.
    const offset = (length % BORDER_TILE) / 2;
    const defs = layers
      .map(
        (layer, i) =>
          `<pattern id='p${i}' patternUnits='userSpaceOnUse' x='${offset}' width='${BORDER_TILE}' height='${BORDER_TILE}'><g fill='${threads[layer.thread]}'>${layer.shapes}</g></pattern>`,
      )
      .join("");
    body = `<defs>${defs}</defs>${layers.map((_, i) => `<rect width='${length}' height='${BORDER_TILE}' fill='url(#p${i})'/>`).join("")}`;
  }

  return `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${length} ${BORDER_TILE}'>${body}</svg>`;
}

export function svgDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
