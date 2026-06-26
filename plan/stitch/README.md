# plan/stitch — Wireframes & Design Themes

This folder contains all Google Stitch wireframe exports and reusable design themes for the invite-splitz platform.

---

## Folder Structure

```
plan/stitch/
  README.md                          ← this file
  themes/                            ← reusable design systems (one subfolder per theme)
    botanical_heirloom/
      DESIGN.md                      ← canonical theme tokens: colors, typography, spacing, components
  {client-folder}/                   ← one folder per wedding client (free-form naming)
    {theme-name}/
      DESIGN.md                      ← copy of the theme used for this client (for local reference)
    design.md                        ← Stitch-generated guest site design doc
    design_dashboard.md              ← Stitch-generated dashboard design doc
    design_settings.md               ← Stitch-generated settings design doc
    {screen_name}/                   ← one subfolder per screen
      screen.png                     ← screenshot of the wireframe
      code.html                      ← Stitch-generated HTML/CSS (implementation reference)
```

### Current clients

| Folder | Couple | Theme | Version |
|---|---|---|---|
| `stitch_v1_bretch & joyce` | Bretch & Joyce | Botanical Heirloom | v1 |

---

## Themes

Themes are **reusable design systems**. A new client can pick an existing theme and get a consistent visual language without starting from scratch.

Each theme lives in `themes/{theme-name}/DESIGN.md` and defines:
- Full color token system (Material Design-style semantic tokens + custom palette)
- Typography scale (font families, sizes, weights, line heights, letter spacing)
- Spacing constants (section gaps, container max-widths, gutter)
- Border radius scale
- Component style rules (buttons, inputs, cards, badges, modals, botanical accents)
- Elevation model (shadows and tonal layers)

### Available themes

| Theme | Style | Best for |
|---|---|---|
| `botanical_heirloom` | Minimalist romantic, yellow/green palette, Cormorant Garamond + Inter | Garden weddings, intimate celebrations |

### Adding a new theme

1. Create `themes/{new-theme-name}/DESIGN.md`
2. Define all token categories (see `botanical_heirloom/DESIGN.md` as a template)
3. Add the theme to the table above
4. When a new client uses this theme, copy the `DESIGN.md` into their client folder

---

## How agents must use this folder

### Before building any component or screen

1. Identify the **active client folder** from `NEXT_PUBLIC_WEDDING_ID` in the environment
2. Read the **theme `DESIGN.md`** inside that client folder — this is the source of truth for all design tokens. It overrides `/plan/design.md` where they conflict.
3. Find the matching **screen subfolder** for the component you are building (see Screen Index below)
4. Read `screen.png` for visual layout reference
5. Read `code.html` for implementation intent — Stitch's HTML/CSS shows exact spacing, font sizes, class names, and structure the designer intended

### Priority order when specs conflict

```
1. Theme DESIGN.md (in client stitch folder)  ← highest authority on tokens
2. screen.png / code.html (wireframe)         ← highest authority on layout
3. plan/design.md, plan/design-dashboard.md   ← fills gaps not covered by wireframes
4. Your own judgment                          ← last resort only
```

### What `code.html` gives you

- Exact pixel values for padding, margin, font size
- Which Tailwind classes the designer used
- The precise DOM structure and element hierarchy
- Inline comments from the designer (if any)

**Always read `code.html` alongside `screen.png`** — the screenshot shows the intent, the HTML shows the implementation.

---

## Screen Index

Maps screen folder names to their plan doc and dashboard/guest site location.

### Guest Site Screens

| Folder | Breakpoint | Plan doc | Route |
|---|---|---|---|
| `guest_landing_page` | Mobile (375px) | `frontend.md` | `/` |
| `guest_landing_page_desktop` | Desktop (1280px) | `frontend.md` | `/` |
| `guest_landing_page_desktop_with_entourage` | Desktop | `frontend.md` → EntourageSection | `/` |
| `guest_landing_page_desktop_with_photo_qr` | Desktop | `frontend.md` → PhotoQR | `/` |

### Dashboard & Auth Screens

| Folder | Breakpoint | Plan doc | Route |
|---|---|---|---|
| `dashboard_sign_in` | Mobile | `auth.md`, `design-dashboard.md` Screen 1 | `/dashboard/[weddingId]` (unauthenticated) |
| `dashboard_sign_in_desktop` | Desktop | `auth.md`, `design-dashboard.md` Screen 1 | `/dashboard/[weddingId]` (unauthenticated) |
| `dashboard_sign_in_email_google` | Both | `auth.md`, `design-dashboard.md` Screen 1 | `/dashboard/[weddingId]` (unauthenticated) |
| `dashboard_home` | Mobile | `design-dashboard.md` Screen 3 | `/dashboard/[weddingId]` |
| `dashboard_home_desktop` | Desktop | `design-dashboard.md` Screen 3 | `/dashboard/[weddingId]` |
| `guest_list` | Mobile | `design-dashboard.md` Screen 4 | `/dashboard/[weddingId]/guests` |
| `guest_list_desktop` | Desktop | `design-dashboard.md` Screen 4 | `/dashboard/[weddingId]/guests` |
| `add_guest_modal` | Mobile | `design-dashboard.md` Screen 5 | Modal on guest list |
| `add_guest_modal_desktop` | Desktop | `design-dashboard.md` Screen 5 | Modal on guest list |
| `csv_import_modal` | Mobile | `design-dashboard.md` Screen 8 Step 1 | Modal on guest list |
| `csv_import_modal_desktop` | Desktop | `design-dashboard.md` Screen 8 Step 1 | Modal on guest list |
| `csv_import_preview` | Mobile | `design-dashboard.md` Screen 8 Step 2 | Modal on guest list |
| `csv_import_preview_desktop` | Desktop | `design-dashboard.md` Screen 8 Step 2 | Modal on guest list |
| `wedding_settings_mobile` | Mobile | `design-settings.md` | `/dashboard/[weddingId]/settings` |
| `wedding_settings_desktop` | Desktop | `design-settings.md` | `/dashboard/[weddingId]/settings` |

### Component Assets

| File | Description |
|---|---|
| `a_clean_minimalist_qr_code_.../screen.png` | QR code component reference — use for `PhotoQR` and `PhotoQRSection` styling |

---

## Adding a New Client

When onboarding a new wedding client:

1. Create a new folder inside `plan/stitch/` — name it however makes sense (e.g. `john & mary`, `v2_santos`, etc.)
2. Copy the chosen theme's `DESIGN.md` into a subfolder matching the theme name (e.g. `{client-folder}/botanical_heirloom/DESIGN.md`)
3. Export wireframes from Google Stitch into screen subfolders — each with `screen.png` and `code.html`
4. Add the client to the **Current clients** table at the top of this README
5. Update `NEXT_PUBLIC_WEDDING_ID` in the new deployment's environment to point to that client's Firestore doc
6. Do NOT start Phase 1 (Static Site) until at least the guest landing page wireframe is present

---

## What is NOT in this folder

- Component behavior and logic → `frontend.md`, `rsvp.md`, `invite-link.md`
- Firestore schema → `backend.md`
- Auth flow → `auth.md`
- Roadmap and build order → `roadmap.md`
