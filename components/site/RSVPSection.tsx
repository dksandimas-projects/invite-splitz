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
  const [status, setStatus] = React.useState<
    "idle" | "submitting" | "confirmed" | "error"
  >("idle");
  const [resultCount, setResultCount] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (existingRsvpCount !== null) {
      setStatus("confirmed");
      setResultCount(existingRsvpCount);
    }
  }, [existingRsvpCount]);

  const submit = async (count: number) => {
    setStatus("submitting");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, count }),
      });
      if (res.ok) {
        const data = (await res.json()) as { success: boolean; rsvpCount: number };
        setResultCount(data.rsvpCount);
        setStatus("confirmed");
        return;
      }
      const errBody = (await res.json().catch(() => ({}))) as { error?: string };
      if (errBody.error === "ALREADY_RESPONDED") {
        // Re-fetch not available here; just show the success message with the
        // count we tried to submit (the existing one is unknown to us)
        setResultCount(count);
        setStatus("confirmed");
        return;
      }
      if (errBody.error === "GUEST_NOT_FOUND") {
        // Generic error — no retry possible
        setStatus("error");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const retry = () => {
    setStatus("idle");
  };

  if (status === "confirmed") {
    const message =
      resultCount !== null && resultCount > 0
        ? "You're confirmed! We can't wait to celebrate with you."
        : "We're sorry you can't make it. You'll be missed!";
    return (
      <section className="px-6 mb-section-gap-mobile">
        <Card className="max-w-guest mx-auto text-center p-8 space-y-2">
          <h2 className="font-serif text-section-heading text-charcoal">
            Thank you
          </h2>
          <p className="text-warm-grey">{message}</p>
          {resultCount !== null && resultCount > 0 ? (
            <p className="text-sm text-warm-grey">
              Attending: {resultCount} of {pax}
            </p>
          ) : null}
        </Card>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="px-6 mb-section-gap-mobile">
        <Card className="max-w-guest mx-auto text-center p-8 space-y-4">
          <p className="text-warm-grey">
            Something went wrong. Please try again.
          </p>
          <Button variant="ghost" size="md" onClick={retry} fullWidth>
            Retry
          </Button>
        </Card>
      </section>
    );
  }

  const isSubmitting = status === "submitting";

  return (
    <section className="px-6 mb-section-gap-mobile">
      <Card className="max-w-guest mx-auto text-center p-8 sm:p-12 space-y-6">
        <h2 className="text-xs tracking-[0.2em] uppercase text-warm-grey">
          Kindly Reply
        </h2>
        <h3 className="font-serif text-section-heading text-charcoal">
          {pax <= 1 || pax === 2
            ? "Will you be joining us?"
            : "How many from your group will be joining us?"}
        </h3>

        <div className="flex flex-col gap-3 w-full">
          {pax === 1 ? (
            <>
              <Button
                variant="primary"
                size="md"
                onClick={() => submit(1)}
                loading={isSubmitting}
                fullWidth
                disabled={isSubmitting}
              >
                I&apos;ll be there
              </Button>
              <Button
                variant="decline"
                size="md"
                onClick={() => submit(0)}
                loading={isSubmitting}
                fullWidth
                disabled={isSubmitting}
              >
                Can&apos;t make it
              </Button>
            </>
          ) : pax === 2 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => submit(1)}
                loading={isSubmitting}
                fullWidth
                disabled={isSubmitting}
              >
                Just me
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => submit(2)}
                loading={isSubmitting}
                fullWidth
                disabled={isSubmitting}
              >
                Both of us
              </Button>
              <Button
                variant="decline"
                size="md"
                onClick={() => submit(0)}
                loading={isSubmitting}
                fullWidth
                disabled={isSubmitting}
              >
                Can&apos;t make it
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {Array.from({ length: pax }, (_, i) => i + 1).map((n) => (
                  <Button
                    key={n}
                    variant="primary"
                    size="md"
                    onClick={() => submit(n)}
                    loading={isSubmitting}
                    fullWidth
                    disabled={isSubmitting}
                  >
                    {n}
                  </Button>
                ))}
              </div>
              <Button
                variant="decline"
                size="md"
                onClick={() => submit(0)}
                loading={isSubmitting}
                fullWidth
                disabled={isSubmitting}
              >
                Can&apos;t make it
              </Button>
            </>
          )}
        </div>
      </Card>
    </section>
  );
}
