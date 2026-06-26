"use client";

import * as React from "react";
import Link from "next/link";
import { dashboardHref } from "@/lib/nav";
import { useAuth } from "./AuthGuard";
import { signOutUser } from "@/lib/auth";

interface TopNavProps {
  coupleName: string;
  weddingId: string;
  activeSection: "overview" | "guests" | "settings";
}

const navLinks: { key: "overview" | "guests" | "settings"; label: string; path: string }[] = [
  { key: "overview", label: "Overview", path: "" },
  { key: "guests", label: "Guests", path: "guests" },
  { key: "settings", label: "Settings", path: "settings" },
];

export function TopNav({ coupleName, weddingId, activeSection }: TopNavProps) {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOutUser();
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-stone">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 max-w-dashboard mx-auto">
        <Link
          href={dashboardHref(weddingId)}
          className="font-serif text-section-heading text-primary truncate min-w-0"
        >
          {coupleName}
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = link.key === activeSection;
            return (
              <Link
                key={link.key}
                href={dashboardHref(weddingId, link.path)}
                className={[
                  "text-sm py-1 transition-colors",
                  isActive
                    ? "text-charcoal font-semibold border-b-2 border-sunflower"
                    : "text-warm-grey hover:text-charcoal",
                ].join(" ")}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {user?.email ? (
            <span className="hidden md:inline text-xs text-warm-grey truncate max-w-[160px]">
              {user.email}
            </span>
          ) : null}
          <button
            type="button"
            onClick={handleSignOut}
            className="text-sm text-warm-grey hover:text-charcoal hover:underline transition-colors min-h-[44px] px-2"
          >
            <span className="hidden sm:inline">Sign out</span>
            <span className="sm:hidden" aria-label="Sign out">
              ↪
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
