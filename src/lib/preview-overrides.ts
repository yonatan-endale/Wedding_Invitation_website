import { isCalendarStyle, isMotionLevel, type CalendarStyle, type MotionLevel } from "./appearance";
import { isLayoutName, type LayoutName } from "./layout";
import { isOpeningName, type OpeningName } from "./opening";
import { isThemeName, type ThemeName } from "./theme";

/**
 * Looks an admin can try on a couple's site without saving them, e.g.
 * /s/hanna-dawit?layout=editorial&opening=netela&motion=rich&calendar=gregorian.
 * The page applies them only for a signed-in admin on the main domain.
 */
export type PreviewOverrides = Partial<{
  layout: LayoutName;
  opening: OpeningName;
  motion: MotionLevel;
  calendarStyle: CalendarStyle;
  theme: ThemeName;
}>;

type SearchParams = Record<string, string | string[] | undefined>;

const PARAMS: { param: string; field: keyof PreviewOverrides; isValid: (value: unknown) => boolean }[] = [
  { param: "layout", field: "layout", isValid: isLayoutName },
  { param: "opening", field: "opening", isValid: isOpeningName },
  { param: "motion", field: "motion", isValid: isMotionLevel },
  { param: "calendar", field: "calendarStyle", isValid: isCalendarStyle },
  { param: "theme", field: "theme", isValid: isThemeName },
];

/** Reads the known query parameters; unknown or invalid values are ignored. */
export function parsePreviewOverrides(params: SearchParams): PreviewOverrides {
  const overrides: Record<string, string> = {};
  for (const { param, field, isValid } of PARAMS) {
    const raw = params[param];
    const value = Array.isArray(raw) ? raw[0] : raw;
    if (isValid(value)) overrides[field] = value as string;
  }
  return overrides as PreviewOverrides;
}

export function hasPreviewOverrides(overrides: PreviewOverrides): boolean {
  return Object.keys(overrides).length > 0;
}
