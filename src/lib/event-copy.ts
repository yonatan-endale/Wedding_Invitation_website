import type { EventType } from "./event-types";

/**
 * Which message to read for a piece of copy that depends on the event type.
 * Each type may override a key under `events.<type>.<key>`, say
 * `events.graduation.intro.invited`; anything it leaves out reads the shared
 * key, which carries the wedding wording. Weddings always read the shared key,
 * so their copy never moves.
 *
 * `has` is next-intl's `t.has` on the root translator.
 */
export function copyKey(type: EventType, key: string, has: (key: string) => boolean): string {
  if (type === "wedding") return key;
  const typed = `events.${type}.${key}`;
  return has(typed) ? typed : key;
}
