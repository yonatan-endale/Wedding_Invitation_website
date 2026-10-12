import { BORDER_TILES, type Thread } from "@/lib/border-shapes";
import type { BorderStyle } from "@/lib/constants";

type Threads = Record<Thread, string>;

/** Line's two rules sit in a band as tall as the tiles'. */
const LINE_HEIGHT = 28;

/**
 * The couple's border as a standalone SVG for the card image, which can't use
 * the site's CSS masks. Tibeb, Floral and Harag repeat their tile as SVG
 * patterns; Line is two thin rules. Tibeb 2 (the wide woven band) uses the
 * Tibeb tile, which keeps the same threads at card size.
 */
export function bandSvg(variant: BorderStyle, threads: Threads, width: number, height: number): string {
  if (variant === "line") {
    const length = (width * LINE_HEIGHT) / height;
    const body =
      `<rect x='0' y='${LINE_HEIGHT / 2 - 2}' width='${length}' height='0.6' fill='${threads.thread2}'/>` +
      `<rect x='0' y='${LINE_HEIGHT / 2 + 1.4}' width='${length}' height='0.6' fill='${threads.thread2}' fill-opacity='0.6'/>`;
    return `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${length} ${LINE_HEIGHT}'>${body}</svg>`;
  }

  const tile = BORDER_TILES[variant === "tibeb2" ? "tibeb" : variant];
  const length = (width * tile.height) / height;
  // Centre the tiles along the band, as the site's mask-position: center does.
  const offset = (length % tile.width) / 2;
  // `color` as well as fill, for the strands that are stroked in currentColor.
  const defs = tile.layers
    .map(
      (layer, i) =>
        `<pattern id='p${i}' patternUnits='userSpaceOnUse' x='${offset}' width='${tile.width}' height='${tile.height}'><g fill='${threads[layer.thread]}' color='${threads[layer.thread]}'>${layer.shapes}</g></pattern>`,
    )
    .join("");
  const body = `<defs>${defs}</defs>${tile.layers.map((_, i) => `<rect width='${length}' height='${tile.height}' fill='url(#p${i})'/>`).join("")}`;
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${length} ${tile.height}'>${body}</svg>`;
}

export function svgDataUri(svg: string): string {
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}
