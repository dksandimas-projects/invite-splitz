# invite-splitz — Gotchas & Common Traps

> **Agent note:** This file documents non-obvious constraints, easy mistakes, and known edge cases
> specific to this codebase. Read before building any component, screen, or API route.
> These are things that are either counter-intuitive or that have caused bugs before.

---

## Firebase / Firestore

### G-001 — `private/access` is a subcollection document, not a field

`weddings/{weddingId}/private/access` is a **Firestore document** inside a subcollection named `private`. The document ID is literally `"access"`.

```
weddings/
  bretch-joyce/
    private/          ← subcollection
      access          ← document (not a field!)
        authorizedEmails: [...]
```

Do not try to read it as `doc.private.access`. Use:
```ts
const ref = doc(db, "weddings", weddingId, "private", "access")
```

---

### G-002 — `isOwner()` in Firestore rules costs an extra read

The `isOwner()` function in `firestore.rules` calls `get()` to fetch the wedding doc and check `ownerId`. This means every write to the wedding doc or guests subcollection costs an additional Firestore read for the rule evaluation.

This is intentional and acceptable at this scale. Do not try to "optimize" it by removing the `isOwner()` check — that would open up write access to any authenticated user.

---

### G-003 — Public `get` on guests is intentional, `list` is not

```
allow get: if true;    // guests can fetch their own doc by ID
allow list: if isOwner(weddingId);  // only dashboard can enumerate all guests
```

The `get` permission is intentional — the invite URL `?guest=<token>` relies on the app fetching a guest doc without any auth. The `list` permission is locked down — guests must not be able to enumerate other guests. Never swap these accidentally.

---

### G-004 — RSVP write rule enforces `null → count` only (one-time)

The Firestore rule for guest RSVP updates requires `resource.data.rsvpCount == null`. This means the guest can only write once — if they've already submitted, the rule blocks the update. The `submitRSVP()` helper also checks this in code, but the rule is the true enforcement layer. Do not remove `resource.data.rsvpCount == null` from the rule.

---

### G-005 — `ownerId` and `createdAt` must never be sent in config updates

`updateWeddingConfig()` accepts `WeddingConfigUpdate` which explicitly excludes `ownerId` and `createdAt`. If you ever bypass this type and send those fields, they will be overwritten in Firestore. The `isOwner()` rule does not protect fields within a document — it only gates write access to the doc as a whole.

---

### G-006 — Guest token is immutable after creation

`GuestDoc.token` is generated once via `nanoid(12)` in `createGuest()` and never changed. The invite URL `?guest=<token>` is what guests receive. If a token were regenerated, the guest's existing link would break.

**Never include `token` in `updateGuest()`.** The type `Partial<Pick<GuestDoc, "firstName" | "lastName" | "pax" | "role">>` enforces this.

---

### G-007 — `weddingId` is an env var, not a runtime value

`NEXT_PUBLIC_WEDDING_ID` is read once at module load time at the top of `/lib/firestore.ts`. It does not change at runtime. Do not read it inline in component files — always go through the Firestore helpers or `dashboardHref()`.

If `NEXT_PUBLIC_WEDDING_ID` is undefined (missing `.env.local`), Firestore calls will silently fail or target `undefined` as the document path. Confirm the env var is set early.

---

## Auth

### G-008 — `AuthGuard` shows sign-in inline — it is NOT a redirect

`AuthGuard` renders the Sign-In screen as its own output when `user === null`. It does NOT call `router.push('/login')` or `redirect()`. This means:

- There is no `/login` route
- The URL does not change when signed out
- No flash of the dashboard before auth check — the guard shows a spinner, then the sign-in form

Do not add a redirect. The current pattern prevents a FOUC (flash of unauthenticated content) because the dashboard route is only rendered once auth state is confirmed.

---

### G-009 — `AuthGuard` makes a Firestore read on every sign-in

After `onAuthStateChanged` fires with a non-null user, `AuthGuard` calls `getAuthorizedEmails()` before rendering the dashboard. This is a Firestore read every time the session is established (page load or sign-in).

If the `private/access` doc hasn't been seeded yet, `getAuthorizedEmails()` will return an empty array and every signed-in user will be denied access. Seed the doc first (Phase 2 of `roadmap.md`).

---

### G-010 — Email/password accounts must be created manually

There is no self-signup. DK creates email/password accounts via Firebase Console → Authentication → Users → Add user. If you try to call `createUserWithEmailAndPassword()` in code, remove it — it is not part of this codebase.

---

## Frontend / UI

### G-011 — iOS Safari zooms on inputs smaller than 16px

Any `<input>`, `<textarea>`, or `<select>` with a font-size below 16px triggers iOS Safari's auto-zoom behavior, which pans the viewport in a jarring way. All inputs must use `text-base` (16px) minimum. Do not override with `text-sm` on any input element.

---

### G-012 — Touch targets must be 44×44px minimum

Apple's HIG and general accessibility guidelines require interactive elements to have a minimum tap target of 44×44px. Always apply `min-h-[44px] min-w-[44px]` to buttons, remove icons, and any clickable element that isn't full-width. This is particularly important for the palette editor remove buttons and entourage editor remove buttons.

---

### G-013 — No hardcoded `weddingId` in components or pages

Never write `/dashboard/bretch-joyce/guests` in a component. Always use:
```ts
import { dashboardHref } from "@/lib/nav"
dashboardHref("/guests")  // → /dashboard/bretch-joyce/guests
```

If `weddingId` is hardcoded and the env var changes (new client), every link breaks. `dashboardHref()` reads from `NEXT_PUBLIC_WEDDING_ID` so there's one source of truth.

---

### G-014 — No raw Tailwind in page files or screen components

Raw Tailwind in page files (`/app/...`) or screen-level components creates visual drift across screens and makes theme changes expensive. This is a hard rule enforced in Phase 1 acceptance criteria. Grep for violations:

```bash
grep -r "rounded-full\|bg-\[#\|shadow-sm\|<button className" app/
```

If found, extract to the appropriate shared component.

---

### G-015 — `pax` minimum is 1, never 0

`GuestDoc.pax` represents the number of seats allocated to the guest's invite. A pax of 0 is nonsensical — it would mean a guest was invited but given no seats. The minimum is 1. Validate this in the Add/Edit Guest form: `pax` input should have `min={1}`.

---

### G-016 — `rsvpCount: null` is NOT a decline

`null` means the guest has not responded yet. `0` means they declined. This distinction matters for the RSVP summary counts on the dashboard:

| Value | Meaning |
|---|---|
| `null` | No response (pending) |
| `0` | Declined |
| `1..pax` | Confirmed attending |

Do not treat `null` and `0` as equivalent when computing summary stats.

---

### G-017 — Team Access has its own Save button

The Wedding Settings page has **two** save actions:
1. The main `[Save Changes]` button in the sticky footer — saves `WeddingDoc` fields via `updateWeddingConfig()`
2. The `[Save Access List]` button inside the Team Access card — saves `authorizedEmails` via `updateAuthorizedEmails()`

These are separate Firestore writes to separate documents. The Team Access save must NOT be triggered by the main Save button, and vice versa.

---

### G-018 — Entourage members are split by newline at save time

The `EntourageEditor` uses a `<textarea>` for members (one per line). At save time, split by `\n`, trim each line, and filter out empty strings before writing to Firestore. Do not store the raw textarea string.

```ts
members: textarea.value.split("\n").map(s => s.trim()).filter(Boolean)
```

---

### G-019 — `isDirty` guard only applies to the main form, not Team Access

The unsaved changes guard (`isDirty`) tracks whether any main settings fields differ from last-saved state. Team Access has its own isolated state. Navigating away with an unsaved Team Access edit does NOT trigger the `isDirty` guard — that's acceptable behavior. The two sections are intentionally decoupled.

---

## Deployment / Config

### G-020 — All `NEXT_PUBLIC_` vars are exposed to the browser

Firebase config values (`NEXT_PUBLIC_FIREBASE_*`) are intentionally public — this is how Firebase client SDKs work. Firestore security rules are the actual security layer. Do not be alarmed that these values are visible in the browser; that is expected and by design.

---

### G-021 — Missing `NEXT_PUBLIC_BASE_URL` breaks invite link generation

`buildInviteUrl(token)` in `/lib/tokens.ts` uses `NEXT_PUBLIC_BASE_URL` to construct the full URL: `${BASE_URL}/?guest=${token}`. If this var is missing, invite links will be malformed (relative paths or `undefined`). Verify it is set in both `.env.local` and the Vercel environment.

---

### G-022 — Vercel domain must be in Firebase Authorized Domains

If the Vercel preview URL or production domain is not in Firebase Console → Authentication → Settings → Authorized Domains, Google Sign-in will silently fail with an `auth/unauthorized-domain` error. Add the domain before testing auth on any new deployment.
