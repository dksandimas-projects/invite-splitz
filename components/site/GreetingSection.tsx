interface GreetingSectionProps {
  guestName: string | null;
  supportCopy?: string;
}

export function GreetingSection({
  guestName,
  supportCopy = "We're so glad to have you celebrate this day with us.",
}: GreetingSectionProps) {
  const headline = guestName
    ? `You're invited, ${guestName}!`
    : "You're invited!";

  return (
    <section className="py-section-gap-mobile md:py-section-gap-desktop text-center px-6">
      <div className="max-w-guest mx-auto space-y-4">
        <h2 className="font-serif text-section-heading text-charcoal">
          {headline}
        </h2>
        <p className="text-warm-grey text-body-main">{supportCopy}</p>
      </div>
    </section>
  );
}
