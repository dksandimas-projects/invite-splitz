import * as React from "react";
import { ColorSwatch } from "@/components/shared/ColorSwatch";
import type { ColorSwatch as Swatch } from "@/lib/config";

interface DressCodeProps {
  description: string;
  palette: Swatch[];
}

export function DressCode({ description, palette }: DressCodeProps) {
  return (
    <section className="px-6 py-section-gap-mobile md:py-section-gap-desktop text-center">
      <div className="max-w-guest mx-auto">
        <h2 className="font-serif text-section-heading text-charcoal mb-4">
          Dress Code
        </h2>
        {description ? (
          <p className="text-warm-grey mb-8">{description}</p>
        ) : null}
        <div className="flex flex-wrap items-start justify-center gap-4 sm:gap-6">
          {palette.map((c) => (
            <ColorSwatch key={c.hex} hex={c.hex} name={c.name} size="md" />
          ))}
        </div>
      </div>
    </section>
  );
}
