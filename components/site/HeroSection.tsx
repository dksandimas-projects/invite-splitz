import * as React from "react";
import { CountdownTimer } from "./CountdownTimer";
import { BotanicalVines } from "./BotanicalVines";

interface HeroSectionProps {
  coupleName: string;
  weddingDate: string; // ISO string, e.g. "2026-08-01"
  weddingDateLabel: string;
  backgroundImageUrl?: string;
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
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center py-24 sm:py-24 overflow-hidden">
      {backgroundImageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          aria-hidden
        />
      ) : null}

      {/* Botanical accents */}
      <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 md:w-44 overflow-hidden pointer-events-none opacity-50 sm:opacity-65 md:opacity-80 flex justify-start origin-bottom-left rotate-[3deg] z-50">
        <BotanicalVines className="h-full w-auto flex-shrink-0" />
      </div>
      <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 md:w-44 overflow-hidden pointer-events-none opacity-50 sm:opacity-65 md:opacity-80 flex justify-end origin-bottom-right -rotate-[3deg] z-50">
        <BotanicalVines className="h-full w-auto flex-shrink-0" isRightSide />
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

