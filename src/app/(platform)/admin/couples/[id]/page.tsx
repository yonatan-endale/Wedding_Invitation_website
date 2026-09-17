import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CoupleDetailsForm } from "@/components/admin/couple-details-form";
import { CoupleHeader } from "@/components/admin/couple-header";
import { CoupleTabs } from "@/components/admin/couple-tabs";
import { CoupleTextsForm } from "@/components/admin/couple-texts-form";
import { GiftsManager } from "@/components/admin/gifts-manager";
import { PhotosManager } from "@/components/admin/photos-manager";
import { RsvpList } from "@/components/admin/rsvp-list";
import { ScheduleManager } from "@/components/admin/schedule-manager";
import { getCoupleForAdmin, listRsvps } from "@/db/queries/admin";
import { siteLinks } from "@/lib/site-links";
import { formatStandardTime, formatWeddingDate } from "@/lib/wedding-format";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const couple = await getCoupleForAdmin((await params).id);
  return { title: couple ? `${couple.partnerOne.en} & ${couple.partnerTwo.en}` : "Couple" };
}

export default async function CouplePage({ params, searchParams }: Props) {
  const [{ id }, { tab }] = await Promise.all([params, searchParams]);
  const [couple, rsvpRows] = await Promise.all([getCoupleForAdmin(id), listRsvps(id)]);
  if (!couple) notFound();

  const links = await siteLinks(couple.slug);
  const uploadsEnabled = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  const iso = couple.weddingAt.toISOString();

  return (
    <div className="grid gap-8">
      <CoupleHeader
        id={couple.id}
        names={`${couple.partnerOne.en} & ${couple.partnerTwo.en}`}
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
            content: <RsvpList coupleId={couple.id} rows={rsvpRows} timezone={couple.timezone} />,
          },
        ]}
      />
    </div>
  );
}
