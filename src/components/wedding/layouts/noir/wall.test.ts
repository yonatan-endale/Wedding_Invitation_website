import { describe, expect, it } from "vitest";
import { WALL_SIZE, placement } from "./wall";

const cells = (count: number) => {
  const taken = new Map<string, number>();
  for (let index = 0; index < count; index++) {
    const p = placement(index, count);
    for (let col = p.col; col < p.col + p.cols; col++) {
      for (let row = p.row; row < p.row + p.rows; row++) {
        const key = `${col},${row}`;
        expect(taken.has(key), `photo ${index} of ${count} overlaps photo ${taken.get(key)} at ${key}`).toBe(false);
        taken.set(key, index);
      }
    }
  }
  return taken;
};

describe("noir gallery wall", () => {
  it.each(Array.from({ length: WALL_SIZE }, (_, i) => i + 1))("hangs %i photos without overlaps, inside twelve columns", (count) => {
    cells(count);
    for (let index = 0; index < count; index++) {
      const p = placement(index, count);
      expect(p.col).toBeGreaterThanOrEqual(1);
      expect(p.col + p.cols - 1).toBeLessThanOrEqual(12);
    }
  });

  it("fills each group of five completely, so the wall has no holes", () => {
    const taken = cells(10);
    expect(taken.size).toBe(12 * 16);
  });

  it("never leaves a half-width frame alone on a phone's last row", () => {
    for (let count = 1; count <= WALL_SIZE; count++) {
      let column = 0;
      for (let index = 0; index < count; index++) {
        const { wide } = placement(index, count);
        if (wide) expect(column, `count ${count}, photo ${index}`).toBe(0);
        column = wide ? 0 : (column + 1) % 2;
      }
      expect(column, `count ${count}`).toBe(0);
    }
  });

  it("marks one large piece per group, and a single photo", () => {
    expect(placement(0, 1).large).toBe(true);
    const large = Array.from({ length: 12 }, (_, i) => placement(i, 12).large);
    expect(large.filter(Boolean)).toHaveLength(2);
  });
});
