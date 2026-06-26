# invite-splitz — Implementation Roadmap

> **Agent note:** This file defines the build order. Complete phases sequentially.
> Each phase lists its goal, tasks, files to create or modify, and acceptance criteria.
> Read `overview.md` before starting.

---

## Phase 0 — Project Setup

**Goal:** Runnable Next.js app connected to Firebase, deployed to Vercel.

### Tasks
- [ ] Init Next.js 14 app with App Router, TypeScript, Tailwind CSS
- [ ] Install dependencies: `firebase`, `nanoid`, `react-qr-code`, `papaparse`, `@types/papaparse`
- [ ] Create Firebase project, enable Firestore and Firebase Auth (Google provider)
- [ ] Add `.env.local` with all vars from `overview.md`
- [ ] Init Firebase client in `/lib/firebase.ts`
- [ ] Deploy to Vercel, confirm build passes

### Files
```
/lib/firebase.ts
/.env.local
/.env.example
/next.config.ts
```

### Acceptance criteria
- `npm run dev` starts without errors
- Firebase connection does not throw on cold start
- Vercel preview URL is live

---

## Phase 1 — Static Site (Wireframes to Live)

**Goal:** Every screen and component exists as a fully styled, pixel-accurate, non-functional static site. No Firestore reads, no auth, no API calls — just HTML and Tailwind. Client approves the look before any backend wiring begins.

**Prerequisite:** At least the guest site wireframe must be present in `/plan/stitch/` before this phase starts. Check that folder first.

### Reference files (read before coding)
- `/plan/stitch/README.md` — naming convention and how to read the wireframes
- `/plan/stitch/` — wireframe images; match each component to its wireframe file
- `/plan/design.md` — colors, typography, spacing for the guest site
- `/plan/design-dashboard.md` — colors and layout for the dashboard screens
- `/plan/design-settings.md` — Wedding Settings screen and sub-editors
- `/plan/components.md` — **read this first**; defines all shared components and the build order
- `/plan/frontend.md` — section list and component file paths

### Tasks

#### Step 0 — Shared Component Library (build first, before any screen)
- [ ] Create `/lib/tokens.ts` with all color, radius, and shadow constants
- [ ] Build all **Atom** components: `Button`, `Input`, `Textarea`, `Select`, `Badge`, `Spinner`, `Divider`, `ColorSwatch`
- [ ] Build all **Molecule** components: `FormField`, `Modal`, `Toast` + `useToast` hook + `ToastContainer`, `ConfirmDialog`, `Card`, `EmptyState`
- [ ] Build all **Organism** components: `TopNav`, `PageHeader`, `SectionCard`, `FormFooter`
- [ ] Mount `<ToastContainer />` in `/app/layout.tsx`
- [ ] Verify: render each component in isolation (no page required yet) and confirm it matches `design.md` specs

#### Guest Site
- [ ] Build layout shell in `/app/page.tsx` with all section components in order
- [ ] `HeroSection` — couple names, wedding date, placeholder countdown (`"00d 00h 00m 00s"`)
- [ ] `GreetingSection` — hardcoded guest name placeholder: `"You're invited, [Guest Name]!"`
- [ ] `NoPlusOneNotice` — static notice card
- [ ] `GiftNote` — static gift note card
- [ ] `RSVPSection` — static buttons only; no submission logic (buttons are visible but inert)
- [ ] `EntourageSection` — placeholder entourage list (3–5 dummy names per role group)
- [ ] `EventDetails` — placeholder venue names, times, and a disabled "Get Directions" link
- [ ] `DressCode` — all color swatches from `weddingConfig` rendered
- [ ] `PhotoQR` — placeholder QR code (static image or dummy URL)
- [ ] `BibleVerseFooter` — static verse and attribution
- [ ] Botanical decorative elements (SVG) placed in hero and footer

#### Dashboard Screens
- [ ] `/dashboard` — Sign-in screen (static, button does nothing)
- [ ] `/dashboard` — Access Denied screen (static)
- [ ] `/dashboard/[weddingId]` — Dashboard Home with placeholder summary stats (use dummy numbers for the static phase only — e.g. `Confirmed: 24 · Declined: 4 · Pending: 14`; these will be replaced with live Firestore data in Phase 6)
- [ ] `/dashboard/guests` — Guest List with 5–8 hardcoded dummy guest rows
- [ ] Add Guest modal — static form, open/close toggle only
- [ ] Edit Guest modal — static form, open/close toggle only
- [ ] Delete Guest dialog — static, open/close toggle only
- [ ] CSV Import modal — all 3 steps statically navigable (Next/Back buttons work, no real parsing)
- [ ] Reset RSVP dialog — static, open/close toggle only

### Files
```
/app/page.tsx
/app/dashboard/page.tsx
/app/dashboard/guests/page.tsx
/components/site/HeroSection.tsx
/components/site/GreetingSection.tsx
/components/site/NoPlusOneNotice.tsx
/components/site/GiftNote.tsx
/components/site/RSVPSection.tsx
/components/site/EntourageSection.tsx
/components/site/EventDetails.tsx
/components/site/DressCode.tsx
/components/site/PhotoQR.tsx
/components/site/BibleVerseFooter.tsx
/components/site/CountdownTimer.tsx
/components/dashboard/GuestTable.tsx
/components/dashboard/GuestForm.tsx
/components/dashboard/GuestCard.tsx         ← mobile card view
/components/dashboard/RSVPSummary.tsx
/components/dashboard/AuthGuard.tsx         ← static shell only
/components/dashboard/CSVImport.tsx
/components/dashboard/DeleteDialog.tsx
/components/dashboard/ResetRSVPDialog.tsx
/components/shared/Button.tsx
/components/shared/Modal.tsx
/components/shared/Toast.tsx
/lib/config.ts                              ← all wedding content goes here
```

### Acceptance criteria
- All screens are reachable via direct URL — no blank pages, no crashes
- Guest site matches the Stitch wireframe layout exactly (section order, spacing, element placement)
- Dashboard screens match Stitch wireframes where available
- Colors and fonts match `design.md` and `design-dashboard.md` exactly
- No TypeScript errors (`tsc --noEmit` passes)
- Guest site is fully usable at 375px (mobile) — no horizontal scroll, no overflow
- Dashboard is fully usable at 375px — guest table shows card view, modals show as bottom sheets
- All buttons and interactive elements are visible and correctly styled; functionality comes in later phases
- Countdown timer renders with placeholder zeroes — no logic yet
- **No page file contains raw Tailwind classes that duplicate a shared component** — grep for `rounded-full`, `bg-\[#E8C800\]`, `shadow-sm` etc. in page files; if found, extract to the appropriate shared component
- **Every button on every screen uses `<Button>`** — no raw `<button>` tags with ad-hoc styling
- **Every form input uses `<FormField>` + `<Input>` / `<Select>` / `<Textarea>`** — no raw inputs
- **Every modal uses `<Modal>`** — no one-off overlay implementations
- **Every white card uses `<Card>`** — no raw `<div className="bg-white rounded-lg shadow-sm">`
- DK reviews and approves this phase before Phase 2 begins

---

## Phase 2 — Firestore Data Model

**Goal:** Collections and documents are defined, typed, and secured. Wedding config lives in Firestore from day one.

### Tasks
- [ ] Define TypeScript types in `/types/index.ts` (include `ownerId` on `WeddingDoc`, `WeddingConfigUpdate` type)
- [ ] Write ownership-aware Firestore security rules (see `backend.md` — uses `isOwner()` helper function)
- [ ] Seed the wedding doc in Firebase Console:
  - Go to Firebase Console → Authentication → Users → find DK's account → copy the **User UID**
  - Create the Firestore document at `weddings/{NEXT_PUBLIC_WEDDING_ID}` manually
  - Set `ownerId` to DK's User UID — `ownerId` is used only by Firestore security rules and should be DK's UID as the primary owner
  - Fill all other fields with placeholder content (real content comes via the Wedding Settings screen in Phase 6)
  - Set `createdAt` and `updatedAt` to the current timestamp
- [ ] Seed the access doc in Firebase Console:
  - Create the Firestore document at `weddings/{NEXT_PUBLIC_WEDDING_ID}/private/access` manually
  - Set `authorizedEmails` to an array of the three initial authorized emails: DK's email, the bride's email, and the groom's email
  - Example: `{ "authorizedEmails": ["dk@gmail.com", "bride@gmail.com", "groom@gmail.com"] }`
  - This doc controls who can sign in to the dashboard — no environment variable needed
- [ ] Seed one test guest doc via Firebase Console
- [ ] Write Firestore helpers in `/lib/firestore.ts`:
  - Read `weddingId` from `process.env.NEXT_PUBLIC_WEDDING_ID` at the top of the file
  - Implement all helpers listed in `backend.md`
- [ ] Create `/lib/nav.ts` with `dashboardHref(path)` helper that builds paths under `/dashboard/[weddingId]`

### Files
```
/types/index.ts
/lib/firestore.ts
/lib/nav.ts
firestore.rules
```

### Acceptance criteria
- TypeScript types match the schema in `backend.md` exactly, including `ownerId` and `WeddingConfigUpdate`
- Security rules pass Firebase emulator: guests can only write their own RSVP; only the `ownerId` account can read/write guests and update wedding config
- `getWedding()` returns the seeded wedding doc
- `updateWeddingConfig()` updates allowed fields and sets `updatedAt`; cannot overwrite `ownerId` or `createdAt`
- All guest helpers resolve without error against the emulator
- `dashboardHref("/guests")` returns `/dashboard/bretch-joyce/guests` (or whatever the env WEDDING_ID is)

---

## Phase 3 — Invite Link System

**Goal:** Each guest record has a unique token; visiting `/?guest=<token>` resolves their name and pax.

### Tasks
- [ ] Implement token generation in `/lib/tokens.ts`
- [ ] On guest creation, auto-assign a `token` field (nanoid, 12 chars)
- [ ] On `/?guest=<token>`, fetch the guest doc and surface name + pax to the page
- [ ] Handle invalid/missing token (show generic site, no personalization)

### Files
```
/lib/tokens.ts
/app/page.tsx
/lib/firestore.ts  (getGuest helper)
```

### Acceptance criteria
- Every guest record has a non-null, unique `token`
- `/?guest=abc123` resolves the correct guest within 1 Firestore read
- Invalid token renders the site without a name (no crash, no error page)
- Missing token renders the site without a name (same fallback)

---

## Phase 4 — Guest-Facing Wedding Site

**Goal:** Full public site renders with all required sections, personalized per guest.

### Tasks
- [ ] Build layout shell in `/app/page.tsx`
- [ ] Implement each section component (see `frontend.md` for full spec)
- [ ] Wire personalized greeting with resolved guest name
- [ ] Implement countdown timer (days/hours/minutes/seconds to Aug 1, 2026)
- [ ] Add color palette display for dress code
- [ ] Add QR code component pointing to shared photo album URL
- [ ] Add Bible verse footer

### Files
```
/app/page.tsx
/components/site/HeroSection.tsx
/components/site/GreetingSection.tsx
/components/site/NoPlusOneNotice.tsx
/components/site/GiftNote.tsx
/components/site/EntourageSection.tsx
/components/site/EventDetails.tsx
/components/site/DressCode.tsx
/components/site/PhotoQR.tsx
/components/site/BibleVerseFooter.tsx
/components/site/CountdownTimer.tsx
```

### Acceptance criteria
- All sections render without hydration errors
- Countdown shows correct time to Aug 1, 2026 00:00 PHT
- Personalized greeting shows guest's first name when token is valid
- Dress code shows color swatches from config
- QR code renders and links to the correct photo album URL
- Site is mobile-responsive at 375px width

---

## Phase 5 — RSVP

**Goal:** Guest can confirm attendance count; response is saved to Firestore; cannot re-submit.

### Tasks
- [ ] Build `RSVPSection` component (see `rsvp.md` for full spec)
- [ ] Implement `/api/rsvp` route (validates token, writes `rsvpCount`)
- [ ] Handle pax=1 (yes/no buttons) vs pax>1 (count buttons) UI
- [ ] Show confirmation state after submission (no re-submit)
- [ ] Handle already-responded state on page load

### Files
```
/components/site/RSVPSection.tsx
/app/api/rsvp/route.ts
/lib/firestore.ts  (submitRSVP helper)
```

### Acceptance criteria
- See `rsvp.md` acceptance criteria (authoritative for this phase)

---

## Phase 6 — Couple Dashboard

**Goal:** Authenticated couple can manage the guest list, view RSVP status, and edit wedding config.

### Tasks
- [ ] Implement email + password sign-in using Firebase Auth (see `auth.md`)
- [ ] Wrap all `/dashboard/[weddingId]` routes with `AuthGuard`
- [ ] Build guest table: columns = Name, Pax, Role, Invite Link, RSVP Status (see `design-dashboard.md`)
- [ ] Add/edit/delete guest functionality with modals
- [ ] Show RSVP summary: confirmed heads / total invited heads / pending count
- [ ] Copy invite link button per guest row
- [ ] Build Wedding Settings screen (`/dashboard/[weddingId]/settings`):
  - Editable fields: couple name, wedding date, hashtag, photo album URL, ceremony details, reception details, dress code description + palette, entourage list
  - On save: call `updateWeddingConfig()` and show toast confirmation
  - Guest site reflects changes on next load (no redeploy needed)
- [ ] Add navigation between Dashboard Home, Guests, and Settings in the top nav

### Files
```
/app/dashboard/[weddingId]/page.tsx
/app/dashboard/[weddingId]/guests/page.tsx
/app/dashboard/[weddingId]/settings/page.tsx
/app/dashboard/[weddingId]/layout.tsx
/components/dashboard/GuestTable.tsx
/components/dashboard/GuestCard.tsx
/components/dashboard/GuestForm.tsx
/components/dashboard/RSVPSummary.tsx
/components/dashboard/AuthGuard.tsx
/components/dashboard/WeddingSettingsForm.tsx
/components/dashboard/EntourageEditor.tsx
/components/dashboard/PaletteEditor.tsx
```

### Acceptance criteria
- See `auth.md` acceptance criteria (authoritative for auth)
- Guest table shows all guests with live RSVP status
- RSVP summary counts are correct
- Wedding Settings form loads current config from Firestore
- Saving settings updates Firestore and reflects on the guest site immediately
- `ownerId` and `createdAt` fields are never editable from the UI
- All dashboard routes use `NEXT_PUBLIC_WEDDING_ID` via `dashboardHref()` — no hardcoded weddingId strings in components

---

## Phase 7 — CSV Import

**Goal:** Couple can upload a CSV to bulk-add guests.

### Tasks
- [ ] Accept CSV with columns: `firstName`, `lastName`, `pax`, `role`
- [ ] Parse with `papaparse`, validate required fields
- [ ] Auto-assign tokens for each new guest row
- [ ] Skip rows with missing `firstName` or `lastName`, show error count
- [ ] Do not overwrite existing guests

### Files
```
/components/dashboard/CSVImport.tsx
/app/api/guests/import/route.ts
```

### Acceptance criteria
- Valid CSV rows are imported with tokens assigned
- Rows missing `firstName` or `lastName` are skipped; skipped count is shown
- Import does not duplicate guests already in Firestore
- File upload accepts `.csv` only

---

## Phase 8 — Polish & Handoff

**Goal:** Site is production-ready and client can use the dashboard.

### Tasks
- [ ] Add Open Graph meta tags (couple names, wedding date, preview image)
- [ ] Add favicon
- [ ] Test all flows end-to-end on mobile (375px) and desktop (1280px)
- [ ] Remove all `console.log` debug statements
- [ ] Confirm Firestore security rules are locked down
- [ ] Write client handoff notes (how to add guests, share invite links)

### Acceptance criteria
- Lighthouse mobile score ≥ 85
- No TypeScript errors (`tsc --noEmit` passes)
- No ESLint errors
- All sections visible and functional on iOS Safari (primary guest browser)
