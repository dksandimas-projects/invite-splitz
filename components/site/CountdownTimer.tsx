"use client";

import * as React from "react";

interface CountdownTimerProps {
  targetIso: string; // e.g. "2026-08-01" in PHT (UTC+8)
  className?: string;
}

function getPartsUntil(target: Date) {
  const now = new Date();
  let diff = target.getTime() - now.getTime();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * 1000 * 60 * 60 * 24;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 1000 * 60 * 60;
  const minutes = Math.floor(diff / (1000 * 60));
  diff -= minutes * 1000 * 60;
  const seconds = Math.floor(diff / 1000);
  return { days, hours, minutes, seconds };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function CountdownTimer({ targetIso, className = "" }: CountdownTimerProps) {
  // Build a PHT (UTC+8) Date from the ISO date string
  const target = React.useMemo(() => {
    const [y, m, d] = targetIso.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, d, -8, 0, 0));
  }, [targetIso]);

  // Render only on the client — the countdown is time-sensitive, so the
  // server's clock value will not match the client's and would cause a
  // hydration mismatch. We render placeholder zeroes on the server and
  // swap in the real values after mount.
  const [mounted, setMounted] = React.useState(false);
  const [parts, setParts] = React.useState<ReturnType<typeof getPartsUntil>>(null);

  React.useEffect(() => {
    setMounted(true);
    setParts(getPartsUntil(target));
    const id = window.setInterval(() => {
      setParts(getPartsUntil(target));
    }, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (mounted && parts === null) {
    return (
      <div className={className}>
        <p className="font-serif text-2xl text-forest italic">
          We&apos;re married!
        </p>
      </div>
    );
  }

  const display = parts ?? { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return (
    <div
      className={[
        "grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-6 w-full max-w-sm mx-auto",
        className,
      ].join(" ")}
      aria-label="Countdown to wedding"
    >
      <Unit value={display.days} label="Days" />
      <Unit value={display.hours} label="Hrs" />
      <Unit value={display.minutes} label="Mins" />
      <Unit value={display.seconds} label="Secs" hiddenOnMobile />
    </div>
  );
}

function Unit({
  value,
  label,
  hiddenOnMobile = false,
}: {
  value: number;
  label: string;
  hiddenOnMobile?: boolean;
}) {
  return (
    <div
      className={[
        "text-center",
        hiddenOnMobile ? "hidden sm:block" : "",
      ].join(" ")}
    >
      <div className="font-serif text-section-heading text-forest">
        {pad(value)}
      </div>
      <div className="text-[10px] tracking-[0.15em] uppercase text-warm-grey mt-1">
        {label}
      </div>
    </div>
  );
}
