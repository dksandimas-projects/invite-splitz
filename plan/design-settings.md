# invite-splitz — Wedding Settings Design Spec

> **Agent note:** This file is the authoritative design spec for the Wedding Settings screen
> and all its sub-editors. It expands on the brief description in `design-dashboard.md` (Screen 10).
> Read `design.md` for the shared palette and typography. Read `backend.md` for the
> `WeddingDoc` schema and `updateWeddingConfig()` helper before building any save logic.

---

## Overview

**Route:** `/dashboard/[weddingId]/settings`
**File:** `/app/dashboard/[weddingId]/settings/page.tsx`

The Settings page is a **single long-scroll form** with six labeled sections. No tabs or sub-pages — one scroll, one Save button. Changes are written to Firestore on save and reflected on the guest site immediately without a redeploy.

---

## Page Layout

```
┌──────────────────────────────────────────┐
│  Top Nav (Guests · Settings · Sign out)  │
├──────────────────────────────────────────┤
│  Wedding Settings                        │
│  Changes are saved to your live site     │
│  immediately.                            │
│──────────────────────────────────────────│
│  [ Section: The Couple              ]    │
│  [ Section: Ceremony                ]    │
│  [ Section: Reception               ]    │
│  [ Section: Dress Code              ]    │
│  [ Section: Photo Album             ]    │
│  [ Section: Entourage               ]    │
│  [ Section: Team Access             ]    │
│──────────────────────────────────────────│
│  [Reset]              [Save Changes]     │
└──────────────────────────────────────────┘
```

- Max width: `max-w-2xl`, centered, `px-6 py-10`
- Each section is a white card: `bg-white rounded-lg shadow-sm p-6 mb-6`
- Section heading: uppercase tracked label `text-xs tracking-widest text-[#7A7670] mb-4`
- Input labels: `text-xs uppercase tracking-wide text-[#7A7670] mb-1`
- All inputs: `text-base` (16px minimum — prevents iOS Safari zoom)

---

## Unsaved Changes Guard

- Track a `isDirty` boolean — true when any field differs from the last saved Firestore state
- If `isDirty` is true and the user navigates away (clicks Guests or the browser back button): show a confirmation dialog — `"You have unsaved changes. Leave anyway?"`
- `"Leave"` (ghost) / `"Stay and Save"` (primary)
- On successful save: reset `isDirty` to false

---

## Section 1 — The Couple

**Card heading:** `"THE COUPLE"`

| Field | Input | Placeholder | Validation |
|---|---|---|---|
| Couple Name | `type="text"` | `"e.g. Bretch & Joyce"` | Required, max 60 chars |
| Wedding Date | `type="date"` | — | Required, must be a future date |
| Hashtag | `type="text"` | `"e.g. #ourwedding"` | Optional, max 80 chars |

**Layout:** Single column, stacked fields, full-width inputs.

**Notes:**
- Wedding Date should display as a date picker — on mobile, use the native `<input type="date">` which renders the platform's date picker (no custom picker needed)
- Couple Name is used in the guest site hero — show a small hint below: `"Displayed as the main heading on your wedding site."`

---

## Section 2 — Ceremony

**Card heading:** `"CEREMONY"`

| Field | Input | Placeholder | Validation |
|---|---|---|---|
| Time | `type="text"` | `"e.g. 10:00 AM"` | Required |
| Venue Name | `type="text"` | `"e.g. St. John the Baptist Parish"` | Required |
| Address | `type="text"` | `"Full address"` | Required |
| Google Maps URL | `type="url"` | `"https://maps.google.com/..."` | Optional, must be valid URL if filled |

**Layout:** Single column, stacked fields, full-width inputs.

---

## Section 3 — Reception

**Card heading:** `"RECEPTION"`

Same four fields as Ceremony. Identical layout and validation rules.

---

## Section 4 — Dress Code

**Card heading:** `"DRESS CODE"`

### Fields

| Field | Input | Placeholder | Validation |
|---|---|---|---|
| Description | `type="text"` | `"e.g. Semi-formal / Garden Party"` | Optional, max 100 chars |

### Color Palette Editor

Below the description field. Component: `/components/dashboard/PaletteEditor.tsx`

**Empty state:**
```
┌──────────────────────────────────┐
│  No colors yet.                  │
│  [+ Add Color]                   │
└──────────────────────────────────┘
```

**With colors:**
```
┌──────────────────────────────────────────────┐
│  ●  [#E8C800 ▾]   [Sunflower          ] [×] │
│  ●  [#7BB040 ▾]   [Garden Green       ] [×] │
│  ●  [#B5CC6E ▾]   [Sage               ] [×] │
│                                              │
│  [+ Add Color]                               │
└──────────────────────────────────────────────┘
```

Each row:
- **Color preview circle** — `w-8 h-8 rounded-full` filled with the current hex, `flex-shrink-0`
- **Hex input** — `type="text"`, `w-32`, placeholder `"#000000"`, validates as a valid hex color on blur. On change, updates the preview circle live.
- **Name input** — `type="text"`, `flex-1`, placeholder `"Color name"`, max 30 chars
- **Remove button** — `×` icon, `text-[#7A7670]`, hover `text-red-400`, `min-w-[44px] min-h-[44px]`

**`"+ Add Color"` button:** Ghost style, `w-full`, appends a new empty row with `hex: "#ffffff"` and empty name.

**Limits:**
- Maximum 8 colors — if 8 rows exist, hide the `"+ Add Color"` button and show: `"Maximum 8 colors reached."`
- Minimum 0 (palette is optional)

**Validation:**
- Hex must match `/^#[0-9A-Fa-f]{6}$/` — show inline red border if invalid on blur
- Invalid hex: `"Please enter a valid hex color (e.g. #E8C800)"`

**Mobile layout:** Rows stack normally; hex input and name input stack vertically within each row on screens < 400px.

---

## Section 5 — Photo Album

**Card heading:** `"PHOTO ALBUM"`

| Field | Input | Placeholder | Validation |
|---|---|---|---|
| Shared Album URL | `type="url"` | `"https://photos.google.com/share/..."` | Optional, must be valid URL if filled |

**Helper text below input:** `"Guests will see a QR code linking to this album on your wedding site."`

**Preview row (if URL is filled):**
```
QR preview: [small 80×80 QR code rendered from the URL]  "Open album ↗"
```
- Shows a live mini QR code preview using `react-qr-code` so the couple can verify it looks correct before saving
- `"Open album ↗"` link opens the URL in a new tab

---

## Section 6 — Entourage

**Card heading:** `"ENTOURAGE"`

Component: `/components/dashboard/EntourageEditor.tsx`

**Empty state:**
```
┌──────────────────────────────────┐
│  No entourage groups yet.        │
│  [+ Add Group]                   │
└──────────────────────────────────┘
```

**With groups:**

Each group is a sub-card within the section: `bg-[#FAFAF5] rounded-md p-4 mb-3`

```
┌──────────────────────────────────────────┐
│  Role  [Principal Sponsors          ] [×]│
│                                          │
│  Members (one per line):                 │
│  ┌────────────────────────────────────┐  │
│  │ Mr. & Mrs. Juan dela Cruz          │  │
│  │ Mr. & Mrs. Pedro Santos            │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

Each group:
- **Role input** — `type="text"`, full-width, placeholder `"e.g. Principal Sponsors"`, required
- **Members textarea** — `rows={4}`, full-width, one member name per line, placeholder `"One name per line\ne.g. Mr. & Mrs. Juan dela Cruz"`
- **Remove group button** — `×` in the top-right corner of the sub-card. Requires inline confirmation: button changes to `"Remove? [Yes] [No]"` before deleting — no separate modal.

**`"+ Add Group"` button:** Ghost style, `w-full`, below all groups. Appends a new empty group.

**Order:** Groups render in the order added. The guest site displays them in this same order. No drag-to-reorder needed for now.

**On save:** Each group's `members` textarea is split by newline (`\n`), trimmed, and empty lines filtered out before writing to Firestore.

---

## Section 7 — Team Access

**Card heading:** `"TEAM ACCESS"`

**Purpose:** Manage the list of emails that are authorized to sign in to this dashboard. Changes take effect immediately — no redeployment needed.

**Stored in:** `weddings/{weddingId}/private/access` → field `authorizedEmails: string[]`
**Written via:** `updateAuthorizedEmails()` from `/lib/firestore.ts`

> **Note:** Team Access is saved separately from the main form — it has its own Save button inside the card. This avoids accidentally removing access while editing unrelated fields.

### Layout

```
┌────────────────────────────────────────────────┐
│  TEAM ACCESS                                   │
│  Only these email addresses can sign in to     │
│  this dashboard.                               │
│                                                │
│  dk@gmail.com                           [×]   │
│  bride@gmail.com                        [×]   │
│  groom@gmail.com                        [×]   │
│                                                │
│  ┌──────────────────────────────┐  [+ Add]    │
│  │ email@example.com            │             │
│  └──────────────────────────────┘             │
│                                                │
│                          [Save Access List]    │
└────────────────────────────────────────────────┘
```

### Behavior

- **Existing email list** — renders as a row-per-email with a `×` remove button. Emails are displayed in the order they were added.
- **Remove button** — immediately removes the email from the local list (not yet saved). Does not require confirmation.
- **Cannot remove yourself** — if the signed-in user's email is in the list, its `×` button is disabled with a tooltip: `"You cannot remove your own access."` This prevents lockout.
- **Add email input** — `type="email"` input with placeholder `"email@example.com"`. The `[+ Add]` button appends the email to the list on click (or Enter key). Clears the input after adding.
- **Duplicate check** — if the typed email is already in the list, show inline error: `"This email is already in the list."` Do not add a duplicate.
- **Email validation** — on Add: must be a valid email format. Show `"Please enter a valid email address."` if not.
- **Empty list warning** — if all emails are removed, show a warning below the list: `"⚠ At least one email is required to maintain dashboard access."` Block save if the list is empty.
- **`[Save Access List]` button** — saves only the `authorizedEmails` array; does not save the rest of the form. On click: calls `updateAuthorizedEmails()`.
  - Loading state: `"Saving..."` with spinner, button disabled
  - Success toast: `"Access list updated."` — Garden green, auto-dismiss 3s
  - Error toast: `"Failed to update access list. Please try again."` — red border

### Input styling

- Email input: `flex-1 text-base`, same style as all other inputs on this page (prevents iOS zoom)
- `[+ Add]` button: Ghost variant, `min-h-[44px]`
- Email rows: `flex items-center justify-between py-2 border-b border-[#E2DED8]`
- Email text: `text-sm text-[#2C2B28]`
- Remove button: `×` icon, `text-[#7A7670]` default, `hover:text-red-400`, `min-w-[44px] min-h-[44px]`
- Disabled remove (own email): `text-[#E2DED8] cursor-not-allowed`

### Mobile behavior

- Input + `[+ Add]` button stack vertically below the email list on screens < 400px
- `[Save Access List]` button is `w-full` on mobile
- Remove buttons maintain `min-h-[44px]` touch targets

---

## Form Footer

Sticky on desktop (`sticky bottom-0 bg-white border-t border-[#E2DED8] py-4 px-6`), static on mobile.

```
[Reset to last saved]          [Save Changes]
```

| Button | Variant | Behavior |
|---|---|---|
| `"Reset to last saved"` | Ghost | Discards all unsaved changes, reloads form from Firestore. Requires no confirmation — data is not deleted, just not yet saved. |
| `"Save Changes"` | Primary (sunflower) | Calls `updateWeddingConfig()` with all changed fields |

**Save loading state:**
- Button text: `"Saving..."` with spinner
- Both buttons disabled
- No page freeze — UI remains scrollable

**Save success:**
- Toast: `"Settings saved. Your live site is updated."` — Garden green left border, auto-dismiss 3s
- `isDirty` reset to false

**Save error:**
- Toast: `"Save failed. Please try again."` — red left border
- Both buttons re-enabled
- Do not discard the user's input

---

## Validation Summary

Run validation on Save click (not on every keystroke). Scroll to the first invalid field.

| Field | Rule | Error message |
|---|---|---|
| Couple Name | Required | `"Couple name is required."` |
| Wedding Date | Required, future date | `"Please enter a valid future date."` |
| Ceremony Time | Required | `"Ceremony time is required."` |
| Ceremony Venue | Required | `"Ceremony venue is required."` |
| Ceremony Address | Required | `"Ceremony address is required."` |
| Reception Time | Required | `"Reception time is required."` |
| Reception Venue | Required | `"Reception venue is required."` |
| Reception Address | Required | `"Reception address is required."` |
| Palette hex values | Valid hex if present | `"Please enter a valid hex color (e.g. #E8C800)."` |
| Photo Album URL | Valid URL if present | `"Please enter a valid URL."` |
| Entourage role names | Required if group exists | `"Each group needs a role name."` |

Show inline error below each invalid input: `text-xs text-red-500 mt-1`. Red border on the input: `border-red-400`.

---

## Mobile Behavior

- All sections stack as full-width cards, `mx-4`
- Form footer is static (not sticky) on mobile — Save button sits below the last section
- `"+ Add Color"` and `"+ Add Group"` buttons are `w-full` on mobile
- Date input uses native mobile date picker — do not override with a custom component
- Palette rows: hex + name stack vertically (hex on top, name below) at `< 400px`
- Remove group inline confirmation (`"Remove? [Yes] [No]"`) stacks to two full-width buttons on mobile

---

## Acceptance Criteria

- [ ] Team Access card loads the current `authorizedEmails` list from Firestore on page load
- [ ] Emails can be added (valid format) and removed (except the signed-in user's own email)
- [ ] Duplicate emails are rejected with an inline error
- [ ] Saving an empty list is blocked with a warning
- [ ] `[Save Access List]` saves only `authorizedEmails`; does not affect wedding config fields
- [ ] Changes to Team Access take effect on the next sign-in attempt — no redeploy needed
- [ ] Page loads with current Firestore values pre-filled in all fields
- [ ] Couple Name, Wedding Date, all Ceremony and Reception fields are required and block save if empty
- [ ] Saving updates only the changed fields via `updateWeddingConfig()`; `ownerId` and `createdAt` are never sent
- [ ] Guest site reflects saved changes on next page load without a redeploy
- [ ] Palette editor: add/remove colors, live hex preview, hex validation
- [ ] Palette limited to 8 colors — `"+ Add Color"` hides at limit
- [ ] Entourage editor: add/remove groups, members split by newline on save
- [ ] QR preview renders when a valid photo album URL is entered
- [ ] `isDirty` guard shows confirmation when navigating away with unsaved changes
- [ ] Toast shows on save success and error
- [ ] All inputs are `text-base` (16px) — no iOS zoom
- [ ] All interactive elements have `min-h-[44px]` touch targets
- [ ] Form is fully usable at 375px — no horizontal scroll
