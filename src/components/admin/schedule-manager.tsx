"use client";

import { Clock, MapPin, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { saveEvent, saveVenue } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { AdminCouple } from "@/db/queries/admin";
import { toDateTimeLocalValue } from "@/lib/datetime";
import { mapsLink } from "@/lib/maps";
import { formatStandardTime, formatStandardTimeRange } from "@/lib/wedding-format";
import { Field, LocalizedField, NativeSelect, SubmitButton } from "./fields";
import { DeleteButton, MoveButtons } from "./item-actions";
import { MediaField } from "./media-field";
import { useAdminForm } from "./use-action-feedback";

type Venue = AdminCouple["venues"][number];
type WeddingEvent = AdminCouple["events"][number];

function VenueDialog({
  couple,
  venue,
  uploadsEnabled,
  trigger,
}: {
  couple: AdminCouple;
  venue?: Venue;
  uploadsEnabled: boolean;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const { pending, onSubmit, errors } = useAdminForm(saveVenue.bind(null, couple.id, venue?.id ?? null), {
    onSuccess: () => setOpen(false),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{venue ? "Edit venue" : "Add venue"}</DialogTitle>
          <DialogDescription>Guests get a button that opens this place in Google Maps.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-5" noValidate>
          <LocalizedField name="name" label="Venue name" defaultValue={venue?.name} errors={errors} required />
          <LocalizedField name="address" label="Area or address" defaultValue={venue?.address} />
          <Field
            label="Google Maps link (optional)"
            htmlFor="mapsUrl"
            error={errors.mapsUrl}
            hint="In Google Maps, tap Share on the place and paste the link here."
          >
            <Input id="mapsUrl" name="mapsUrl" type="url" defaultValue={venue?.mapsUrl ?? ""} placeholder="https://maps.app.goo.gl/…" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Latitude (optional)" htmlFor="lat" error={errors.lat} hint="Used for the embedded map.">
              <Input id="lat" name="lat" inputMode="decimal" defaultValue={venue?.lat ?? ""} placeholder="9.0303" />
            </Field>
            <Field label="Longitude (optional)" htmlFor="lng" error={errors.lng}>
              <Input id="lng" name="lng" inputMode="decimal" defaultValue={venue?.lng ?? ""} placeholder="38.7663" />
            </Field>
          </div>
          <MediaField
            name="imageUrl"
            label="Photo of the venue (optional)"
            kind="image"
            defaultValue={venue?.imageUrl}
            uploadsEnabled={uploadsEnabled}
            error={errors.imageUrl}
          />
          <DialogFooter>
            <SubmitButton pending={pending}>{venue ? "Save venue" : "Add venue"}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EventDialog({ couple, event, trigger }: { couple: AdminCouple; event?: WeddingEvent; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { pending, onSubmit, errors } = useAdminForm(saveEvent.bind(null, couple.id, event?.id ?? null), {
    onSuccess: () => setOpen(false),
  });
  const defaultStart = toDateTimeLocalValue(event?.startsAt ?? couple.weddingAt, couple.timezone);
  const defaultEnd = event?.endsAt ? toDateTimeLocalValue(event.endsAt, couple.timezone) : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{event ? "Edit event" : "Add event"}</DialogTitle>
          <DialogDescription>Events appear in time order on the day&apos;s timeline.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-5" noValidate>
          <LocalizedField name="title" label="Title" defaultValue={event?.title} errors={errors} required />
          <LocalizedField name="description" label="Details (optional)" defaultValue={event?.description} multiline rows={2} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Starts at"
              htmlFor="startsAt"
              error={errors.startsAt}
              hint={`${couple.timezone.replace(/_/g, " ")} time`}
            >
              <Input id="startsAt" name="startsAt" type="datetime-local" defaultValue={defaultStart} />
            </Field>
            <Field label="Ends at (optional)" htmlFor="endsAt" error={errors.endsAt} hint="Leave empty for open-ended.">
              <Input id="endsAt" name="endsAt" type="datetime-local" defaultValue={defaultEnd} />
            </Field>
            <Field label="Venue (optional)" htmlFor="venueId" error={errors.venueId}>
              <NativeSelect id="venueId" name="venueId" defaultValue={event?.venueId ?? ""}>
                <option value="">No venue</option>
                {couple.venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name.en}
                  </option>
                ))}
              </NativeSelect>
            </Field>
          </div>
          <DialogFooter>
            <SubmitButton pending={pending}>{event ? "Save event" : "Add event"}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ScheduleManager({ couple, uploadsEnabled }: { couple: AdminCouple; uploadsEnabled: boolean }) {
  const venueName = new Map(couple.venues.map((v) => [v.id, v.name.en]));

  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <section className="grid content-start gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-medium">Venues</h2>
            <p className="text-sm text-muted-foreground">The first venue shows on the invitation card.</p>
          </div>
          <VenueDialog
            couple={couple}
            uploadsEnabled={uploadsEnabled}
            trigger={
              <Button type="button" variant="outline">
                <Plus aria-hidden /> Add venue
              </Button>
            }
          />
        </div>
        {couple.venues.length === 0 ? (
          <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            Add the church, hall or garden so guests can find their way.
          </p>
        ) : (
          <ul className="grid gap-3">
            {couple.venues.map((venue, index) => {
              const href = mapsLink({ mapsUrl: venue.mapsUrl, lat: venue.lat, lng: venue.lng, address: venue.address?.en });
              return (
                <li key={venue.id} className="flex items-start gap-3 rounded-lg border bg-background p-3">
                  <MapPin className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{venue.name.en}</p>
                    {venue.address?.en ? <p className="text-sm text-muted-foreground">{venue.address.en}</p> : null}
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4">
                        Check on the map
                      </a>
                    ) : (
                      <p className="text-sm text-destructive">No map location yet</p>
                    )}
                  </div>
                  <div className="flex shrink-0">
                    <MoveButtons list="venues" id={venue.id} first={index === 0} last={index === couple.venues.length - 1} />
                    <VenueDialog
                      couple={couple}
                      venue={venue}
                      uploadsEnabled={uploadsEnabled}
                      trigger={
                        <Button type="button" variant="ghost" size="icon" aria-label={`Edit ${venue.name.en}`}>
                          <Pencil aria-hidden />
                        </Button>
                      }
                    />
                    <DeleteButton
                      list="venues"
                      id={venue.id}
                      itemLabel={venue.name.en}
                      description="Events at this venue will stay on the timeline without a location."
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="grid content-start gap-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-medium">Timeline</h2>
            <p className="text-sm text-muted-foreground">What happens when on the day.</p>
          </div>
          <EventDialog
            couple={couple}
            trigger={
              <Button type="button" variant="outline">
                <Plus aria-hidden /> Add event
              </Button>
            }
          />
        </div>
        {couple.events.length === 0 ? (
          <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
            Add the ceremony, lunch and reception times.
          </p>
        ) : (
          <ul className="grid gap-3">
            {couple.events.map((event) => (
              <li key={event.id} className="flex items-start gap-3 rounded-lg border bg-background p-3">
                <Clock className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground tabular-nums">
                    {event.endsAt
                      ? formatStandardTimeRange(event.startsAt.toISOString(), event.endsAt.toISOString(), couple.timezone)
                      : formatStandardTime(event.startsAt.toISOString(), couple.timezone)}
                  </p>
                  <p className="font-medium">{event.title.en}</p>
                  {event.venueId ? <p className="text-sm text-muted-foreground">{venueName.get(event.venueId)}</p> : null}
                </div>
                <div className="flex shrink-0">
                  <EventDialog
                    couple={couple}
                    event={event}
                    trigger={
                      <Button type="button" variant="ghost" size="icon" aria-label={`Edit ${event.title.en}`}>
                        <Pencil aria-hidden />
                      </Button>
                    }
                  />
                  <DeleteButton list="events" id={event.id} itemLabel={event.title.en} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
