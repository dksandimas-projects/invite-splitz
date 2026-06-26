"use client";

import * as React from "react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/shared/Button";

interface CSVImportProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = "upload" | "preview" | "done";

const PREVIEW_ROWS = [
  { firstName: "Maria", lastName: "Santos", pax: 2, role: "Principal Sponsor" },
  { firstName: "Ricardo", lastName: "Dela Cruz", pax: 4, role: "Secondary Sponsor" },
  { firstName: "Isabella", lastName: "Montenegro", pax: 1, role: "Entourage" },
  { firstName: "Rafael", lastName: "Gomez", pax: 2, role: "Guest" },
  { firstName: "Liam", lastName: "Wilson", pax: 1, role: "Entourage" },
];

export function CSVImport({ isOpen, onClose }: CSVImportProps) {
  const [step, setStep] = React.useState<Step>("upload");
  const [fileName, setFileName] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setStep("upload");
      setFileName(null);
    }
  }, [isOpen]);

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
              onClick={() => setStep("preview")}
              disabled={!fileName}
              fullWidth
            >
              Upload
            </Button>
          </>
        ) : step === "preview" ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep("upload")}
              fullWidth
            >
              Back
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setStep("done")}
              fullWidth
            >
              Import {PREVIEW_ROWS.length} Guests
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
          <div className="text-xs text-warm-grey bg-stone-light/40 rounded-md px-3 py-2 font-mono">
            firstName, lastName, pax, role
          </div>
          <label
            className="block border-2 border-dashed border-stone rounded-lg p-8 text-center cursor-pointer hover:bg-stone-light/40 transition-colors"
            htmlFor="csv-file"
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
              id="csv-file"
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFileName(f.name);
              }}
            />
          </label>
        </div>
      )}

      {step === "preview" && (
        <div className="space-y-4">
          <div className="border border-stone rounded-md overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-light/40 text-warm-grey border-b border-stone">
                <tr>
                  <th className="px-3 py-2 text-xs uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 py-2 text-xs uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-3 py-2 text-xs uppercase tracking-wider text-center">
                    Pax
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone/60">
                {PREVIEW_ROWS.slice(0, 5).map((r, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 text-charcoal">
                      {r.firstName} {r.lastName}
                    </td>
                    <td className="px-3 py-2 text-warm-grey">{r.role}</td>
                    <td className="px-3 py-2 text-charcoal text-center">
                      {r.pax}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-warm-grey">
            {PREVIEW_ROWS.length} guests ready to import · 0 rows skipped
          </p>
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
            {PREVIEW_ROWS.length} guests added successfully to your wedding
            list.
          </p>
        </div>
      )}
    </Modal>
  );
}
