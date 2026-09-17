export type Direction = "up" | "down";

/** Returns ids in their new order after moving one item a single place, or null if it isn't in the list. */
export function moveItem(ids: readonly string[], id: string, direction: Direction): string[] | null {
  const index = ids.indexOf(id);
  if (index === -1) return null;
  const target = direction === "up" ? index - 1 : index + 1;
  const next = [...ids];
  if (target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}
