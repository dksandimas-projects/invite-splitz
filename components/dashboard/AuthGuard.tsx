"use client";

import * as React from "react";
import { Spinner } from "@/components/shared/Spinner";

/**
 * Phase 1 static shell of AuthGuard. Always renders children. In Phase 2+
 * this will:
 *  - subscribe to onAuthStateChanged
 *  - render SignInScreen when user === null
 *  - call getAuthorizedEmails() and render AccessDenied when not allowed
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/** Static sign-in screen — used inside AuthGuard in later phases. */
export function SignInScreen() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm bg-white shadow-soft border border-stone rounded-lg p-8 flex flex-col items-center">
        <h1 className="font-serif text-section-heading text-charcoal text-center mb-1">
          Bretch &amp; Joyce
        </h1>
        <p className="text-xs tracking-[0.2em] uppercase text-warm-grey text-center mb-6">
          Dashboard
        </p>
        <div className="w-16 h-px bg-sunflower mb-6" />
        <p className="text-sm text-warm-grey text-center mb-8 leading-relaxed">
          Sign in to manage your guest list and invite links.
        </p>
        <button
          type="button"
          disabled
          className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-stone rounded-full shadow-sm text-charcoal text-sm font-medium opacity-60 cursor-not-allowed"
        >
          <span className="font-semibold text-garden">G</span>
          Sign in with Google
        </button>
        <p className="mt-8 text-xs text-warm-grey text-center leading-relaxed max-w-[240px]">
          Access is restricted to authorized accounts only. Sign-in will be
          enabled in a later phase.
        </p>
      </div>
    </div>
  );
}

/** Static loading state used by AuthGuard in later phases. */
export function AuthLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
