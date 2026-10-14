import { describe, expect, it } from "vitest";
import { groupPhotos } from "./group-photos";

const photo = (id: string, group?: string) => ({ id, url: `/${id}.jpg`, caption: "", group });

describe("groupPhotos", () => {
  it("keeps one plain run when no photo is grouped", () => {
    const groups = groupPhotos([photo("a"), photo("b")]);
    expect(groups.map((g) => [g.label, g.photos.map((p) => p.index)])).toEqual([["", [0, 1]]]);
  });

  it("cuts runs where the heading changes, in the admin's order", () => {
    const groups = groupPhotos([photo("a", "The two of us"), photo("b", "The two of us "), photo("c", "With Mum and Dad"), photo("d")]);
    expect(groups.map((g) => [g.label, g.photos.map((p) => p.index)])).toEqual([
      ["The two of us", [0, 1]],
      ["With Mum and Dad", [2]],
      ["", [3]],
    ]);
  });

  it("starts a new run when a heading comes back later", () => {
    expect(groupPhotos([photo("a", "A"), photo("b", "B"), photo("c", "A")]).map((g) => g.label)).toEqual(["A", "B", "A"]);
  });
});
