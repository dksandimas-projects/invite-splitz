"use client";

import * as React from "react";
import Papa from "papaparse";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";
import { useToast } from "@/components/shared/ToastProvider";
import { createGuest, syncEntourageFromGuests } from "@/lib/firestore";
import type { GuestRole } from "@/types";

interface CSVImportProps {
  isOpen: boolean;
  onClose: () => void;
  existingNames?: Set<string>;
  onImported?: () => void;
}

type Step = "upload" | "preview" | "done";

interface RawRow {
  firstName?: string;
  lastName?: string;
  pax?: string;
  role?: string;
  subrole?: string;
}

interface ParsedRow {
  firstName: string;
  lastName: string;
  pax: number;
  role: GuestRole;
  subRole: string;
}

interface ImportPlan {
  toImport: ParsedRow[];
  skipped: { row: RawRow; reason: string }[];
}

const VALID_ROLES: GuestRole[] = [
  "Guest",
  "Entourage",
  "Secondary Sponsor",
  "Principal Sponsor",
];

const PREVIEW_LIMIT = 5;

function normalizeRole(input: string | undefined): GuestRole | null {
  if (!input) return "Guest";
  const trimmed = input.trim();
  if (!trimmed) return "Guest";
  // Allow case-insensitive / underscore variants like "principal_sponsor"
  const cleaned = trimmed
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
  for (const role of VALID_ROLES) {
    if (role.toLowerCase() === cleaned) return role;
  }
  // Match "principal sponsor" → "Principal Sponsor"
  const titled = cleaned
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  if (VALID_ROLES.includes(titled as GuestRole)) return titled as GuestRole;
  return null;
}

function buildPlan(raw: RawRow[], existingNames: Set<string>): ImportPlan {
  const toImport: ParsedRow[] = [];
  const skipped: { row: RawRow; reason: string }[] = [];

  for (const row of raw) {
    const firstName = (row.firstName ?? "").trim();
    const lastName = (row.lastName ?? "").trim();
    if (!firstName || !lastName) {
      skipped.push({ row, reason: "Missing firstName or lastName" });
      continue;
    }
    const key = `${firstName.toLowerCase()}|${lastName.toLowerCase()}`;
    if (existingNames.has(key)) {
      skipped.push({ row, reason: "Already in guest list" });
      continue;
    }
    const paxNum = Number(row.pax ?? "1");
    if (!Number.isInteger(paxNum) || paxNum < 1) {
      skipped.push({ row, reason: "Invalid pax (must be a positive integer)" });
      continue;
    }
    const role = normalizeRole(row.role);
    if (!role) {
      skipped.push({ row, reason: `Unknown role "${row.role}"` });
      continue;
    }
    const subRole = (row.subrole ?? "").trim();
    toImport.push({ firstName, lastName, pax: paxNum, role, subRole });
  }

  return { toImport, skipped };
}

export function CSVImport({
  isOpen,
  onClose,
  existingNames,
  onImported,
}: CSVImportProps) {
  const [step, setStep] = React.useState<Step>("upload");
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [plan, setPlan] = React.useState<ImportPlan | null>(null);
  const [importing, setImporting] = React.useState(false);
  const [importedCount, setImportedCount] = React.useState(0);
  const [importedError, setImportedError] = React.useState<string | null>(null);
  const { showToast } = useToast();

  const downloadTemplate = () => {
    const headers = "firstName,lastName,pax,role,subRole\n";
    const sample = "Maria,Santos,2,Principal Sponsor,Ninang\n";
    const blob = new Blob([headers + sample], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "guests_import_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  React.useEffect(() => {
    if (isOpen) {
      setStep("upload");
      setFileName(null);
      setPlan(null);
      setImportedCount(0);
      setImportedError(null);
    }
  }, [isOpen]);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    const text = await file.text();
    const parsed = Papa.parse<RawRow>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => {
        const cleaned = h.trim().toLowerCase().replace(/[^a-z0-9]+/g, "");
        if (cleaned === "firstname" || cleaned === "first") return "firstName";
        if (cleaned === "lastname" || cleaned === "last") return "lastName";
        if (cleaned === "pax" || cleaned === "seats" || cleaned === "size") return "pax";
        if (cleaned === "role") return "role";
        if (cleaned === "subrole" || cleaned === "subrole_title" || cleaned === "subrole_name" || cleaned === "subroletitle" || cleaned === "title") {
          return "subrole";
        }
        return h.trim();
      },
    });
    const raw = (parsed.data ?? []).filter(
      (r) => r && (r.firstName || r.lastName || r.pax || r.role)
    );
    setPlan(buildPlan(raw, existingNames ?? new Set()));
    setStep("preview");
  };

  const handleImport = async () => {
    if (!plan) return;
    setImporting(true);
    let success = 0;
    let failure = 0;
    for (const row of plan.toImport) {
      try {
        await createGuest(
          {
            firstName: row.firstName,
            lastName: row.lastName,
            pax: row.pax,
            role: row.role,
            subRole: row.subRole,
          },
          true // skipSync = true
        );
        success += 1;
      } catch {
        failure += 1;
      }
    }

    // Single sync after all rows are imported
    if (success > 0) {
      try {
        await syncEntourageFromGuests();
      } catch (err) {
        console.error("Failed to sync entourage after CSV import:", err);
      }
    }

    setImportedCount(success);
    setImportedError(failure > 0 ? `${failure} row(s) failed` : null);
    setImporting(false);
    setStep("done");
    onImported?.();
    if (success > 0) {
      showToast({
        message: `${success} guest${success === 1 ? "" : "s"} imported.`,
        variant: "success",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title={
        step === "upload"
          ? "Import Guests from CSV"
          : step === "preview"
            ? "Review Import"
            : "Import Complete"
      }
      footer={
        step === "upload" ? (
          <>
            <Button variant="ghost" size="sm" onClick={onClose} fullWidth>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                const input = document.getElementById(
                  "csv-file-input"
                ) as HTMLInputElement | null;
                input?.click();
              }}
              fullWidth
            >
              Choose File
            </Button>
          </>
        ) : step === "preview" ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep("upload")}
              disabled={importing}
              fullWidth
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleImport}
              loading={importing}
              disabled={!plan || plan.toImport.length === 0}
              fullWidth
            >
              Import {plan?.toImport.length ?? 0} Guest
              {plan?.toImport.length === 1 ? "" : "s"}
            </Button>
          </>
        ) : (
          <Button variant="primary" size="md" onClick={onClose} fullWidth>
            Done
          </Button>
        )
      }
    >
      {step === "upload" && (
        <div className="space-y-4">
          <p className="text-sm text-warm-grey">
            Upload a CSV file to bulk-add guests. Existing guests will not be
            overwritten.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-warm-grey bg-stone-light/40 rounded-md px-3 py-2 font-mono flex-1">
              firstName, lastName, pax, role, subRole (optional)
            </span>
            <button
              type="button"
              onClick={downloadTemplate}
              className="text-xs font-semibold text-forest hover:text-garden border border-garden rounded-full px-4 py-2 hover:bg-stone-light/20 transition-colors whitespace-nowrap min-h-[36px] flex items-center justify-center gap-1.5 self-start sm:self-auto"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Template
            </button>
          </div>
          <label
            className="block border-2 border-dashed border-stone rounded-xl p-8 text-center cursor-pointer hover:bg-stone-light/40 transition-colors"
            htmlFor="csv-file-input"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7A7670"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-3"
              aria-hidden
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-charcoal text-sm font-medium">
              {fileName ?? "Drop your CSV here or click to browse"}
            </p>
            <p className="text-xs text-warm-grey mt-1">Accepts .csv only</p>
            <input
              id="csv-file-input"
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </label>
        </div>
      )}

      {step === "preview" && plan && (
        <div className="space-y-4">
          <p className="text-sm text-warm-grey">
            <span className="text-charcoal font-medium">
              {plan.toImport.length}
            </span>{" "}
            guest{plan.toImport.length === 1 ? "" : "s"} ready to import
            {plan.skipped.length > 0 ? (
              <>
                {" · "}
                <span className="text-charcoal font-medium">
                  {plan.skipped.length}
                </span>{" "}
                row{plan.skipped.length === 1 ? "" : "s"} skipped
              </>
            ) : null}
          </p>
          {plan.toImport.length > 0 ? (
            <div className="border border-stone rounded-xl overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-light/40 text-warm-grey border-b border-stone">
                  <tr>
                    <th className="px-3 py-2 text-xs uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 py-2 text-xs uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-3 py-2 text-xs uppercase tracking-wider">
                      Sub-Role
                    </th>
                    <th className="px-3 py-2 text-xs uppercase tracking-wider text-center">
                      Pax
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone/60">
                  {plan.toImport.slice(0, PREVIEW_LIMIT).map((r, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 text-charcoal">
                        {r.firstName} {r.lastName}
                      </td>
                      <td className="px-3 py-2 text-warm-grey">{r.role}</td>
                      <td className="px-3 py-2 text-warm-grey italic text-xs">
                        {r.subRole || "—"}
                      </td>
                      <td className="px-3 py-2 text-charcoal text-center">
                        {r.pax}
                      </td>
                    </tr>
                  ))}
                  {plan.toImport.length > PREVIEW_LIMIT ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-3 py-2 text-warm-grey italic text-center"
                      >
                        …and {plan.toImport.length - PREVIEW_LIMIT} more
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-warm-grey italic">
              No valid rows to import.
            </p>
          )}
          {plan.skipped.length > 0 ? (
            <details className="text-sm">
              <summary className="cursor-pointer text-warm-grey">
                Show {plan.skipped.length} skipped row
                {plan.skipped.length === 1 ? "" : "s"}
              </summary>
              <ul className="mt-2 space-y-1 text-xs text-warm-grey">
                {plan.skipped.map((s, i) => (
                  <li key={i} className="flex justify-between gap-2">
                    <span className="truncate">
                      {s.row.firstName || "—"} {s.row.lastName || "—"}
                    </span>
                    <span className="text-error whitespace-nowrap">
                      {s.reason}
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>
      )}

      {step === "done" && (
        <div className="text-center space-y-4 py-4">
          <div className="w-20 h-20 mx-auto bg-garden/30 rounded-full flex items-center justify-center">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4E8A20"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-warm-grey">
            <span className="text-charcoal font-medium">{importedCount}</span>{" "}
            guest{importedCount === 1 ? "" : "s"} added successfully.
          </p>
          {importedError ? (
            <p className="text-xs text-error">{importedError}</p>
          ) : null}
        </div>
      )}
    </Modal>
  );
}
