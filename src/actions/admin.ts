"use server";

import { and, asc, eq, max } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { getDb } from "@/db";
import { isUuid } from "@/db/queries/admin";
import { importCouple, SlugTakenError } from "@/db/queries/couple-import";
import { couples, events, giftAccounts, honorees, photos, rsvps, storyMilestones, venues, wishlistItems } from "@/db/schema";
import { getAdminUser } from "@/lib/auth";
import { couplePortalUrl } from "@/lib/card-links";
import { siteCacheTag, type CoupleStatus } from "@/lib/constants";
import { createAccess, revokeAccess, unlockAccess } from "@/lib/couple-access";
import { EVENT_TYPE_META, usesHonorees, type EventType } from "@/lib/event-types";
import { moveItem, type Direction } from "@/lib/reorder";
import { siteLinks } from "@/lib/site-links";
import {
  formDataToFields,
  isSafeUrl,
  parseCoupleDetails,
  parseCoupleTexts,
  parseEvent,
  parseEventType,
  parseFirstHonoree,
  parseGiftAccount,
  parseHonoree,
  parseMilestone,
  parsePhotoLabels,
  parseVenue,
  parseWishlistItem,
  type FieldErrors,
} from "@/lib/validation/admin";
import { parseCoupleImport } from "@/lib/validation/couple-import";

export type ActionState = { ok: boolean; message: string | null; fieldErrors: FieldErrors; savedAt: number };

const failure = (message: string, fieldErrors: FieldErrors = {}): ActionState => ({
  ok: false,
  message,
  fieldErrors,
  savedAt: Date.now(),
});

const success = (message: string): ActionState => ({ ok: true, message, fieldErrors: {}, savedAt: Date.now() });

const SESSION_ENDED = "Your session ended. Sign in again, then retry.";
const CHECK_FIELDS = "Some fields need attention.";
const NOT_FOUND = "That item no longer exists. Refresh the page.";

function isUniqueViolation(error: unknown): boolean {
  const err = error as { code?: string; cause?: { code?: string } };
  return err?.code === "23505" || err?.cause?.code === "23505";
}

/** What the site celebrates, fixed when it was created; null when the site is gone. */
async function coupleEventType(coupleId: string): Promise<EventType | null> {
  if (!isUuid(coupleId)) return null;
  const [row] = await getDb().select({ eventType: couples.eventType }).from(couples).where(eq(couples.id, coupleId));
  return row?.eventType ?? null;
}

async function coupleSlug(coupleId: string): Promise<string | null> {
  if (!isUuid(coupleId)) return null;
  const [row] = await getDb().select({ slug: couples.slug }).from(couples).where(eq(couples.id, coupleId));
  return row?.slug ?? null;
}

/** Clears the guest site cache and refreshes admin pages after any change. */
async function refreshCouple(coupleId: string, extraSlugs: string[] = []) {
  const slug = await coupleSlug(coupleId);
  for (const s of new Set([slug, ...extraSlugs])) {
    if (s) revalidateTag(siteCacheTag(s));
  }
  revalidatePath("/admin", "layout");
}

/* ------------------------------- Couples ------------------------------- */

export async function createCouple(_previous: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await getAdminUser())) return failure(SESSION_ENDED);
  const fields = formDataToFields(formData);
  const type = parseEventType(fields);
  if (!type.success) return failure(CHECK_FIELDS, type.fieldErrors);
  const eventType = type.data;
  const parsed = parseCoupleDetails(fields, eventType);
  // An honoree site starts with its first honoree, so it is never without a name.
  const first = usesHonorees(eventType) ? parseFirstHonoree(fields) : null;
  if (!parsed.success || (first && !first.success)) {
    return failure(CHECK_FIELDS, {
      ...(parsed.success ? {} : parsed.fieldErrors),
      ...(first && !first.success ? first.fieldErrors : {}),
    });
  }

  let id: string;
  try {
    id = await getDb().transaction(async (tx) => {
      const [row] = await tx
        .insert(couples)
        .values({ ...parsed.data, eventType, status: "draft" })
        .returning({ id: couples.id });
      if (first?.success) await tx.insert(honorees).values({ ...first.data, coupleId: row.id, sortOrder: 0 });
      return row.id;
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return failure(CHECK_FIELDS, { slug: "Another couple already uses this link. Try adding the year." });
    }
    throw error;
  }

  revalidatePath("/admin");
  redirect(`/admin/couples/${id}?tab=texts`);
}

const MAX_IMPORT_BYTES = 1_000_000;

/** Creates (or, when asked, replaces) a whole couple from an uploaded JSON file. */
export async function importCoupleFromJson(_previous: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await getAdminUser())) return failure(SESSION_ENDED);

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return failure(CHECK_FIELDS, { file: "Choose a .json file." });
  if (file.size > MAX_IMPORT_BYTES) return failure(CHECK_FIELDS, { file: "Keep the file under 1 MB." });

  let raw: unknown;
  try {
    raw = JSON.parse(await file.text());
  } catch {
    return failure("That file is not valid JSON.", { file: "The file could not be read as JSON. Check for a missing comma or quote." });
  }

  const parsed = parseCoupleImport(raw);
  if (!parsed.success) {
    const count = parsed.issues.length;
    return failure(count === 1 ? "The file has one problem." : `The file has ${count} problems.`, {
      file: parsed.issues.join("\n"),
    });
  }

  const replace = formData.get("replace") === "on";
  let id: string;
  try {
    ({ id } = await importCouple(getDb(), parsed.data, { replace }));
  } catch (error) {
    if (error instanceof SlugTakenError) {
      return failure(CHECK_FIELDS, {
        file: `A couple already uses /s/${error.slug}. Turn on "Replace the existing couple" to overwrite it, RSVPs included.`,
      });
    }
    throw error;
  }

  await refreshCouple(id);
  redirect(`/admin/couples/${id}`);
}

export async function updateCoupleDetails(coupleId: string, _previous: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await getAdminUser())) return failure(SESSION_ENDED);
  const previousSlug = await coupleSlug(coupleId);
  const eventType = await coupleEventType(coupleId);
  if (!previousSlug || !eventType) return failure(NOT_FOUND);

  const parsed = parseCoupleDetails(formDataToFields(formData), eventType);
  if (!parsed.success) return failure(CHECK_FIELDS, parsed.fieldErrors);

  try {
    await getDb().update(couples).set(parsed.data).where(eq(couples.id, coupleId));
  } catch (error) {
    if (isUniqueViolation(error)) {
      return failure(CHECK_FIELDS, { slug: "Another couple already uses this link. Try adding the year." });
    }
    throw error;
  }

  await refreshCouple(coupleId, [previousSlug]);
  return success(
    previousSlug === parsed.data.slug ? "Details saved." : "Details saved. The site link changed, so share the new one.",
  );
}

export async function updateCoupleTexts(coupleId: string, _previous: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await getAdminUser())) return failure(SESSION_ENDED);
  if (!isUuid(coupleId)) return failure(NOT_FOUND);
  const [couple] = await getDb().select({ timezone: couples.timezone }).from(couples).where(eq(couples.id, coupleId));
  if (!couple) return failure(NOT_FOUND);

  const parsed = parseCoupleTexts(formDataToFields(formData), couple.timezone);
  if (!parsed.success) return failure(CHECK_FIELDS, parsed.fieldErrors);

  await getDb().update(couples).set(parsed.data).where(eq(couples.id, coupleId));
  await refreshCouple(coupleId);
  return success("Invitation text saved.");
}

export async function setCoupleStatus(coupleId: string, status: CoupleStatus): Promise<ActionState> {
  if (!(await getAdminUser())) return failure(SESSION_ENDED);
  if (!isUuid(coupleId) || (status !== "draft" && status !== "published")) return failure(NOT_FOUND);
  await getDb().update(couples).set({ status }).where(eq(couples.id, coupleId));
  await refreshCouple(coupleId);
  return success(status === "published" ? "Published. Guests can open the site now." : "Unpublished. The site is hidden from guests.");
}

export async function deleteCouple(coupleId: string): Promise<ActionState> {
  if (!(await getAdminUser())) return failure(SESSION_ENDED);
  const slug = await coupleSlug(coupleId);
  if (!slug) return failure(NOT_FOUND);
  await getDb().delete(couples).where(eq(couples.id, coupleId));
  revalidateTag(siteCacheTag(slug));
  revalidatePath("/admin", "layout");
  redirect("/admin");
}

/* ----------------------------- List helpers ---------------------------- */

const SORTABLE = { photos, honorees, venues, giftAccounts, wishlistItems, storyMilestones } as const;
const DELETABLE = { photos, honorees, venues, events, giftAccounts, wishlistItems, storyMilestones, rsvps } as const;

export type SortableList = keyof typeof SORTABLE;
export type DeletableList = keyof typeof DELETABLE;

/** Every list table shares id, coupleId and createdAt; the sortable ones also have sortOrder. */
type ListTable = typeof photos;

async function nextSortOrder(list: SortableList, coupleId: string) {
  const table = SORTABLE[list] as unknown as ListTable;
  const [row] = await getDb()
    .select({ value: max(table.sortOrder) })
    .from(table)
    .where(eq(table.coupleId, coupleId));
  return (row?.value ?? -1) + 1;
}

export async function moveListItem(list: SortableList, id: string, direction: Direction): Promise<ActionState> {
  if (!(await getAdminUser())) return failure(SESSION_ENDED);
  if (!(list in SORTABLE) || !isUuid(id) || (direction !== "up" && direction !== "down")) return failure(NOT_FOUND);
  const table = SORTABLE[list] as unknown as ListTable;
  const db = getDb();

  const [item] = await db.select({ coupleId: table.coupleId }).from(table).where(eq(table.id, id));
  if (!item) return failure(NOT_FOUND);

  const siblings = await db
    .select({ id: table.id })
    .from(table)
    .where(eq(table.coupleId, item.coupleId))
    .orderBy(asc(table.sortOrder), asc(table.createdAt));
  const order = moveItem(
    siblings.map((s) => s.id),
    id,
    direction,
  );
  if (!order) return failure(NOT_FOUND);

  await Promise.all(order.map((itemId, index) => db.update(table).set({ sortOrder: index }).where(eq(table.id, itemId))));
  await refreshCouple(item.coupleId);
  return success("Order updated.");
}

export async function deleteListItem(list: DeletableList, id: string): Promise<ActionState> {
  if (!(await getAdminUser())) return failure(SESSION_ENDED);
  if (!(list in DELETABLE) || !isUuid(id)) return failure(NOT_FOUND);
  const table = DELETABLE[list] as unknown as ListTable;
  if (list === "honorees") {
    const [item] = await getDb().select({ coupleId: honorees.coupleId }).from(honorees).where(eq(honorees.id, id));
    if (!item) return failure(NOT_FOUND);
    const siblings = await getDb().select({ id: honorees.id }).from(honorees).where(eq(honorees.coupleId, item.coupleId));
    if (siblings.length <= 1) return failure("Keep at least one person on the site. Edit this one instead.");
  }
  const [removed] = await getDb().delete(table).where(eq(table.id, id)).returning({ coupleId: table.coupleId });
  if (!removed) return failure(NOT_FOUND);
  await refreshCouple(removed.coupleId);
  return success("Removed.");
}

/* -------------------------------- Photos ------------------------------- */

export async function addPhotos(coupleId: string, urls: string[]): Promise<ActionState> {
  if (!(await getAdminUser())) return failure(SESSION_ENDED);
  if (!(await coupleSlug(coupleId))) return failure(NOT_FOUND);
  const clean = urls.map((u) => u.trim()).filter(Boolean);
  if (clean.length === 0 || clean.length > 50) return failure("Add between 1 and 50 photos at a time.");
  if (clean.some((u) => u.length > 2000 || !isSafeUrl(u))) return failure("Photo links must start with https://");

  const start = await nextSortOrder("photos", coupleId);
  await getDb()
    .insert(photos)
    .values(clean.map((url, index) => ({ coupleId, url, sortOrder: start + index })));
  await refreshCouple(coupleId);
  return success(clean.length === 1 ? "Photo added." : `${clean.length} photos added.`);
}

export async function updatePhotoLabels(photoId: string, _previous: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await getAdminUser())) return failure(SESSION_ENDED);
  if (!isUuid(photoId)) return failure(NOT_FOUND);
  const parsed = parsePhotoLabels(formDataToFields(formData));
  if (!parsed.success) return failure(CHECK_FIELDS, parsed.fieldErrors);
  const [photo] = await getDb().update(photos).set(parsed.data).where(eq(photos.id, photoId)).returning({ coupleId: photos.coupleId });
  if (!photo) return failure(NOT_FOUND);
  await refreshCouple(photo.coupleId);
  return success("Photo saved.");
}

export async function setCoverPhoto(photoId: string): Promise<ActionState> {
  if (!(await getAdminUser())) return failure(SESSION_ENDED);
  if (!isUuid(photoId)) return failure(NOT_FOUND);
  const [photo] = await getDb().select().from(photos).where(eq(photos.id, photoId));
  if (!photo) return failure(NOT_FOUND);
  await getDb().update(couples).set({ heroPhotoUrl: photo.url }).where(eq(couples.id, photo.coupleId));
  await refreshCouple(photo.coupleId);
  return success("Cover photo updated.");
}

/* ------------------------- Venues and schedule ------------------------- */

export async function saveVenue(
  coupleId: string,
  venueId: string | null,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await getAdminUser())) return failure(SESSION_ENDED);
  if (!(await coupleSlug(coupleId))) return failure(NOT_FOUND);
  const parsed = parseVenue(formDataToFields(formData));
  if (!parsed.success) return failure(CHECK_FIELDS, parsed.fieldErrors);

  const db = getDb();
  if (venueId) {
    if (!isUuid(venueId)) return failure(NOT_FOUND);
    await db
      .update(venues)
      .set(parsed.data)
      .where(and(eq(venues.id, venueId), eq(venues.coupleId, coupleId)));
  } else {
    await db.insert(venues).values({ ...parsed.data, coupleId, sortOrder: await nextSortOrder("venues", coupleId) });
  }
  await refreshCouple(coupleId);
  return success(venueId ? "Venue saved." : "Venue added.");
}

export async function saveEvent(
  coupleId: string,
  eventId: string | null,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await getAdminUser())) return failure(SESSION_ENDED);
  if (!isUuid(coupleId)) return failure(NOT_FOUND);
  const db = getDb();
  const [couple] = await db
    .select({ timezone: couples.timezone, eventType: couples.eventType })
    .from(couples)
    .where(eq(couples.id, coupleId));
  if (!couple) return failure(NOT_FOUND);

  const parsed = parseEvent(formDataToFields(formData), couple.timezone, couple.eventType);
  if (!parsed.success) return failure(CHECK_FIELDS, parsed.fieldErrors);

  if (parsed.data.venueId) {
    const [venue] = await db
      .select({ id: venues.id })
      .from(venues)
      .where(and(eq(venues.id, parsed.data.venueId), eq(venues.coupleId, coupleId)));
    if (!venue) return failure(CHECK_FIELDS, { venueId: "Choose a venue from the list." });
  }

  if (eventId) {
    if (!isUuid(eventId)) return failure(NOT_FOUND);
    await db
      .update(events)
      .set(parsed.data)
      .where(and(eq(events.id, eventId), eq(events.coupleId, coupleId)));
  } else {
    await db.insert(events).values({ ...parsed.data, coupleId });
  }
  await refreshCouple(coupleId);
  return success(eventId ? "Event saved." : "Event added.");
}

/* -------------------------------- Honorees ------------------------------- */

export async function saveHonoree(
  coupleId: string,
  honoreeId: string | null,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await getAdminUser())) return failure(SESSION_ENDED);
  const eventType = await coupleEventType(coupleId);
  if (!eventType || !usesHonorees(eventType)) return failure(NOT_FOUND);
  const parsed = parseHonoree(formDataToFields(formData));
  if (!parsed.success) return failure(CHECK_FIELDS, parsed.fieldErrors);

  const db = getDb();
  if (honoreeId) {
    if (!isUuid(honoreeId)) return failure(NOT_FOUND);
    await db
      .update(honorees)
      .set(parsed.data)
      .where(and(eq(honorees.id, honoreeId), eq(honorees.coupleId, coupleId)));
  } else {
    const existing = await db.select({ id: honorees.id }).from(honorees).where(eq(honorees.coupleId, coupleId));
    const { label, honorees: limit } = EVENT_TYPE_META[eventType];
    if (existing.length >= limit.max) return failure(`A ${label.toLowerCase()} site lists up to ${limit.max} people.`);
    await db.insert(honorees).values({ ...parsed.data, coupleId, sortOrder: await nextSortOrder("honorees", coupleId) });
  }
  await refreshCouple(coupleId);
  return success(honoreeId ? "Saved." : "Added.");
}

/* ---------------------------- Story milestones ---------------------------- */

export async function saveMilestone(
  coupleId: string,
  milestoneId: string | null,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await getAdminUser())) return failure(SESSION_ENDED);
  if (!(await coupleSlug(coupleId))) return failure(NOT_FOUND);
  const parsed = parseMilestone(formDataToFields(formData));
  if (!parsed.success) return failure(CHECK_FIELDS, parsed.fieldErrors);

  const db = getDb();
  if (milestoneId) {
    if (!isUuid(milestoneId)) return failure(NOT_FOUND);
    await db
      .update(storyMilestones)
      .set(parsed.data)
      .where(and(eq(storyMilestones.id, milestoneId), eq(storyMilestones.coupleId, coupleId)));
  } else {
    await db
      .insert(storyMilestones)
      .values({ ...parsed.data, coupleId, sortOrder: await nextSortOrder("storyMilestones", coupleId) });
  }
  await refreshCouple(coupleId);
  return success(milestoneId ? "Chapter saved." : "Chapter added.");
}

/* -------------------------------- Gifts -------------------------------- */

export async function saveGiftAccount(
  coupleId: string,
  accountId: string | null,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await getAdminUser())) return failure(SESSION_ENDED);
  if (!(await coupleSlug(coupleId))) return failure(NOT_FOUND);
  const parsed = parseGiftAccount(formDataToFields(formData));
  if (!parsed.success) return failure(CHECK_FIELDS, parsed.fieldErrors);

  const db = getDb();
  if (accountId) {
    if (!isUuid(accountId)) return failure(NOT_FOUND);
    await db
      .update(giftAccounts)
      .set(parsed.data)
      .where(and(eq(giftAccounts.id, accountId), eq(giftAccounts.coupleId, coupleId)));
  } else {
    await db
      .insert(giftAccounts)
      .values({ ...parsed.data, coupleId, sortOrder: await nextSortOrder("giftAccounts", coupleId) });
  }
  await refreshCouple(coupleId);
  return success(accountId ? "Account saved." : "Account added.");
}

export async function saveWishlistItem(
  coupleId: string,
  itemId: string | null,
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  if (!(await getAdminUser())) return failure(SESSION_ENDED);
  if (!(await coupleSlug(coupleId))) return failure(NOT_FOUND);
  const parsed = parseWishlistItem(formDataToFields(formData));
  if (!parsed.success) return failure(CHECK_FIELDS, parsed.fieldErrors);

  const db = getDb();
  if (itemId) {
    if (!isUuid(itemId)) return failure(NOT_FOUND);
    await db
      .update(wishlistItems)
      .set(parsed.data)
      .where(and(eq(wishlistItems.id, itemId), eq(wishlistItems.coupleId, coupleId)));
  } else {
    await db
      .insert(wishlistItems)
      .values({ ...parsed.data, coupleId, sortOrder: await nextSortOrder("wishlistItems", coupleId) });
  }
  await refreshCouple(coupleId);
  return success(itemId ? "Wishlist item saved." : "Wishlist item added.");
}

/* ------------------------- Couple's private page ------------------------- */

export type CoupleAccessResult = { ok: true; link: string; passcode: string } | { ok: false; message: string };

/**
 * Makes a new secret link and passcode for the couple's RSVP and wishes page.
 * They are returned once and only their hashes are stored; the old link,
 * passcode and every signed-in device stop working.
 */
export async function createCoupleAccess(coupleId: string): Promise<CoupleAccessResult> {
  if (!(await getAdminUser())) return { ok: false, message: SESSION_ENDED };
  if (!isUuid(coupleId)) return { ok: false, message: NOT_FOUND };
  const [couple] = await getDb()
    .select({ slug: couples.slug, enabled: couples.couplePageEnabled })
    .from(couples)
    .where(eq(couples.id, coupleId));
  if (!couple) return { ok: false, message: NOT_FOUND };
  if (!couple.enabled) return { ok: false, message: "Turn on the couple's private page in the Invitation text tab first." };
  const { slug } = couple;
  const { token, passcode } = await createAccess(coupleId);
  const { share } = await siteLinks(slug);
  revalidatePath("/admin", "layout");
  return { ok: true, link: couplePortalUrl(share, token), passcode };
}

export async function revokeCoupleAccess(coupleId: string): Promise<ActionState> {
  if (!(await getAdminUser())) return failure(SESSION_ENDED);
  if (!isUuid(coupleId)) return failure(NOT_FOUND);
  await revokeAccess(coupleId);
  revalidatePath("/admin", "layout");
  return success("The private page is off. The old link no longer works.");
}

export async function unlockCoupleAccess(coupleId: string): Promise<ActionState> {
  if (!(await getAdminUser())) return failure(SESSION_ENDED);
  if (!isUuid(coupleId)) return failure(NOT_FOUND);
  await unlockAccess(coupleId);
  revalidatePath("/admin", "layout");
  return success("Unlocked. The couple can try their passcode again.");
}
