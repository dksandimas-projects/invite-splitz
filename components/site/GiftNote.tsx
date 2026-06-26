interface GiftNoteProps {
  heading?: string;
  body: string;
}

export function GiftNote({
  heading = "A Note on Gifts",
  body,
}: GiftNoteProps) {
  return (
    <section className="px-6 mb-section-gap-mobile">
      <div className="max-w-guest mx-auto text-center">
        <h3 className="text-xs tracking-[0.2em] uppercase text-warm-grey mb-3">
          {heading}
        </h3>
        <p className="text-sm text-warm-grey leading-relaxed">{body}</p>
      </div>
    </section>
  );
}
