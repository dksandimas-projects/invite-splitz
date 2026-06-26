# invite-splitz — Backend & Data Model

> **Agent note:** This file defines the Firestore schema, TypeScript types, security rules,
> and Firestore helper functions. Read `overview.md` first.

---

## Firestore Collections

```
firestore
└── weddings/
    └── {weddingId}/                  ← one doc per wedding (this deploy = one wedding)
        ├── (fields: wedding config)
        ├── private/
        │   └── access                ← authorized dashboard emails; private, auth-gated
        └── guests/
            └── {guestId}/            ← one doc per guest
                └── (fields: guest data)
```

**Convention:** Read `weddingId` from `process.env.NEXT_PUBLIC_WEDDING_ID` (e.g. `"bretch-joyce"`). Store it as a constant at the top of `/lib/firestore.ts`. Do not hardcode it inline — reading from env makes it trivial to change per deployment and future-proofs for multi-tenant.

---

## Document Schemas

### `weddings/{weddingId}`

Stores all wedding configuration. Editable by the couple via the Wedding Settings screen in the dashboard. Read by the guest site on every page load.

```ts
interface WeddingDoc {
  ownerId: string              // Firebase Auth UID of the couple's account (set on creation, never changed)
  coupleName: string           // "Bretch & Joyce"
  weddingDate: string          // ISO date "2026-08-01"
  hashtag: string
  photoAlbumUrl: string
  ceremony: {
    time: string
    venue: string
    address: string
    mapsUrl: string
  }
  reception: {
    time: string
    venue: string
    address: string
    mapsUrl: string
  }
  dressCode: {
    description: string
    palette: Array<{ name: string; hex: string }>
  }
  entourage: Array<{
    role: string
    members: string[]
  }>
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**`ownerId` rules:**
- Set to `auth.currentUser.uid` when DK seeds the wedding doc
- Never changed after creation
- Used by Firestore security rules to scope write access — only the owner can update the wedding doc or manage guests
- In single-tenant mode, this is DK's UID (and/or the couple's UID if they are given a Firebase account)

---

### `weddings/{weddingId}/private/access`

Stores the list of emails authorized to access the dashboard. Never exposed publicly — Firestore rules require authentication to read.

```ts
interface AccessDoc {
  authorizedEmails: string[]   // ["bride@gmail.com", "groom@gmail.com", "dk@gmail.com"]
}
```

**Rules:**
- Any authenticated Firebase user can **read** this doc (needed so `AuthGuard` can check the list after sign-in)
- Only the wedding owner (`ownerId`) can **write** this doc
- `authorizedEmails` is managed from the Wedding Settings → Team Access section in the dashboard
- DK sets the initial list when seeding the wedding doc (see `roadmap.md` Phase 2)

---

### `weddings/{weddingId}/guests/{guestId}`

One document per invited guest or group.

```ts
interface GuestDoc {
  id: string                   // same as Firestore document ID
  token: string                // nanoid(12) — used in invite URL ?guest=<token>
  firstName: string
  lastName: string
  pax: number                  // total seats allocated to this invite (min: 1)
  role: GuestRole
  rsvpCount: number | null     // null = no response, 0 = declined, 1..pax = confirmed count
  rsvpSubmittedAt: Timestamp | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

type GuestRole =
  | "Principal Sponsor"
  | "Secondary Sponsor"
  | "Entourage"
  | "Guest"
```

**Field rules:**
- `token` — generated on create, never changed after assignment
- `pax` — minimum value is 1; no upper limit enforced in schema (business logic caps it)
- `rsvpCount` — only writable by the guest (via token); only resettable by authenticated user
- `rsvpSubmittedAt` — set server-side when `rsvpCount` is first written

---

## TypeScript Types

**File:** `/types/index.ts`

```ts
import { Timestamp } from "firebase/firestore"

export type GuestRole =
  | "Principal Sponsor"
  | "Secondary Sponsor"
  | "Entourage"
  | "Guest"

export interface GuestDoc {
  id: string
  token: string
  firstName: string
  lastName: string
  pax: number
  role: GuestRole
  rsvpCount: number | null
  rsvpSubmittedAt: Timestamp | null
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ColorSwatch {
  name: string
  hex: string
}

export interface EntourageGroup {
  role: string
  members: string[]
}

export interface EventInfo {
  time: string
  venue: string
  address: string
  mapsUrl: string
}

export interface WeddingDoc {
  ownerId: string              // Firebase Auth UID — used by security rules
  coupleName: string
  weddingDate: string
  hashtag: string
  photoAlbumUrl: string
  ceremony: EventInfo
  reception: EventInfo
  dressCode: {
    description: string
    palette: ColorSwatch[]
  }
  entourage: EntourageGroup[]
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface AccessDoc {
  authorizedEmails: string[]
}

export type WeddingConfigUpdate = Partial<Pick<WeddingDoc,
  | "coupleName"
  | "weddingDate"
  | "hashtag"
  | "photoAlbumUrl"
  | "ceremony"
  | "reception"
  | "dressCode"
  | "entourage"
>>
```

---

## Firestore Helpers

**File:** `/lib/firestore.ts`

Implement the following exported functions. All functions are async and throw on Firestore errors (do not swallow exceptions).

```ts
// Wedding
export async function getWedding(): Promise<WeddingDoc | null>
export async function updateWeddingConfig(data: WeddingConfigUpdate): Promise<void>

// Access control
export async function getAuthorizedEmails(): Promise<string[]>
export async function updateAuthorizedEmails(emails: string[]): Promise<void>

// Guests (public — used by guest site)
export async function getGuestByToken(token: string): Promise<GuestDoc | null>

// Guests (authenticated — used by dashboard)
export async function listGuests(): Promise<GuestDoc[]>
export async function createGuest(data: Omit<GuestDoc, "id" | "token" | "rsvpCount" | "rsvpSubmittedAt" | "createdAt" | "updatedAt">): Promise<GuestDoc>
export async function updateGuest(id: string, data: Partial<Pick<GuestDoc, "firstName" | "lastName" | "pax" | "role">>): Promise<void>
export async function deleteGuest(id: string): Promise<void>
export async function resetRSVP(id: string): Promise<void>

// RSVP (public — used by RSVP API route, validated server-side)
export async function submitRSVP(token: string, count: number): Promise<void>
```

**`createGuest` implementation notes:**
- Generate `token` via `generateToken()` from `/lib/tokens.ts`
- Set `rsvpCount: null`, `rsvpSubmittedAt: null`
- Set `createdAt` and `updatedAt` to `serverTimestamp()`

**`submitRSVP` implementation notes:**
- Look up guest by `token`
- If guest not found: throw `Error("GUEST_NOT_FOUND")`
- If `rsvpCount` is already non-null: throw `Error("ALREADY_RESPONDED")`
- If `count < 0` or `count > guest.pax`: throw `Error("INVALID_COUNT")`
- Write `rsvpCount` and `rsvpSubmittedAt: serverTimestamp()`

---

## Firestore Security Rules

**File:** `firestore.rules`

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper: check if the authenticated user owns this wedding
    function isOwner(weddingId) {
      return request.auth != null &&
        request.auth.uid == get(/databases/$(database)/documents/weddings/$(weddingId)).data.ownerId;
    }

    // Wedding config — public read, owner-only write
    match /weddings/{weddingId} {
      allow read: if true;
      allow write: if isOwner(weddingId);
    }

    // Private subcollection — authenticated read, owner-only write
    // Any signed-in user can read (needed for AuthGuard email check after sign-in)
    // Only the owner can update the authorized emails list
    match /weddings/{weddingId}/private/{docId} {
      allow read: if request.auth != null;
      allow write: if isOwner(weddingId);
    }

    // Guest records
    match /weddings/{weddingId}/guests/{guestId} {

      // Public: read a single guest by token only (not list)
      allow get: if true;
      allow list: if isOwner(weddingId);

      // Public: submit RSVP — only rsvpCount and rsvpSubmittedAt fields,
      // only if rsvpCount is currently null (first submission only)
      allow update: if
        request.auth == null &&
        request.resource.data.diff(resource.data).affectedKeys()
          .hasOnly(["rsvpCount", "rsvpSubmittedAt"]) &&
        resource.data.rsvpCount == null &&
        request.resource.data.rsvpCount is int &&
        request.resource.data.rsvpCount >= 0 &&
        request.resource.data.rsvpCount <= resource.data.pax;

      // Owner: full read/write (dashboard)
      allow read, write: if isOwner(weddingId);
    }
  }
}
```

**Security notes:**
- `isOwner()` checks `request.auth.uid === wedding.ownerId` — this is the key multi-tenant-ready rule. Adding a second wedding just means a different `ownerId`; no rule changes needed.
- Public `get` on guests is intentional — the URL token acts as a shared secret
- Public `list` is blocked — guests cannot enumerate other guests
- The RSVP update rule enforces server-side that `rsvpCount` is only written once and within bounds
- `updateWeddingConfig()` must never update `ownerId`, `createdAt` — the `WeddingConfigUpdate` type enforces this

---

## Indexes

No composite indexes required beyond Firestore defaults for this schema.
If a dashboard "filter by role" feature is added later, add an index on `(role, createdAt)`.
