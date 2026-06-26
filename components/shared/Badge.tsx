import * as React from "react";

type Variant =
  | "principal"
  | "secondary"
  | "entourage"
  | "guest"
  | "rsvp-confirmed"
  | "rsvp-declined"
  | "rsvp-pending";

interface BadgeProps {
  variant: Variant;
  label: string;
  className?: string;
}

const variantClass: Record<Variant, string> = {
  principal: "bg-sunflower text-charcoal",
  secondary: "bg-sage text-charcoal",
  entourage: "bg-butter text-forest",
  guest: "bg-stone-light text-warm-grey",
  "rsvp-confirmed": "bg-sunflower text-charcoal",
  "rsvp-declined": "bg-red-50 text-red-400",
  "rsvp-pending": "bg-stone-light text-warm-grey",
};

export function Badge({ variant, label, className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClass[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </span>
  );
}
