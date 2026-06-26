# invite-splitz — Code Conventions

> **Agent note:** These conventions apply to every file in this codebase.
> They are not suggestions — they are requirements enforced in Phase 1 acceptance criteria.
> Read `components.md` for the full component library spec before building any UI.

---

## File & Folder Naming

| Type | Convention | Example |
|---|---|---|
| React components | PascalCase `.tsx` | `GuestTable.tsx` |
| Hooks | camelCase with `use` prefix | `useToast.ts` |
| Utility/library files | camelCase `.ts` | `firestore.ts`, `tokens.ts` |
| Pages (App Router) | `page.tsx` in the route folder | `/app/dashboard/[weddingId]/page.tsx` |
| Layouts | `layout.tsx` in the route folder | `/app/dashboard/[weddingId]/layout.tsx` |
| API routes | `route.ts` in the route folder | `/app/api/rsvp/route.ts` |
| Plan docs | lowercase with hyphens | `design-dashboard.md` |

---

## Component Architecture

Components follow a strict four-layer hierarchy. Build in this order:

```
tokens → atoms → molecules → organisms → site/dashboard screens
```

### Layer definitions

| Layer | Location | Examples |
|---|---|---|
| **Tokens** | `/lib/tokens.ts` | Color constants, radius, shadow |
| **Atoms** | `/components/shared/` | `Button`, `Input`, `Badge`, `Spinner` |
| **Molecules** | `/components/shared/` | `FormField`, `Modal`, `Toast`, `Card` |
| **Organisms** | `/components/shared/` | `TopNav`, `PageHeader`, `SectionCard`, `FormFooter` |
| **Site screens** | `/components/site/` | `HeroSection`, `RSVPSection`, `EventDetails` |
| **Dashboard screens** | `/components/dashboard/` | `GuestTable`, `AuthGuard`, `PaletteEditor` |

Lower layers must never import from higher layers.

---

## Hard UI Rules

These are enforced as acceptance criteria — do not bypass them.

### No raw Tailwind in page files

Page files (`/app/**/*.tsx`) and screen-level components must not contain raw Tailwind classes that duplicate a shared component. If you find yourself writing `className="bg-white rounded-lg shadow-sm p-6"` in a page, extract it to `<Card>` instead.

**Banned patterns in page files:**
```tsx
// ❌ Wrong
<button className="bg-[#E8C800] rounded-full px-6 py-3 font-medium">Submit</button>
<div className="bg-white rounded-lg shadow-sm p-6 mb-6">...</div>
<div className="fixed inset-0 bg-black/50 flex items-center justify-center">...</div>
```

```tsx
// ✅ Correct
<Button variant="primary">Submit</Button>
<Card>...</Card>
<Modal>...</Modal>
```

### Every button uses `<Button>`

No raw `<button>` tags with inline styling anywhere on any screen. The `<Button>` atom accepts `variant`, `size`, `disabled`, `loading`, and `onClick` props. If a new variant is needed, extend `Button.tsx` — don't create a one-off.

### Every form input uses `<FormField>` + `<Input>` / `<Select>` / `<Textarea>`

No raw `<input>`, `<select>`, or `<textarea>` with inline styling on any screen. `<FormField>` wraps the label, input, helper text, and error message into one consistent unit.

### Every modal uses `<Modal>`

No custom overlay implementations. `<Modal>` handles the backdrop, focus trap, keyboard dismissal (Escape), and bottom-sheet behavior on mobile. Do not duplicate this logic per screen.

### Every white card uses `<Card>`

`<Card>` standardizes `bg-white rounded-lg shadow-sm`. Do not write this combination of classes inline.

---

## Naming Conventions

### Component props

- Boolean props: `isLoading`, `isDisabled`, `isDirty` — prefix with `is` or `has`
- Event handlers: `onSave`, `onDelete`, `onClose` — prefix with `on`
- Children: always typed as `children: React.ReactNode`

### Firestore helpers

All helpers in `/lib/firestore.ts` are named with the CRUD verb first:
- `getWedding()`, `getGuestByToken()`, `getAuthorizedEmails()`
- `listGuests()`
- `createGuest()`
- `updateGuest()`, `updateWeddingConfig()`, `updateAuthorizedEmails()`
- `deleteGuest()`
- `resetRSVP()`, `submitRSVP()`

Do not add helpers with names that diverge from this pattern.

### Enum-like string unions

Prefer string union types over enums:

```ts
// ✅ Correct
type GuestRole = "Principal Sponsor" | "Secondary Sponsor" | "Entourage" | "Guest"

// ❌ Avoid
enum GuestRole { PrincipalSponsor = "Principal Sponsor", ... }
```

---

## TypeScript Rules

- Strict mode is on (`strict: true` in `tsconfig.json`). No `any` unless unavoidable.
- All Firestore helper functions are typed with the interfaces in `/types/index.ts`. Do not inline anonymous object types in helper signatures.
- `WeddingConfigUpdate` is the only type allowed to be passed to `updateWeddingConfig()`. Do not cast to `Partial<WeddingDoc>` — it would allow overwriting `ownerId`.
- `Timestamp` from `firebase/firestore` is the correct type for all date fields in Firestore documents. Do not use JavaScript `Date` in Firestore writes; use `serverTimestamp()` instead.

---

## Navigation

All dashboard navigation must go through `dashboardHref()`:

```ts
import { dashboardHref } from "@/lib/nav"

// ✅ Correct
<Link href={dashboardHref("/guests")}>Guests</Link>
<Link href={dashboardHref("/settings")}>Settings</Link>

// ❌ Wrong
<Link href="/dashboard/bretch-joyce/guests">Guests</Link>
```

`dashboardHref()` reads `NEXT_PUBLIC_WEDDING_ID` at runtime — one source of truth.

---

## Wedding Content

All wedding-specific content (couple name, wedding date, Bible verse, etc.) must come from one of two places:

1. **Firestore** (`getWedding()`) — for content the couple can edit via the dashboard
2. **`/lib/config.ts`** — for static constants that never change per deployment (e.g., default Bible verse fallback, brand tagline)

**Never inline wedding content in a component:**

```tsx
// ❌ Wrong
<h1>Bretch & Joyce</h1>
<p>August 1, 2026</p>

// ✅ Correct — from Firestore
<h1>{wedding.coupleName}</h1>
<p>{formatDate(wedding.weddingDate)}</p>
```

---

## Error Handling

- Firestore helpers throw on error — they do not return `null` on network failure. Callers must wrap in `try/catch`.
- `getWedding()` and `getGuestByToken()` return `null` if the document doesn't exist (not found ≠ error).
- API routes (`/app/api/...`) must always return a JSON response with a `message` field, even on error:
  ```ts
  return NextResponse.json({ message: "Guest not found" }, { status: 404 })
  ```
- UI components must handle loading, success, and error states explicitly. Do not leave components in a permanently loading state on error.

---

## CSS / Tailwind

- Use design token constants from `/lib/tokens.ts` rather than raw hex values where possible.
- When a hex value must be used inline (e.g., dynamic palette colors), use the `style` prop: `style={{ backgroundColor: color.hex }}` — not `className={`bg-[${color.hex}]`}` (Tailwind can't generate dynamic class names at build time).
- Mobile-first: write base styles for mobile, use `md:` and `lg:` prefixes for larger screens.
- Never use `!important` overrides.

---

## Import Paths

Use the `@/` alias for all internal imports:

```ts
// ✅ Correct
import { Button } from "@/components/shared/Button"
import { getWedding } from "@/lib/firestore"

// ❌ Wrong
import { Button } from "../../components/shared/Button"
```
