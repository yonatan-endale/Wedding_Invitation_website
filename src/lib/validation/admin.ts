import { GIFT_KINDS, HERO_POSITIONS, type GiftKind } from "@/lib/constants";
import { zonedTimeToUtc } from "@/lib/datetime";
import type { LocalizedText } from "@/lib/localized";
import { isValidSlug } from "@/lib/slug";
import { isThemeName, type ThemeName } from "@/lib/theme";

export type FormFields = Record<string, string | undefined>;
export type FieldErrors = Record<string, string>;
export type Parsed<T> = { success: true; data: T } | { success: false; fieldErrors: FieldErrors };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function formDataToFields(formData: FormData): FormFields {
  const fields: FormFields = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") fields[key] = value;
  }
  return fields;
}

function text(form: FormFields, key: string): string {
  return (form[key] ?? "").trim();
}

function optionalText(form: FormFields, key: string, max: number, errors: FieldErrors, message: string) {
  const value = text(form, key);
  if (value.length > max) errors[key] = message;
  return value || null;
}

export function readLocalized(form: FormFields, base: string): LocalizedText | null {
  const en = text(form, `${base}.en`);
  const am = text(form, `${base}.am`);
  if (!en && !am) return null;
  return am ? { en, am } : { en };
}

function requiredLocalized(form: FormFields, base: string, errors: FieldErrors, message: string): LocalizedText {
  const value = readLocalized(form, base);
  if (!value?.en) errors[`${base}.en`] = message;
  return value ?? { en: "" };
}

/** Accepts absolute http(s) URLs and site-relative paths such as /demo/song.mp3. */
export function isSafeUrl(value: string, { allowRelative = true } = {}): boolean {
  if (allowRelative && value.startsWith("/") && !value.startsWith("//")) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function optionalUrl(
  form: FormFields,
  key: string,
  errors: FieldErrors,
  { allowRelative = true } = {},
): string | null {
  const value = text(form, key);
  if (!value) return null;
  if (value.length > 2000 || !isSafeUrl(value, { allowRelative })) {
    errors[key] = "Enter a full link starting with https://";
  }
  return value;
}

function isValidTimeZone(timeZone: string): boolean {
  if (!timeZone) return false;
  try {
    new Intl.DateTimeFormat("en", { timeZone });
    return true;
  } catch {
    return false;
  }
}

function dateTime(
  form: FormFields,
  key: string,
  timeZone: string,
  errors: FieldErrors,
  { required }: { required: boolean },
): Date | null {
  const value = text(form, key);
  if (!value) {
    if (required) errors[key] = "Choose a date and time.";
    return null;
  }
  try {
    return zonedTimeToUtc(value, isValidTimeZone(timeZone) ? timeZone : "UTC");
  } catch {
    errors[key] = "Choose a date and time.";
    return null;
  }
}

function coordinate(form: FormFields, key: "lat" | "lng", errors: FieldErrors): number | null {
  const raw = text(form, key);
  if (!raw) return null;
  const value = Number(raw);
  const limit = key === "lat" ? 90 : 180;
  if (!Number.isFinite(value) || Math.abs(value) > limit) {
    errors[key] = key === "lat" ? "Latitude must be between -90 and 90." : "Longitude must be between -180 and 180.";
    return null;
  }
  return value;
}

function result<T>(data: T, errors: FieldErrors): Parsed<T> {
  return Object.keys(errors).length ? { success: false, fieldErrors: errors } : { success: true, data };
}

export type CoupleDetails = {
  partnerOne: LocalizedText;
  partnerTwo: LocalizedText;
  slug: string;
  weddingAt: Date;
  timezone: string;
  city: LocalizedText | null;
  theme: ThemeName;
  heroPhotoUrl: string | null;
  heroPosition: string;
  musicUrl: string | null;
  musicTitle: string | null;
};

export function parseCoupleDetails(form: FormFields): Parsed<CoupleDetails> {
  const errors: FieldErrors = {};
  const partnerOne = requiredLocalized(form, "partnerOne", errors, "Enter this partner's name in English.");
  const partnerTwo = requiredLocalized(form, "partnerTwo", errors, "Enter this partner's name in English.");

  const slug = text(form, "slug");
  if (!isValidSlug(slug)) {
    errors.slug = "Use 3 to 40 lowercase letters, numbers and single hyphens. Some words like admin are reserved.";
  }

  const timezone = text(form, "timezone");
  if (!isValidTimeZone(timezone)) errors.timezone = "Choose a time zone from the list.";

  const weddingAt = dateTime(form, "weddingAt", timezone, errors, { required: true });

  const theme = text(form, "theme");
  if (!isThemeName(theme)) errors.theme = "Choose one of the themes.";

  const heroPosition = text(form, "heroPosition") || HERO_POSITIONS[1].value;
  if (!HERO_POSITIONS.some((p) => p.value === heroPosition)) errors.heroPosition = "Choose a photo position.";

  return result(
    {
      partnerOne,
      partnerTwo,
      slug,
      weddingAt: weddingAt as Date,
      timezone,
      city: readLocalized(form, "city"),
      theme: theme as ThemeName,
      heroPhotoUrl: optionalUrl(form, "heroPhotoUrl", errors),
      heroPosition,
      musicUrl: optionalUrl(form, "musicUrl", errors),
      musicTitle: optionalText(form, "musicTitle", 120, errors, "Keep the song title under 120 characters."),
    },
    errors,
  );
}

export type CoupleTexts = {
  tagline: LocalizedText | null;
  hosts: LocalizedText | null;
  invitation: LocalizedText | null;
  story: LocalizedText | null;
  scripture: LocalizedText | null;
  scriptureRef: LocalizedText | null;
  dressCode: LocalizedText | null;
  giftNote: LocalizedText | null;
  telegramUrl: string | null;
  rsvpEnabled: boolean;
  rsvpDeadline: Date | null;
};

export function parseCoupleTexts(form: FormFields, timeZone: string): Parsed<CoupleTexts> {
  const errors: FieldErrors = {};
  return result(
    {
      tagline: readLocalized(form, "tagline"),
      hosts: readLocalized(form, "hosts"),
      invitation: readLocalized(form, "invitation"),
      story: readLocalized(form, "story"),
      scripture: readLocalized(form, "scripture"),
      scriptureRef: readLocalized(form, "scriptureRef"),
      dressCode: readLocalized(form, "dressCode"),
      giftNote: readLocalized(form, "giftNote"),
      telegramUrl: optionalUrl(form, "telegramUrl", errors, { allowRelative: false }),
      rsvpEnabled: form.rsvpEnabled === "on",
      rsvpDeadline: dateTime(form, "rsvpDeadline", timeZone, errors, { required: false }),
    },
    errors,
  );
}

export type VenueInput = {
  name: LocalizedText;
  address: LocalizedText | null;
  mapsUrl: string | null;
  lat: number | null;
  lng: number | null;
  imageUrl: string | null;
};

export function parseVenue(form: FormFields): Parsed<VenueInput> {
  const errors: FieldErrors = {};
  const name = requiredLocalized(form, "name", errors, "Enter the venue name in English.");
  const lat = coordinate(form, "lat", errors);
  const lng = coordinate(form, "lng", errors);
  if (!errors.lat && !errors.lng) {
    if (lat !== null && lng === null) errors.lng = "Add the longitude too, or clear the latitude.";
    if (lng !== null && lat === null) errors.lat = "Add the latitude too, or clear the longitude.";
  }
  return result(
    {
      name,
      address: readLocalized(form, "address"),
      mapsUrl: optionalUrl(form, "mapsUrl", errors, { allowRelative: false }),
      lat,
      lng,
      imageUrl: optionalUrl(form, "imageUrl", errors),
    },
    errors,
  );
}

export type EventInput = {
  title: LocalizedText;
  description: LocalizedText | null;
  startsAt: Date;
  venueId: string | null;
};

export function parseEvent(form: FormFields, timeZone: string): Parsed<EventInput> {
  const errors: FieldErrors = {};
  const title = requiredLocalized(form, "title", errors, "Enter the event title in English.");
  const startsAt = dateTime(form, "startsAt", timeZone, errors, { required: true });
  const venueId = text(form, "venueId") || null;
  if (venueId && !UUID_PATTERN.test(venueId)) errors.venueId = "Choose a venue from the list.";
  return result(
    { title, description: readLocalized(form, "description"), startsAt: startsAt as Date, venueId },
    errors,
  );
}

export type GiftAccountInput = {
  kind: GiftKind;
  provider: string;
  accountName: string;
  accountNumber: string;
  note: LocalizedText | null;
};

export function parseGiftAccount(form: FormFields): Parsed<GiftAccountInput> {
  const errors: FieldErrors = {};
  const kind = text(form, "kind") as GiftKind;
  if (!GIFT_KINDS.includes(kind)) errors.kind = "Choose how guests send this gift.";

  const required = (key: string, label: string, max: number) => {
    const value = text(form, key);
    if (!value) errors[key] = `Enter the ${label}.`;
    else if (value.length > max) errors[key] = `Keep the ${label} under ${max} characters.`;
    return value;
  };

  return result(
    {
      kind,
      provider: required("provider", "bank or service name", 80),
      accountName: required("accountName", "account holder's name", 120),
      accountNumber: required("accountNumber", "account or phone number", 60),
      note: readLocalized(form, "note"),
    },
    errors,
  );
}

export type WishlistItemInput = {
  title: LocalizedText;
  url: string | null;
  imageUrl: string | null;
  price: string | null;
};

export function parseWishlistItem(form: FormFields): Parsed<WishlistItemInput> {
  const errors: FieldErrors = {};
  return result(
    {
      title: requiredLocalized(form, "title", errors, "Enter the item name in English."),
      url: optionalUrl(form, "url", errors, { allowRelative: false }),
      imageUrl: optionalUrl(form, "imageUrl", errors),
      price: optionalText(form, "price", 40, errors, "Keep the price under 40 characters."),
    },
    errors,
  );
}
