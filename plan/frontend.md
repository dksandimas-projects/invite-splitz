# invite-splitz — Frontend Spec

> **Agent note:** This file covers the guest-facing public site only.
> For the dashboard, see `auth.md`. For RSVP section behavior, see `rsvp.md`.
> Read `overview.md` first.

---

## Routes

| Route | Access | Description |
|---|---|---|
| `/` | — | **404.** No landing page. The invite lives at `/{weddingId}`. |
| `/{weddingId}` | Public | Guest-facing wedding site (with optional `?guest=<token>` for personalization) |
| `/dashboard/{weddingId}` | Private (email + password Auth) | Couple's dashboard home |
| `/dashboard/{weddingId}/guests` | Private (email + password Auth) | Guest list management |
| `/dashboard/{weddingId}/settings` | Private (email + password Auth) | Wedding config editor |
| `/og` | Public | OG image used for social previews of invite links |

**`weddingId` in single-tenant mode:** Always equals `process.env.NEXT_PUBLIC_WEDDING_ID`. Build a `useDashboardPath()` hook or a `dashboardHref(path)` helper in `/lib/nav.ts` that prepends the weddingId so it's never hardcoded across components. The `inviteHref(weddingId, token?)` helper in the same file builds `/{weddingId}` and `/{weddingId}?guest=<token>` URLs — never hardcode the path or the query string in components.

---

## Guest Site — `/app/[weddingId]/page.tsx`

### Page behavior

1. Read `?guest=<token>` from URL search params (server component or `useSearchParams`)
2. If token is present, fetch guest doc from Firestore (`getGuest(token)`)
3. Pass `guest` (or `null`) as prop to all child sections
4. Render all sections in order (see below)

### Sections — render order

```
1. HeroSection
2. GreetingSection
3. NoPlusOneNotice
4. GiftNote
5. RSVPSection          ← only if guest token is valid
6. EntourageSection
7. EventDetails
8. DressCode
9. PhotoQR
10. BibleVerseFooter
```

---

## Section Specs

### 1. HeroSection
**File:** `/components/site/HeroSection.tsx`

**Props:**
```ts
interface HeroSectionProps {
  coupleName: string        // e.g. "Bretch & Joyce"
  weddingDate: string       // ISO string: "2026-08-01"
  backgroundImageUrl?: string
}
```

**Renders:**
- Full-viewport hero with couple names and wedding date (formatted: "August 1, 2026")
- `CountdownTimer` component below the date
- Optional background image with overlay

**CountdownTimer** (`/components/site/CountdownTimer.tsx`):
- Target: August 1, 2026, 00:00:00 PHT (UTC+8)
- Display: `DD days HH:MM:SS` — updates every second via `setInterval`
- After the wedding date passes: show "We're married! 🎉" (static)
- Uses `useEffect` + `useState` — no SSR mismatch (render only on client)

**Acceptance criteria:**
- [ ] Couple name and formatted date are visible
- [ ] Countdown ticks every second
- [ ] No hydration error from timer
- [ ] Mobile: text is readable at 375px (no overflow)

---

### 2. GreetingSection
**File:** `/components/site/GreetingSection.tsx`

**Props:**
```ts
interface GreetingSectionProps {
  guestName: string | null   // null = no token / invalid token
}
```

**Renders:**
- If `guestName` is not null: `"You're invited, {guestName}!"`
- If `guestName` is null: `"You're invited!"` (no name)
- Supporting copy: `"We're so glad to have you celebrate this day with us."`

**Acceptance criteria:**
- [ ] Personalized greeting shows when token resolves a guest
- [ ] Generic fallback renders when token is absent or invalid
- [ ] No crash if `guestName` is `null`

---

### 3. NoPlusOneNotice
**File:** `/components/site/NoPlusOneNotice.tsx`

**Props:** none

**Renders:**
- A clearly styled notice: `"This invitation is strictly per invite only. We kindly ask that you do not bring additional guests."`
- Use a distinct visual treatment (e.g. bordered card, light background) to draw attention

**Acceptance criteria:**
- [ ] Notice is visually distinct from surrounding content
- [ ] Text matches the spec above exactly

---

### 4. GiftNote
**File:** `/components/site/GiftNote.tsx`

**Props:** none

**Renders:**
- Heading: `"A Note on Gifts"`
- Body: `"Your presence is the greatest gift of all. If you wish to give, a monetary box will be available at the venue. Please do not bring physical gifts."`

**Acceptance criteria:**
- [ ] Renders with heading and full body text

---

### 5. RSVPSection
**File:** `/components/site/RSVPSection.tsx`

See `rsvp.md` for the full spec. This component is rendered only when a valid guest token is present.

**Props:**
```ts
interface RSVPSectionProps {
  token: string
  pax: number
  existingRsvpCount: number | null   // null = not yet responded
}
```

---

### 6. EntourageSection
**File:** `/components/site/EntourageSection.tsx`

**Props:**
```ts
interface EntourageSectionProps {
  entourage: EntourageGroup[]
}

interface EntourageGroup {
  role: string           // e.g. "Principal Sponsors", "Best Man"
  members: string[]      // full names
}
```

**Renders:**
- Section heading: `"Our Entourage"`
- Groups rendered in role order: Principal Sponsors first, then Secondary Sponsors, then others
- Each group: role label + member names listed below

**Data source:** Hardcoded in `app/page.tsx` config object (not from Firestore — entourage does not change per guest).

**Acceptance criteria:**
- [ ] All entourage groups render
- [ ] Role labels are clearly distinguished from member names
- [ ] Mobile: no horizontal overflow

---

### 7. EventDetails
**File:** `/components/site/EventDetails.tsx`

**Props:**
```ts
interface EventDetailsProps {
  ceremony: EventInfo
  reception: EventInfo
}

interface EventInfo {
  time: string       // e.g. "10:00 AM"
  venue: string      // e.g. "St. John the Baptist Parish"
  address: string
  mapsUrl: string    // Google Maps link
}
```

**Renders:**
- Two cards: Ceremony and Reception
- Each card: time, venue name, address, "Get Directions" link (opens `mapsUrl`)

**Acceptance criteria:**
- [ ] Both cards render with all fields
- [ ] "Get Directions" opens the correct maps URL in a new tab

---

### 8. DressCode
**File:** `/components/site/DressCode.tsx`

**Props:**
```ts
interface DressCodeProps {
  description: string       // e.g. "Semi-formal / Garden Party"
  palette: ColorSwatch[]
}

interface ColorSwatch {
  name: string              // e.g. "Dusty Rose"
  hex: string               // e.g. "#C9A96E"
}
```

**Renders:**
- Heading: `"Dress Code"`
- Description text
- Row of color swatches: each is a circle with `backgroundColor: hex` and label below

**Acceptance criteria:**
- [ ] Each swatch renders the correct color
- [ ] Color name labels are visible
- [ ] Mobile: swatches wrap cleanly, no overflow

---

### 9. PhotoQR
**File:** `/components/site/PhotoQR.tsx`

**Props:**
```ts
interface PhotoQRProps {
  albumUrl: string    // e.g. Google Photos shared album URL
}
```

**Renders:**
- Heading: `"Snap & Share"`
- Body: `"Scan the QR code below to upload your photos to our shared album!"`
- QR code generated from `albumUrl` using `react-qr-code`
- Direct link below QR as fallback: `"Or tap here to open the album"`

**Acceptance criteria:**
- [ ] QR code renders and encodes `albumUrl`
- [ ] Fallback link opens `albumUrl` in a new tab
- [ ] QR is large enough to scan on mobile (min 200×200px)

---

### 10. BibleVerseFooter
**File:** `/components/site/BibleVerseFooter.tsx`

**Props:** none

**Renders:**
- Verse: `"So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate."`
- Attribution: `"— Matthew 19:6"`
- Copyright / built-by line (optional, configurable)

**Acceptance criteria:**
- [ ] Verse and attribution render correctly
- [ ] Footer is visually distinct (e.g. centered, muted styling)

---

## Site Config Object

All hardcoded wedding data lives in a single config object in `/lib/config.ts`.
Do not scatter hardcoded strings across components.

```ts
// /lib/config.ts
export const weddingConfig = {
  coupleName: "Bretch & Joyce",
  weddingDate: "2026-08-01",
  hashtag: "#spendtheBRETCHofmylifewithJOYCE",
  photoAlbumUrl: "",              // to be filled by client
  ceremony: {
    time: "",
    venue: "",
    address: "",
    mapsUrl: "",
  },
  reception: {
    time: "",
    venue: "",
    address: "",
    mapsUrl: "",
  },
  dressCode: {
    description: "",
    palette: [],                  // { name, hex }[]
  },
  entourage: [],                  // EntourageGroup[]
}
```

**Rule:** Any value that the client may need to update must live in `weddingConfig`, never inline in a component.

---

## Responsiveness

- Design mobile-first (375px base)
- Breakpoints: `sm` (640px), `md` (768px), `lg` (1024px)
- Test on: iOS Safari 375px (primary guest browser), Chrome desktop 1280px
- No horizontal scroll at any breakpoint
