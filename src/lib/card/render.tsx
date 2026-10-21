/* eslint-disable @next/next/no-img-element -- next/og draws these <img> tags itself; no browser loads them. */
import "server-only";

import { getTranslations } from "next-intl/server";
import { ImageResponse } from "next/og";
import type { GuestCard } from "@/db/queries/cards";
import { canOptimizeImage } from "@/lib/images";
import { pickText, usesEthiopianCalendar } from "@/lib/localized";
import { celebratedNames, layoutNames } from "@/lib/site-names";
import { loadFullGoogleFont } from "@/lib/og-fonts";
import { getTheme, type Theme } from "@/lib/theme";
import { formatGregorianDate, formatWeddingDate, formatWeddingTime } from "@/lib/wedding-format";
import { bandSvg, svgDataUri } from "./band";
import { qrPath } from "./qr";

/** 5:7, the shape of a printed invitation card, at a size that stays sharp on a phone. */
export const CARD_SIZE = { width: 1080, height: 1512 };

const MARGIN = 40;
const SHEET_WIDTH = CARD_SIZE.width - MARGIN * 2 - 4;
const QR_BOX = 212;

const DISPLAY = "Marcellus";
const BODY = "Source Serif 4";
const ETHIOPIC = "Noto Serif Ethiopic";
const ETHIOPIC_TEXT = /[ሀ-᎟ⶀ-⷟꬀-꬯]/;

/** Keeps a long invitation text to the space the card has. */
function clip(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

const MAX_PHOTO_BYTES = 2_000_000;

/**
 * Where this app's image optimizer is reached for the card's photo: taken from
 * configuration, never from request headers, so a forged Host can't aim the
 * server's fetch somewhere else. On `next dev`, the dev server itself.
 */
function optimizerOrigin(requestOrigin: string): string | null {
  if (process.env.NODE_ENV === "development") return requestOrigin;
  const host = process.env.NEXT_PUBLIC_ROOT_DOMAIN || process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (!host) return null;
  return `${/^localhost(:\d+)?$/.test(host) ? "http" : "https"}://${host}`;
}

/**
 * The hero photo as a data URI, or null. next/og can't read WebP or AVIF, so the
 * photo goes through next/image, which answers a JPEG-only Accept header with a
 * small JPEG. Only site photos and the hosts next.config.ts allows are fetched;
 * anything else, or a slow or broken photo, leaves the card with the monogram.
 */
async function loadPhoto(src: string | null, requestOrigin: string): Promise<string | null> {
  if (!src || !canOptimizeImage(src)) return null;
  const origin = optimizerOrigin(requestOrigin);
  if (!origin) return null;
  try {
    const response = await fetch(`${origin}/_next/image?url=${encodeURIComponent(src)}&w=384&q=75`, {
      headers: { accept: "image/jpeg,image/png" },
      redirect: "error",
      signal: AbortSignal.timeout(5000),
    });
    const type = response.headers.get("content-type")?.split(";")[0];
    if (!response.ok || (type !== "image/jpeg" && type !== "image/png")) return null;
    if (Number(response.headers.get("content-length") ?? 0) > MAX_PHOTO_BYTES) return null;
    const body = await response.arrayBuffer();
    if (body.byteLength > MAX_PHOTO_BYTES) return null;
    return `data:${type};base64,${Buffer.from(body).toString("base64")}`;
  } catch {
    return null;
  }
}

/** `requestOrigin` is used only on `next dev`, to reach the dev server's image optimizer. */
type RenderOptions = { passLink: string; requestOrigin: string; headers?: Record<string, string> };

/** A small gold diamond between two short rules, like the printed card's divider. */
function Ornament({ color }: { color: string }) {
  const line = <div style={{ display: "flex", width: 64, height: 1.5, background: color }} />;
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {line}
      <div style={{ display: "flex", width: 9, height: 9, margin: "0 14px", background: color, transform: "rotate(45deg)" }} />
      {line}
    </div>
  );
}

/** The couple's initials in a double gold ring, for couples without a cover photo. */
function Monogram({ text, theme, fontFamily }: { text: string; theme: Theme; fontFamily: string }) {
  const { colors } = theme;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 132,
        height: 132,
        borderRadius: 999,
        border: `2px solid ${colors.metal}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 116,
          height: 116,
          borderRadius: 999,
          border: `1px solid ${colors.metal}`,
          fontFamily,
          fontSize: 38,
          color: colors.thread1,
        }}
      >
        {text}
      </div>
    </div>
  );
}

/**
 * The guest's invitation card: the site's invitation section as a framed paper
 * card, with the guest's name at the top and a tear-off stub at the foot whose
 * QR code opens their entry pass. It uses the couple's theme and border, in the
 * language the guest replied in.
 */
export async function renderGuestCard({ site, guest }: GuestCard, { passLink, requestOrigin, headers }: RenderOptions) {
  const { couple, venues } = site;
  const locale = guest.locale;
  const t = await getTranslations({ locale, namespace: "card" });
  const tInvitation = await getTranslations({ locale, namespace: "invitation" });
  const theme = getTheme(couple.theme);
  const { colors } = theme;

  // A couple's two names, or every honoree's, stacked with an ampersand before the last.
  const people = celebratedNames(site, locale).full.filter(Boolean);
  const monogram = layoutNames(site, locale).monogram;
  const hosts = pickText(couple.hosts, locale) || tInvitation("hostsFallback");
  const invitation = clip(pickText(couple.invitation, locale) || tInvitation("defaultText"), 200);
  const date = formatWeddingDate(couple.weddingAt, couple.timezone, locale);
  const gregorian = usesEthiopianCalendar(locale) ? formatGregorianDate(couple.weddingAt, couple.timezone) : "";
  const time = formatWeddingTime(couple.weddingAt, couple.timezone, locale);
  const venue = venues[0];
  const venueName = venue ? pickText(venue.name, locale) : "";
  const venueAddress = venue ? pickText(venue.address, locale) : "";
  const dear = t("dear", { name: guest.name });
  const admits = t("admits", { count: guest.guestCount });
  const entrance = t("showAtEntrance");

  const allText = [dear, hosts, ...people, monogram, invitation, date, gregorian, time, venueName, venueAddress, admits, entrance].join(
    " ",
  );
  const [display, body, ethiopic, photo] = await Promise.all([
    loadFullGoogleFont(DISPLAY),
    loadFullGoogleFont(BODY),
    ETHIOPIC_TEXT.test(allText) ? loadFullGoogleFont(ETHIOPIC) : Promise.resolve(null),
    loadPhoto(couple.heroPhotoUrl, requestOrigin),
  ]);
  const fonts = [
    display && { name: DISPLAY, data: display },
    body && { name: BODY, data: body },
    ethiopic && { name: ETHIOPIC, data: ethiopic },
  ]
    .filter((font): font is { name: string; data: ArrayBuffer } => Boolean(font))
    .map((font) => ({ ...font, weight: 400 as const, style: "normal" as const }));
  // Ethiopic last, so Latin keeps its own face and Amharic letters still render.
  const displayFamily = [display && DISPLAY, ethiopic && ETHIOPIC, "serif"].filter(Boolean).join(", ");
  const bodyFamily = [body && BODY, ethiopic && ETHIOPIC, "serif"].filter(Boolean).join(", ");

  const bandHeight = couple.border === "line" ? 30 : 42;
  const band = svgDataUri(
    bandSvg(couple.border, { thread1: colors.thread1, thread2: colors.thread2, thread3: colors.thread3 }, SHEET_WIDTH, bandHeight),
  );
  const qr = qrPath(passLink);
  // Scanners want dark modules on a light ground, whichever way the theme runs.
  const qrGround = theme.scheme === "dark" ? colors.ink : colors.sheet;
  const qrInk = theme.scheme === "dark" ? colors.paper : colors.ink;
  const longest = Math.max(...people.map((name) => name.length));
  const nameSize = longest > 18 ? 56 : longest > 12 ? 66 : 78;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          padding: MARGIN,
          background: colors.paper,
          color: colors.ink,
          fontFamily: bodyFamily,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            background: colors.sheet,
            border: `2px solid ${colors.rule}`,
          }}
        >
          <img src={band} width={SHEET_WIDTH} height={bandHeight} alt="" />

          <div style={{ display: "flex", flex: 1, padding: 22 }}>
            {/* A double gold frame, as on a printed card. */}
            <div style={{ display: "flex", flex: 1, padding: 6, border: `1.5px solid ${colors.metal}` }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  border: `1px solid ${colors.metal}`,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    padding: "24px 56px",
                  }}
                >
                  {photo ? (
                    <div
                      style={{
                        display: "flex",
                        width: 148,
                        height: 148,
                        padding: 4,
                        borderRadius: 999,
                        background: colors.thread2,
                      }}
                    >
                      <img
                        src={photo}
                        width={140}
                        height={140}
                        alt=""
                        style={{ borderRadius: 999, objectFit: "cover", objectPosition: couple.heroPosition }}
                      />
                    </div>
                  ) : (
                    <Monogram text={monogram} theme={theme} fontFamily={displayFamily} />
                  )}
                  <div style={{ marginTop: 26, fontFamily: displayFamily, fontSize: 44, lineHeight: 1.15, color: colors.thread1 }}>
                    {dear}
                  </div>
                  <div style={{ marginTop: 16, fontSize: 26, color: colors.inkSoft }}>{hosts}</div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      marginTop: 18,
                      fontFamily: displayFamily,
                      fontSize: nameSize,
                      lineHeight: 1.05,
                    }}
                  >
                    {people.map((name, index) => (
                      <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        {index > 0 && index === people.length - 1 ? (
                          <div style={{ margin: "4px 0", fontSize: nameSize * 0.5, color: colors.metal }}>&amp;</div>
                        ) : null}
                        <div>{name}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 22, maxWidth: 760, fontSize: invitation.length > 140 ? 24 : 26, lineHeight: 1.4 }}>
                    {invitation}
                  </div>
                  <div style={{ display: "flex", marginTop: 30 }}>
                    <Ornament color={colors.metal} />
                  </div>
                  <div style={{ marginTop: 26, fontFamily: displayFamily, fontSize: 42, lineHeight: 1.15 }}>{date}</div>
                  {gregorian ? <div style={{ marginTop: 4, fontSize: 23, color: colors.inkSoft }}>{gregorian}</div> : null}
                  <div style={{ marginTop: 8, fontSize: 28 }}>{time}</div>
                  {venueName ? <div style={{ marginTop: 18, fontSize: 27 }}>{venueName}</div> : null}
                  {venueAddress ? (
                    <div style={{ marginTop: 2, maxWidth: 760, fontSize: 23, color: colors.inkSoft }}>{venueAddress}</div>
                  ) : null}
                </div>

                {/* The stub: a tear line, then the entry QR. */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 36,
                    padding: "26px 40px 28px",
                    borderTop: `2px dashed ${colors.rule}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      width: QR_BOX,
                      height: QR_BOX,
                      padding: 14,
                      borderRadius: 10,
                      background: qrGround,
                      border: `1.5px solid ${colors.rule}`,
                    }}
                  >
                    <svg width={QR_BOX - 31} height={QR_BOX - 31} viewBox={`0 0 ${qr.size} ${qr.size}`} shapeRendering="crispEdges">
                      <path d={qr.path} fill={qrInk} />
                    </svg>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", maxWidth: 400, textAlign: "left" }}>
                    <div style={{ fontFamily: displayFamily, fontSize: 38, color: colors.thread1 }}>{admits}</div>
                    <div style={{ marginTop: 8, fontSize: 24, lineHeight: 1.3, color: colors.inkSoft }}>{entrance}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <img src={band} width={SHEET_WIDTH} height={bandHeight} alt="" />
        </div>
      </div>
    ),
    { ...CARD_SIZE, fonts, headers },
  );
}
