import * as React from "react";
import { Card } from "@/components/shared/Card";

interface RSVPSummaryProps {
  confirmed: number;
  declined: number;
  pending: number;
  totalInvited: number;
  className?: string;
}

function Stat({
  value,
  label,
  color,
}: {
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="text-center px-4 space-y-1">
      <span
        className="block font-serif text-4xl sm:text-5xl"
        style={{ color }}
      >
        {value}
      </span>
      <span className="block text-[10px] tracking-[0.2em] uppercase text-warm-grey">
        {label}
      </span>
    </div>
  );
}

export function RSVPSummary({
  confirmed,
  declined,
  pending,
  totalInvited,
  className = "",
}: RSVPSummaryProps) {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-serif text-section-heading text-charcoal">
          Guest Overview
        </h2>
        <span className="text-xs tracking-[0.2em] uppercase text-warm-grey">
          Real-time stats
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Stat value={confirmed} label="Confirmed" color="#E8C800" />
        <Stat value={declined} label="Declined" color="#7A7670" />
        <Stat value={pending} label="Pending" color="#B5CC6E" />
        <Stat value={totalInvited} label="Total Invited" color="#2C2B28" />
      </div>
    </Card>
  );
}
