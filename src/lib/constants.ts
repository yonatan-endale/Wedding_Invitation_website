export const COUPLE_STATUSES = ["draft", "published"] as const;
export type CoupleStatus = (typeof COUPLE_STATUSES)[number];

export const GIFT_KINDS = ["bank", "telebirr", "other"] as const;
export type GiftKind = (typeof GIFT_KINDS)[number];

/** Decorative band along the hero, invitation card, opening screen and footer. */
export const BORDER_STYLES = ["tibeb", "floral", "line"] as const;
export type BorderStyle = (typeof BORDER_STYLES)[number];

export const HERO_POSITIONS = [
  { value: "50% 20%", label: "Top" },
  { value: "50% 40%", label: "Upper middle" },
  { value: "50% 60%", label: "Lower middle" },
  { value: "50% 85%", label: "Bottom" },
] as const;

export const DEFAULT_TIMEZONE = "Africa/Addis_Ababa";

export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Set by middleware when a request arrived on a couple's subdomain. */
export const TENANT_HEADER = "x-wedding-tenant";

export const siteCacheTag = (slug: string) => `site:${slug}`;
