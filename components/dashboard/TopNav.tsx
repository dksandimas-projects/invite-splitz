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
      <div className="flex flex-col md:flex-row md:items-center justify-between px-4 sm:px-6 py-3 md:py-4 max-w-dashboard mx-auto gap-2 md:gap-0">
        <div className="flex items-center justify-between w-full md:w-auto">
          <Link
            href={dashboardHref(weddingId)}
            className="font-serif text-section-heading text-primary truncate min-w-0"
          >
            {coupleName}
          </Link>

          {/* Mobile Sign out button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={handleSignOut}
              className="text-sm text-warm-grey hover:text-charcoal transition-colors min-h-[44px] px-2 flex items-center"
              aria-label="Sign out"
            >
              ↪
            </button>
          </div>
        </div>

        {/* Desktop Nav Links */}
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

        {/* Desktop User Info & Sign out */}
        <div className="hidden md:flex items-center gap-3">
          {user?.email ? (
            <span className="text-xs text-warm-grey truncate max-w-[160px]">
              {user.email}
            </span>
          ) : null}
          <button
            type="button"
            onClick={handleSignOut}
            className="text-sm text-warm-grey hover:text-charcoal hover:underline transition-colors min-h-[44px] px-2"
          >
            Sign out
          </button>
        </div>

        {/* Mobile Nav Links Row */}
        <nav className="flex md:hidden items-center gap-6 border-t border-stone-light pt-2 mt-1 w-full justify-start">
          {navLinks.map((link) => {
            const isActive = link.key === activeSection;
            return (
              <Link
                key={link.key}
                href={dashboardHref(weddingId, link.path)}
                className={[
                  "text-xs py-1 transition-colors uppercase tracking-wider",
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
      </div>
    </header>
  );
}
