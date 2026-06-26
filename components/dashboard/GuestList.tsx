"use client";

import * as React from "react";
import { TopNav } from "@/components/dashboard/TopNav";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/shared/Button";
import { Input } from "@/components/shared/Input";
import { EmptyState } from "@/components/shared/EmptyState";
import { GuestTable } from "@/components/dashboard/GuestTable";
import { GuestCard } from "@/components/dashboard/GuestCard";
import { GuestForm } from "@/components/dashboard/GuestForm";
import { DeleteDialog } from "@/components/dashboard/DeleteDialog";
import { ResetRSVPDialog } from "@/components/dashboard/ResetRSVPDialog";
import { CSVImport } from "@/components/dashboard/CSVImport";
import { DUMMY_GUESTS, rsvpSummary } from "@/lib/dummyData";
import { weddingConfig } from "@/lib/config";
import { useToast } from "@/components/shared/ToastProvider";
import type { Guest } from "@/types";

interface GuestListProps {
  weddingId: string;
  baseUrl: string;
}

export function GuestList({ weddingId, baseUrl }: GuestListProps) {
  const [guests] = React.useState<Guest[]>(DUMMY_GUESTS);
  const [search, setSearch] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"add" | "edit">("add");
  const [formInitial, setFormInitial] = React.useState<Guest | undefined>(
    undefined
  );
  const [deleteTarget, setDeleteTarget] = React.useState<Guest | null>(null);
  const [resetTarget, setResetTarget] = React.useState<Guest | null>(null);
  const [importOpen, setImportOpen] = React.useState(false);
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);
  const { showToast } = useToast();

  const filtered = guests.filter((g) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      g.firstName.toLowerCase().includes(q) ||
      g.lastName.toLowerCase().includes(q)
    );
  });

  const summary = rsvpSummary(guests);

  const handleCopyLink = async (g: Guest) => {
    const url = `${baseUrl}/?guest=${g.token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedToken(g.token);
      showToast({
        message: `Invite link copied for ${g.firstName} ${g.lastName}.`,
        variant: "success",
      });
      setTimeout(() => setCopiedToken(null), 2000);
    } catch {
      showToast({
        message: "Could not copy link. Please copy manually.",
        variant: "error",
      });
    }
  };

  const openAdd = () => {
    setFormMode("add");
    setFormInitial(undefined);
    setFormOpen(true);
  };

  const openEdit = (g: Guest) => {
    setFormMode("edit");
    setFormInitial(g);
    setFormOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <TopNav
        coupleName={weddingConfig.coupleName}
        weddingId={weddingId}
        activeSection="guests"
        userEmail="dksandimas.projects@gmail.com"
      />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <PageHeader
          title="Guest List"
          subtitle={`${guests.length} guests · ${summary.totalPax} invited heads`}
          actions={
            <>
              <Button
                variant="ghost"
                size="md"
                onClick={() => setImportOpen(true)}
              >
                Import CSV
              </Button>
              <Button variant="primary" size="md" onClick={openAdd}>
                Add Guest
              </Button>
            </>
          }
        />

        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              id="search"
              value={search}
              onChange={setSearch}
              placeholder="Search guest name…"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white shadow-soft rounded-lg border border-stone">
            <EmptyState
              message="No guests match your search."
              action={
                guests.length === 0
                  ? { label: "Add Guest", onClick: openAdd }
                  : undefined
              }
            />
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <GuestTable
                guests={filtered}
                copiedToken={copiedToken}
                onCopyLink={handleCopyLink}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
                onResetRSVP={setResetTarget}
              />
            </div>
            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {filtered.map((g) => (
                <GuestCard
                  key={g.id}
                  guest={g}
                  copiedToken={copiedToken}
                  onCopyLink={handleCopyLink}
                  onEdit={openEdit}
                  onDelete={setDeleteTarget}
                  onResetRSVP={setResetTarget}
                />
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="w-full py-8 mt-auto bg-offwhite border-t border-stone">
        <div className="flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 max-w-dashboard mx-auto gap-4">
          <p className="text-xs tracking-[0.2em] uppercase text-warm-grey">
            © 2026 Invite-Splitz. All rights reserved.
          </p>
        </div>
      </footer>

      <GuestForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        mode={formMode}
        initial={formInitial}
      />
      <DeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          setDeleteTarget(null);
          showToast({ message: "Guest removed.", variant: "neutral" });
        }}
        guestName={
          deleteTarget
            ? `${deleteTarget.firstName} ${deleteTarget.lastName}`
            : ""
        }
      />
      <ResetRSVPDialog
        isOpen={!!resetTarget}
        onClose={() => setResetTarget(null)}
        onConfirm={() => {
          setResetTarget(null);
          showToast({ message: "RSVP cleared.", variant: "neutral" });
        }}
        firstName={resetTarget?.firstName ?? ""}
      />
      <CSVImport isOpen={importOpen} onClose={() => setImportOpen(false)} />

      {/* Mobile FAB for quick add */}
      <button
        type="button"
        onClick={openAdd}
        aria-label="Add guest"
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-sunflower text-charcoal rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-40"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>
    </div>
  );
}
