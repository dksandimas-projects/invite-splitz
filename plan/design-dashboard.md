# invite-splitz — Dashboard & Auth Design Spec

> **Agent note:** This file covers all screens for the couple's private dashboard —
> sign-in, access denied, guest management, and all modals/dialogs.
> Read `design.md` for the shared color palette and typography system.
> Read `auth.md` and `backend.md` for behavior and data rules.

---

## Design Approach

The dashboard is a **private management tool**, not a guest-facing page. It should feel:
- Clean and functional — tables, forms, modals
- On-brand — same yellow/green palette as the guest site, but more structured
- Simple — the couple are not power users; no complexity, no jargon

Use white (`#FFFFFF`) cards on the off-white (`#FAFAF5`) background to create hierarchy. The yellow/green palette appears as accents, badges, buttons, and status indicators — not as heavy fills.

---

## Shared Dashboard Components

### Top Navigation Bar
Present on all authenticated dashboard screens.

**Layout:** Full-width bar, `bg-white`, bottom border `border-b border-[#E2DED8]`

**Left:** Couple name — loaded from Firestore `weddingConfig.coupleName` — Cormorant Garamond, charcoal. Never hardcode this value.

**Center (nav links):** `"Guests"` · `"Settings"` — `text-sm`, charcoal, active link gets a sunflower underline `border-b-2 border-[#E8C800]`

**Right:**
- Signed-in user email — small, warm grey (hidden on mobile, icon-only sign-out)
- `"Sign out"` — text link, warm grey, hover underline

**Height:** `h-16`

---

## Screen List

---

### Screen 1 — Sign-In

**Route:** `/dashboard` (unauthenticated state)
**File:** Rendered inside `AuthGuard` when `user === null`

**Layout:** Centered card on off-white background, vertically centered on the viewport

**Card contents (top to bottom):**
1. Couple names — loaded from Firestore `weddingConfig.coupleName` — Cormorant Garamond, `text-2xl`, centered
2. Subtext — `"Dashboard"` in uppercase tracked label, warm grey
3. Thin divider — `border-t border-[#E2DED8] my-6`
4. Body copy — `"Sign in to manage your guest list and invite links."` — small, warm grey, centered
5. Google Sign-In button (see spec below)
6. Divider with label — `"── or ──"` in `text-xs text-[#7A7670]`, centered
7. Email + password form (see spec below)
8. Fine print — `"Access is restricted to authorized accounts only."` — `text-xs`, warm grey, centered

**Google Sign-In Button:**
```
[G]  Sign in with Google
```
- Width: `w-full`
- Style: `bg-white border border-[#E2DED8] rounded-full shadow-sm min-h-[48px]`
- Official Google "G" SVG logo on the left
- Text: `"Sign in with Google"` — body font, charcoal, `text-sm`
- Hover: `bg-[#F5F2C0]` (butter tint)
- Error: `"Google sign-in failed. Please try again."` — `text-xs text-red-500` below button

**Email + Password Form:**
- Email field: `type="email"`, label `"Email"`, placeholder `"you@example.com"`
- Password field: `type="password"`, label `"Password"`, placeholder `"••••••••"`
  - Show/hide toggle: eye icon button, right edge of input, `min-w-[44px] min-h-[44px]`
- `"Forgot password?"` — small text link, right-aligned, sits between the password field and the Sign In button. `text-xs`, warm grey, hover underline.
- Submit button: `"Sign In"` — primary (sunflower), `w-full`, `min-h-[48px]`

**Below the form (replaces the previous "no links" rule):**
- `"New here? Create an account"` — small text link, centered. The "Create an account" portion is forest green, `font-medium`, hover underline. Routes to the Sign-Up sub-screen (Screen 1b).

**Input style (applies to both fields):**
- `w-full border border-[#E2DED8] rounded-md px-3 py-2 text-base` (16px — prevents iOS zoom)
- Focus: `border-[#7BB040] outline-none ring-1 ring-[#7BB040]`
- Label above each input: `text-xs uppercase tracking-wide text-[#7A7670] mb-1`
- `min-h-[48px]` for mobile tap comfort

**Error states (email/password):**
- Invalid credentials: `"Incorrect email or password."` — `text-xs text-red-500`, below the Sign In button
- Rate limited: `"Too many attempts. Please try again later."` — same style
- Other: `"Sign-in failed. Please try again."` — same style
- Single line of red text only — no heavy error banner
- Never reveal whether the email exists

**Card size:** `max-w-sm w-full`, `p-8`, `bg-white`, `rounded-lg`, `shadow-sm`

---

### Screen 1b — Sign-Up

**Route:** `/dashboard` (unauthenticated state, sign-up sub-view)
**File:** Rendered inside `AuthGuard` as a sub-view of the unauthenticated state — toggled by clicking `"Create an account"` on Screen 1. No URL change (per G-008).

**Layout:** Same centered card as Screen 1, same dimensions and chrome (couple name, "Dashboard" label, sunflower divider).

**Body copy:** `"Create an account to access the dashboard. Your email must already be on the access list — ask the couple if it isn't."` — small, warm grey, centered. Sets expectations so a non-allowlisted signup attempt doesn't surprise the user with Access Denied.

**Form fields (top to bottom):**
- Email — `type="email"`, `autoComplete="email"`, same input style as Screen 1
- Password — `type="password"`, `autoComplete="new-password"`, hint `"At least 6 characters"`, show/hide toggle
- Confirm password — `type="password"`, `autoComplete="new-password"`, show/hide toggle

**Submit button:** `"Create Account"` — primary (sunflower), `w-full`, `min-h-[48px]`

**Error states:**
- Inline, under the password field: `"Password must be at least 6 characters."` or `"Password is too weak. Use at least 6 characters."` (from `auth/weak-password`)
- Inline, under the confirm field: `"Passwords do not match."`
- Inline, under the email field: `"Please enter a valid email address."` (from `auth/invalid-email`)
- Form-level, below the submit button: `"An account with this email already exists. Try signing in."` (from `auth/email-already-in-use`) or `"Sign-up failed. Please try again."` (other errors)

**After success:** `onAuthStateChanged` fires → `AuthGuard` runs the allowlist check. Allowed → dashboard. Not allowed → Access Denied.

**Below the form:**
- `"Already have an account? Back to sign in"` — same style as the Screen 1 "Create an account" link. Routes back to Screen 1.

---

### Screen 1c — Forgot Password

**Route:** `/dashboard` (unauthenticated state, forgot-password sub-view)
**File:** Rendered inside `AuthGuard` as a sub-view of the unauthenticated state — toggled by clicking `"Forgot password?"` on Screen 1. No URL change.

**Layout:** Same centered card as Screen 1, same chrome (couple name, "Dashboard" label, sunflower divider).

**Body copy (form state):** `"Enter your email and we'll send you a link to reset your password."`

**Body copy (success state, replaces the form):**
- Heading: `"Check your inbox."` — `text-sm`, charcoal, centered
- Body: `"If an account exists for {email}, we've sent a password reset link."` — `text-sm`, warm grey, centered

**Form fields (form state only):**
- Email — `type="email"`, `autoComplete="email"`, same input style as Screen 1

**Submit button:** `"Send Reset Link"` — primary (sunflower), `w-full`, `min-h-[48px]`

**Error states (form state):**
- Inline, under the email field: `"Please enter a valid email address."` (from `auth/invalid-email`)
- Form-level, below the submit button: `"Too many requests. Please try again later."` (from `auth/too-many-requests`) or `"Could not send reset link. Please try again."` (other errors)

**Success behavior:** the form is replaced by the success body copy. The "Back to sign in" link remains. The user does not need to do anything further — they check their email in another tab/app.

**Never reveal whether the email exists.** The success message wording is identical for existing and non-existing emails. This prevents account enumeration.

**Below the card (always visible):**
- `"Back to sign in"` — same style as the Screen 1 links. Routes back to Screen 1.

---

### Screen 2 — Access Denied

**Route:** `/dashboard` (authenticated but email not in allowlist)
**File:** Rendered inside `AuthGuard` when email check fails

**Layout:** Same centered card layout as Sign-In

**Card contents:**
1. Icon: a simple lock SVG or `🔒` — centered, `text-4xl` or `w-10 h-10`
2. Heading: `"Access Denied"` — Cormorant Garamond, `text-xl`, charcoal, centered
3. Body: `"This dashboard is private. Your account is not authorized to access it."` — small, warm grey, centered
4. Signed-in as: `"{email}"` — `text-xs`, warm grey, centered
5. Sign-out link: `"Sign out and try a different account"` — text link, Garden green `#7BB040`, centered

**Do not redirect to the guest site.** Stay on this screen until they sign out.

---

### Screen 3 — Dashboard Home

**Route:** `/dashboard` (authenticated)
**File:** `/app/dashboard/page.tsx`

**Layout:** Below top nav. Single-column, max-width `max-w-4xl`, centered, `px-6 py-10`

**Sections (top to bottom):**

#### RSVP Summary Card
White card, `rounded-lg shadow-sm p-6`, full width

Four stat tiles in a row (2×2 on mobile, 4×1 on desktop):

| Stat | Label | Color |
|---|---|---|
| Total confirmed heads | `"Confirmed"` | Sunflower `#E8C800` badge |
| Total declined | `"Declined"` | Warm grey |
| Awaiting response | `"Pending"` | Sage `#B5CC6E` badge |
| Total invited heads | `"Total Invited"` | Charcoal |

Each tile: large number in Cormorant Garamond `text-4xl`, label below in uppercase tracked label `text-xs warm grey`.

#### Quick Actions
Row of buttons below the summary card:
- `"Manage Guests"` — primary button → links to `/dashboard/guests`
- `"Import CSV"` — ghost button → opens CSV import modal

#### Recent Activity (optional / Phase 7)
Simple list of last 5 RSVP responses — guest name, response, timestamp. Warm grey text, no cards.

---

### Screen 4 — Guest List

**Route:** `/dashboard/guests`
**File:** `/app/dashboard/guests/page.tsx`

**Layout:** Below top nav. Max-width `max-w-5xl`, centered, `px-6 py-10`

#### Page Header
- Heading: `"Guest List"` — Cormorant Garamond `text-3xl`, charcoal
- Subtext: live count — `"42 guests · 86 invited heads"` — small, warm grey
- Right side: `"Add Guest"` primary button + `"Import CSV"` ghost button

#### Guest Table

Full-width table, `bg-white rounded-lg shadow-sm overflow-hidden`

**Columns:**

| Column | Width | Notes |
|---|---|---|
| Name | `w-1/4` | `"{firstName} {lastName}"` — charcoal, `text-sm` |
| Role | `w-1/6` | Role badge (see badge spec below) |
| Pax | `w-1/12` | Number, centered, warm grey |
| Invite Link | `w-1/4` | Truncated URL + Copy button |
| RSVP | `w-1/6` | Status chip (see status spec below) |
| Actions | `w-1/8` | Edit · Delete icon buttons |

**Table header row:** uppercase tracked label, `text-xs`, warm grey, `bg-[#FAFAF5]`, `border-b border-[#E2DED8]`
**Table body rows:** `text-sm`, `border-b border-[#F0EDE8]`, hover `bg-[#F5F2C0]` (butter tint)
**Empty state:** Centered in table area — `"No guests yet. Add your first guest or import a CSV."` with an Add Guest button below

#### Role Badges

Pill-shaped, `rounded-full px-2 py-0.5 text-xs`

| Role | Style |
|---|---|
| Principal Sponsor | `bg-[#E8C800] text-[#2C2B28]` (sunflower) |
| Secondary Sponsor | `bg-[#B5CC6E] text-[#2C2B28]` (sage) |
| Entourage | `bg-[#F5F2C0] text-[#4E8A20]` (butter + forest text) |
| Guest | `bg-[#F0EDE8] text-[#7A7670]` (stone, neutral) |

#### RSVP Status Chips

Pill-shaped, `rounded-full px-2 py-0.5 text-xs`

| State | Display | Style |
|---|---|---|
| `null` | `"Pending"` | `bg-[#F0EDE8] text-[#7A7670]` |
| `0` | `"Declined"` | `bg-red-50 text-red-400` |
| `1..pax` | `"{count}/{pax}"` | `bg-[#E8C800] text-[#2C2B28]` |

#### Invite Link Cell

- Display: `".../?guest=abc123"` — `text-xs`, warm grey, truncated
- `"Copy"` button beside it: `text-xs`, ghost pill, Garden green border
- On copy success: button text changes to `"Copied!"` for 2 seconds, then reverts

#### Actions Column

- Edit: pencil icon button — `text-warm-grey`, hover `text-[#4E8A20]`
- Delete: trash icon button — `text-warm-grey`, hover `text-red-400`
- No labels — icon only; use `title` attribute for accessibility

---

### Screen 5 — Add Guest (Modal)

**Trigger:** `"Add Guest"` button on Guest List screen
**Type:** Centered modal overlay

**Overlay:** `bg-black/40` full screen
**Modal card:** `bg-white rounded-lg shadow-xl p-8 max-w-md w-full`

**Header:**
- Title: `"Add Guest"` — Cormorant Garamond `text-xl`, charcoal
- Close button: `×` top-right corner, warm grey

**Form fields (top to bottom):**

| Field | Type | Required | Notes |
|---|---|---|---|
| First Name | Text input | Yes | Placeholder: `"e.g. Maria"` |
| Last Name | Text input | Yes | Placeholder: `"e.g. Santos"` |
| Pax | Number input | Yes | Min 1, default 1; label: `"Seats (pax)"` |
| Role | Select dropdown | Yes | Options: Principal Sponsor, Secondary Sponsor, Entourage, Guest |

**Input style:**
- `w-full border border-[#E2DED8] rounded-md px-3 py-2 text-sm`
- Focus: `border-[#7BB040] outline-none ring-1 ring-[#7BB040]`
- Label above each input: `text-xs uppercase tracking-wide text-[#7A7670]`

**Footer buttons (right-aligned):**
- `"Cancel"` — ghost button, closes modal
- `"Add Guest"` — primary button (sunflower)

**Loading state:** `"Add Guest"` button shows spinner + `"Adding..."`, both buttons disabled
**Success:** Modal closes, guest appears in table, toast: `"Guest added successfully."`
**Error:** Inline below the form: `"Something went wrong. Please try again."`

---

### Screen 6 — Edit Guest (Modal)

Same layout as Add Guest modal, with:
- Title: `"Edit Guest"`
- All fields pre-filled with current guest data
- Primary button label: `"Save Changes"`
- Token and RSVP fields are **not editable** in this form

---

### Screen 7 — Delete Guest (Confirmation Dialog)

**Trigger:** Trash icon in guest row
**Type:** Small confirmation dialog (smaller than the full Add Guest modal)

**Card:** `max-w-sm`, centered modal

**Contents:**
- Heading: `"Delete Guest?"` — `text-lg`, charcoal
- Body: `"This will permanently remove {firstName} {lastName} and their invite link. This cannot be undone."` — `text-sm`, warm grey
- Buttons (right-aligned):
  - `"Cancel"` — ghost button
  - `"Delete"` — `bg-red-500 text-white rounded-full px-5 py-2 text-sm` — only screen where red appears

---

### Screen 8 — CSV Import (Modal)

**Trigger:** `"Import CSV"` button on Guest List or Dashboard Home
**Type:** Centered modal, slightly wider than Add Guest — `max-w-lg`

**Step 1 — Upload**

- Title: `"Import Guests from CSV"`
- Body: `"Upload a CSV file to bulk-add guests. Existing guests will not be overwritten."`
- Expected columns (shown as a code block or table):
  ```
  firstName | lastName | pax | role
  ```
- File drop zone: dashed border `border-2 border-dashed border-[#E2DED8]`, `rounded-lg`, `p-8`, centered
  - Icon: upload SVG, warm grey
  - Text: `"Drop your CSV here or click to browse"`
  - Accepts `.csv` only
- Buttons: `"Cancel"` ghost + `"Upload"` primary (disabled until file selected)

**Step 2 — Preview (after file parsed)**

- Title: `"Review Import"`
- Table preview: first 5 rows of parsed data, same column structure as guest table
- Summary line: `"{N} guests ready to import · {E} rows skipped (missing name)"` — `text-sm`, warm grey
- Skipped rows shown below in a collapsible: `"Show skipped rows ▾"`
- Buttons: `"Back"` ghost + `"Import {N} Guests"` primary

**Step 3 — Done**

- Title: `"Import Complete"`
- Body: `"{N} guests added successfully."` with Garden green checkmark icon
- If any skipped: `"{E} rows were skipped."`
- Single button: `"Done"` — closes modal, guest table refreshes

---

### Screen 9 — Reset RSVP (Confirmation Dialog)

**Trigger:** Reset icon or action in guest row (dashboard only — not visible to guests)
**Type:** Same small confirmation dialog as Delete Guest

**Contents:**
- Heading: `"Reset RSVP?"`
- Body: `"This will clear {firstName}'s RSVP response. They will be able to submit again."` — `text-sm`, warm grey
- Buttons:
  - `"Cancel"` — ghost
  - `"Reset"` — primary (sunflower) — not destructive, so no red here

---

## Toast Notifications

Appear bottom-center or top-right of screen. Auto-dismiss after 3 seconds.

| Event | Message | Style |
|---|---|---|
| Guest added | `"Guest added successfully."` | Sunflower left border |
| Guest updated | `"Changes saved."` | Sunflower left border |
| Guest deleted | `"Guest removed."` | Neutral grey |
| RSVP reset | `"RSVP cleared."` | Neutral grey |
| CSV imported | `"{N} guests imported."` | Garden green left border |
| Any error | `"Something went wrong. Please try again."` | Red left border |

Style: `bg-white shadow-lg rounded-md px-4 py-3 text-sm border-l-4`, animated slide-in

---

## Mobile-First Rules (Dashboard)

The couple will manage guests primarily on their phone. The dashboard must be fully usable at 375px.

### General
- `overflow-x: hidden` on `<body>` — no horizontal scroll
- All interactive elements: minimum `44×44px` touch target
- Page padding: `px-4` on mobile, `px-6` on tablet, `px-8` on desktop
- Apply `padding-bottom: env(safe-area-inset-bottom)` to the page footer

### Top Navigation Bar on mobile
- Couple name and sign-out button remain on one row
- If email text is too long, truncate with `truncate max-w-[140px]`
- Sign-out: icon-only (`→` or power icon) on mobile, text label on `md:` and above

### Forms and Inputs (critical for iOS)
- **All `<input>` and `<select>` elements must have `font-size: 16px` minimum** — iOS Safari zooms in on inputs smaller than 16px, which breaks the layout
- In Tailwind: use `text-base` (`16px`) on all form inputs — never `text-sm` on an input
- Input height: `min-h-[48px]` for comfortable mobile tapping
- Use `inputmode="numeric"` on the Pax number input for the numeric mobile keyboard

### Modals on mobile
- On screens `< 640px`: modals become **bottom sheets** — slide up from the bottom of the screen, full width, `rounded-t-2xl`
- Bottom sheet height: `max-h-[90vh]`, scrollable if content overflows
- Drag handle: small grey pill `w-10 h-1 bg-stone-300 rounded-full mx-auto mt-3 mb-4` at the top
- Close button remains in the top-right corner of the sheet
- On `sm:` and above: centered modal card (standard behavior)

### Guest List on mobile (card view)
The table collapses into a **card list** on mobile (< 768px). One card per guest:

```
┌─────────────────────────────────────┐
│ Maria Santos              [Pending] │
│ Principal Sponsor · 2 pax           │
│ ···/?guest=abc123    [Copy] [✏] [🗑]│
└─────────────────────────────────────┘
```

- Card: `bg-white rounded-lg shadow-sm p-4 mb-3`
- Name: `text-sm font-medium text-[#2C2B28]`
- Role + pax: `text-xs text-[#7A7670]` on the line below
- RSVP chip: top-right of card
- Invite link: truncated, with Copy button beside it
- Edit + Delete: small icon buttons, right-aligned on the bottom row
- Touch target for each icon button: `min-w-[44px] min-h-[44px]` — pad them even if the icon is smaller

### RSVP Summary on mobile
- 4-tile grid becomes `grid-cols-2` (2×2) on mobile
- Each tile: full width within its grid cell, number prominent, label below

### Dashboard Home quick actions on mobile
- Buttons stack vertically, `w-full`, on mobile
- Side by side on `sm:` and above

### CSV Import on mobile
- File drop zone: retain the dashed border but replace drag text with `"Tap to select a CSV file"` on mobile (no drag-and-drop on iOS)
- Step 2 preview table: show only Name and Role columns on mobile; hide Pax and others
- Import button: `w-full` on mobile

### Confirmation dialogs on mobile
- Full-width bottom sheet on mobile (same modal → bottom sheet rule)
- Buttons stack vertically: `"Cancel"` on top (ghost), destructive/confirm action below (primary/red)
- On desktop: buttons side by side, right-aligned

---

## Responsiveness Summary

| Breakpoint | Guest Table | Modals | Nav | Buttons |
|---|---|---|---|---|
| 375px (mobile) | Card list | Bottom sheet | Icon-only sign-out | Full-width, stacked |
| 640px (sm) | Card list | Centered modal | Full nav | Auto-width, inline |
| 768px (md) | Table: Name, RSVP, Pax, Actions | Centered modal | Full nav | Auto-width |
| 1024px (lg) | Full table, all columns | Centered modal | Full nav | Auto-width |

---

---

### Screen 10 — Wedding Settings

**Route:** `/dashboard/[weddingId]/settings`
**File:** `/app/dashboard/[weddingId]/settings/page.tsx`

**Layout:** Below top nav. Single-column, `max-w-2xl`, centered, `px-6 py-10`

**Page Header:**
- Heading: `"Wedding Settings"` — Cormorant Garamond `text-3xl`, charcoal
- Subtext: `"Changes are saved to your live site immediately."` — small, warm grey

The settings page is a single long-scroll form broken into labeled sections. No tabs — one page, one Save button at the bottom.

#### Section: The Couple
| Field | Input type | Notes |
|---|---|---|
| Couple Name | Text | e.g. `"Bretch & Joyce"` |
| Wedding Date | Date | ISO date picker |
| Hashtag | Text | e.g. `"#spendtheBRETCHofmylifewithJOYCE"` |

#### Section: Ceremony
| Field | Input type |
|---|---|
| Time | Text | e.g. `"10:00 AM"` |
| Venue Name | Text |
| Address | Text |
| Google Maps URL | URL input |

#### Section: Reception
Same fields as Ceremony.

#### Section: Dress Code
| Field | Input type | Notes |
|---|---|---|
| Description | Text | e.g. `"Semi-formal / Garden Party"` |
| Color Palette | Palette Editor | List of `{ name, hex }` — add/remove swatches |

**Palette Editor (`/components/dashboard/PaletteEditor.tsx`):**
- Each row: color picker (hex input + visual swatch preview) + name text field + remove button
- `"Add color"` button appends a new empty row
- Max 8 swatches (soft limit — show warning if exceeded, don't block)

#### Section: Photo Album
| Field | Input type |
|---|---|
| Shared Album URL | URL input |

#### Section: Entourage
**Entourage Editor (`/components/dashboard/EntourageEditor.tsx`):**
- List of role groups, each with:
  - Role name (text input, e.g. `"Principal Sponsors"`)
  - Members (textarea, one name per line — split on save)
  - Remove group button
- `"Add group"` button appends a new empty group
- Groups can be reordered via drag handle (optional — low priority)

#### Form footer (sticky on desktop, static on mobile)
- `"Save Changes"` — primary button (sunflower), `w-full` on mobile
- `"Reset to last saved"` — ghost button, discards unsaved changes (reloads from Firestore)

**Save behavior:**
- On click: call `updateWeddingConfig()` with changed fields only
- Loading state: button shows `"Saving..."`, disabled
- Success: toast `"Settings saved. Your live site is updated."` (Garden green border)
- Error: toast `"Save failed. Please try again."` (red border)

**Read-only fields (never shown in this form):**
- `ownerId`, `createdAt` — internal fields, not editable

---

## Accessibility

- All icon buttons must have `aria-label` (e.g., `aria-label="Delete Maria Santos"`)
- Modal must trap focus when open and return focus to trigger on close
- Form inputs must have associated `<label>` elements (not just placeholders)
- Color is never the sole indicator of state — always pair with text or icon
