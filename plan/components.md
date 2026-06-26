# invite-splitz — Shared Component Library

> **Agent note:** Build every component in this file BEFORE building any screen.
> Screens are assembled from these components — never write one-off inline styles
> that duplicate what a shared component already provides.
> Read `design.md` and `design-dashboard.md` for the color palette and typography system first.

---

## Rules

1. **No inline one-off styling.** If a pattern appears on more than one screen, it is a component.
2. **Components own their own spacing.** Padding/margin inside a component is the component's responsibility. The parent only controls positioning.
3. **All interactive elements use the shared `Button` component** — no raw `<button>` with ad-hoc Tailwind classes in page files.
4. **All form inputs use `FormField`** — never a raw `<input>` without a label and error slot.
5. **Design tokens are centralized in `/lib/tokens.ts`** — colors, radii, shadows as constants. Never hardcode hex values in component files; import from tokens.

---

## Design Tokens

**File:** `/lib/tokens.ts`

```ts
export const colors = {
  // Yellows
  butter:    "#F5F2C0",
  lemon:     "#F0E44A",
  sunflower: "#E8C800",
  sunflowerHover: "#D4B400",

  // Greens
  sage:      "#B5CC6E",
  garden:    "#7BB040",
  forest:    "#4E8A20",

  // Neutrals
  offWhite:  "#FAFAF5",
  charcoal:  "#2C2B28",
  warmGrey:  "#7A7670",
  stone:     "#E2DED8",
  stoneLight:"#F0EDE8",
} as const

export const radius = {
  sm:   "0.125rem",   // rounded-sm
  md:   "0.375rem",   // rounded-md
  lg:   "0.5rem",     // rounded-lg
  full: "9999px",     // rounded-full (pills)
} as const

export const shadow = {
  sm:  "0 1px 2px rgba(0,0,0,0.05)",
  md:  "0 4px 6px rgba(0,0,0,0.07)",
  lg:  "0 10px 15px rgba(0,0,0,0.10)",
} as const
```

---

## Component Index

| Layer | Component | File | Used on |
|---|---|---|---|
| Atom | `Button` | `/components/shared/Button.tsx` | All screens |
| Atom | `Input` | `/components/shared/Input.tsx` | Forms |
| Atom | `Textarea` | `/components/shared/Textarea.tsx` | Entourage editor |
| Atom | `Select` | `/components/shared/Select.tsx` | Guest form (Role) |
| Atom | `Badge` | `/components/shared/Badge.tsx` | Role badges, RSVP chips |
| Atom | `Spinner` | `/components/shared/Spinner.tsx` | Loading states |
| Atom | `Divider` | `/components/shared/Divider.tsx` | Section separators |
| Atom | `ColorSwatch` | `/components/shared/ColorSwatch.tsx` | Dress code, palette editor |
| Molecule | `FormField` | `/components/shared/FormField.tsx` | All forms |
| Molecule | `Modal` | `/components/shared/Modal.tsx` | All modals and dialogs |
| Molecule | `Toast` | `/components/shared/Toast.tsx` | Save feedback |
| Molecule | `ConfirmDialog` | `/components/shared/ConfirmDialog.tsx` | Delete, reset, unsaved changes |
| Molecule | `Card` | `/components/shared/Card.tsx` | Dashboard cards, settings sections |
| Molecule | `EmptyState` | `/components/shared/EmptyState.tsx` | Empty guest list, empty palette |
| Organism | `TopNav` | `/components/dashboard/TopNav.tsx` | All dashboard screens |
| Organism | `PageHeader` | `/components/shared/PageHeader.tsx` | Guest list, settings |
| Organism | `SectionCard` | `/components/shared/SectionCard.tsx` | Settings sections |
| Organism | `FormFooter` | `/components/shared/FormFooter.tsx` | Settings save/reset bar |

---

## Atom Specs

---

### `Button`
**File:** `/components/shared/Button.tsx`

```ts
interface ButtonProps {
  variant: "primary" | "ghost" | "decline" | "danger"
  size?: "sm" | "md"            // default: "md"
  fullWidth?: boolean           // default: false
  loading?: boolean             // shows spinner, disables click
  disabled?: boolean
  onClick?: () => void
  type?: "button" | "submit"   // default: "button"
  children: React.ReactNode
}
```

| Variant | Background | Text | Border |
|---|---|---|---|
| `primary` | `#E8C800` | `#2C2B28` | none |
| `ghost` | transparent | `#4E8A20` | `#7BB040` |
| `decline` | transparent | `#7A7670` | `#E2DED8` |
| `danger` | `#EF4444` | `#FFFFFF` | none |

**Sizes:**
- `md`: `px-6 py-3 text-sm min-h-[48px]` (default — mobile safe)
- `sm`: `px-4 py-2 text-xs min-h-[36px]` (dashboard icon-adjacent actions only)

**States:**
- Hover: primary → `#D4B400`; ghost → border `#4E8A20`; decline → border `#7A7670`
- Loading: show `<Spinner size="sm" />` left of text, disable pointer events
- Disabled: `opacity-50 cursor-not-allowed` — all variants

**Always:** `rounded-full tracking-wide font-medium transition-colors`

---

### `Input`
**File:** `/components/shared/Input.tsx`

```ts
interface InputProps {
  type?: "text" | "email" | "password" | "url" | "date" | "number"
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string              // shows red border + error message via FormField
  disabled?: boolean
  suffix?: React.ReactNode    // e.g. show/hide toggle for password
  inputMode?: string          // e.g. "numeric" for pax
}
```

**Base style:** `w-full border border-[#E2DED8] rounded-md px-3 py-2 text-base bg-white`
**Focus:** `border-[#7BB040] outline-none ring-1 ring-[#7BB040]`
**Error:** `border-red-400 ring-1 ring-red-300`
**Disabled:** `bg-[#F0EDE8] text-[#7A7670] cursor-not-allowed`
**Min height:** `min-h-[48px]` — always, for mobile tap comfort

**Password variant:** renders an eye icon button (`suffix`) to toggle `type` between `"password"` and `"text"`. Eye icon: `text-[#7A7670]`, `min-w-[44px] min-h-[44px]`.

---

### `Textarea`
**File:** `/components/shared/Textarea.tsx`

```ts
interface TextareaProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  rows?: number               // default: 4
  error?: string
  disabled?: boolean
}
```

Same border/focus/error styles as `Input`. `resize-y` only (no horizontal resize). `text-base` always.

---

### `Select`
**File:** `/components/shared/Select.tsx`

```ts
interface SelectProps {
  options: Array<{ value: string; label: string }>
  value: string
  onChange: (value: string) => void
  placeholder?: string        // shown as disabled first option
  error?: string
  disabled?: boolean
}
```

Same border/focus/error styles as `Input`. `min-h-[48px]`. Native `<select>` — no custom dropdown.

---

### `Badge`
**File:** `/components/shared/Badge.tsx`

```ts
interface BadgeProps {
  variant: "principal" | "secondary" | "entourage" | "guest"
           | "rsvp-confirmed" | "rsvp-declined" | "rsvp-pending"
  label: string
}
```

**Role badge styles:**

| Variant | Background | Text |
|---|---|---|
| `principal` | `#E8C800` | `#2C2B28` |
| `secondary` | `#B5CC6E` | `#2C2B28` |
| `entourage` | `#F5F2C0` | `#4E8A20` |
| `guest` | `#F0EDE8` | `#7A7670` |

**RSVP chip styles:**

| Variant | Background | Text |
|---|---|---|
| `rsvp-confirmed` | `#E8C800` | `#2C2B28` |
| `rsvp-declined` | `#FEF2F2` | `#F87171` |
| `rsvp-pending` | `#F0EDE8` | `#7A7670` |

**Always:** `rounded-full px-2.5 py-0.5 text-xs font-medium inline-flex items-center`

---

### `Spinner`
**File:** `/components/shared/Spinner.tsx`

```ts
interface SpinnerProps {
  size?: "sm" | "md" | "lg"   // sm=16px, md=24px, lg=32px
  color?: string               // default: currentColor
}
```

SVG spinner, `animate-spin`. Used inside `Button` (loading state) and on page-level loading screens.

---

### `Divider`
**File:** `/components/shared/Divider.tsx`

```ts
interface DividerProps {
  spacing?: "sm" | "md" | "lg"  // controls my- value; default: "md"
}
```

`<hr className="border-t border-[#E2DED8]" />` — no decorative content, purely structural.

---

### `ColorSwatch`
**File:** `/components/shared/ColorSwatch.tsx`

```ts
interface ColorSwatchProps {
  hex: string
  name?: string               // label below swatch; omit in palette editor rows
  size?: "sm" | "md"          // sm=w-8 h-8, md=w-12 h-12; default: "md"
}
```

Circle with `backgroundColor: hex`, `rounded-full`, optional label below in `text-xs text-[#7A7670]`. Used in guest site `DressCode` section and palette editor preview.

---

## Molecule Specs

---

### `FormField`
**File:** `/components/shared/FormField.tsx`

Wrapper that combines a label, an input/select/textarea, and an error message slot.

```ts
interface FormFieldProps {
  label: string
  hint?: string               // helper text below input
  error?: string              // red error message below input
  required?: boolean          // adds * to label
  children: React.ReactNode   // the Input / Select / Textarea
}
```

**Layout (top to bottom):**
1. Label — `text-xs uppercase tracking-wide text-[#7A7670] mb-1` + `*` if required
2. `{children}` — the input element
3. Hint — `text-xs text-[#7A7670] mt-1` (only if no error)
4. Error — `text-xs text-red-500 mt-1` (replaces hint when present)

---

### `Modal`
**File:** `/components/shared/Modal.tsx`

```ts
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  size?: "sm" | "md" | "lg"  // sm=max-w-sm, md=max-w-md, lg=max-w-lg; default: "md"
  children: React.ReactNode
  footer?: React.ReactNode    // button row rendered in a padded footer area
}
```

**Desktop (≥ 640px):** centered card, `bg-white rounded-lg shadow-xl`
**Mobile (< 640px):** bottom sheet — slides up from bottom, `rounded-t-2xl`, full width

**Always:**
- Overlay: `fixed inset-0 bg-black/40 z-50`
- Drag handle on mobile: `w-10 h-1 bg-[#E2DED8] rounded-full mx-auto mt-3 mb-2`
- Close button: `×` top-right, `min-w-[44px] min-h-[44px]`
- Traps focus when open; returns focus to trigger on close
- `Escape` key closes the modal
- `max-h-[90vh] overflow-y-auto` on mobile to handle tall content

---

### `Toast`
**File:** `/components/shared/Toast.tsx`

```ts
interface ToastProps {
  message: string
  variant: "success" | "error" | "neutral"
  duration?: number           // ms; default: 3000
}
```

| Variant | Left border color |
|---|---|
| `success` | `#7BB040` (Garden green) |
| `error` | `#EF4444` (red) |
| `neutral` | `#E2DED8` (stone) |

**Style:** `bg-white shadow-lg rounded-md px-4 py-3 text-sm border-l-4`
**Position:** bottom-center on mobile, top-right on desktop
**Animation:** slide-in from bottom (mobile) or from right (desktop), fade out before dismiss

Implement a `useToast()` hook and `<ToastContainer />` at the app root. Components call `showToast({ message, variant })` — never render `<Toast />` directly inline.

---

### `ConfirmDialog`
**File:** `/components/shared/ConfirmDialog.tsx`

```ts
interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string       // default: "Confirm"
  cancelLabel?: string        // default: "Cancel"
  confirmVariant?: "primary" | "danger"  // default: "primary"
  loading?: boolean           // shows spinner on confirm button
}
```

Uses `Modal` internally with `size="sm"`. Footer has Cancel (ghost) + Confirm button. On mobile, buttons stack vertically — Cancel on top, Confirm below.

---

### `Card`
**File:** `/components/shared/Card.tsx`

```ts
interface CardProps {
  padding?: "sm" | "md" | "lg"  // sm=p-4, md=p-6, lg=p-8; default: "md"
  children: React.ReactNode
}
```

`bg-white rounded-lg shadow-sm` — the standard dashboard card. All dashboard content panels use this component, never raw `<div>` with ad-hoc shadow classes.

---

### `EmptyState`
**File:** `/components/shared/EmptyState.tsx`

```ts
interface EmptyStateProps {
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}
```

Centered within its container: message in warm grey body text, optional primary `Button` below. Used in guest table (no guests yet), palette editor (no colors), entourage editor (no groups).

---

## Organism Specs

---

### `TopNav`
**File:** `/components/dashboard/TopNav.tsx`

```ts
interface TopNavProps {
  coupleName: string
  activeSection: "guests" | "settings"
}
```

**Desktop:** Logo/name left · nav links center (Guests, Settings) · email + Sign out right
**Mobile:** Logo/name left · sign-out icon right · nav links as bottom tab bar OR kept in header (pick one, stay consistent)

Active nav link: `border-b-2 border-[#E8C800]`
Uses `dashboardHref()` from `/lib/nav.ts` for all links — never hardcodes `/dashboard/[weddingId]`.

---

### `PageHeader`
**File:** `/components/shared/PageHeader.tsx`

```ts
interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode    // button(s) rendered top-right
}
```

**Layout:** Title (Cormorant Garamond `text-3xl`) + optional subtitle (small warm grey) on the left. `actions` slot on the right, wraps below title on mobile.

---

### `SectionCard`
**File:** `/components/shared/SectionCard.tsx`

```ts
interface SectionCardProps {
  heading: string              // rendered as uppercase tracked label
  children: React.ReactNode
}
```

`Card` with a section heading (`text-xs uppercase tracking-widest text-[#7A7670] mb-4`) above the content. Used for every section in the Wedding Settings page. Ensures consistent heading treatment and card padding across all six sections.

---

### `FormFooter`
**File:** `/components/shared/FormFooter.tsx`

```ts
interface FormFooterProps {
  onSave: () => void
  onReset: () => void
  saving?: boolean
  isDirty?: boolean           // disables Reset when false
}
```

Sticky on desktop (`sticky bottom-0 bg-white border-t border-[#E2DED8] py-4 px-6`), static on mobile.
Reset button (ghost, disabled if `!isDirty`) on the left. Save button (primary, loading state if `saving`) on the right. On mobile: stacks vertically, both full-width, Save on top.

---

## Build Order for Phase 1

Build components in this exact order — each layer depends on the one above it:

```
1. Design tokens         /lib/tokens.ts
2. Atoms                 Button, Input, Textarea, Select, Badge, Spinner, Divider, ColorSwatch
3. Molecules             FormField, Modal, Toast (+useToast hook), ConfirmDialog, Card, EmptyState
4. Organisms             TopNav, PageHeader, SectionCard, FormFooter
5. Site components       HeroSection, GreetingSection, ... (guest site)
6. Dashboard components  GuestTable, GuestCard, GuestForm, RSVPSummary, WeddingSettingsForm, ...
7. Pages                 /app/page.tsx, /app/dashboard/[weddingId]/page.tsx, ...
```

**Do not skip steps.** A page file should contain almost no Tailwind classes of its own — it assembles organisms and molecules. If you find yourself writing `bg-white rounded-lg shadow-sm` in a page file, extract it to `Card` instead.
