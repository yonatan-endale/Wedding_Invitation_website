import { relations } from "drizzle-orm";
import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { BORDER_STYLES, COUPLE_STATUSES, GIFT_KINDS } from "@/lib/constants";
import type { LocalizedText } from "@/lib/localized";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

const localized = (name: string) => jsonb(name).$type<LocalizedText>();

export const couples = pgTable("couples", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  status: text("status", { enum: COUPLE_STATUSES }).notNull().default("draft"),
  partnerOne: localized("partner_one").notNull(),
  partnerTwo: localized("partner_two").notNull(),
  partnerOneNick: localized("partner_one_nick"),
  partnerTwoNick: localized("partner_two_nick"),
  partnerOneFather: localized("partner_one_father"),
  partnerTwoFather: localized("partner_two_father"),
  tagline: localized("tagline"),
  weddingAt: timestamp("wedding_at", { withTimezone: true }).notNull(),
  timezone: text("timezone").notNull().default("Africa/Addis_Ababa"),
  city: localized("city"),
  invitation: localized("invitation"),
  hosts: localized("hosts"),
  story: localized("story"),
  scripture: localized("scripture"),
  scriptureRef: localized("scripture_ref"),
  dressCode: localized("dress_code"),
  giftNote: localized("gift_note"),
  heroPhotoUrl: text("hero_photo_url"),
  heroPosition: text("hero_position").notNull().default("50% 40%"),
  musicUrl: text("music_url"),
  musicTitle: text("music_title"),
  telegramUrl: text("telegram_url"),
  theme: text("theme").notNull().default("tibeb"),
  border: text("border", { enum: BORDER_STYLES }).notNull().default("tibeb"),
  petals: boolean("petals").notNull().default(true),
  rsvpEnabled: boolean("rsvp_enabled").notNull().default(true),
  rsvpDeadline: timestamp("rsvp_deadline", { withTimezone: true }),
  ...timestamps,
});

export const photos = pgTable(
  "photos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    coupleId: uuid("couple_id")
      .notNull()
      .references(() => couples.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    caption: localized("caption"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("photos_couple_idx").on(t.coupleId, t.sortOrder)],
);

export const venues = pgTable(
  "venues",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    coupleId: uuid("couple_id")
      .notNull()
      .references(() => couples.id, { onDelete: "cascade" }),
    name: localized("name").notNull(),
    address: localized("address"),
    mapsUrl: text("maps_url"),
    lat: doublePrecision("lat"),
    lng: doublePrecision("lng"),
    imageUrl: text("image_url"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("venues_couple_idx").on(t.coupleId, t.sortOrder)],
);

export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    coupleId: uuid("couple_id")
      .notNull()
      .references(() => couples.id, { onDelete: "cascade" }),
    title: localized("title").notNull(),
    description: localized("description"),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    venueId: uuid("venue_id").references(() => venues.id, { onDelete: "set null" }),
    ...timestamps,
  },
  (t) => [index("events_couple_idx").on(t.coupleId, t.startsAt)],
);

export const giftAccounts = pgTable(
  "gift_accounts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    coupleId: uuid("couple_id")
      .notNull()
      .references(() => couples.id, { onDelete: "cascade" }),
    kind: text("kind", { enum: GIFT_KINDS }).notNull().default("bank"),
    provider: text("provider").notNull(),
    accountName: text("account_name").notNull(),
    accountNumber: text("account_number").notNull(),
    note: localized("note"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("gift_accounts_couple_idx").on(t.coupleId, t.sortOrder)],
);

export const wishlistItems = pgTable(
  "wishlist_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    coupleId: uuid("couple_id")
      .notNull()
      .references(() => couples.id, { onDelete: "cascade" }),
    title: localized("title").notNull(),
    url: text("url"),
    imageUrl: text("image_url"),
    price: text("price"),
    sortOrder: integer("sort_order").notNull().default(0),
    ...timestamps,
  },
  (t) => [index("wishlist_items_couple_idx").on(t.coupleId, t.sortOrder)],
);

export const rsvps = pgTable(
  "rsvps",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    coupleId: uuid("couple_id")
      .notNull()
      .references(() => couples.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    email: text("email"),
    attending: boolean("attending").notNull(),
    guestCount: integer("guest_count").notNull(),
    message: text("message"),
    locale: text("locale").notNull().default("en"),
    ...timestamps,
  },
  (t) => [index("rsvps_couple_idx").on(t.coupleId, t.createdAt)],
);

export const couplesRelations = relations(couples, ({ many }) => ({
  photos: many(photos),
  venues: many(venues),
  events: many(events),
  giftAccounts: many(giftAccounts),
  wishlistItems: many(wishlistItems),
  rsvps: many(rsvps),
}));

export const photosRelations = relations(photos, ({ one }) => ({
  couple: one(couples, { fields: [photos.coupleId], references: [couples.id] }),
}));

export const venuesRelations = relations(venues, ({ one }) => ({
  couple: one(couples, { fields: [venues.coupleId], references: [couples.id] }),
}));

export const eventsRelations = relations(events, ({ one }) => ({
  couple: one(couples, { fields: [events.coupleId], references: [couples.id] }),
  venue: one(venues, { fields: [events.venueId], references: [venues.id] }),
}));

export const giftAccountsRelations = relations(giftAccounts, ({ one }) => ({
  couple: one(couples, { fields: [giftAccounts.coupleId], references: [couples.id] }),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  couple: one(couples, { fields: [wishlistItems.coupleId], references: [couples.id] }),
}));

export const rsvpsRelations = relations(rsvps, ({ one }) => ({
  couple: one(couples, { fields: [rsvps.coupleId], references: [couples.id] }),
}));

export type Couple = typeof couples.$inferSelect;
export type Photo = typeof photos.$inferSelect;
export type Venue = typeof venues.$inferSelect;
export type WeddingEvent = typeof events.$inferSelect;
export type GiftAccount = typeof giftAccounts.$inferSelect;
export type WishlistItem = typeof wishlistItems.$inferSelect;
export type Rsvp = typeof rsvps.$inferSelect;
