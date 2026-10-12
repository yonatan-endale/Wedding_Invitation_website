import { z } from "zod";
import {
  BORDER_STYLES,
  COUPLE_STATUSES,
  DEFAULT_TIMEZONE,
  GIFT_KINDS,
  HERO_POSITIONS,
  PARTNER_ROLES,
} from "@/lib/constants";
import { CALENDAR_STYLES, MOTION_LEVELS, ORNAMENTS } from "@/lib/appearance";
import { zonedTimeToUtc } from "@/lib/datetime";
import { EVENT_KINDS, kindsFor } from "@/lib/event-kinds";
import { EVENT_TYPES, EVENT_TYPE_META, usesHonorees } from "@/lib/event-types";
import { LAYOUTS, isLayoutName, type LayoutMeta } from "@/lib/layout";
import type { LocalizedText } from "@/lib/localized";
import { isOpeningName } from "@/lib/opening";
import { isValidSlug } from "@/lib/slug";
import { isThemeName } from "@/lib/theme";
import { CALENDAR_DATE, isSafeUrl, isValidTimeZone } from "./admin";

/*
 * Validates a whole couple in one JSON document, the file uploaded at
 * /admin/couples/import. The rules mirror the per-form parsers in ./admin.ts;
 * keep them in step. A file without `eventType` is a wedding, as every file
 * was before other event types existed.
 */

const LOCAL_DATETIME = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/;
const ISO_WITH_OFFSET = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})$/;
const URL_MESSAGE = "Enter a full link starting with https://";

function collapse(value: { en?: string; am?: string } | null | undefined): LocalizedText | null {
  const en = value?.en?.trim() ?? "";
  const am = value?.am?.trim() ?? "";
  if (!en && !am) return null;
  return am ? { en, am } : { en };
}

const localizedShape = z.object({ en: z.string().optional(), am: z.string().optional() }).strict();

/** `{ en, am? }`, or null when both languages are blank or the field is missing. */
const optionalLocalized = localizedShape.nullish().transform(collapse);

/** `{ en, am? }` with English text present. */
const requiredLocalized = localizedShape.transform(collapse).pipe(
  z.custom<LocalizedText>((value) => value !== null && (value as LocalizedText).en.length > 0, {
    message: "Add the English text.",
  }),
);

function optionalText(max: number) {
  return z
    .string()
    .trim()
    .max(max, `Keep this under ${max} characters.`)
    .nullish()
    .transform((value) => value || null);
}

function requiredText(max: number, label: string) {
  return z.string().trim().min(1, `Enter the ${label}.`).max(max, `Keep the ${label} under ${max} characters.`);
}

function url({ allowRelative = true } = {}) {
  return z
    .string()
    .trim()
    .nullish()
    .transform((value) => value || null)
    .pipe(
      z
        .string()
        .max(2000, URL_MESSAGE)
        .refine((value) => isSafeUrl(value, { allowRelative }), URL_MESSAGE)
        .nullable(),
    );
}

const requiredUrl = z
  .string()
  .trim()
  .min(1, URL_MESSAGE)
  .max(2000, URL_MESSAGE)
  .refine((value) => isSafeUrl(value), URL_MESSAGE);

/**
 * A point in time. `"2026-10-24T15:00"` is wall-clock time in the couple's
 * time zone; a full ISO string with an offset (or a Date) is taken as-is.
 */
function dateTime(timeZone: string) {
  return z.union([z.date(), z.string()]).transform((value, ctx) => {
    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) ctx.addIssue({ code: "custom", message: "Invalid date." });
      return value;
    }
    const raw = value.trim();
    if (LOCAL_DATETIME.test(raw)) return zonedTimeToUtc(raw.slice(0, 16), timeZone);
    const parsed = new Date(raw);
    if (!ISO_WITH_OFFSET.test(raw) || Number.isNaN(parsed.getTime())) {
      ctx.addIssue({
        code: "custom",
        message: 'Use "YYYY-MM-DDTHH:mm" (local time) or a full ISO date with an offset such as "2026-10-24T15:00:00+03:00".',
      });
      return z.NEVER;
    }
    return parsed;
  });
}

function optionalDateTime(timeZone: string) {
  return dateTime(timeZone)
    .nullish()
    .transform((value) => value ?? null);
}

function buildSchema(timeZone: string) {
  const couple = z
    .object({
      slug: z
        .string()
        .trim()
        .refine(isValidSlug, "Use 3 to 40 lowercase letters, numbers and single hyphens. Some words like admin are reserved."),
      status: z.enum(COUPLE_STATUSES).default("draft"),
      eventType: z
        .enum(EVENT_TYPES)
        .default("wedding")
        .refine((type) => EVENT_TYPE_META[type].enabled, "This event type is not open yet."),
      /* Required for couple types and left out for honoree types; checked below once the type is known. */
      partnerOne: optionalLocalized,
      partnerTwo: optionalLocalized,
      partnerOneNick: optionalLocalized,
      partnerTwoNick: optionalLocalized,
      partnerOneFather: optionalLocalized,
      partnerTwoFather: optionalLocalized,
      partnerOneRole: z.enum(PARTNER_ROLES).default("bride"),
      partnerTwoRole: z.enum(PARTNER_ROLES).default("groom"),
      partnerOnePortraitUrl: url(),
      partnerTwoPortraitUrl: url(),
      tagline: optionalLocalized,
      weddingAt: dateTime(timeZone),
      timezone: z.string().trim().default(DEFAULT_TIMEZONE).refine(isValidTimeZone, "Use an IANA time zone such as Africa/Addis_Ababa."),
      city: optionalLocalized,
      invitation: optionalLocalized,
      hosts: optionalLocalized,
      story: optionalLocalized,
      scripture: optionalLocalized,
      scriptureRef: optionalLocalized,
      dressCode: optionalLocalized,
      giftNote: optionalLocalized,
      heroPhotoUrl: url(),
      heroPosition: z
        .string()
        .trim()
        .default(HERO_POSITIONS[1].value)
        .refine((value) => HERO_POSITIONS.some((p) => p.value === value), `Use one of ${HERO_POSITIONS.map((p) => `"${p.value}"`).join(", ")}.`),
      musicUrl: url(),
      musicTitle: optionalText(120),
      telegramUrl: url({ allowRelative: false }),
      theme: z.string().trim().default("tibeb").refine(isThemeName, "Unknown theme."),
      layout: z.string().trim().default("classic").refine(isLayoutName, "Unknown layout."),
      border: z.enum(BORDER_STYLES).default("tibeb"),
      opening: z.string().trim().default("netela").refine(isOpeningName, "Unknown opening."),
      calendarStyle: z.enum(CALENDAR_STYLES).default("both"),
      motion: z.enum(MOTION_LEVELS).default("moderate"),
      ornament: z.enum(ORNAMENTS).default("none"),
      calendarPhotoUrl: url(),
      petals: z.boolean().default(true),
      rsvpEnabled: z.boolean().default(true),
      rsvpDeadline: optionalDateTime(timeZone),
      guestCardsEnabled: z.boolean().default(false),
      couplePageEnabled: z.boolean().default(false),
      galleryDrift: z.boolean().default(false),
      calendarButtons: z.boolean().default(false),
      scrollProgress: z.boolean().default(false),
      collapsibleEvents: z.boolean().default(false),
    })
    .strict();

  const venue = z
    .object({
      name: requiredLocalized,
      address: optionalLocalized,
      mapsUrl: url({ allowRelative: false }),
      lat: z.number().min(-90).max(90).nullish().transform((value) => value ?? null),
      lng: z.number().min(-180).max(180).nullish().transform((value) => value ?? null),
      imageUrl: url(),
    })
    .strict()
    .superRefine((value, ctx) => {
      if (value.lat !== null && value.lng === null) ctx.addIssue({ code: "custom", path: ["lng"], message: "Add the longitude too, or drop the latitude." });
      if (value.lng !== null && value.lat === null) ctx.addIssue({ code: "custom", path: ["lat"], message: "Add the latitude too, or drop the longitude." });
    });

  const event = z
    .object({
      title: requiredLocalized,
      description: optionalLocalized,
      startsAt: dateTime(timeZone),
      endsAt: optionalDateTime(timeZone),
      /** Index into `venues`; leave it out for steps with no place, like travel. */
      venue: z.number().int().min(0).nullish().transform((value) => value ?? null),
      kind: z.enum(EVENT_KINDS).default("other"),
    })
    .strict()
    .superRefine((value, ctx) => {
      if (value.endsAt && value.endsAt.getTime() <= value.startsAt.getTime()) {
        ctx.addIssue({ code: "custom", path: ["endsAt"], message: "The end must be after the start." });
      }
    });

  const photo = z.preprocess(
    (value) => (typeof value === "string" ? { url: value } : value),
    z.object({ url: requiredUrl, caption: optionalLocalized, groupLabel: optionalLocalized }).strict(),
  );

  const honoree = z
    .object({
      name: requiredLocalized,
      nick: optionalLocalized,
      father: optionalLocalized,
      headline: optionalLocalized,
      subheadline: optionalLocalized,
      story: optionalLocalized,
      portraitUrl: url(),
      portraitPosition: z
        .string()
        .trim()
        .default(HERO_POSITIONS[1].value)
        .refine((value) => HERO_POSITIONS.some((p) => p.value === value), `Use one of ${HERO_POSITIONS.map((p) => `"${p.value}"`).join(", ")}.`),
    })
    .strict();

  const gift = z
    .object({
      kind: z.enum(GIFT_KINDS).default("bank"),
      provider: requiredText(80, "bank or service name"),
      accountName: requiredText(120, "account holder's name"),
      accountNumber: requiredText(60, "account or phone number"),
      note: optionalLocalized,
    })
    .strict();

  const milestone = z
    .object({
      happenedOn: z.string().trim().regex(CALENDAR_DATE, 'Use a calendar day like "2022-01-15".'),
      title: requiredLocalized,
      body: optionalLocalized,
      imageUrl: url(),
    })
    .strict();

  const wishlistItem = z
    .object({
      title: requiredLocalized,
      url: url({ allowRelative: false }),
      imageUrl: url(),
      price: optionalText(40),
    })
    .strict();

  return z
    .object({
      couple,
      /** The people a non-wedding site celebrates, in display order. Weddings leave it out. */
      honorees: z.array(honoree).default([]),
      /** Display order; the first venue is the one shown on the invitation card. */
      venues: z.array(venue).default([]),
      events: z.array(event).default([]),
      /** Gallery images in display order, as URLs or `{ url, caption }`. */
      photos: z.array(photo).default([]),
      gifts: z.array(gift).default([]),
      milestones: z.array(milestone).default([]),
      wishlist: z.array(wishlistItem).default([]),
    })
    .strict()
    .superRefine((value, ctx) => {
      const type = value.couple.eventType;
      const meta = EVENT_TYPE_META[type];
      // A closed type is already reported; checking its people and layout would only add noise.
      if (meta.enabled) {
        if (usesHonorees(type)) {
          const { min, max } = meta.honorees;
          if (value.honorees.length < min || value.honorees.length > max) {
            ctx.addIssue({
              code: "custom",
              path: ["honorees"],
              message: `A ${meta.label.toLowerCase()} needs ${min === max ? min : `${min} to ${max}`} honorees.`,
            });
          }
          for (const field of ["partnerOne", "partnerTwo"] as const) {
            if (value.couple[field]) {
              ctx.addIssue({ code: "custom", path: ["couple", field], message: "List the people under honorees instead." });
            }
          }
        } else {
          for (const field of ["partnerOne", "partnerTwo"] as const) {
            if (!value.couple[field]?.en) ctx.addIssue({ code: "custom", path: ["couple", field], message: "Add the English text." });
          }
          if (value.honorees.length) {
            ctx.addIssue({ code: "custom", path: ["honorees"], message: `A ${meta.label.toLowerCase()} names its two partners on the couple instead.` });
          }
        }
        const layout = value.couple.layout;
        if (isLayoutName(layout) && !(LAYOUTS[layout] as LayoutMeta).eventTypes.includes(type)) {
          ctx.addIssue({ code: "custom", path: ["couple", "layout"], message: `This layout is not drawn for a ${meta.label.toLowerCase()}.` });
        }
        const kinds = kindsFor(type);
        value.events.forEach((event, index) => {
          if (!kinds.includes(event.kind)) {
            ctx.addIssue({ code: "custom", path: ["events", index, "kind"], message: `This kind is not offered for a ${meta.label.toLowerCase()}.` });
          }
        });
      }
      value.events.forEach((event, index) => {
        if (event.venue !== null && event.venue >= value.venues.length) {
          ctx.addIssue({
            code: "custom",
            path: ["events", index, "venue"],
            message: `points at a venue that does not exist (venues has ${value.venues.length}).`,
          });
        }
      });
    });
}

type ImportSchema = ReturnType<typeof buildSchema>;

/** Insert-ready data: dates resolved, blanks collapsed to null, defaults applied. */
export type CoupleImport = z.output<ImportSchema>;

export type CoupleImportResult = { success: true; data: CoupleImport } | { success: false; issues: string[] };

function formatPath(path: PropertyKey[]): string {
  return path.reduce<string>((acc, part) => {
    if (typeof part === "number") return `${acc}[${part}]`;
    return acc ? `${acc}.${String(part)}` : String(part);
  }, "");
}

/** Reads the couple's time zone ahead of validation so local dates can be resolved. */
function timeZoneOf(raw: unknown): string {
  const candidate = (raw as { couple?: { timezone?: unknown } } | null)?.couple?.timezone;
  return typeof candidate === "string" && isValidTimeZone(candidate) ? candidate : DEFAULT_TIMEZONE;
}

export function parseCoupleImport(raw: unknown): CoupleImportResult {
  const result = buildSchema(timeZoneOf(raw)).safeParse(raw);
  if (result.success) return { success: true, data: result.data };
  const issues = result.error.issues.map((issue) => {
    const path = formatPath(issue.path);
    return path ? `${path}: ${issue.message}` : issue.message;
  });
  return { success: false, issues: Array.from(new Set(issues)) };
}
