"use client";

import { useState, type ReactNode } from "react";
import { createCouple, updateCoupleDetails } from "@/actions/admin";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FaithOrnament } from "@/components/wedding/ornaments/faith-ornament";
import { Band } from "@/components/wedding/primitives";
import type { AdminCouple } from "@/db/queries/admin";
import {
  CALENDAR_STYLES,
  CALENDAR_STYLE_OPTIONS,
  MOTION_LEVELS,
  MOTION_LEVEL_OPTIONS,
  ORNAMENTS,
  ORNAMENT_OPTIONS,
  getCalendarStyle,
  getMotionLevel,
  getOrnament,
} from "@/lib/appearance";
import { DEFAULT_TIMEZONE, HERO_POSITIONS, PARTNER_ROLES, type BorderStyle } from "@/lib/constants";
import { toDateTimeLocalValue } from "@/lib/datetime";
import { EVENT_TYPE_META, usesHonorees, type EventType } from "@/lib/event-types";
import { LAYOUTS, LAYOUT_NAMES, getLayout, layoutsFor, type LayoutName } from "@/lib/layout";
import { OPENINGS, getOpening, openingsFor, type OpeningName } from "@/lib/opening";
import { slugify } from "@/lib/slug";
import { THEME_LIST, getTheme, themeStyle } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { Field, FormSection, LocalizedField, NativeSelect, SubmitButton } from "./fields";
import { MediaField } from "./media-field";
import { useAdminForm } from "./use-action-feedback";

const BORDER_OPTIONS: { value: BorderStyle; label: string; description: string }[] = [
  { value: "tibeb", label: "Tibeb 1", description: "The woven border of a habesha kemis, slim and simple." },
  {
    value: "tibeb2",
    label: "Tibeb 2",
    description: "A wide woven band of interlocking diamonds and chevrons, drawn from a real netela.",
  },
  { value: "floral", label: "Floral", description: "A rose vine with leaves." },
  { value: "line", label: "Line", description: "Two thin rules. Quiet and modern." },
  { value: "harag", label: "Harag", description: "The interlaced knotwork of Ethiopian manuscripts and church carvings." },
];

const ROLE_LABELS = { bride: "Bride", groom: "Groom" } as const;

const stroke = "currentColor";

/** A thumbnail wireframe of each layout so the choice reads at a glance. Keyed by name, so a new layout must add one. */
const LAYOUT_SKETCHES: Record<LayoutName, ReactNode> = {
  classic: (
    <>
      <rect x="0.5" y="0.5" width="95" height="30" fill={stroke} opacity="0.35" />
      <rect x="10" y="18" width="40" height="4" fill="white" />
      <rect x="10" y="24" width="28" height="3" fill="white" opacity="0.8" />
      <rect x="24" y="38" width="48" height="16" fill="none" stroke={stroke} />
      <rect x="34" y="44" width="28" height="2" fill={stroke} opacity="0.6" />
      <rect x="38" y="48" width="20" height="2" fill={stroke} opacity="0.6" />
    </>
  ),
  editorial: (
    <>
      <rect x="8" y="10" width="26" height="4" fill={stroke} />
      <rect x="8" y="17" width="20" height="4" fill={stroke} />
      <rect x="8" y="26" width="24" height="1.5" fill={stroke} opacity="0.5" />
      <rect x="42" y="8" width="34" height="24" fill={stroke} opacity="0.35" />
      <rect x="80" y="9" width="8" height="6" fill={stroke} opacity="0.35" />
      <rect x="80" y="17" width="8" height="6" fill={stroke} opacity="0.35" />
      <rect x="80" y="25" width="8" height="6" fill={stroke} opacity="0.35" />
      <ellipse cx="30" cy="47" rx="6" ry="7" fill={stroke} opacity="0.35" />
      <ellipse cx="66" cy="47" rx="6" ry="7" fill={stroke} opacity="0.35" />
    </>
  ),
  reel: (
    <>
      <rect x="0.5" y="0.5" width="95" height="36" fill={stroke} opacity="0.7" />
      <rect x="0.5" y="0.5" width="95" height="5" fill={stroke} />
      <rect x="0.5" y="31.5" width="95" height="5" fill={stroke} />
      <rect x="30" y="16" width="36" height="3" fill="white" />
      <rect x="38" y="22" width="20" height="2" fill="white" opacity="0.7" />
      {[6, 26, 46, 66].map((x) => (
        <rect key={x} x={x} y="42" width="16" height="12" fill={stroke} opacity="0.35" />
      ))}
    </>
  ),
  noir: (
    <>
      <rect x="0.5" y="0.5" width="95" height="59" rx="2" fill={stroke} opacity="0.75" />
      <circle cx="48" cy="20" r="11" fill="none" stroke="white" opacity="0.8" />
      <circle cx="48" cy="20" r="8" fill="none" stroke="white" opacity="0.5" />
      <rect x="30" y="37" width="36" height="3" fill="white" opacity="0.9" />
      <rect x="22" y="46" width="14" height="9" fill="none" stroke="white" opacity="0.6" />
      <rect x="41" y="46" width="14" height="9" fill="none" stroke="white" opacity="0.6" />
      <rect x="60" y="46" width="14" height="9" fill="none" stroke="white" opacity="0.6" />
    </>
  ),
  stories: (
    <>
      {[4, 30, 56].map((x) => (
        <rect key={x} x={x + 6} y="3" width="20" height="2" rx="1" fill={stroke} opacity={x === 4 ? 0.9 : 0.35} />
      ))}
      <rect x="36" y="8" width="26" height="48" rx="3" fill={stroke} opacity="0.35" />
      <rect x="41" y="40" width="16" height="3" fill="white" />
      <rect x="44" y="46" width="10" height="2" fill="white" opacity="0.8" />
      <rect x="12" y="14" width="18" height="36" rx="3" fill="none" stroke={stroke} opacity="0.4" />
      <rect x="68" y="14" width="18" height="36" rx="3" fill="none" stroke={stroke} opacity="0.4" />
    </>
  ),
  flatlay: (
    <>
      <path d="M14 30l20-14h28l20 14v22H14z" fill={stroke} opacity="0.2" />
      <path d="M14 30l34 14 34-14" fill="none" stroke={stroke} opacity="0.6" />
      <circle cx="48" cy="40" r="4" fill={stroke} opacity="0.8" />
      <rect x="24" y="6" width="40" height="18" fill="none" stroke={stroke} opacity="0.6" transform="rotate(-4 44 15)" />
      <rect x="30" y="10" width="40" height="18" fill="white" stroke={stroke} opacity="0.7" transform="rotate(3 50 19)" />
    </>
  ),
  kaba: (
    <>
      <rect x="0.5" y="0.5" width="95" height="59" rx="2" fill={stroke} opacity="0.8" />
      <path d="M8 8h80M8 52h80" stroke="white" strokeDasharray="2 2" opacity="0.7" />
      <path d="M48 14l6 8-6 8-6-8z" fill="none" stroke="white" opacity="0.85" />
      <rect x="32" y="36" width="32" height="3" fill="white" opacity="0.9" />
      <rect x="38" y="42" width="20" height="2" fill="white" opacity="0.6" />
    </>
  ),
  brana: (
    <>
      <rect x="0.5" y="0.5" width="95" height="59" rx="2" fill={stroke} opacity="0.12" />
      <rect x="12" y="6" width="72" height="6" fill="none" stroke={stroke} opacity="0.7" />
      <path d="M14 9h68" stroke={stroke} strokeDasharray="3 2" opacity="0.6" />
      <rect x="34" y="17" width="28" height="3" fill={stroke} opacity="0.85" />
      {[24, 31, 38, 45, 52].map((y) => (
        <g key={y}>
          <rect x="14" y={y} width="30" height="2" fill={stroke} opacity="0.4" />
          <rect x="52" y={y} width="30" height="2" fill={stroke} opacity="0.4" />
        </g>
      ))}
      <path d="M48 23v31" stroke={stroke} opacity="0.4" />
    </>
  ),
  slate: (
    <>
      <rect x="0.5" y="0.5" width="95" height="32" fill={stroke} opacity="0.45" />
      <rect x="34" y="18" width="28" height="3" fill="white" />
      <rect x="30" y="24" width="17" height="4" rx="2" fill="white" opacity="0.9" />
      <rect x="49" y="24" width="17" height="4" rx="2" fill="none" stroke="white" opacity="0.9" />
      {[10, 30, 50, 70].map((x) => (
        <rect key={x} x={x} y="38" width="16" height="8" rx="1.5" fill="none" stroke={stroke} opacity="0.6" />
      ))}
      <rect x="0.5" y="51" width="95" height="8.5" fill={stroke} opacity="0.7" />
    </>
  ),
  commencement: (
    <>
      <text x="52" y="54" fontSize="34" fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.6" fontFamily="serif">
        26
      </text>
      <rect x="8" y="10" width="34" height="5" fill={stroke} />
      <rect x="8" y="17" width="22" height="2" fill={stroke} opacity="0.5" />
      <rect x="8" y="24" width="30" height="5" fill={stroke} />
      <rect x="8" y="31" width="20" height="2" fill={stroke} opacity="0.5" />
      <rect x="8" y="44" width="40" height="1" fill={stroke} opacity="0.5" />
    </>
  ),
  tassel: (
    <>
      <rect x="0.5" y="0.5" width="95" height="44" fill={stroke} opacity="0.7" />
      <path d="M48 0.5v9" stroke="white" opacity="0.8" />
      <circle cx="48" cy="20" r="9" fill="none" stroke="white" opacity="0.85" />
      <path d="M50 11c4 2 6 5 7 9" stroke="white" opacity="0.8" fill="none" />
      <rect x="55" y="20" width="4" height="6" fill="white" opacity="0.8" />
      <rect x="32" y="34" width="32" height="3" fill="white" opacity="0.9" />
      <path d="M28 52v-6a6 6 0 0 1 12 0v6zM56 52v-6a6 6 0 0 1 12 0v6z" fill={stroke} opacity="0.35" />
    </>
  ),
  arches: (
    <>
      <path d="M34 34V16a14 14 0 0 1 28 0v18z" fill={stroke} opacity="0.35" />
      <path d="M31 35V16a17 17 0 0 1 34 0v19" fill="none" stroke={stroke} opacity="0.7" />
      {[14, 34, 54, 74].map((x) => (
        <path key={x} d={`M${x} 56v-8a4 4 0 0 1 8 0v8z`} fill={stroke} opacity="0.35" />
      ))}
    </>
  ),
};

/** A thumbnail of each opening screen, keyed by name like the layout sketches. */
const OPENING_SKETCHES: Record<OpeningName, ReactNode> = {
  netela: (
    <>
      <rect x="0.5" y="0.5" width="47" height="59" fill={stroke} opacity="0.12" />
      <rect x="48" y="0.5" width="47.5" height="59" fill={stroke} opacity="0.12" />
      <rect x="40" y="0.5" width="4" height="59" fill={stroke} opacity="0.45" />
      <rect x="52" y="0.5" width="4" height="59" fill={stroke} opacity="0.45" />
      <rect x="30" y="20" width="36" height="20" fill="white" stroke={stroke} strokeWidth="0.6" />
    </>
  ),
  seal: (
    <>
      <rect x="47.6" y="4" width="0.8" height="52" fill={stroke} opacity="0.6" />
      <circle cx="48" cy="28" r="10" fill="white" stroke={stroke} strokeWidth="1" />
      <circle cx="48" cy="28" r="7" fill="none" stroke={stroke} strokeWidth="0.5" opacity="0.6" />
      <rect x="38" y="43" width="20" height="3" fill={stroke} opacity="0.5" />
    </>
  ),
  envelope: (
    <>
      <rect x="22" y="16" width="52" height="32" rx="1" fill="none" stroke={stroke} />
      <path d="M22 16 48 36 74 16" fill="none" stroke={stroke} />
      <circle cx="48" cy="35" r="4" fill={stroke} opacity="0.6" />
    </>
  ),
  adey: (
    <g transform="translate(48 28)" fill={stroke} opacity="0.5">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <ellipse key={angle} cx="0" cy="-8" rx="2.6" ry="7" transform={`rotate(${angle})`} />
      ))}
      <circle r="3.5" opacity="1" />
    </g>
  ),
};

function OpeningSketch({ name }: { name: OpeningName }) {
  return (
    <svg viewBox="0 0 96 60" aria-hidden className="h-15 w-24 text-muted-foreground">
      <rect x="0.5" y="0.5" width="95" height="59" rx="2" fill="none" stroke={stroke} opacity="0.5" />
      {OPENING_SKETCHES[name]}
    </svg>
  );
}

function LayoutSketch({ name }: { name: LayoutName }) {
  return (
    <svg viewBox="0 0 96 60" aria-hidden className="h-15 w-24 text-muted-foreground">
      <rect x="0.5" y="0.5" width="95" height="59" rx="2" fill="none" stroke={stroke} opacity="0.5" />
      {LAYOUT_SKETCHES[name]}
    </svg>
  );
}

type Props = {
  couple?: AdminCouple;
  /** What the site celebrates: the saved one when editing, the one picked on the create page otherwise. */
  eventType: EventType;
  timeZones: string[];
  uploadsEnabled: boolean;
  siteBase: string;
};

export function CoupleDetailsForm({ couple, eventType, timeZones, uploadsEnabled, siteBase }: Props) {
  const editing = Boolean(couple);
  const wedding = eventType === "wedding";
  const honorees = usesHonorees(eventType);
  const typeLabel = EVENT_TYPE_META[eventType].label.toLowerCase();
  const action = couple ? updateCoupleDetails.bind(null, couple.id) : createCouple;
  const { pending, onSubmit, errors } = useAdminForm(action);

  const [slug, setSlug] = useState(couple?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(editing);
  const [names, setNames] = useState({ one: couple?.partnerOne.en ?? "", two: couple?.partnerTwo.en ?? "" });

  function updateName(which: "one" | "two", value: string) {
    const next = { ...names, [which]: value };
    setNames(next);
    if (!slugTouched) setSlug(slugify([next.one, next.two].filter(Boolean).join(" ")));
  }

  const timezone = couple?.timezone ?? DEFAULT_TIMEZONE;
  const slugField = (
    <Field
      label="Site link"
      htmlFor="slug"
      error={errors.slug}
      hint={
        <>
          Guests will open <span className="font-medium text-foreground">{siteBase.replace("{slug}", slug || "your-link")}</span>
        </>
      }
    >
      <Input
        id="slug"
        name="slug"
        value={slug}
        onChange={(event) => {
          setSlugTouched(true);
          setSlug(event.target.value.toLowerCase());
        }}
        aria-invalid={errors.slug ? true : undefined}
        autoComplete="off"
        spellCheck={false}
      />
    </Field>
  );

  return (
    <form onSubmit={onSubmit} className="grid gap-8" noValidate>
      {editing ? null : <input type="hidden" name="eventType" value={eventType} />}
      {honorees ? (
        <FormSection
          title="People"
          description={
            editing
              ? "Add, edit and order the people this site celebrates in the People tab."
              : "Start with the first person. You can add the others, their photos and their details next."
          }
        >
          {editing ? null : (
            <fieldset className="grid gap-3 rounded-lg border p-4">
              <legend className="px-1 text-sm font-medium">First person</legend>
              <Field label="First name in English" htmlFor="honoreeName-en" error={errors["honoreeName.en"]}>
                <Input
                  id="honoreeName-en"
                  name="honoreeName.en"
                  onChange={(event) => {
                    if (!slugTouched) setSlug(slugify(event.target.value));
                  }}
                  aria-invalid={errors["honoreeName.en"] ? true : undefined}
                  autoComplete="off"
                />
              </Field>
              <Field label="First name in Amharic (optional)" htmlFor="honoreeName-am">
                <Input id="honoreeName-am" name="honoreeName.am" lang="am" autoComplete="off" />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Father's name (optional)" htmlFor="honoreeFather-en">
                  <Input id="honoreeFather-en" name="honoreeFather.en" autoComplete="off" />
                </Field>
                <Field label="Father's name in Amharic" htmlFor="honoreeFather-am">
                  <Input id="honoreeFather-am" name="honoreeFather.am" lang="am" autoComplete="off" />
                </Field>
              </div>
            </fieldset>
          )}
          {slugField}
        </FormSection>
      ) : (
        <FormSection
          title="Couple"
          description="The opening screen shows first names, the hero shows nicknames when set, and the invitation card and footer show first and father's names."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {(["one", "two"] as const).map((which) => {
              const key = which === "one" ? "partnerOne" : "partnerTwo";
              const existing = couple?.[key];
              const nick = couple?.[`${key}Nick`];
              const father = couple?.[`${key}Father`];
              const role = couple?.[`${key}Role`] ?? (which === "one" ? "bride" : "groom");
              return (
                <fieldset key={which} className="grid gap-3 rounded-lg border p-4">
                  <legend className="px-1 text-sm font-medium">{which === "one" ? "First partner" : "Second partner"}</legend>
                  <Field label="Role" htmlFor={`${key}Role`} error={errors[`${key}Role`]} className="max-w-48">
                    <NativeSelect id={`${key}Role`} name={`${key}Role`} defaultValue={role}>
                      {PARTNER_ROLES.map((option) => (
                        <option key={option} value={option}>
                          {ROLE_LABELS[option]}
                        </option>
                      ))}
                    </NativeSelect>
                  </Field>
                  <Field label="First name in English" htmlFor={`${key}-en`} error={errors[`${key}.en`]}>
                    <Input
                      id={`${key}-en`}
                      name={`${key}.en`}
                      defaultValue={existing?.en}
                      onChange={(event) => updateName(which, event.target.value)}
                      aria-invalid={errors[`${key}.en`] ? true : undefined}
                      autoComplete="off"
                    />
                  </Field>
                  <Field label="First name in Amharic (optional)" htmlFor={`${key}-am`}>
                    <Input id={`${key}-am`} name={`${key}.am`} lang="am" defaultValue={existing?.am} autoComplete="off" />
                  </Field>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field
                      label="Father's name (optional)"
                      htmlFor={`${key}Father-en`}
                      hint="Makes the full name on the invitation card and footer."
                    >
                      <Input id={`${key}Father-en`} name={`${key}Father.en`} defaultValue={father?.en} autoComplete="off" />
                    </Field>
                    <Field label="Father's name in Amharic" htmlFor={`${key}Father-am`}>
                      <Input
                        id={`${key}Father-am`}
                        name={`${key}Father.am`}
                        lang="am"
                        defaultValue={father?.am}
                        autoComplete="off"
                      />
                    </Field>
                  </div>
                  <div className="grid gap-3 border-t pt-3 sm:grid-cols-2">
                    <Field
                      label="Nickname (optional)"
                      htmlFor={`${key}Nick-en`}
                      hint="Shown in the hero instead of the first name."
                    >
                      <Input id={`${key}Nick-en`} name={`${key}Nick.en`} defaultValue={nick?.en} autoComplete="off" />
                    </Field>
                    <Field label="Nickname in Amharic" htmlFor={`${key}Nick-am`}>
                      <Input id={`${key}Nick-am`} name={`${key}Nick.am`} lang="am" defaultValue={nick?.am} autoComplete="off" />
                    </Field>
                  </div>
                  <div className="border-t pt-3">
                    <MediaField
                      name={`${key}PortraitUrl`}
                      label="Portrait (optional)"
                      kind="image"
                      defaultValue={couple?.[`${key}PortraitUrl`]}
                      uploadsEnabled={uploadsEnabled}
                      error={errors[`${key}PortraitUrl`]}
                      hint="A head-and-shoulders photo. Shown in the Editorial layout."
                    />
                  </div>
                </fieldset>
              );
            })}
          </div>
          {slugField}
        </FormSection>
      )}

      <FormSection title="Date and place" description={`Times are entered in the ${typeLabel}'s local time.`}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label={wedding ? "Wedding date and time" : "Date and time"}
            htmlFor="weddingAt"
            error={errors.weddingAt}
            hint={wedding ? "Usually the ceremony start." : "When guests should arrive, or the main event starts."}
          >
            <Input
              id="weddingAt"
              name="weddingAt"
              type="datetime-local"
              defaultValue={couple ? toDateTimeLocalValue(couple.weddingAt, couple.timezone) : ""}
              aria-invalid={errors.weddingAt ? true : undefined}
            />
          </Field>
          <Field label="Time zone" htmlFor="timezone" error={errors.timezone}>
            <NativeSelect id="timezone" name="timezone" defaultValue={timezone}>
              {timeZones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone.replace(/_/g, " ")}
                </option>
              ))}
            </NativeSelect>
          </Field>
        </div>
        <LocalizedField name="city" label="City" defaultValue={couple?.city} placeholder={{ en: "Addis Ababa", am: "አዲስ አበባ" }} />
      </FormSection>

      <FormSection
        title="Look and sound"
        description="Pick a layout, a palette, the cover photo, the calendar and the song that plays when guests open the invitation."
      >
        <fieldset className="grid gap-3">
          <legend className="mb-2 text-sm font-medium">Layout</legend>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {layoutsFor(eventType).map((layout) => {
              const name = layout.name as LayoutName;
              const themeLabels = layout.recommendedThemes.map((theme) => getTheme(theme).label);
              return (
                <label
                  key={name}
                  className="flex cursor-pointer gap-3 rounded-lg border p-3 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/20"
                >
                  <input
                    type="radio"
                    name="layout"
                    value={name}
                    defaultChecked={getLayout(couple?.layout, eventType) === name}
                    className="mt-1"
                  />
                  <span className="grid gap-2">
                    <span className="flex items-center gap-3">
                      <LayoutSketch name={name} />
                      <span className="font-medium">{layout.label}</span>
                    </span>
                    <span className="text-sm text-muted-foreground">{layout.description}</span>
                    {themeLabels.length ? (
                      <span className="text-xs text-muted-foreground">Looks best with: {themeLabels.join(", ")}</span>
                    ) : null}
                    {layout.scheme === "dark" ? (
                      <span className="text-xs text-muted-foreground">Light themes are shown in their dark version.</span>
                    ) : null}
                  </span>
                </label>
              );
            })}
          </div>
          {errors.layout ? <p className="text-sm text-destructive">{errors.layout}</p> : null}
        </fieldset>

        <fieldset className="grid gap-3">
          <legend className="mb-2 text-sm font-medium">Opening screen</legend>
          <p className="-mt-1 text-sm text-muted-foreground">
            What guests tap to open the invitation. It also starts the music. Works with any layout.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {openingsFor(eventType)
              .map((name) => OPENINGS[name])
              .map((opening) => {
                const suggestedFor = LAYOUT_NAMES.filter((layout) => LAYOUTS[layout].defaultOpening === opening.name).map(
                  (layout) => LAYOUTS[layout].label,
                );
                return (
                  <label
                    key={opening.name}
                    className="flex cursor-pointer gap-3 rounded-lg border p-3 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/20"
                  >
                    <input
                      type="radio"
                      name="opening"
                      value={opening.name}
                      defaultChecked={getOpening(couple?.opening, eventType) === opening.name}
                      className="mt-1"
                    />
                    <span className="grid gap-2">
                      <span className="flex items-center gap-3">
                        <OpeningSketch name={opening.name} />
                        <span className="grid gap-0.5">
                          <span className="font-medium">{opening.label}</span>
                          {suggestedFor.length ? (
                            <span className="text-xs text-muted-foreground">Suggested for {suggestedFor.join(" and ")}</span>
                          ) : null}
                        </span>
                      </span>
                      <span className="text-sm text-muted-foreground">{opening.description}</span>
                    </span>
                  </label>
                );
              })}
          </div>
          {couple ? (
            // The path on this (main) domain also works for drafts, which a couple subdomain hides.
            <a
              href={`/s/${couple.slug}?replay=1`}
              target="_blank"
              rel="noreferrer"
              className="justify-self-start text-sm underline underline-offset-4"
            >
              Watch the saved opening on the site
            </a>
          ) : null}
          {errors.opening ? <p className="text-sm text-destructive">{errors.opening}</p> : null}
        </fieldset>

        <fieldset className="grid gap-3">
          <legend className="mb-2 text-sm font-medium">Theme</legend>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {THEME_LIST.map((theme) => (
              <label
                key={theme.name}
                className="flex cursor-pointer gap-3 rounded-lg border p-3 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/20"
              >
                <input
                  type="radio"
                  name="theme"
                  value={theme.name}
                  defaultChecked={(couple?.theme ?? "tibeb") === theme.name}
                  className="mt-1"
                />
                <span className="grid gap-2">
                  <span className="flex items-center gap-2">
                    <span className="flex overflow-hidden rounded border" aria-hidden>
                      {[theme.colors.paper, theme.colors.thread1, theme.colors.thread2, theme.colors.thread3].map(
                        (color, index) => (
                          <span key={index} className="block size-5" style={{ backgroundColor: color }} />
                        ),
                      )}
                    </span>
                    <span className="font-medium">{theme.label}</span>
                  </span>
                  <span className="text-sm text-muted-foreground">{theme.description}</span>
                </span>
              </label>
            ))}
          </div>
          {errors.theme ? <p className="text-sm text-destructive">{errors.theme}</p> : null}
        </fieldset>

        <fieldset className="grid gap-3">
          <legend className="mb-2 text-sm font-medium">Border</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {BORDER_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="grid cursor-pointer gap-2 rounded-lg border p-3 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/20"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="border"
                    value={option.value}
                    defaultChecked={(couple?.border ?? "tibeb") === option.value}
                  />
                  <span className="font-medium">{option.label}</span>
                </span>
                <span className="rounded bg-[var(--w-paper)] px-2 py-1" style={themeStyle(couple?.theme)}>
                  {/* Harag keeps its full 28px so the checked rails at both edges show. */}
                  <Band
                    variant={option.value}
                    className={option.value === "tibeb2" ? "h-10" : option.value === "harag" ? "h-7" : "h-6"}
                  />
                </span>
                <span className="text-sm text-muted-foreground">{option.description}</span>
              </label>
            ))}
          </div>
          {errors.border ? <p className="text-sm text-destructive">{errors.border}</p> : null}
        </fieldset>

        <fieldset className="grid gap-3">
          <legend className="mb-2 text-sm font-medium">Faith ornament</legend>
          <p className="-mt-1 text-sm text-muted-foreground">
            A small gold symbol above the names on the invitation. Leave it on None unless {EVENT_TYPE_META[eventType].hosts} asks for one.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {ORNAMENTS.map((ornament) => (
              <label
                key={ornament}
                className="flex cursor-pointer gap-3 rounded-lg border p-3 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/20"
              >
                <input
                  type="radio"
                  name="ornament"
                  value={ornament}
                  defaultChecked={getOrnament(couple?.ornament) === ornament}
                  className="mt-1"
                />
                <span
                  aria-hidden
                  className="grid size-12 shrink-0 place-items-center rounded bg-[var(--w-paper)]"
                  style={themeStyle(couple?.theme)}
                >
                  {ornament === "none" ? (
                    <span className="size-8 rounded-sm border border-dashed border-[var(--w-rule)]" />
                  ) : (
                    <FaithOrnament ornament={ornament} reveal={false} className="size-8" />
                  )}
                </span>
                <span className="grid content-start gap-1">
                  <span className="font-medium">{ORNAMENT_OPTIONS[ornament].label}</span>
                  <span className="text-sm text-muted-foreground">{ORNAMENT_OPTIONS[ornament].description}</span>
                </span>
              </label>
            ))}
          </div>
          {errors.ornament ? <p className="text-sm text-destructive">{errors.ornament}</p> : null}
        </fieldset>

        <label className="flex items-center justify-between gap-4 rounded-lg border p-4">
          <span>
            <span className="block text-sm font-medium">Falling rose petals on the hero</span>
            <span className="block text-sm text-muted-foreground">
              A slow, gentle fall over the cover photo. Off for guests who prefer reduced motion.
            </span>
          </span>
          <Switch name="petals" defaultChecked={couple?.petals ?? true} value="on" />
        </label>

        <MediaField
          name="heroPhotoUrl"
          label="Cover photo"
          kind="image"
          defaultValue={couple?.heroPhotoUrl}
          uploadsEnabled={uploadsEnabled}
          error={errors.heroPhotoUrl}
          hint={`A landscape photo of ${wedding ? "the couple" : "the people you celebrate"} works best. You can also pick one from the Photos tab.`}
        />
        <Field
          label="Keep this part of the cover photo visible"
          htmlFor="heroPosition"
          hint="Phones crop the sides of wide photos. Choose where the faces are."
          className="max-w-xs"
        >
          <NativeSelect id="heroPosition" name="heroPosition" defaultValue={couple?.heroPosition ?? HERO_POSITIONS[1].value}>
            {HERO_POSITIONS.map((position) => (
              <option key={position.value} value={position.value}>
                {position.label}
              </option>
            ))}
          </NativeSelect>
        </Field>

        <MediaField
          name="calendarPhotoUrl"
          label="Save-the-date photo (optional)"
          kind="image"
          defaultValue={couple?.calendarPhotoUrl}
          uploadsEnabled={uploadsEnabled}
          error={errors.calendarPhotoUrl}
          hint="The full-screen calendar's background. Leave it empty to use the cover or a gallery photo."
        />

        <fieldset className="grid gap-3">
          <legend className="mb-2 text-sm font-medium">Save-the-date calendar</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {CALENDAR_STYLES.map((style) => (
              <label
                key={style}
                className="grid cursor-pointer gap-1 rounded-lg border p-3 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/20"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="calendarStyle"
                    value={style}
                    defaultChecked={getCalendarStyle(couple?.calendarStyle) === style}
                  />
                  <span className="font-medium">{CALENDAR_STYLE_OPTIONS[style].label}</span>
                </span>
                <span className="text-sm text-muted-foreground">{CALENDAR_STYLE_OPTIONS[style].description}</span>
              </label>
            ))}
          </div>
          {errors.calendarStyle ? <p className="text-sm text-destructive">{errors.calendarStyle}</p> : null}
        </fieldset>

        <fieldset className="grid gap-3">
          <legend className="mb-2 text-sm font-medium">Motion</legend>
          <div className="grid gap-3 sm:grid-cols-3">
            {MOTION_LEVELS.map((level) => (
              <label
                key={level}
                className="grid cursor-pointer gap-1 rounded-lg border p-3 has-[:checked]:border-primary has-[:checked]:ring-2 has-[:checked]:ring-primary/20"
              >
                <span className="flex items-center gap-2">
                  <input type="radio" name="motion" value={level} defaultChecked={getMotionLevel(couple?.motion) === level} />
                  <span className="font-medium">{MOTION_LEVEL_OPTIONS[level].label}</span>
                </span>
                <span className="text-sm text-muted-foreground">{MOTION_LEVEL_OPTIONS[level].description}</span>
              </label>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">Guests whose phone asks for reduced motion always see a still page.</p>
          {errors.motion ? <p className="text-sm text-destructive">{errors.motion}</p> : null}
        </fieldset>

        <MediaField
          name="musicUrl"
          label="Background music"
          kind="audio"
          defaultValue={couple?.musicUrl}
          uploadsEnabled={uploadsEnabled}
          error={errors.musicUrl}
          hint="MP3 or M4A, up to 15 MB. Only use music you have the right to share."
        />
        <Field label="Song title" htmlFor="musicTitle" error={errors.musicTitle} className="max-w-md">
          <Input id="musicTitle" name="musicTitle" defaultValue={couple?.musicTitle ?? ""} />
        </Field>
      </FormSection>

      <div className={cn("flex justify-end gap-3", !editing && "sticky bottom-0 -mx-4 border-t bg-background/95 px-4 py-3")}>
        <SubmitButton pending={pending}>{editing ? "Save details" : wedding ? "Create couple" : "Create site"}</SubmitButton>
      </div>
    </form>
  );
}
