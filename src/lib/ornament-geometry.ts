/**
 * A closed, gently scalloped circle: `lobes` bumps around (cx, cy), each
 * curving out to radius r between dips of depth `depth`. The wax seal's rim.
 */
export function scallopPath(cx: number, cy: number, r: number, lobes: number, depth: number): string {
  const point = (angle: number, radius: number) => {
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    return `${round(x)} ${round(y)}`;
  };
  const step = (2 * Math.PI) / lobes;
  const start = -Math.PI / 2;
  const segments = Array.from({ length: lobes }, (_, index) => {
    const from = start + index * step;
    // Control point beyond the rim pulls each lobe outward; the ends sit in the dips.
    return `Q${point(from + step / 2, r + depth)} ${point(from + step, r - depth)}`;
  });
  return `M${point(start, r - depth)}${segments.join("")}Z`;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
