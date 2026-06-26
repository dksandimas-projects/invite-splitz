import * as React from "react";
import type { EventInfo } from "@/lib/config";

interface EventDetailsProps {
  ceremony: EventInfo;
  reception: EventInfo;
}

const PinIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

/**
 * Converts a Google Maps share URL into an embed src.
 * Handles:
 *   https://maps.google.com/?q=...
 *   https://www.google.com/maps?q=...
 *   https://www.google.com/maps/place/...
 *   Falls back to a plain query search from the venue name + address.
 */
function toEmbedUrl(mapsUrl: string, venue: string, address: string): string {
  try {
    const url = new URL(mapsUrl);

    // Already an embed URL — return as-is
    if (url.searchParams.get("output") === "embed") return mapsUrl;

    // Has a ?q= param → reuse it
    const q = url.searchParams.get("q");
    if (q) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed&z=15`;
    }

    // /maps/place/ style URL — try to extract the place slug
    const placeMatch = url.pathname.match(/\/maps\/place\/([^/]+)/);
    if (placeMatch) {
      return `https://maps.google.com/maps?q=${placeMatch[1]}&output=embed&z=15`;
    }
  } catch {
    // Not a valid URL — fall through
  }

  // Fallback: build a query from venue name + address
  const fallback = [venue, address].filter(Boolean).join(", ");
  return `https://maps.google.com/maps?q=${encodeURIComponent(fallback)}&output=embed&z=15`;
}

function MapEmbed({ mapsUrl, venue, address, label }: { mapsUrl: string; venue: string; address: string; label: string }) {
  const embedSrc = toEmbedUrl(mapsUrl, venue, address);

  return (
    <div className="rounded-md overflow-hidden border border-stone -mx-2 sm:mx-0">
      <iframe
        title={`Map for ${label}`}
        src={embedSrc}
        width="100%"
        height="200"
        style={{ border: 0, display: "block" }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        aria-label={`Google Maps location of ${label}`}
      />
    </div>
  );
}

function EventCard({ label, info }: { label: string; info: EventInfo }) {
  return (
    <div className="border border-stone bg-white rounded-md overflow-hidden">
      <MapEmbed
        mapsUrl={info.mapsUrl}
        venue={info.venue}
        address={info.address}
        label={`${label} — ${info.venue}`}
      />
      <div className="p-6 sm:p-8 space-y-3">
        <p className="text-xs tracking-[0.2em] uppercase text-warm-grey">
          {label}
        </p>
        <h3 className="font-serif text-2xl text-charcoal">{info.venue}</h3>
        <p className="text-warm-grey text-sm whitespace-pre-line leading-relaxed">
          {info.address}
        </p>
        <p className="text-sm text-charcoal">{info.time}</p>
        <a
          href={info.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-forest text-sm font-medium hover:underline min-h-[44px]"
        >
          <PinIcon />
          Get Directions
        </a>
      </div>
    </div>
  );
}

function CombinedEventCard({ ceremony, reception }: { ceremony: EventInfo; reception: EventInfo }) {
  return (
    <div className="border border-stone bg-white rounded-md overflow-hidden max-w-md mx-auto w-full">
      <MapEmbed
        mapsUrl={ceremony.mapsUrl}
        venue={ceremony.venue}
        address={ceremony.address}
        label={`Ceremony & Reception — ${ceremony.venue}`}
      />
      <div className="p-6 sm:p-8 space-y-4">
        <p className="text-xs tracking-[0.2em] uppercase text-warm-grey">
          Ceremony &amp; Reception
        </p>
        <h3 className="font-serif text-2xl text-charcoal">{ceremony.venue}</h3>
        <p className="text-warm-grey text-sm whitespace-pre-line leading-relaxed">
          {ceremony.address}
        </p>
        {/* Timeline of times */}
        <div className="flex flex-col gap-2 pt-1">
          <div className="flex items-center gap-3">
            <span className="text-xs tracking-widest uppercase text-warm-grey w-20 shrink-0">
              Ceremony
            </span>
            <span className="text-sm text-charcoal">{ceremony.time}</span>
          </div>
          <div className="w-px h-4 bg-stone ml-9" aria-hidden />
          <div className="flex items-center gap-3">
            <span className="text-xs tracking-widest uppercase text-warm-grey w-20 shrink-0">
              Reception
            </span>
            <span className="text-sm text-charcoal">{reception.time}</span>
          </div>
        </div>
        <a
          href={ceremony.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-forest text-sm font-medium hover:underline min-h-[44px]"
        >
          <PinIcon />
          Get Directions
        </a>
      </div>
    </div>
  );
}

export function EventDetails({ ceremony, reception }: EventDetailsProps) {
  const isSameVenue =
    ceremony.venue.trim().toLowerCase() === reception.venue.trim().toLowerCase();

  return (
    <section className="px-6 py-section-gap-mobile md:py-section-gap-desktop">
      <div className="max-w-guest mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-serif text-section-heading text-charcoal">
            The Celebration
          </h2>
          <div className="w-12 h-px bg-stone mx-auto mt-4" />
        </div>
        {isSameVenue ? (
          <CombinedEventCard ceremony={ceremony} reception={reception} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EventCard label="Ceremony" info={ceremony} />
            <EventCard label="Reception" info={reception} />
          </div>
        )}
      </div>
    </section>
  );
}
