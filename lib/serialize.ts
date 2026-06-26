import type { Guest, WeddingDoc } from "@/types";

/**
 * Convert Firestore Timestamps to plain ISO strings so the object is
 * safely serializable from a Server Component to a Client Component
 * (Next.js can't pass objects with toJSON methods across the boundary).
 *
 * Only Timestamp fields are converted; everything else is passed through.
 */
function toISO(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string") return value;
  if (
    typeof value === "object" &&
    "toDate" in (value as { toDate?: () => Date }) &&
    typeof (value as { toDate?: () => Date }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }
  return null;
}

export interface SerializedWedding {
  ownerId: string;
  coupleName: string;
  weddingDate: string;
  hashtag: string;
  couplePhotoUrl?: string;
  photoAlbumUrl: string;
  ceremony: WeddingDoc["ceremony"];
  reception: WeddingDoc["reception"];
  dressCode: WeddingDoc["dressCode"];
  entourage: WeddingDoc["entourage"];
  createdAt: string | null;
  updatedAt: string | null;
}

export function serializeWedding(
  wedding: WeddingDoc | null
): SerializedWedding | null {
  if (!wedding) return null;
  return {
    ...wedding,
    createdAt: toISO(wedding.createdAt),
    updatedAt: toISO(wedding.updatedAt),
  };
}

export interface SerializedGuest {
  id: string;
  token: string;
  firstName: string;
  lastName: string;
  pax: number;
  role: Guest["role"];
  subRole?: string;
  rsvpCount: number | null;
  rsvpSubmittedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export function serializeGuest(guest: Guest): SerializedGuest {
  return {
    id: guest.id,
    token: guest.token,
    firstName: guest.firstName,
    lastName: guest.lastName,
    pax: guest.pax,
    role: guest.role,
    subRole: guest.subRole,
    rsvpCount: guest.rsvpCount,
    rsvpSubmittedAt: toISO(guest.rsvpSubmittedAt),
    createdAt: toISO(guest.createdAt),
    updatedAt: toISO(guest.updatedAt),
  };
}

export function serializeGuests(guests: Guest[]): SerializedGuest[] {
  return guests.map(serializeGuest);
}
