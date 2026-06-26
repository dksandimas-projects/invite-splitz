import * as React from "react";
import type { EventInfo } from "@/lib/config";

interface EventDetailsProps {
  ceremony: EventInfo;
  reception: EventInfo;
}

function EventCard({ label, info }: { label: string; info: EventInfo }) {
  return (
    <div className="border border-stone bg-white rounded-md p-6 sm:p-8 space-y-3">
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
        Get Directions
      </a>
    </div>
  );
}

export function EventDetails({ ceremony, reception }: EventDetailsProps) {
  return (
    <section className="px-6 py-section-gap-mobile md:py-section-gap-desktop">
      <div className="max-w-guest mx-auto">
        <div className="text-center mb-10">
          <h2 className="font-serif text-section-heading text-charcoal">
            The Celebration
          </h2>
          <div className="w-12 h-px bg-stone mx-auto mt-4" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EventCard label="Ceremony" info={ceremony} />
          <EventCard label="Reception" info={reception} />
        </div>
      </div>
    </section>
  );
}
