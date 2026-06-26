"use client";

import * as React from "react";
import { TopNav } from "@/components/dashboard/TopNav";
import { PageHeader } from "@/components/shared/PageHeader";
import { WeddingSettingsForm } from "@/components/dashboard/WeddingSettingsForm";
import { weddingConfig } from "@/lib/config";
import { dashboardHref } from "@/lib/nav";

interface SettingsScreenProps {
  weddingId: string;
}

export function SettingsScreen({ weddingId }: SettingsScreenProps) {
  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <TopNav
        coupleName={weddingConfig.coupleName}
        weddingId={weddingId}
        activeSection="settings"
        userEmail="dksandimas@gmail.com"
      />
      <main className="flex-1 w-full max-w-[576px] mx-auto px-4 sm:px-6 py-10">
        <PageHeader
          title="Wedding Settings"
          subtitle="Changes are saved to your live site immediately."
        />
        <WeddingSettingsForm />
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
