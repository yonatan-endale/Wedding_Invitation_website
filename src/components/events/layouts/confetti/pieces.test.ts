import { describe, expect, it } from "vitest";
import { confettiPieces } from "./pieces";

describe("confettiPieces", () => {
  it("draws the same pieces every time", () => {
    expect(confettiPieces(20)).toEqual(confettiPieces(20));
  });

  it("keeps the middle of the cover clear for the names", () => {
    for (const piece of confettiPieces(60)) {
      const inMiddle = piece.x > 18 && piece.x < 82 && piece.y > 18 && piece.y < 82;
      expect(inMiddle, `${piece.x},${piece.y}`).toBe(false);
      expect(piece.x).toBeGreaterThanOrEqual(0);
      expect(piece.y).toBeLessThanOrEqual(100);
    }
  });
});
