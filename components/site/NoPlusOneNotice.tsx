interface NoPlusOneNoticeProps {
  text?: string;
}

export function NoPlusOneNotice({
  text = "This invitation is strictly per invite only. We kindly ask that you do not bring additional guests.",
}: NoPlusOneNoticeProps) {
  return (
    <section className="px-6 mb-section-gap-mobile">
      <div className="max-w-guest mx-auto border border-stone rounded-md px-6 py-4 text-center">
        <p className="text-xs tracking-[0.2em] uppercase text-warm-grey mb-2">
          Guest Policy
        </p>
        <p className="text-sm text-warm-grey leading-relaxed">{text}</p>
      </div>
    </section>
  );
}
