"use client";

import * as React from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-offwhite px-6 py-10">
      <div className="max-w-md text-center">
        <p className="text-xs tracking-[0.2em] uppercase text-warm-grey mb-3">
          Something went wrong
        </p>
        <h1 className="font-serif text-section-heading text-charcoal mb-4">
          We hit a snag loading the dashboard.
        </h1>
        <p className="text-warm-grey mb-6 leading-relaxed">
          It&apos;s probably a temporary connection issue. Try again, and if
          the problem persists, check the Firebase Console for any service
          outages.
        </p>
        {error.digest ? (
          <p className="text-xs text-warm-grey mb-6 font-mono">
            Error ID: {error.digest}
          </p>
        ) : null}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-full bg-sunflower text-charcoal text-sm font-medium hover:bg-sunflower-hover transition-colors"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 rounded-full border border-garden text-forest text-sm font-medium hover:bg-stone-light transition-colors"
          >
            Go to invitation
          </a>
        </div>
      </div>
    </div>
  );
}
