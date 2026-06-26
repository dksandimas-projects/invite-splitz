"use client";

import * as React from "react";
import { Button } from "@/components/shared/Button";
import { Card } from "@/components/shared/Card";

interface RSVPSectionProps {
  token: string;
  pax: number;
  existingRsvpCount: number | null;
}

export function RSVPSection({
  token,
  pax,
  existingRsvpCount,
}: RSVPSectionProps) {
  // Phase 1: static. Buttons are visible but inert (no submission).
  const handleStatic = () => undefined;

  if (existingRsvpCount !== null) {
    const message =
      existingRsvpCount > 0
        ? "You're confirmed! We can't wait to celebrate with you."
        : "We're sorry you can't make it. You'll be missed!";
    return (
      <section className="px-6 mb-section-gap-mobile">
        <Card className="max-w-guest mx-auto text-center p-8 space-y-2">
          <h2 className="font-serif text-section-heading text-charcoal">
            Thank you
          </h2>
          <p className="text-warm-grey">{message}</p>
          {existingRsvpCount > 0 ? (
            <p className="text-sm text-warm-grey">
              Attending: {existingRsvpCount} of {pax}
            </p>
          ) : null}
        </Card>
      </section>
    );
  }

  return (
    <section className="px-6 mb-section-gap-mobile">
      <Card className="max-w-guest mx-auto text-center p-8 sm:p-12 space-y-6">
        <h2 className="text-xs tracking-[0.2em] uppercase text-warm-grey">
          Kindly Reply
        </h2>
        <h3 className="font-serif text-section-heading text-charcoal">
          {pax <= 1
            ? "Will you be joining us?"
            : pax === 2
              ? "Will you be joining us?"
              : "How many from your group will be joining us?"}
        </h3>

        <div className="flex flex-col gap-3 w-full">
          {pax === 1 ? (
            <>
              <Button
                variant="primary"
                size="md"
                onClick={handleStatic}
                fullWidth
              >
                I&apos;ll be there
              </Button>
              <Button
                variant="decline"
                size="md"
                onClick={handleStatic}
                fullWidth
              >
                Can&apos;t make it
              </Button>
            </>
          ) : pax === 2 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleStatic}
                  fullWidth
                >
                  Just me
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleStatic}
                  fullWidth
                >
                  Both of us
                </Button>
                <Button
                  variant="decline"
                  size="md"
                  onClick={handleStatic}
                  fullWidth
                >
                  Can&apos;t make it
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: pax }, (_, i) => i + 1).map((n) => (
                  <Button
                    key={n}
                    variant="primary"
                    size="md"
                    onClick={handleStatic}
                    fullWidth
                  >
                    {n}
                  </Button>
                ))}
              </div>
              <Button
                variant="decline"
                size="md"
                onClick={handleStatic}
                fullWidth
              >
                Can&apos;t make it
              </Button>
            </>
          )}
        </div>

        <p className="text-[10px] text-warm-grey uppercase tracking-widest">
          Token: {token.slice(0, 6)}… (static — no submission yet)
        </p>
      </Card>
    </section>
  );
}
