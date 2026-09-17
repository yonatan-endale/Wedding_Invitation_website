import { describe, expect, it } from "vitest";
import { moveItem } from "./reorder";

describe("moveItem", () => {
  it("moves an item up one place", () => {
    expect(moveItem(["a", "b", "c"], "b", "up")).toEqual(["b", "a", "c"]);
  });

  it("moves an item down one place", () => {
    expect(moveItem(["a", "b", "c"], "b", "down")).toEqual(["a", "c", "b"]);
  });

  it("leaves the order unchanged at the edges", () => {
    expect(moveItem(["a", "b", "c"], "a", "up")).toEqual(["a", "b", "c"]);
    expect(moveItem(["a", "b", "c"], "c", "down")).toEqual(["a", "b", "c"]);
  });

  it("returns null when the item is not in the list", () => {
    expect(moveItem(["a", "b"], "z", "up")).toBeNull();
  });

  it("does not mutate the input", () => {
    const ids = ["a", "b"];
    moveItem(ids, "b", "up");
    expect(ids).toEqual(["a", "b"]);
  });
});
