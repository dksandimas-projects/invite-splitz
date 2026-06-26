"use client";

import * as React from "react";
import { Badge } from "@/components/shared/Badge";
import type { Guest, GuestRole } from "@/types";

interface GuestCardProps {
  guest: Guest;
  onCopyLink: (guest: Guest) => void;
  copiedToken: string | null;
  onEdit: (guest: Guest) => void;
  onDelete: (guest: Guest) => void;
  onResetRSVP: (guest: Guest) => void;
}

function roleToBadgeVariant(role: GuestRole) {
  switch (role) {
    case "Principal Sponsor":
      return "principal" as const;
    case "Secondary Sponsor":
      return "secondary" as const;
    case "Entourage":
      return "entourage" as const;
    default:
      return "guest" as const;
  }
}

function roleToLabel(role: GuestRole) {
  return role;
}

function rsvpBadge(guest: Guest) {
  if (guest.rsvpCount === null) {
    return <Badge variant="rsvp-pending" label="Pending" />;
  }
  if (guest.rsvpCount === 0) {
    return <Badge variant="rsvp-declined" label="Declined" />;
  }
  return (
    <Badge
      variant="rsvp-confirmed"
      label={`${guest.rsvpCount}/${guest.pax} Confirmed`}
    />
  );
}

export function GuestCard({
  guest,
  onCopyLink,
  copiedToken,
  onEdit,
  onDelete,
  onResetRSVP,
}: GuestCardProps) {
  const fullName = `${guest.firstName} ${guest.lastName}`;
  return (
    <div className="bg-white shadow-soft rounded-lg p-4 sm:p-5 border border-stone flex flex-col gap-3">
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-charcoal">{fullName}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-warm-grey">
            <Badge variant={roleToBadgeVariant(guest.role)} label={roleToLabel(guest.role)} />
            <span>{guest.pax} pax</span>
          </div>
        </div>
        {rsvpBadge(guest)}
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-md bg-stone-light/40">
        <span className="text-xs text-warm-grey truncate font-mono">
          {`/?guest=${guest.token.slice(0, 6)}…`}
        </span>
        <button
          type="button"
          onClick={() => onCopyLink(guest)}
          className="text-xs font-semibold uppercase tracking-wider text-forest px-2 py-1 border border-garden rounded-full hover:bg-white min-h-[32px]"
        >
          {copiedToken === guest.token ? "Copied!" : "Copy"}
        </button>
      </div>
      <div className="flex items-center justify-end gap-1 pt-2 border-t border-stone/60">
        {guest.rsvpCount !== null ? (
          <button
            type="button"
            onClick={() => onResetRSVP(guest)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-warm-grey hover:text-forest rounded-md"
            aria-label={`Reset RSVP for ${fullName}`}
            title="Reset RSVP"
          >
            ↺
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => onEdit(guest)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-warm-grey hover:text-forest rounded-md"
          aria-label={`Edit ${fullName}`}
          title="Edit"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onDelete(guest)}
          className="min-w-[44px] min-h-[44px] flex items-center justify-center text-warm-grey hover:text-error rounded-md"
          aria-label={`Delete ${fullName}`}
          title="Delete"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
