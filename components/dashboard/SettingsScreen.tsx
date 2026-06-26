"use client";

import * as React from "react";
import { TopNav } from "@/components/dashboard/TopNav";
import { PageHeader } from "@/components/shared/PageHeader";
import { WeddingSettingsForm } from "@/components/dashboard/WeddingSettingsForm";
import { dashboardHref } from "@/lib/nav";
import type { SerializedWedding } from "@/lib/serialize";

interface SettingsScreenProps {
  weddingId: string;
  wedding: SerializedWedding | null;
  initialAccessEmails: string[];
}

export function SettingsScreen({
  weddingId,
  wedding,
  initialAccessEmails,
}: SettingsScreenProps) {
  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <TopNav
        coupleName={wedding?.coupleName ?? "Wedding Dashboard"}
        weddingId={weddingId}
        activeSection="settings"
      />
      <main className="flex-1 w-full max-w-[576px] mx-auto px-4 sm:px-6 py-10">
        <PageHeader
          title="Wedding Settings"
          subtitle="Changes are saved to your live site immediately."
        />
        <WeddingSettingsForm
          wedding={wedding}
          initialAccessEmails={initialAccessEmails}
        />
        <p className="mt-6 text-xs text-warm-grey text-center">
          <a
            href={dashboardHref(weddingId, "guests")}
            className="text-forest hover:underline"
          >
            ← Back to Guests
          </a>
        </p>
      </main>
      <footer className="w-full py-8 mt-auto bg-offwhite border-t border-stone">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 max-w-dashboard mx-auto gap-4">
          <p className="text-xs tracking-[0.2em] uppercase text-warm-grey">
            © 2026 Invite-Splitz. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
