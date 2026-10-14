import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoupleAccessPanel, type AccessSummary } from "@/components/admin/couple-access-panel";
import { CoupleDetailsForm } from "@/components/admin/couple-details-form";
import { CoupleHeader } from "@/components/admin/couple-header";
import { CoupleTabs } from "@/components/admin/couple-tabs";
import { CoupleTextsForm } from "@/components/admin/couple-texts-form";
import { GiftsManager } from "@/components/admin/gifts-manager";
import { HonoreesManager } from "@/components/admin/honorees-manager";
import { PhotosManager } from "@/components/admin/photos-manager";
import { RsvpList } from "@/components/admin/rsvp-list";
import { ScheduleManager } from "@/components/admin/schedule-manager";
import { StoryManager } from "@/components/admin/story-manager";
import { getCoupleForAdmin, listRsvps } from "@/db/queries/admin";
import { getAccessStatus } from "@/lib/couple-access";
import { usesHonorees } from "@/lib/event-types";
import { siteLinks } from "@/lib/site-links";
import { siteTitleNames } from "@/lib/site-names";
import { formatGregorianDate, formatStandardTime, formatWeddingDate } from "@/lib/wedding-format";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const couple = await getCoupleForAdmin((await params).id);
  return { title: couple ? siteTitleNames({ couple, honorees: couple.honorees }, "en") || couple.slug : "Site" };
}

export default async function CouplePage({ params, searchParams }: Props) {
  const [{ id }, { tab }] = await Promise.all([params, searchParams]);
  const [couple, rsvpRows] = await Promise.all([getCoupleForAdmin(id), listRsvps(id)]);
  if (!couple) notFound();
  const access = await getAccessStatus(couple.id);

  const links = await siteLinks(couple.slug);
  const uploadsEnabled = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  const iso = couple.weddingAt.toISOString();
  const names = siteTitleNames({ couple, honorees: couple.honorees }, "en") || couple.slug;
  const honorees = usesHonorees(couple.eventType);
  const when = (date: Date) =>
    `${formatGregorianDate(date.toISOString(), couple.timezone)}, ${formatStandardTime(date.toISOString(), couple.timezone)}`;
  const accessSummary: AccessSummary = access
    ? {
        since: when(access.updatedAt),
        lastOpened: access.lastUsedAt ? when(access.lastUsedAt) : null,
        lockedUntil: access.lockedUntil && access.lockedUntil.getTime() > Date.now() ? when(access.lockedUntil) : null,
      }
    : null;

  return (
    <div className="grid gap-8">
      <CoupleHeader
        id={couple.id}
        names={names}
        dateLine={`${formatWeddingDate(iso, couple.timezone, "en")} at ${formatStandardTime(iso, couple.timezone)}`}
        status={couple.status}
        shareUrl={links.share}
        previewUrl={links.preview}
      />

      <CoupleTabs
        initial={tab ?? "details"}
        tabs={[
          {
            value: "details",
            label: "Details",
            content: (
              <div className="rounded-xl border bg-background p-4 sm:p-6">
                <CoupleDetailsForm
                  couple={couple}
                  eventType={couple.eventType}
                  timeZones={Intl.supportedValuesOf("timeZone")}
                  uploadsEnabled={uploadsEnabled}
                  siteBase={links.pattern}
                />
              </div>
            ),
          },
          {
            value: "texts",
            label: "Invitation text",
            content: (
              <div className="rounded-xl border bg-background p-4 sm:p-6">
                <CoupleTextsForm couple={couple} />
              </div>
            ),
          },
          // Honoree sites tell their story on each person's card and in the story text; the dated chapters are a couple's.
          honorees
            ? {
                value: "people",
                label: "People",
                count: couple.honorees.length,
                content: <HonoreesManager couple={couple} uploadsEnabled={uploadsEnabled} />,
              }
            : {
                value: "story",
                label: "Our story",
                count: couple.storyMilestones.length,
                content: <StoryManager couple={couple} uploadsEnabled={uploadsEnabled} />,
              },
          {
            value: "photos",
            label: "Photos",
            count: couple.photos.length,
            content: <PhotosManager couple={couple} uploadsEnabled={uploadsEnabled} />,
          },
          {
            value: "schedule",
            label: "Venues and schedule",
            count: couple.events.length,
            content: <ScheduleManager couple={couple} uploadsEnabled={uploadsEnabled} />,
          },
          {
            value: "gifts",
            label: "Gifts",
            count: couple.giftAccounts.length + couple.wishlistItems.length,
            content: <GiftsManager couple={couple} uploadsEnabled={uploadsEnabled} />,
          },
          {
            value: "rsvps",
            label: "RSVPs",
            count: rsvpRows.length,
            content: (
              <div className="grid gap-6">
                <CoupleAccessPanel
                  coupleId={couple.id}
                  coupleNames={names}
                  status={accessSummary}
                  enabled={couple.couplePageEnabled}
                />
                <RsvpList
                  coupleId={couple.id}
                  rows={rsvpRows}
                  timezone={couple.timezone}
                  siteBase={links.share}
                  coupleNames={names}
                  cardsEnabled={couple.guestCardsEnabled}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
