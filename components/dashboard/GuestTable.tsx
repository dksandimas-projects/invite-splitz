"use client";

import * as React from "react";
import { Badge } from "@/components/shared/Badge";
import type { GuestRole } from "@/types";
import type { SerializedGuest } from "@/lib/serialize";

interface GuestTableProps {
  guests: SerializedGuest[];
  onCopyLink: (guest: SerializedGuest) => void;
  copiedToken: string | null;
  onEdit: (guest: SerializedGuest) => void;
  onDelete: (guest: SerializedGuest) => void;
  onResetRSVP: (guest: SerializedGuest) => void;
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

function rsvpBadge(guest: SerializedGuest) {
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

export function GuestTable({
  guests,
  onCopyLink,
  copiedToken,
  onEdit,
  onDelete,
  onResetRSVP,
}: GuestTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-soft border border-stone overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-offwhite border-b border-stone">
            <tr>
              <th className="px-6 py-4 text-[11px] tracking-[0.2em] uppercase text-warm-grey font-medium">
                Name
              </th>
              <th className="px-6 py-4 text-[11px] tracking-[0.2em] uppercase text-warm-grey font-medium">
                Role
              </th>
              <th className="px-6 py-4 text-[11px] tracking-[0.2em] uppercase text-warm-grey font-medium text-center">
                Pax
              </th>
              <th className="px-6 py-4 text-[11px] tracking-[0.2em] uppercase text-warm-grey font-medium">
                Invite Link
              </th>
              <th className="px-6 py-4 text-[11px] tracking-[0.2em] uppercase text-warm-grey font-medium">
                RSVP
              </th>
              <th className="px-6 py-4 text-[11px] tracking-[0.2em] uppercase text-warm-grey font-medium text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone/60">
            {guests.map((guest) => {
              const fullName = `${guest.firstName} ${guest.lastName}`;
              return (
                <tr
                  key={guest.id}
                  className="hover:bg-butter/40 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-charcoal">
                    {fullName}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={roleToBadgeVariant(guest.role)}
                      label={roleToLabel(guest.role)}
                    />
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-warm-grey">
                    {guest.pax}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-warm-grey truncate max-w-[160px] font-mono">
                        {`/?guest=${guest.token.slice(0, 8)}…`}
                      </span>
                      <button
                        type="button"
                        onClick={() => onCopyLink(guest)}
                        className="text-xs font-semibold uppercase tracking-wider text-forest px-2 py-1 border border-garden rounded-full hover:bg-white min-h-[32px]"
                      >
                        {copiedToken === guest.token ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">{rsvpBadge(guest)}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end items-center gap-1">
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
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
