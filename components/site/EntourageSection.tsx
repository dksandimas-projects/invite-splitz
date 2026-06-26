import * as React from "react";
import type { EntourageGroup } from "@/lib/config";

interface EntourageSectionProps {
  entourage: EntourageGroup[];
}

export function EntourageSection({ entourage }: EntourageSectionProps) {
  return (
    <section className="px-6 py-section-gap-mobile md:py-section-gap-desktop">
      <div className="max-w-guest mx-auto text-center">
        <p className="text-xs tracking-[0.2em] uppercase text-warm-grey mb-2">
          The Entourage
        </p>
        <h2 className="font-serif text-section-heading text-charcoal mb-10">
          Our Entourage
        </h2>

        <div className="space-y-10 text-center">
          {entourage.map((group) => (
            <div key={group.role}>
              <p className="text-xs tracking-[0.2em] uppercase text-warm-grey mb-3">
                {group.role}
              </p>
              <div className="font-serif text-body-lg text-charcoal space-y-1">
                {group.members.map((name) => (
                  <p key={name}>{name}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
