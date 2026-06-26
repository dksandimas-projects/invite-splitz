# invite-splitz — Project Overview

> **Agent entry point.** Read this file first before any other plan doc.
> All implementation docs are in `/plan/`. Read only the docs relevant to your task.

---

## Project

| Field | Value |
|---|---|
| Product | Wedding e-invite platform with personalized guest links and RSVP |
| Client | Bretch & Joyce |
| Wedding date | August 1, 2026 |
| Developer | DK |
| Repo | `invite-splitz` |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), React, TypeScript, Tailwind CSS |
| Backend | Firebase Firestore (database), Firebase Auth (authentication) |
| Hosting | Vercel |
| Auth method | Google Sign-in OR email + password via Firebase Auth (couple's dashboard only — guests do not log in) |

---

## App Structure (High Level)

```
/app
  /                                    → Public: guest-facing wedding site
  /dashboard/[weddingId]               → Private: couple's management dashboard
  /dashboard/[weddingId]/guests        → Guest list management
  /dashboard/[weddingId]/settings      → Wedding config editor
  /api/rsvp                            → API route: RSVP submission
/components
  /site                                → Guest-facing UI components
  /dashboard                           → Dashboard UI components
  /shared                              → Shared components (Button, etc.)
/lib
  /firebase.ts                         → Firebase client init
  /firestore.ts                        → Firestore helpers
  /tokens.ts                           → Invite token utilities
/types
  /index.ts                            → Shared TypeScript types
/plan                                  → Implementation plan docs (this folder)
```

**weddingId in single-tenant mode:** Read from `NEXT_PUBLIC_WEDDING_ID` env var. All dashboard links are built with this value. No dynamic resolution needed until multi-tenant.

---

## Scope

### In scope
- Public guest-facing wedding site, personalized per guest via URL token
- Couple's private dashboard (Google Sign-in or email + password — access restricted by email allowlist)
- Guest list management (add/edit/delete/CSV import)
- Auto-generated unique invite links per guest
- RSVP confirmation (count-based, no login required)
- Entourage list, dress code with color palette, photo QR code

### Out of scope — do not implement
- Meal preference / dietary questions
- Guest verification or name-matching at entry
- Plus-one additions (pax is fixed per guest record)
- Payment, registry, or e-commerce integration
- Self-service signup for couples (DK deploys per client)

---

## Key Constraints

1. **Guests never log in.** Authentication is identified by the `?guest=<token>` URL param only.
2. **Pax is fixed.** Guests cannot increase their party size beyond what's in their record.
3. **RSVP is one-time.** Once submitted, the guest sees a confirmation state. No editing after submission (unless DK resets it from the dashboard).
4. **No RSVP ≠ declining.** `rsvpCount: null` means no response — not a decline.
5. **Single wedding config.** This codebase serves one wedding at a time. There is no multi-tenant routing. Future clients get a fresh clone.

---

## Multi-Tenant Upgrade Path

This codebase is currently **single-tenant** (one wedding per deployment). The architecture is partially upgrade-friendly but not fully. This section documents what carries over and what would need rework if the platform evolves into a multi-tenant SaaS.

### What carries over cleanly
- **Firestore schema** — `weddings/{weddingId}/guests/{guestId}` already supports multiple weddings in one database. The `weddingId` constant in `/lib/firestore.ts` just becomes a dynamic value.
- **Guest token system** — tokens are already scoped to a guest doc under a specific `weddingId`, so no collision risk across weddings.
- **Component architecture** — all UI components are stateless and config-driven; they will work in a multi-tenant context without changes.

### What would need rework
| Area | Current | Multi-tenant requirement |
|---|---|---|
| Auth | Email/password, accounts created manually by DK | Couples self-register; each account is scoped to their `weddingId` |
| Routing | `/dashboard` is one couple's dashboard | `/dashboard/{weddingId}` or subdomain per couple |
| Firestore security rules | Rules don't verify that the authenticated user owns the wedding they're reading | Rules must check `userId === wedding.ownerId` |
| Wedding config | Hardcoded in `/lib/config.ts` per deployment | Moved to Firestore, editable per couple via dashboard |
| Super-admin | No concept exists | A separate admin role needed to manage all couples and deployments |

### Decisions already implemented to reduce future rework

These three architectural choices are baked into the current single-tenant build:

1. **Dynamic routing** — Dashboard uses `/dashboard/[weddingId]` with `NEXT_PUBLIC_WEDDING_ID` hardcoded per deployment. Going multi-tenant only requires making `weddingId` dynamic — no route restructuring needed.

2. **`ownerId` on the wedding doc** — Every wedding doc stores the Firebase Auth UID of its owner. Firestore rules already check `request.auth.uid === resource.data.ownerId`. Adding more couples means adding more owners — no rule rewrite needed.

3. **Config in Firestore** — Wedding content (ceremony, reception, dress code, entourage, photo album URL) lives in the `weddings/{weddingId}` Firestore doc, not in a hardcoded file. The dashboard has a Wedding Settings screen to edit it. Going multi-tenant just means each couple manages their own doc.

### What still requires rework for multi-tenant
- Self-registration auth (couples signing up themselves)
- Super-admin role
- Billing / subscription layer

---

## Plan Docs Index

| File | What it covers |
|---|---|
| `overview.md` | This file — project context and constraints |
| `roadmap.md` | Phased implementation plan with milestones |
| `frontend.md` | Guest-facing site — routes, components, section specs |
| `backend.md` | Firestore schema, TypeScript types, security rules |
| `auth.md` | Firebase Auth, email/password sign-in, dashboard route protection |
| `rsvp.md` | RSVP flow — state machine, UI, Firestore writes, edge cases |
| `invite-link.md` | Token generation, URL param handling, guest resolution |
| `components.md` | Shared component library — atoms, molecules, organisms, design tokens |
| `design.md` | Visual design for the guest-facing site |
| `design-dashboard.md` | Visual design for dashboard and auth screens |
| `design-settings.md` | Full spec for the Wedding Settings screen and sub-editors |

---

## Environment Variables

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_BASE_URL=                    # e.g. https://bretchandjoyce.vercel.app
NEXT_PUBLIC_WEDDING_ID=                  # e.g. bretch-joyce — identifies the wedding doc in Firestore
```

All `NEXT_PUBLIC_` vars are safe to expose to the browser. `NEXT_PUBLIC_WEDDING_ID` is the Firestore document ID for this deployment's wedding.

**No email allowlist env var.** Authorized dashboard emails are stored in Firestore at `weddings/{weddingId}/private/access` and managed from the Wedding Settings → Team Access screen. No redeployment needed to add or remove access.
