import QRCode from "qrcode";

/**
 * A QR code as one SVG path, one unit per module, with each run of dark modules
 * in a row drawn as a single rectangle. Medium error correction survives a
 * phone photo of a printed or on-screen card.
 */
export function qrPath(text: string): { size: number; path: string } {
  const { modules } = QRCode.create(text, { errorCorrectionLevel: "M" });
  const { size } = modules;
  const parts: string[] = [];
  for (let row = 0; row < size; row += 1) {
    let col = 0;
    while (col < size) {
      if (!modules.get(row, col)) {
        col += 1;
        continue;
      }
      const start = col;
      while (col < size && modules.get(row, col)) col += 1;
      parts.push(`M${start} ${row}h${col - start}v1h${start - col}z`);
    }
  }
  return { size, path: parts.join("") };
}
