"use client";

import * as React from "react";
import QRCode from "react-qr-code";
import { SectionCard } from "@/components/shared/SectionCard";
import { FormField } from "@/components/shared/FormField";
import { Input } from "@/components/shared/Input";
import { Button } from "@/components/shared/Button";
import { FormFooter } from "@/components/shared/FormFooter";
import { PaletteEditor } from "./PaletteEditor";
import { useToast } from "@/components/shared/ToastProvider";
import { weddingConfig as fallbackConfig } from "@/lib/config";
import {
  updateAuthorizedEmails,
  updateWeddingConfig,
} from "@/lib/firestore";
import type { EventInfo } from "@/types";
import type { SerializedWedding } from "@/lib/serialize";

type WeddingDraft = {
  coupleName: string;
  weddingDate: string;
  hashtag: string;
  couplePhotoUrl: string;
  photoAlbumUrl: string;
  ceremony: EventInfo;
  reception: EventInfo;
  dressCode: { description: string; palette: { name: string; hex: string }[] };
  entourage: { role: string; members: string[] }[];
};

interface WeddingSettingsFormProps {
  wedding: SerializedWedding | null;
  initialAccessEmails: string[];
}

function toDraft(wedding: SerializedWedding | null): WeddingDraft {
  if (wedding) {
    return {
      coupleName: wedding.coupleName,
      weddingDate: wedding.weddingDate,
      hashtag: wedding.hashtag,
      couplePhotoUrl: wedding.couplePhotoUrl ?? "",
      photoAlbumUrl: wedding.photoAlbumUrl,
      ceremony: wedding.ceremony,
      reception: wedding.reception,
      dressCode: wedding.dressCode,
      entourage: wedding.entourage,
    };
  }
  return {
    coupleName: fallbackConfig.coupleName,
    weddingDate: fallbackConfig.weddingDate,
    hashtag: fallbackConfig.hashtag,
    couplePhotoUrl: "",
    photoAlbumUrl: fallbackConfig.photoAlbumUrl,
    ceremony: fallbackConfig.ceremony,
    reception: fallbackConfig.reception,
    dressCode: fallbackConfig.dressCode,
    entourage: fallbackConfig.entourage,
  };
}

export function WeddingSettingsForm({
  wedding,
  initialAccessEmails,
}: WeddingSettingsFormProps) {
  const initialDraft = React.useMemo(() => toDraft(wedding), [wedding]);
  const initialAccess = React.useMemo(
    () => initialAccessEmails.map((email) => ({ email })),
    [initialAccessEmails]
  );

  const [draft, setDraft] = React.useState<WeddingDraft>(initialDraft);
  const [saved, setSaved] = React.useState<WeddingDraft>(initialDraft);
  const [accessDraft, setAccessDraft] = React.useState(initialAccess);
  const [newEmail, setNewEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [accessSaving, setAccessSaving] = React.useState(false);

  // "Same venue" toggle: true when ceremony & reception share the same venue name
  const [sameVenue, setSameVenue] = React.useState(
    () =>
      initialDraft.ceremony.venue.trim().toLowerCase() ===
      initialDraft.reception.venue.trim().toLowerCase() &&
      initialDraft.ceremony.venue.trim() !== ""
  );

  const { showToast } = useToast();

  const isDirty = React.useMemo(() => {
    return JSON.stringify(draft) !== JSON.stringify(saved);
  }, [draft, saved]);

  const accessIsDirty = React.useMemo(() => {
    return JSON.stringify(accessDraft) !== JSON.stringify(initialAccess);
  }, [accessDraft, initialAccess]);

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

  const updateCeremony = (patch: Partial<EventInfo>) => {
    setDraft((d) => {
      const newCeremony = { ...d.ceremony, ...patch };
      // If same-venue is active, mirror venue/address/mapsUrl to reception too
      if (sameVenue) {
        return {
          ...d,
          ceremony: newCeremony,
          reception: {
            ...d.reception,
            venue: newCeremony.venue,
            address: newCeremony.address,
            mapsUrl: newCeremony.mapsUrl,
          },
        };
      }
      return { ...d, ceremony: newCeremony };
    });
  };

  const handleSameVenueToggle = (checked: boolean) => {
    setSameVenue(checked);
    if (checked) {
      // Mirror ceremony → reception immediately
      setDraft((d) => ({
        ...d,
        reception: {
          ...d.reception,
          venue: d.ceremony.venue,
          address: d.ceremony.address,
          mapsUrl: d.ceremony.mapsUrl,
        },
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateWeddingConfig(draft);
      setSaved(draft);
      showToast({
        message: "Settings saved. Your live site is updated.",
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      showToast({
        message: "Save failed. Please try again.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
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

  const handleSaveAccess = async () => {
    if (accessDraft.length === 0) {
      showToast({
        message: "At least one email is required.",
        variant: "error",
      });
      return;
    }
    setAccessSaving(true);
    try {
      const emails = accessDraft.map((a) => a.email);
      await updateAuthorizedEmails(emails);
      showToast({
        message: "Access list updated.",
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      showToast({
        message: "Failed to update access list. Please try again.",
        variant: "error",
      });
    } finally {
      setAccessSaving(false);
    }
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
            <FormField
              label="Couple Photo URL"
              htmlFor="couplePhotoUrl"
              hint="Paste a direct image URL (e.g. from Google Drive, Cloudinary, or Imgur). This appears as the background on the hero section of your invitation."
            >
              <Input
                id="couplePhotoUrl"
                type="url"
                value={draft.couplePhotoUrl}
                onChange={(v) => update("couplePhotoUrl", v)}
                placeholder="https://example.com/photo.jpg"
              />
            </FormField>
            {draft.couplePhotoUrl ? (
              <div className="flex items-start gap-4 pt-1">
                <div className="w-24 h-24 rounded-md overflow-hidden border border-stone flex-shrink-0 bg-stone-light/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={draft.couplePhotoUrl}
                    alt="Couple photo preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <p className="text-xs text-warm-grey leading-relaxed pt-1">
                  Preview. If the image doesn't appear, the URL may not be publicly accessible or may not allow cross-origin display.
                </p>
              </div>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard heading="Ceremony">
          <div className="space-y-4">
            <FormField label="Time" required htmlFor="ceremony-time">
              <Input
                id="ceremony-time"
                value={draft.ceremony.time}
                onChange={(v) => updateCeremony({ time: v })}
                placeholder="e.g. 3:00 PM"
              />
            </FormField>
            <FormField label="Venue Name" required htmlFor="ceremony-venue">
              <Input
                id="ceremony-venue"
                value={draft.ceremony.venue}
                onChange={(v) => updateCeremony({ venue: v })}
                placeholder="e.g. St. John the Baptist Parish"
              />
            </FormField>
            <FormField label="Address" required htmlFor="ceremony-address">
              <Input
                id="ceremony-address"
                value={draft.ceremony.address}
                onChange={(v) => updateCeremony({ address: v })}
                placeholder="Full address"
              />
            </FormField>
            <FormField label="Google Maps URL" htmlFor="ceremony-maps">
              <Input
                id="ceremony-maps"
                type="url"
                value={draft.ceremony.mapsUrl}
                onChange={(v) => updateCeremony({ mapsUrl: v })}
                placeholder="https://maps.google.com/..."
              />
            </FormField>
          </div>
        </SectionCard>

        <SectionCard heading="Reception">
          {/* Same-venue toggle */}
          <label className="flex items-center gap-3 mb-5 cursor-pointer select-none">
            <input
              id="same-venue-toggle"
              type="checkbox"
              checked={sameVenue}
              onChange={(e) => handleSameVenueToggle(e.target.checked)}
              className="w-4 h-4 accent-forest rounded cursor-pointer"
            />
            <span className="text-sm text-charcoal">
              Same venue as ceremony
            </span>
          </label>
          <div className="space-y-4">
            <FormField label="Time" required htmlFor="reception-time">
              <Input
                id="reception-time"
                value={draft.reception.time}
                onChange={(v) => updateEvent("reception", { time: v })}
                placeholder="e.g. 6:00 PM"
              />
            </FormField>
            {!sameVenue && (
              <>
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
              </>
            )}
            {sameVenue && (
              <p className="text-sm text-warm-grey italic">
                Venue, address, and map link will match the ceremony.
              </p>
            )}
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
                  className="text-forest text-sm font-medium hover:underline"
                >
                  Open album ↗
                </a>
              </div>
            ) : null}
          </div>
        </SectionCard>

        <SectionCard heading="Entourage">
          <p className="text-sm text-warm-grey mb-4">
            The entourage list is generated automatically based on your guest list roles. To add members, edit names, or assign roles, manage them in the{" "}
            <a
              href={`/dashboard/${process.env.NEXT_PUBLIC_WEDDING_ID || "bretch-joyce"}/guests`}
              className="text-forest font-semibold hover:underline"
            >
              Guests
            </a>{" "}
            tab. Drag the arrows to reorder groups as they appear on the invitation.
          </p>
          {draft.entourage.length === 0 ? (
            <div className="border border-dashed border-stone rounded-md p-6 text-center text-warm-grey text-sm">
              No entourage groups yet. Assign roles to guests to populate the entourage list.
            </div>
          ) : (
            <div className="space-y-2">
              {draft.entourage.map((group, idx) => (
                <div
                  key={`${group.role}-${idx}`}
                  className="flex items-start gap-2 bg-stone-light/30 rounded-md p-4"
                >
                  {/* Reorder buttons */}
                  <div className="flex flex-col gap-0.5 shrink-0 mt-0.5">
                    <button
                      type="button"
                      aria-label={`Move ${group.role} up`}
                      disabled={idx === 0}
                      onClick={() => {
                        if (idx === 0) return;
                        const next = [...draft.entourage];
                        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                        update("entourage", next);
                      }}
                      className="w-6 h-6 flex items-center justify-center rounded text-warm-grey hover:text-forest hover:bg-stone/40 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polyline points="18 15 12 9 6 15" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      aria-label={`Move ${group.role} down`}
                      disabled={idx === draft.entourage.length - 1}
                      onClick={() => {
                        if (idx === draft.entourage.length - 1) return;
                        const next = [...draft.entourage];
                        [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
                        update("entourage", next);
                      }}
                      className="w-6 h-6 flex items-center justify-center rounded text-warm-grey hover:text-forest hover:bg-stone/40 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                  </div>

                  {/* Group content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif font-medium text-forest text-base mb-2">
                      {group.role}
                    </h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {group.members.map((member, mIdx) => (
                        <li key={mIdx} className="text-sm text-charcoal font-light">
                          {member}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

      </div>

      <FormFooter
        onSave={handleSave}
        onReset={handleReset}
        isDirty={isDirty}
        saving={saving}
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
              disabled={accessSaving}
            />
            <Button
              variant="ghost"
              onClick={addAccessEmail}
              disabled={accessSaving}
            >
              + Add
            </Button>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveAccess}
              loading={accessSaving}
              disabled={!accessIsDirty}
            >
              Save Access List
            </Button>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
