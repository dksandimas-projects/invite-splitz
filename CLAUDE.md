# invite-splitz — Claude Agent Instructions

Before writing any code, read the `/plan` folder in full.

## Required reading order

1. `/plan/overview.md` — project context, tech stack, scope, constraints
2. `/plan/roadmap.md` — phased build order; follow phases sequentially
3. The specific doc for the area you are working on:
   - Frontend / guest site → `/plan/frontend.md`
   - Firestore schema, types, rules → `/plan/backend.md`
   - Firebase Auth, dashboard access → `/plan/auth.md`
   - RSVP flow and API → `/plan/rsvp.md`
   - Invite link / token system → `/plan/invite-link.md`
   - Shared component library (atoms, molecules, organisms, tokens) → `/plan/components.md`
   - Visual design (guest site) → `/plan/design.md`
   - Visual design (dashboard + auth) → `/plan/design-dashboard.md`
   - Visual design (wedding settings screen) → `/plan/design-settings.md`
   - Wireframes → `/plan/stitch/` — read `README.md` in that folder first, then the theme `DESIGN.md`, then the relevant screen's `code.html` and `screen.png`

## Rules

- Do not implement anything marked **Out of scope** in `overview.md`.
- Do not skip phases in `roadmap.md` — each phase has dependencies.
- All hardcoded wedding content goes in `/lib/config.ts`, never inline in components.
- Every plan doc has **Acceptance criteria** — treat these as your definition of done.
- When a plan doc and the code conflict, ask before assuming which is correct.
