"use client";

import * as React from "react";
import QRCode from "react-qr-code";
import { SectionCard } from "@/components/shared/SectionCard";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { FormFooter } from "@/components/shared/FormFooter";
import { PaletteEditor } from "./PaletteEditor";
import { EntourageEditor } from "./EntourageEditor";
import { useToast } from "@/components/shared/ToastProvider";
import { weddingConfig as initialConfig } from "@/lib/config";
import type { EventInfo } from "@/types";

type WeddingDraft = {
  coupleName: string;
  weddingDate: string;
  hashtag: string;
  photoAlbumUrl: string;
  ceremony: EventInfo;
  reception: EventInfo;
  dressCode: { description: string; palette: { name: string; hex: string }[] };
  entourage: { role: string; members: string[] }[];
};

interface WeddingSettingsFormProps {
  initial?: WeddingDraft;
  onSave?: (next: WeddingDraft) => void;
}

interface AccessEntry {
  email: string;
}

export function WeddingSettingsForm({
  initial,
  onSave,
}: WeddingSettingsFormProps) {
  const seed: WeddingDraft = initial ?? {
    coupleName: initialConfig.coupleName,
    weddingDate: initialConfig.weddingDate,
    hashtag: initialConfig.hashtag,
    photoAlbumUrl: initialConfig.photoAlbumUrl,
    ceremony: initialConfig.ceremony,
    reception: initialConfig.reception,
    dressCode: initialConfig.dressCode,
    entourage: initialConfig.entourage,
  };

  const [draft, setDraft] = React.useState<WeddingDraft>(seed);
  const [saved, setSaved] = React.useState<WeddingDraft>(seed);
  const [access, setAccess] = React.useState<AccessEntry[]>([
    { email: "dksandimas.projects@gmail.com" },
  ]);
  const [accessDraft, setAccessDraft] = React.useState<AccessEntry[]>(access);
  const [newEmail, setNewEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [accessSaving, setAccessSaving] = React.useState(false);

  const { showToast } = useToast();

  const isDirty = React.useMemo(() => {
    return JSON.stringify(draft) !== JSON.stringify(saved);
  }, [draft, saved]);

  const update = <K extends keyof WeddingDraft>(
    key: K,
    value: WeddingDraft[K]
  ) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const updateEvent = (
    which: "ceremony" | "reception",
    patch: Partial<EventInfo>
  ) => {
    setDraft((d) => ({ ...d, [which]: { ...d[which], ...patch } }));
  };

  const handleSave = () => {
    onSave?.(draft);
    setSaved(draft);
    showToast({
      message: "Settings saved. Your live site is updated.",
      variant: "success",
    });
  };

  const handleReset = () => {
    setDraft(saved);
  };

  const addAccessEmail = () => {
    setEmailError(null);
    const v = newEmail.trim();
    if (!v) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    if (accessDraft.some((a) => a.email.toLowerCase() === v.toLowerCase())) {
      setEmailError("This email is already in the list.");
      return;
    }
    setAccessDraft([...accessDraft, { email: v }]);
    setNewEmail("");
  };

  const removeAccessEmail = (idx: number) => {
    setAccessDraft((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSaveAccess = () => {
    if (accessDraft.length === 0) {
      showToast({
        message: "At least one email is required.",
        variant: "error",
      });
      return;
    }
    setAccessSaving(true);
    setTimeout(() => {
      setAccess(accessDraft);
      setAccessSaving(false);
      showToast({
        message: "Access list updated.",
        variant: "success",
      });
    }, 300);
  };

  return (
    <div>
      <div className="space-y-6">
        <SectionCard heading="The Couple">
          <div className="space-y-4">
            <FormField
              label="Couple Name"
              required
              htmlFor="coupleName"
              hint="Displayed as the main heading on your wedding site."
            >
              <Input
                id="coupleName"
                value={draft.coupleName}
                onChange={(v) => update("coupleName", v)}
                placeholder="e.g. Bretch & Joyce"
              />
            </FormField>
            <FormField label="Wedding Date" required htmlFor="weddingDate">
              <Input
                id="weddingDate"
                type="date"
                value={draft.weddingDate}
                onChange={(v) => update("weddingDate", v)}
              />
            </FormField>
            <FormField label="Hashtag" htmlFor="hashtag">
              <Input
                id="hashtag"
                value={draft.hashtag}
                onChange={(v) => update("hashtag", v.slice(0, 80))}
                placeholder="e.g. #ourwedding"
              />
            </FormField>
          </div>
        </SectionCard>

        <SectionCard heading="Ceremony">
          <div className="space-y-4">
            <FormField label="Time" required htmlFor="ceremony-time">
              <Input
                id="ceremony-time"
                value={draft.ceremony.time}
                onChange={(v) => updateEvent("ceremony", { time: v })}
                placeholder="e.g. 3:00 PM"
              />
            </FormField>
            <FormField label="Venue Name" required htmlFor="ceremony-venue">
              <Input
                id="ceremony-venue"
                value={draft.ceremony.venue}
                onChange={(v) => updateEvent("ceremony", { venue: v })}
                placeholder="e.g. St. John the Baptist Parish"
              />
            </FormField>
            <FormField label="Address" required htmlFor="ceremony-address">
              <Input
                id="ceremony-address"
                value={draft.ceremony.address}
                onChange={(v) => updateEvent("ceremony", { address: v })}
                placeholder="Full address"
              />
            </FormField>
            <FormField label="Google Maps URL" htmlFor="ceremony-maps">
              <Input
                id="ceremony-maps"
                type="url"
                value={draft.ceremony.mapsUrl}
                onChange={(v) => updateEvent("ceremony", { mapsUrl: v })}
                placeholder="https://maps.google.com/..."
              />
            </FormField>
          </div>
        </SectionCard>

        <SectionCard heading="Reception">
          <div className="space-y-4">
            <FormField label="Time" required htmlFor="reception-time">
              <Input
                id="reception-time"
                value={draft.reception.time}
                onChange={(v) => updateEvent("reception", { time: v })}
                placeholder="e.g. 6:00 PM"
              />
            </FormField>
            <FormField label="Venue Name" required htmlFor="reception-venue">
              <Input
                id="reception-venue"
                value={draft.reception.venue}
                onChange={(v) => updateEvent("reception", { venue: v })}
                placeholder="e.g. The Garden Pavilion"
              />
            </FormField>
            <FormField label="Address" required htmlFor="reception-address">
              <Input
                id="reception-address"
                value={draft.reception.address}
                onChange={(v) => updateEvent("reception", { address: v })}
                placeholder="Full address"
              />
            </FormField>
            <FormField label="Google Maps URL" htmlFor="reception-maps">
              <Input
                id="reception-maps"
                type="url"
                value={draft.reception.mapsUrl}
                onChange={(v) => updateEvent("reception", { mapsUrl: v })}
                placeholder="https://maps.google.com/..."
              />
            </FormField>
          </div>
        </SectionCard>

        <SectionCard heading="Dress Code">
          <div className="space-y-6">
            <FormField
              label="Description"
              htmlFor="dressCode-description"
              hint="Optional. One short line about the formality."
            >
              <Input
                id="dressCode-description"
                value={draft.dressCode.description}
                onChange={(v) =>
                  update("dressCode", {
                    ...draft.dressCode,
                    description: v.slice(0, 100),
                  })
                }
                placeholder="e.g. Semi-formal / Garden Party"
              />
            </FormField>
            <div>
              <label className="block text-xs uppercase tracking-wide text-warm-grey mb-2">
                Color Palette
              </label>
              <PaletteEditor
                value={draft.dressCode.palette}
                onChange={(palette) =>
                  update("dressCode", { ...draft.dressCode, palette })
                }
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard heading="Photo Album">
          <div className="space-y-3">
            <FormField
              label="Shared Album URL"
              htmlFor="photoAlbum"
              hint="Guests will see a QR code linking to this album on your wedding site."
            >
              <Input
                id="photoAlbum"
                type="url"
                value={draft.photoAlbumUrl}
                onChange={(v) => update("photoAlbumUrl", v)}
                placeholder="https://photos.app.goo.gl/..."
              />
            </FormField>
            {draft.photoAlbumUrl ? (
              <div className="flex items-center gap-4 pt-2">
                <div className="w-20 h-20 bg-white border border-stone rounded-md p-1 flex-shrink-0">
                  <QRCode
                    value={draft.photoAlbumUrl}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  />
                </div>
                <a
                  href={draft.photoAlbumUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest text-sm hover:underline"
                >
                  Open album ↗
                </a>
              </div>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard heading="Entourage">
          <EntourageEditor
            value={draft.entourage}
            onChange={(entourage) => update("entourage", entourage)}
          />
        </SectionCard>
      </div>

      <FormFooter
        onSave={handleSave}
        onReset={handleReset}
        isDirty={isDirty}
      />

      <div className="mt-10">
        <SectionCard heading="Team Access">
          <p className="text-sm text-warm-grey mb-4">
            Only these email addresses can sign in to this dashboard.
          </p>
          <ul className="space-y-2 mb-4">
            {accessDraft.length === 0 ? (
              <li className="text-sm text-error py-2 border-b border-stone">
                ⚠ At least one email is required to maintain dashboard access.
              </li>
            ) : (
              accessDraft.map((entry, idx) => (
                <li
                  key={`${entry.email}-${idx}`}
                  className="flex items-center justify-between py-2 border-b border-stone"
                >
                  <span className="text-sm text-charcoal">{entry.email}</span>
                  <button
                    type="button"
                    onClick={() => removeAccessEmail(idx)}
                    aria-label={`Remove ${entry.email}`}
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center text-warm-grey hover:text-error"
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
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </li>
              ))
            )}
          </ul>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              id="newEmail"
              type="email"
              value={newEmail}
              onChange={(v) => {
                setNewEmail(v);
                setEmailError(null);
              }}
              placeholder="email@example.com"
              error={emailError ?? undefined}
              className="flex-1"
            />
            <Button variant="ghost" onClick={addAccessEmail}>
              + Add
            </Button>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveAccess}
              loading={accessSaving}
            >
              Save Access List
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
