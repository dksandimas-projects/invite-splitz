# invite-splitz — Invite Link System

> **Agent note:** This file covers token generation, URL structure, guest resolution,
> and all edge cases for the invite link system.
> Read `overview.md` and `backend.md` first.

---

## URL Format

```
https://bretchandjoyce.vercel.app/?guest=<token>
```

- `token` is a 12-character URL-safe random string (nanoid)
- The token is the only identifier passed in the URL — no guest name, no ID, no email
- The token never changes after assignment

---

## Token Generation

**File:** `/lib/tokens.ts`

```ts
import { nanoid } from "nanoid"

/**
 * Generates a URL-safe token for a guest invite link.
 * 12 characters = ~71 bits of entropy — sufficient for this use case.
 * Not a security-critical secret; it's a convenience identifier.
 */
export function generateToken(): string {
  return nanoid(12)
}

/**
 * Builds the full invite URL for a guest.
 */
export function buildInviteUrl(token: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"
  return `${base}/?guest=${token}`
}
```

**Why nanoid(12):**
- 12 chars at 64-symbol alphabet = ~71 bits of entropy
- Collision probability with 10,000 guests: negligible (~10⁻¹⁶)
- Short enough to be copy-pasteable; long enough to be unguessable

**Do not use:**
- Sequential IDs (guessable)
- UUID v4 (too long for a URL param, though functionally fine)
- Guest name or email in the URL (privacy)

---

## Token Assignment

- Token is generated at guest creation time in `createGuest()` (see `backend.md`)
- Token is stored in the `token` field of the guest doc
- Token is **never regenerated** after creation — changing it breaks existing links
- If a guest doc is deleted and re-added, a new token is generated (old link breaks — expected)

---

## Guest Resolution Flow

On page load at `/?guest=<token>`:

```
1. Read `?guest` param from URL
2. If param is absent or empty → skip Firestore call, render with guest = null
3. If param is present → call getGuestByToken(token)
4. If Firestore returns null (no matching doc) → render with guest = null (invalid token)
5. If Firestore returns a GuestDoc → render with guest = GuestDoc
```

**Implementation in `/app/page.tsx` (Server Component):**

```ts
import { getGuestByToken } from "@/lib/firestore"

export default async function HomePage({
  searchParams,
}: {
  searchParams: { guest?: string }
}) {
  const token = searchParams.guest ?? null
  const guest = token ? await getGuestByToken(token) : null

  return (
    <main>
      <HeroSection ... />
      <GreetingSection guestName={guest?.firstName ?? null} />
      {guest && (
        <RSVPSection
          token={token!}
          pax={guest.pax}
          existingRsvpCount={guest.rsvpCount}
        />
      )}
      {/* other sections */}
    </main>
  )
}
```

**Cost:** 1 Firestore read per page load (when token is present). Acceptable.

---

## Invite Link Display in Dashboard

The guest table includes an **Invite Link** column with:
- Truncated URL display: `.../?guest=abc123`
- **Copy** button: copies `buildInviteUrl(guest.token)` to clipboard
- On copy success: button briefly shows "Copied!" then reverts

**Do not display the raw token** — always show the full URL so it's immediately shareable.

---

## Edge Cases

| Scenario | Expected behavior |
|---|---|
| No `?guest` param in URL | Site renders normally, no personalization, no RSVP section |
| Token exists but no matching Firestore doc | Treat as no token — generic site, no RSVP section |
| Token is valid but guest was deleted | Same as above — `getGuestByToken` returns null |
| Token contains special characters | `nanoid` only produces URL-safe chars — this should not occur. If it does, URL parsing handles it |
| Guest shares their link with someone else | The site renders with their name and pax. This is acceptable — we do not verify identity |
| Two requests come in simultaneously for the same token | Firestore handles concurrent reads safely — both see the same guest doc |

---

## Security Notes

- The token is **not a secret in the cryptographic sense** — it's a convenience link, not auth
- Anyone with the link can view the guest's name and RSVP on their behalf
- This is acceptable for a wedding invite context — treat it like a paper invitation
- Do not log tokens in server-side logs or analytics

---

## Acceptance Criteria

- [ ] Every guest doc has a non-null, unique `token` after creation
- [ ] `buildInviteUrl(token)` returns a correct, absolute URL using `NEXT_PUBLIC_BASE_URL`
- [ ] `/?guest=<valid-token>` renders with guest's first name in greeting
- [ ] `/?guest=<invalid-token>` renders generic site without error
- [ ] `/?` (no guest param) renders generic site without error
- [ ] No Firestore call is made when token is absent
- [ ] Dashboard copy button copies the full invite URL to clipboard
- [ ] Tokens survive page refreshes and do not regenerate on re-render
