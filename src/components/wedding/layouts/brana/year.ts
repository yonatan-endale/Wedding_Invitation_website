import { zonedParts } from "@/lib/datetime";
import { gregorianToEthiopian } from "@/lib/ethiopian-calendar";

/** The year of the wedding in the Ethiopian calendar (E.C.), on the day as the couple's time zone has it. */
export function ethiopianYear(weddingAt: string, timeZone: string): number {
  const { year, month, day } = zonedParts(new Date(weddingAt), timeZone);
  return gregorianToEthiopian(year, month, day).year;
}
