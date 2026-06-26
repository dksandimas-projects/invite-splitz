# invite-splitz — Design Spec

> **Agent note:** This file defines the visual direction for the guest-facing wedding site.
> It is derived from the couple's inspiration reference (minimalist botanical invite).
> Use this alongside `frontend.md`. Do not deviate from the aesthetic without client approval.

---

## Aesthetic Direction

**Style:** Minimalist romantic. Clean, airy, timeless.
**Mood:** Elegant but approachable — like a high-end printed wedding invitation.
**References:** Botanical stationery, garden party, fine art wedding photography.

Do not use: heavy gradients, bold color blocks, modern sans-serif headers, drop shadows, or busy patterns.

---

## Color Palette

Derived from the couple's yellow and green wedding mood board.

### Yellows
| Role | Name | Hex |
|---|---|---|
| Pale yellow (background tint, subtle sections) | Butter | `#F5F2C0` |
| Soft yellow (highlights, hover states) | Lemon | `#F0E44A` |
| Golden yellow (primary accent, buttons, swatches) | Sunflower | `#E8C800` |

### Greens
| Role | Name | Hex |
|---|---|---|
| Light sage (botanical accents, tags) | Sage | `#B5CC6E` |
| Medium green (secondary buttons, labels) | Garden | `#7BB040` |
| Deep green (primary text alternative, rich accents) | Forest | `#4E8A20` |

### Neutrals
| Role | Name | Hex |
|---|---|---|
| Page background | Off-white | `#FAFAF5` |
| Primary text | Deep charcoal | `#2C2B28` |
| Secondary text | Warm grey | `#7A7670` |
| Divider / border | Pale stone | `#E2DED8` |

### Usage rules
- **Page background:** Off-white `#FAFAF5` — keep it clean, let the yellow/green breathe
- **Primary buttons:** Sunflower `#E8C800` bg + charcoal `#2C2B28` text
- **Ghost buttons:** `border` in Garden green `#7BB040` + Forest green `#4E8A20` text
- **Botanical elements (SVG):** Use Garden `#7BB040` and Forest `#4E8A20`
- **Accent dividers / decorative lines:** Sunflower `#E8C800`
- **Section tints:** Butter `#F5F2C0` as a very subtle background on alternating sections (optional — use sparingly)
- No pure black (`#000`) or pure white (`#fff`). Always use the off-tones above.

---

## Typography

### Fonts to use (Google Fonts)

| Role | Font | Weight / Style |
|---|---|---|
| Couple names / hero heading | Cormorant Garamond | 400 Regular, 300 Light |
| "and" connector | Cormorant Garamond | 400 Italic |
| Section labels, dates, caps text | Cormorant Garamond or system sans | 400, uppercase, letter-spacing: 0.15em |
| Body / supporting copy | Lato or Inter | 300 Light or 400 Regular |
| Section headings | Cormorant Garamond | 400 |

### Scale

| Element | Size (mobile → desktop) |
|---|---|
| Couple names (hero) | `text-5xl` → `text-7xl` |
| "and" connector | `text-2xl` → `text-3xl` (italic) |
| Section heading | `text-2xl` → `text-3xl` |
| Uppercase label | `text-xs` → `text-sm`, `tracking-widest`, uppercase |
| Body text | `text-sm` → `text-base` |

---

## Layout Principles

- **Centered, single-column** layout for the entire guest site. Max width: `max-w-xl` (576px) centered on desktop.
- **Generous vertical spacing** between sections: `py-12` mobile → `py-20` desktop.
- **No hard section borders** — use whitespace and subtle dividers (`<hr>` with `border-stone-200`) instead.
- Content feels like a scroll through a printed invitation — unhurried, breathing room everywhere.
- **Mobile-first.** The design must feel complete and beautiful at 375px — not just functional. Design for mobile first, then enhance for desktop.

---

## Mobile-First Rules (Guest Site)

The primary guest browser is **iOS Safari on a phone**. Every design decision must pass the mobile test first.

### Touch targets
- All tappable elements (buttons, links) must be at minimum `44×44px` — use `min-h-[44px] min-w-[44px]`
- RSVP buttons must be easy to tap with a thumb — full-width or wide pill on mobile
- Do not place two tappable elements closer than `8px` apart

### Horizontal padding
- All sections: `px-6` on mobile (24px each side), `px-8` on desktop
- Never let text touch the screen edge

### Botanical elements on mobile
- On screens `< 640px`: hide the flanking branch illustrations — they crowd the content at narrow widths
- Use a single centered sprig illustration above the couple names instead (optional)
- Footer sprig remains visible at all sizes

### Font size floor
- Minimum body font size: `14px` (`text-sm`) — never smaller on mobile
- Minimum touch label font size: `12px` (`text-xs`) — use sparingly

### Scroll behavior
- `overflow-x: hidden` on `<body>` — no horizontal scroll at any breakpoint
- Each section should be comfortable within one or two phone-height scrolls
- Avoid very long sections; break content into digestible blocks

### Safe area (iOS notch / home bar)
- Apply `padding-bottom: env(safe-area-inset-bottom)` to the footer
- Apply `padding-top: env(safe-area-inset-top)` if using a fixed header

### Countdown timer on mobile
- Display as a `2×2` grid on very small screens (< 360px): days/hours on top row, minutes/seconds on bottom
- Display as a single `4-column` row on 375px and above
- Each unit: number + label (e.g., `"24 HRS"`)

### RSVP buttons on mobile
- Stack buttons **vertically**, full-width (`w-full`) on mobile
- Side-by-side layout only on `sm:` (640px+)
- Minimum button height `48px` on mobile for easy tapping

### Event details on mobile
- Ceremony and Reception cards **stack vertically** (single column)
- Each card full-width with generous padding `px-6 py-6`
- "Get Directions" link has `min-h-[44px]` and is visually distinct

### Color swatches on mobile
- Wrap into multiple rows if needed — never force a single horizontal row that causes overflow
- Each swatch circle `w-12 h-12` with label — ensure labels don't overlap on small screens

---

## Botanical Decorative Elements

The inspiration uses delicate baby's breath / gypsophila branch illustrations on the left and right edges.

**Implementation options (in order of preference):**
1. SVG illustrations — lightweight, scalable, no extra requests
2. PNG with transparent background — acceptable if SVG is not available
3. CSS-only — skip botanical if no assets are available; the design still works without them

**Placement:**
- Hero section: flanking branches on left and right edges, anchored top-to-bottom
- Footer: subtle smaller branch or single sprig
- Do not repeat on every section — use sparingly

**Color:** Botanical illustrations use Garden green (`#7BB040`) for stems/branches and Sage (`#B5CC6E`) for buds/leaves. Do not use grey or muted sage — the palette is vibrant green.

---

## Component Design Notes

### HeroSection
- Full-viewport or near-full (`min-h-screen`) — guest lands here
- Couple names stacked vertically: `[Name 1]` → `and` (italic, smaller) → `[Name 2]`
- Wedding date below in uppercase tracked label style
- Countdown timer below date — small, secondary, warm grey
- Botanical branches frame the left and right edges of this section

### GreetingSection
- Centered, generous top/bottom padding
- Personalized line in serif, slightly larger than body
- Supporting copy in light weight body font, warm grey

### NoPlusOneNotice
- Subtle bordered card: `border border-stone-200 rounded-sm px-6 py-4`
- Text in secondary warm grey — informational, not alarming
- No icons, no bold — keep it soft

### GiftNote
- Same card treatment as NoPlusOneNotice, or a simple centered paragraph
- Heading in small uppercase tracked label
- Body in light body font

### RSVPSection
- Section heading: uppercase tracked label — `"KINDLY REPLY"`
- Buttons: pill-shaped or softly rounded (`rounded-full` or `rounded-sm`)
- Primary action (attending): charcoal fill + cream text
- Secondary actions: ghost style — transparent bg, `border border-stone-300`, charcoal text
- Confirmation state: simple centered text, no heavy UI — let the message breathe

### EntourageSection
- Role labels: uppercase tracked, warm grey, small
- Member names: regular serif, charcoal, slightly larger than label
- Groups separated by whitespace, not lines

### EventDetails
- Two-column on desktop (`grid grid-cols-2 gap-8`), stacked on mobile
- Each card: minimal — time in uppercase label, venue name in serif heading, address in body
- "Get Directions" as a text link with a subtle underline — no button

### DressCode
- Heading in uppercase tracked label
- Description in body font
- Color swatches: circles (`w-12 h-12 rounded-full`), no border, shadow-sm, centered row
- Swatch label below each circle in small warm grey text

### PhotoQR
- Centered QR code, generous white space around it
- Heading and body copy above in standard hierarchy
- QR code background: white card `bg-white p-4 rounded-sm shadow-sm` so it scans cleanly

### BibleVerseFooter
- Full-width section, cream background or very subtle contrast (`bg-stone-50`)
- Verse text centered, italic serif, warm grey
- Attribution below in small uppercase tracked label
- Bottom padding generous — this is the last thing guests see

---

## Buttons

| Variant | Style |
|---|---|
| Primary (attending) | `bg-[#E8C800] text-[#2C2B28] px-6 py-3 rounded-full text-sm tracking-wide font-medium` |
| Ghost (secondary count options) | `border border-[#7BB040] text-[#4E8A20] px-6 py-3 rounded-full text-sm tracking-wide` |
| Decline | `border border-[#E2DED8] text-[#7A7670] px-6 py-3 rounded-full text-sm tracking-wide` — neutral, not red |

Hover state: primary deepens to `#D4B400`, ghost border deepens to `#4E8A20`.

**Mobile button rules:**
- All buttons: `min-h-[48px]` on mobile for comfortable tapping
- RSVP buttons: `w-full` on mobile, `w-auto` on `sm:` and above
- Never use `text-xs` on a button — minimum `text-sm`
- Disabled state: `opacity-50 cursor-not-allowed` — no other visual change needed

---

## What to Avoid

- No card-heavy layouts with shadows everywhere
- No colored backgrounds per section (keep it cream throughout)
- No emoji in UI text
- No rounded-xl or heavily rounded corners — prefer `rounded-sm` or `rounded-full` (pills only)
- No sans-serif headings — all headings in Cormorant Garamond
- No stock photo backgrounds — the design lives in typography and botanical line art
