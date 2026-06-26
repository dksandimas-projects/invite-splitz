interface BibleVerseFooterProps {
  text: string;
  reference: string;
  coupleName: string;
}

export function BibleVerseFooter({
  text,
  reference,
  coupleName,
}: BibleVerseFooterProps) {
  return (
    <footer
      className="px-6 py-section-gap-mobile md:py-section-gap-desktop border-t border-stone text-center"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 3rem)" }}
    >
      <div className="max-w-guest mx-auto space-y-6">
        <p className="font-serif italic text-xl text-warm-grey leading-relaxed">
          &ldquo;{text}&rdquo;
        </p>
        <p className="text-xs tracking-[0.2em] uppercase text-warm-grey">
          — {reference}
        </p>
        <div className="w-8 h-px bg-sunflower mx-auto" />
        <p className="text-[10px] tracking-widest uppercase text-warm-grey">
          {coupleName} • invite-splitz
        </p>
      </div>
    </footer>
  );
}
