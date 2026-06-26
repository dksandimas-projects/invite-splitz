---
name: Botanical Heirloom
colors:
  surface: '#fafaf5'
  surface-dim: '#dadad6'
  surface-bright: '#fafaf5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4ef'
  surface-container: '#eeeee9'
  surface-container-high: '#e8e8e4'
  surface-container-highest: '#e2e3de'
  on-surface: '#1a1c19'
  on-surface-variant: '#4c4732'
  inverse-surface: '#2f312e'
  inverse-on-surface: '#f1f1ec'
  outline: '#7e7760'
  outline-variant: '#cfc6ac'
  surface-tint: '#6e5e00'
  primary: '#6e5e00'
  on-primary: '#ffffff'
  primary-container: '#e8c800'
  on-primary-container: '#625400'
  inverse-primary: '#e5c500'
  secondary: '#3d6a00'
  on-secondary: '#ffffff'
  secondary-container: '#baf47a'
  on-secondary-container: '#427000'
  tertiary: '#605e5a'
  on-tertiary: '#ffffff'
  tertiary-container: '#ccc9c4'
  on-tertiary-container: '#565451'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffe257'
  primary-fixed-dim: '#e5c500'
  on-primary-fixed: '#211b00'
  on-primary-fixed-variant: '#534600'
  secondary-fixed: '#baf47a'
  secondary-fixed-dim: '#9fd762'
  on-secondary-fixed: '#0f2000'
  on-secondary-fixed-variant: '#2d5000'
  tertiary-fixed: '#e6e2dd'
  tertiary-fixed-dim: '#c9c6c1'
  on-tertiary-fixed: '#1c1c19'
  on-tertiary-fixed-variant: '#484743'
  background: '#fafaf5'
  on-background: '#1a1c19'
  surface-variant: '#e2e3de'
  butter: '#F5F2C0'
  lemon: '#F0E44A'
  sage: '#B5CC6E'
  forest: '#4E8A20'
  warm-grey: '#7A7670'
  stone: '#E2DED8'
typography:
  hero-names:
    fontFamily: Cormorant Garamond
    fontSize: 72px
    fontWeight: '300'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  hero-names-mobile:
    fontFamily: Cormorant Garamond
    fontSize: 48px
    fontWeight: '300'
    lineHeight: '1.1'
  section-heading:
    fontFamily: Cormorant Garamond
    fontSize: 30px
    fontWeight: '400'
    lineHeight: '1.4'
  label-caps:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: 0.15em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '300'
    lineHeight: '1.6'
  body-main:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '300'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  section-gap-desktop: 5rem
  section-gap-mobile: 3rem
  container-max-guest: 576px
  container-max-dashboard: 1024px
  gutter: 1.5rem
---

## Brand & Style

This design system balances the high-fidelity, emotional "Minimalist Romantic" aesthetic of a wedding guest experience with the "Clean and Structured" utility of a management dashboard. The brand personality is elegant, unhurried, and refined, drawing heavy inspiration from fine-art botanical stationery and garden parties.

The design style is **Minimalist with Tactile Accents**. It relies on generous whitespace (breathing room), sophisticated serif typography, and delicate botanical line art to evoke the feeling of a premium printed invitation. The dashboard transitions this into a **Modern Corporate** structure—maintaining the palette but prioritizing functional grids, clear hierarchy, and efficient data density.

**Key Brand Principles:**
- **Digital Stationery:** Interfaces should feel like paper, not software. Avoid heavy shadows, blurs, or aggressive rounded corners.
- **Organic Precision:** Use clean, structured layouts for data, but soften them with organic SVG botanical elements.
- **Airy Sophistication:** Use vertical spacing to create a sense of calm and importance.

## Colors

The palette is derived from a sun-drenched garden mood board. It avoids pure blacks and whites to maintain a soft, vintage feel.

- **Primary (Sunflower):** Used for primary actions, critical highlights, and decorative accents.
- **Secondary (Garden):** Used for botanical illustrations, ghost button borders, and secondary labels.
- **Neutral (Off-white):** The universal canvas for all screens.
- **Primary Text (Deep Charcoal):** Provides high legibility while remaining softer than pure black.

**Functional Color Application:**
- **Butter (#F5F2C0):** Use for subtle section tints or row hovers in the dashboard.
- **Sage (#B5CC6E):** Reserved for softer botanical details (leaves/buds) and specific UI badges.
- **Forest (#4E8A20):** Used for high-contrast text against light backgrounds or deep botanical stems.
- **Stone (#E2DED8):** The standard for thin dividers and subtle borders.

## Typography

The typography system relies on the contrast between the literary elegance of **Cormorant Garamond** and the functional clarity of **Inter**.

**Usage Rules:**
- **Cormorant Garamond:** Exclusively for headers, names, and high-impact quotes. Use the "Light" (300) weight for hero elements to emphasize the fine-art aesthetic.
- **Inter:** Used for all body copy, forms, and dashboard data. Maintain a light weight (300) for guest-facing content to keep it "airy," and switch to regular (400) for dashboard utility.
- **Uppercase Labels:** Used for metadata, dates, and navigation hints. These must always carry high letter-spacing (`0.15em`) for a modern-classic look.
- **The "and" Connector:** Specifically use Cormorant Garamond Italic for conjunctions between names (e.g., *and*) to break the geometric rigidity of the layout.

## Layout & Spacing

This design system uses two distinct layout models:

1.  **Guest Site (Centered/Fluid):** A single-column, centered layout with a narrow max-width (`576px`). This mimics a vertical scroll through a physical invitation. It uses extreme vertical padding to isolate sections and create "moments."
2.  **Dashboard (Fixed Grid):** A standard 12-column grid system with a wider max-width (`1024px`). This prioritizes data density and efficient scanning.

**Responsive Rules:**
- **Vertical Rhythm:** Guest pages use `80px` (desktop) or `48px` (mobile) gaps between major sections.
- **Safe Zones:** Horizontal padding is strictly `24px` on mobile to ensure no text hits the glass edge.
- **Touch Targets:** A mandatory minimum touch target of `44px` (or `48px` for RSVP actions) is required for all interactive elements.

## Elevation & Depth

To maintain the "Minimalist Romantic" feel, depth is created through **Tonal Layers** rather than shadows.

- **The Canvas:** The base layer is the Off-white (#FAFAF5) background.
- **Raised Surfaces:** On the dashboard, use pure White (#FFFFFF) for cards and modals to create a "lifted" effect.
- **Outlines:** Use low-contrast borders in Pale Stone (#E2DED8) for cards and input fields.
- **Shadows:** Use only one shadow type: a very soft, ambient shadow for white cards on the dashboard (`0px 4px 20px rgba(44, 43, 40, 0.05)`).
- **Glassmorphism:** Do not use.
- **Dividers:** Use thin horizontal lines in Sunflower (#E8C800) or Stone (#E2DED8) to separate logical blocks without adding visual weight.

## Shapes

The shape language is primarily **Soft and Geometric**.

- **Standard Elements:** Input fields, guest cards, and modal containers use `0.25rem` (rounded-sm) to maintain a structured, tidy look.
- **Interactive Elements:** Primary and ghost buttons use "Pill" shapes (rounded-full) to provide a soft, welcoming touch to the guest experience.
- **Decorative Elements:** Color swatches and status badges are always fully circular or pill-shaped.
- **Avoid:** Heavy rounding (rounded-xl) or aggressive sharp corners on primary surfaces.

## Components

### Buttons
- **Primary (Attending):** Sunflower background, Charcoal text, Pill-shaped. Height: 48px.
- **Ghost (Secondary):** Garden green border (1px), Forest green text, Pill-shaped.
- **Decline:** Stone border, Warm Grey text. Avoid red for "Decline" to maintain a romantic tone.

### Inputs & Forms
- **Dashboard Inputs:** White background, Stone border, 16px font size (to prevent iOS zoom).
- **Selects:** Custom chevron in Garden green.

### Cards & Status Chips
- **Dashboard Table Rows:** Use Butter (#F5F2C0) for hover states.
- **Role Badges:**
  - *Principal Sponsor:* Sunflower/Charcoal.
  - *Entourage:* Butter/Forest.
  - *Guest:* Stone/Warm Grey.
- **RSVP Chips:** Empty state is Stone; Attending state is Sunflower.

### Botanical Accents (Guest Site)
- **Hero:** SVG branches in Garden green anchored to the left and right viewport edges.
- **Dividers:** Use a single centered botanical sprig above major section headings.
- **Rules:** Hide complex SVG elements on screens smaller than 640px to avoid crowding.

### Modals & Bottom Sheets
- **Desktop:** Centered white cards with a dark/40% overlay.
- **Mobile:** Transition to a "Bottom Sheet" model that slides up from the base of the screen with a centered drag handle.