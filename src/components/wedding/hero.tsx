import type { SiteData } from "@/db/queries/site";
import { pickText, type Locale } from "@/lib/localized";
import { formatEthiopianDateLine, formatGregorianDate, formatWeddingDate } from "@/lib/wedding-format";
import { Countdown } from "./countdown";
import { FallingPetals } from "./petals";
import { Band, WeddingImage } from "./primitives";

type Props = { site: SiteData; locale: Locale };

export function Hero({ site, locale }: Props) {
  const { couple } = site;
  // Nicknames, when the couple set them, replace the full names in the hero only.
  const one = pickText(couple.partnerOneNick, locale) || pickText(couple.partnerOne, locale);
  const two = pickText(couple.partnerTwoNick, locale) || pickText(couple.partnerTwo, locale);
  const tagline = pickText(couple.tagline, locale);
  const city = pickText(couple.city, locale);

  return (
    <>
      <section id="top" className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink text-white">
        {couple.heroPhotoUrl ? (
          <WeddingImage
            src={couple.heroPhotoUrl}
            alt={`${one} & ${two}`}
            fill
            priority
            sizes="100vw"
            className="-z-20 object-cover"
            style={{ objectPosition: couple.heroPosition }}
          />
        ) : (
          <div aria-hidden className="absolute inset-0 -z-20 bg-thread-1" />
        )}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(0,0,0,0.74)_0%,rgba(0,0,0,0.38)_38%,rgba(0,0,0,0.04)_68%,rgba(0,0,0,0.3)_100%)]"
        />
        {couple.petals ? <FallingPetals /> : null}
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-32 sm:px-8 sm:pb-20">
          {tagline ? <p className="mb-5 max-w-md text-lg text-white/85 sm:text-xl">{tagline}</p> : null}
          <h1 className="font-display text-[clamp(3.75rem,14vw,10.5rem)] leading-[0.88] tracking-[-0.01em] [text-shadow:0_2px_24px_rgba(0,0,0,0.25)]">
            <span className="block">{one}</span>
            <span className="block pl-[0.55em]">
              <span className="mr-[0.28em] inline-block align-[0.14em] text-[0.48em]">&amp;</span>
              {two}
            </span>
          </h1>
          <div className="mt-8 space-y-1 text-lg text-white/90 sm:text-xl">
            <p>{formatWeddingDate(couple.weddingAt, couple.timezone, locale)}</p>
            {/* The other calendar, so Ethiopian and international guests both recognise the day. */}
            {locale === "am" ? (
              <p className="text-white/70">{formatGregorianDate(couple.weddingAt, couple.timezone)}</p>
            ) : (
              <p lang="am" className="text-white/70">
                {formatEthiopianDateLine(couple.weddingAt, couple.timezone)}
              </p>
            )}
            {city ? <p className="text-white/70">{city}</p> : null}
          </div>
        </div>
      </section>
      <Band variant={couple.border} />
    </>
  );
}

export function CountdownSection({ site }: Props) {
  const captionId = "countdown-caption";
  return (
    <section aria-labelledby={captionId} className="px-5 py-14 sm:py-20">
      <Countdown target={site.couple.weddingAt} serverNow={new Date().toISOString()} captionId={captionId} />
    </section>
  );
}
