import * as React from "react";
import { CountdownTimer } from "./CountdownTimer";

interface HeroSectionProps {
  coupleName: string;
  weddingDate: string; // ISO string, e.g. "2026-08-01"
  weddingDateLabel: string;
  backgroundImageUrl?: string;
}

function BotanicalLeft({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 600"
      width="120"
      height="600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M20 580 C 20 580 90 460 60 320 C 30 200 80 40 80 40"
        stroke="#7BB040"
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      <circle cx="80" cy="40" fill="#4E8A20" r="3" />
      <circle cx="20" cy="580" fill="#4E8A20" r="3" />
      <path
        d="M30 460 q 40 -20 60 -60"
        stroke="#7BB040"
        strokeWidth="1"
        fill="none"
      />
      <path
        d="M40 320 q 30 -20 50 -50"
        stroke="#7BB040"
        strokeWidth="1"
        fill="none"
      />
      <circle cx="90" cy="240" fill="#B5CC6E" r="2" />
      <circle cx="70" cy="180" fill="#B5CC6E" r="2" />
      <circle cx="55" cy="120" fill="#B5CC6E" r="2" />
    </svg>
  );
}

export function HeroSection({
  coupleName,
  weddingDate,
  weddingDateLabel,
  backgroundImageUrl,
}: HeroSectionProps) {
  // Split the couple name for stacked display, e.g. "Bretch & Joyce"
  const parts = coupleName.split("&").map((s) => s.trim());

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center py-16 sm:py-24 overflow-hidden">
      {backgroundImageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          aria-hidden
        />
      ) : null}

      {/* Botanical accents — desktop only */}
      <div className="hidden md:block absolute left-0 top-0 bottom-0 w-32 pointer-events-none opacity-40">
        <BotanicalLeft className="h-full w-auto" />
      </div>
      <div className="hidden md:block absolute right-0 top-0 bottom-0 w-32 pointer-events-none opacity-40 -scale-x-100">
        <BotanicalLeft className="h-full w-auto" />
      </div>

      <div className="relative px-6 max-w-guest w-full mx-auto">
        <p className="text-xs tracking-[0.2em] uppercase text-warm-grey mb-6">
          Save the Date
        </p>
        <h1 className="font-serif font-light text-hero-names-mobile md:text-hero-names text-charcoal flex flex-col items-center leading-[1.05] tracking-tight">
          <span>{parts[0] ?? coupleName}</span>
          <span className="italic font-light text-forest py-2 text-3xl md:text-5xl">
            and
          </span>
          <span>{parts[1] ?? ""}</span>
        </h1>
        <div className="w-12 h-px bg-stone mx-auto my-8" />
        <p className="text-sm tracking-widest uppercase text-warm-grey">
          {weddingDateLabel}
        </p>

        <div className="mt-10">
          <CountdownTimer targetIso={weddingDate} />
        </div>
      </div>
    </section>
  );
}
