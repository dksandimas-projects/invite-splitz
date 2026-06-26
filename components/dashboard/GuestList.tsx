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
import { DeleteAllDialog } from "@/components/dashboard/DeleteAllDialog";
import { ResetRSVPDialog } from "@/components/dashboard/ResetRSVPDialog";
import { CSVImport } from "@/components/dashboard/CSVImport";
import { useToast } from "@/components/shared/ToastProvider";
import {
  createGuest,
  deleteAllGuests,
  deleteGuest,
  resetRSVP,
  updateGuest,
} from "@/lib/firestore";
import type { GuestRole } from "@/types";
import { serializeGuest, serializeWedding, type SerializedGuest, type SerializedWedding } from "@/lib/serialize";
import { inviteHref, WEDDING_ID } from "@/lib/nav";
import { subscribeToGuests, subscribeToWedding } from "@/lib/firestore";

interface GuestListProps {
  weddingId: string;
  wedding: SerializedWedding | null;
  initialGuests: SerializedGuest[];
  baseUrl: string;
}

function rsvpSummary(guests: SerializedGuest[]) {
  const totalPax = guests.reduce((sum, g) => sum + g.pax, 0);
  let confirmed = 0;
  let declined = 0;
  let pending = 0;
  for (const g of guests) {
    if (g.rsvpCount === null) pending += 1;
    else if (g.rsvpCount === 0) declined += 1;
    else confirmed += g.rsvpCount;
  }
  return { confirmed, declined, pending, totalPax };
}

export function GuestList({
  weddingId,
  wedding,
  initialGuests,
  baseUrl,
}: GuestListProps) {
  const [guests, setGuests] = React.useState<SerializedGuest[]>(initialGuests);
  const [liveWedding, setLiveWedding] = React.useState<SerializedWedding | null>(wedding);
  const [search, setSearch] = React.useState("");
  const [formOpen, setFormOpen] = React.useState(false);
  const [formMode, setFormMode] = React.useState<"add" | "edit">("add");
  const [formInitial, setFormInitial] = React.useState<SerializedGuest | undefined>(
    undefined
  );
  const [deleteTarget, setDeleteTarget] = React.useState<SerializedGuest | null>(null);
  const [resetTarget, setResetTarget] = React.useState<SerializedGuest | null>(null);
  const [importOpen, setImportOpen] = React.useState(false);
  const [deleteAllOpen, setDeleteAllOpen] = React.useState(false);
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const { showToast } = useToast();

  // Live updates — the guest list and wedding doc refresh in real time.
  // Manual state updates (from createGuest / updateGuest / etc.) still
  // win immediately; the subscription reconciles on the next change.
  React.useEffect(() => {
    const unsubGuests = subscribeToGuests((next) => {
      setGuests(next.map(serializeGuest));
    });
    const unsubWedding = subscribeToWedding((next) => {
      setLiveWedding(serializeWedding(next));
    });
    return () => {
      unsubGuests();
      unsubWedding();
    };
  }, []);

  const filtered = guests.filter((g) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      g.firstName.toLowerCase().includes(q) ||
      g.lastName.toLowerCase().includes(q)
    );
  });

  const summary = rsvpSummary(guests);

  const handleCopyLink = async (g: SerializedGuest) => {
    const url = `${baseUrl}${inviteHref(WEDDING_ID, g.token)}`;
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

  const openEdit = (g: SerializedGuest) => {
    setFormMode("edit");
    setFormInitial(g);
    setFormOpen(true);
  };

  const handleFormSubmit = async (data: {
    firstName: string;
    lastName: string;
    pax: number;
    role: GuestRole;
    subRole: string;
  }) => {
    setBusy(true);
    try {
      if (formMode === "add") {
        const created = await createGuest(data);
        setGuests((prev) => [...prev, serializeGuest(created)]);
        showToast({ message: "Guest added successfully.", variant: "success" });
      } else if (formInitial) {
        await updateGuest(formInitial.id, data);
        setGuests((prev) =>
          prev.map((g) =>
            g.id === formInitial.id
              ? { ...g, ...data, updatedAt: new Date().toISOString() }
              : g
          )
        );
        showToast({ message: "Changes saved.", variant: "success" });
      }
      setFormOpen(false);
    } catch (err) {
      console.error(err);
      showToast({
        message: "Something went wrong. Please try again.",
        variant: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setBusy(true);
    try {
      await deleteGuest(id);
      setGuests((prev) => prev.filter((g) => g.id !== id));
      setDeleteTarget(null);
      showToast({ message: "Guest removed.", variant: "neutral" });
    } catch (err) {
      console.error(err);
      showToast({
        message: "Something went wrong. Please try again.",
        variant: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteAll = async () => {
    setBusy(true);
    try {
      await deleteAllGuests();
      setGuests([]);
      setDeleteAllOpen(false);
      showToast({ message: "All guests have been removed.", variant: "neutral" });
    } catch (err) {
      console.error(err);
      showToast({
        message: "Something went wrong. Please try again.",
        variant: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleResetRSVP = async () => {
    if (!resetTarget) return;
    const id = resetTarget.id;
    setBusy(true);
    try {
      await resetRSVP(id);
      setGuests((prev) =>
        prev.map((g) =>
          g.id === id
            ? { ...g, rsvpCount: null, rsvpSubmittedAt: null }
            : g
        )
      );
      setResetTarget(null);
      showToast({ message: "RSVP cleared.", variant: "neutral" });
    } catch (err) {
      console.error(err);
      showToast({
        message: "Something went wrong. Please try again.",
        variant: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-offwhite">
      <TopNav
        coupleName={liveWedding?.coupleName ?? wedding?.coupleName ?? "Wedding Dashboard"}
        weddingId={weddingId}
        activeSection="guests"
      />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <PageHeader
          title="Guest List"
          subtitle={`${guests.length} guests · ${summary.totalPax} invited heads`}
          actions={
            <>
              {guests.length > 0 && (
                <Button
                  variant="danger"
                  size="md"
                  onClick={() => setDeleteAllOpen(true)}
                >
                  Delete All
                </Button>
              )}
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
          <div className="bg-white shadow-soft rounded-xl border border-stone">
            <EmptyState
              message={
                guests.length === 0
                  ? "No guests yet. Add your first guest or import a CSV."
                  : "No guests match your search."
              }
              action={
                guests.length === 0
                  ? { label: "Add Guest", onClick: openAdd }
                  : undefined
              }
            />
          </div>
        ) : (
          <>
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
        onSubmit={handleFormSubmit}
        busy={busy}
      />
      <DeleteDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        guestName={
          deleteTarget
            ? `${deleteTarget.firstName} ${deleteTarget.lastName}`
            : ""
        }
        loading={busy}
      />
      <ResetRSVPDialog
        isOpen={!!resetTarget}
        onClose={() => setResetTarget(null)}
        onConfirm={handleResetRSVP}
        firstName={resetTarget?.firstName ?? ""}
        loading={busy}
      />
      <CSVImport
        isOpen={importOpen}
        onClose={() => setImportOpen(false)}
        existingNames={new Set(
          guests.map((g) => `${g.firstName.toLowerCase()}|${g.lastName.toLowerCase()}`)
        )}
      />
      <DeleteAllDialog
        isOpen={deleteAllOpen}
        guestCount={guests.length}
        onClose={() => setDeleteAllOpen(false)}
        onConfirm={handleDeleteAll}
        loading={busy}
      />

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
