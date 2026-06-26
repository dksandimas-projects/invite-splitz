"use client";

import * as React from "react";
import Link from "next/link";
import { TopNav } from "@/components/dashboard/TopNav";
import { RSVPSummary } from "@/components/dashboard/RSVPSummary";
import { Button } from "@/components/shared/Button";
import { CSVImport } from "@/components/dashboard/CSVImport";
import { DUMMY_GUESTS, rsvpSummary } from "@/lib/dummyData";
import { weddingConfig } from "@/lib/config";
import { dashboardHref } from "@/lib/nav";

interface DashboardHomeProps {
  weddingId: string;
}

export function DashboardHome({ weddingId }: DashboardHomeProps) {
  const [importOpen, setImportOpen] = React.useState(false);
  const summary = rsvpSummary(DUMMY_GUESTS);

  // Top 5 recent RSVPs (those with rsvpSubmittedAt set)
  const recent = DUMMY_GUESTS.filter((g) => g.rsvpSubmittedAt)
    .sort(
      (a, b) =>
        (b.rsvpSubmittedAt?.toMillis() ?? 0) -
        (a.rsvpSubmittedAt?.toMillis() ?? 0)
    )
    .slice(0, 5);

  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <TopNav
        coupleName={weddingConfig.coupleName}
        weddingId={weddingId}
        activeSection="overview"
        userEmail="dksandimas@gmail.com"
      />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <header className="space-y-2">
          <p className="text-xs tracking-[0.2em] uppercase text-forest">
            Wedding Registry &amp; RSVP
          </p>
          <h1 className="font-serif text-section-heading text-charcoal">
            Welcome back, {weddingConfig.partnerTwo}
          </h1>
        </header>

        <RSVPSummary
          confirmed={summary.confirmed}
          declined={summary.declined}
          pending={summary.pending}
          totalInvited={summary.totalPax}
        />

        <section className="space-y-4">
          <h2 className="text-xs tracking-[0.2em] uppercase text-warm-grey border-b border-stone pb-2">
            Quick Actions
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={dashboardHref(weddingId, "guests")} className="sm:flex-1">
              <Button variant="primary" size="md" fullWidth>
                Manage Guests
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setImportOpen(true)}
              fullWidth
            >
              Import CSV
            </Button>
          </div>
        </section>

        {recent.length > 0 ? (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone pb-4">
              <h3 className="font-serif text-2xl text-charcoal">
                Recent Responses
              </h3>
            </div>
            <ul className="space-y-1">
              {recent.map((g) => (
                <li
                  key={g.id}
                  className="flex items-center justify-between py-4 border-b border-stone/60 hover:bg-butter/30 transition-colors px-2 -mx-2 rounded-md"
                >
                  <div>
                    <p className="text-sm font-medium text-charcoal">
                      {g.firstName} {g.lastName}
                    </p>
                    <p className="text-xs text-warm-grey">
                      {g.rsvpCount === 0
                        ? "Declined"
                        : `Attending • ${g.rsvpCount} of ${g.pax}`}
                    </p>
                  </div>
                  <span className="text-xs text-warm-grey italic">
                    {g.rsvpSubmittedAt
                      ? formatRelative(g.rsvpSubmittedAt.toMillis())
                      : ""}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>

      <footer className="w-full py-8 mt-auto bg-offwhite border-t border-stone">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 max-w-dashboard mx-auto gap-4">
          <p className="text-xs tracking-[0.2em] uppercase text-warm-grey">
            © 2026 Invite-Splitz. All rights reserved.
          </p>
        </div>
      </footer>

      <CSVImport isOpen={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
