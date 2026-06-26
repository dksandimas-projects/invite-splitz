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
        <div className="flex justify-center mb-2">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#7BB040"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="scale-125"
          >
            <path d="M12 3l1.9 4.6L19 9l-4 3.4 1.3 5.1L12 14.8 7.7 17.5 9 12.4 5 9l5.1-1.4z" />
            <circle cx="12" cy="12" r="1" fill="#7BB040" />
          </svg>
        </div>
        <h2 className="font-serif text-section-heading text-charcoal">
          {headline}
        </h2>
        <p className="text-warm-grey text-body-main">{supportCopy}</p>
      </div>
    </section>
  );
}
