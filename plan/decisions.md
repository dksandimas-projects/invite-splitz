# invite-splitz — Architectural Decision Records

> **Agent note:** This file explains *why* key decisions were made, not just *what* was decided.
> Read this when a plan doc and your instincts conflict, or before proposing an alternative approach.
> Do not override these decisions without discussing with DK first.

---

## ADR-001 — Firestore-based access control (not env var)

**Decision:** Authorized dashboard emails are stored in `weddings/{weddingId}/private/access` → `authorizedEmails: string[]`. No `ALLOWED_DASHBOARD_EMAILS` environment variable.

**Why:** An env var requires a Vercel redeployment every time an email is added or removed. Storing in Firestore means DK or the couple can manage access from the Wedding Settings → Team Access screen with zero downtime. The couple should be able to grant/revoke access themselves.

**Trade-offs accepted:**
- `AuthGuard` now makes a Firestore read on every sign-in to fetch the allowed list. This is one extra read per session — acceptable cost.
- The `private/access` doc must be seeded manually in Firebase Console before the first sign-in (documented in `roadmap.md` Phase 2).

**Do not revert to env var.** If the list of authorized users grows large, the correct fix is pagination or caching — not moving back to env vars.

---

## ADR-002 — Count-based RSVP (not boolean)

**Decision:** RSVP is stored as `rsvpCount: null | 0 | 1..N` — a count of attending people from the guest's allocated party (pax), not a simple yes/no boolean.

**Why:** Many guests are invited as couples or families. A boolean can't distinguish "just me" from "both of us" from "all four of us." Count-based RSVP lets the couple track exact headcount for catering without adding dietary or name-per-seat complexity.

**Key semantic rules:**
- `null` = no response yet (not a decline)
- `0` = explicitly declined
- `1..pax` = confirmed attending (specific count)

**Do not add a boolean `rsvpAccepted` field** — the count already encodes the yes/no signal.

---

## ADR-003 — Dynamic dashboard routing `/dashboard/[weddingId]`

**Decision:** The dashboard uses a Next.js dynamic segment `[weddingId]` even though this is a single-tenant deployment. The active `weddingId` is read from `NEXT_PUBLIC_WEDDING_ID` env var and used to build all links via `dashboardHref()`.

**Why:** A hardcoded `/dashboard` route would need restructuring if this codebase ever serves multiple weddings. The dynamic segment makes `weddingId` a variable at the routing level today, so going multi-tenant only requires making the env var dynamic — no route restructuring.

**Implication:** All internal navigation must use `dashboardHref()` from `/lib/nav.ts`. Never hardcode `/dashboard/bretch-joyce/...` in a component.

---

## ADR-004 — `ownerId` on the wedding doc

**Decision:** Every `WeddingDoc` has an `ownerId: string` field set to the Firebase Auth UID of DK (the deployer). Firestore rules use an `isOwner()` helper that checks `request.auth.uid === wedding.ownerId`.

**Why:** Without `ownerId`, Firestore rules can't distinguish which authenticated user owns which wedding. Adding a second wedding to the same Firebase project would either require open write access or manual per-document rules. `ownerId` scales to N weddings with zero rule changes.

**Rules:**
- `ownerId` is set once at seeding time and never changed
- `WeddingConfigUpdate` type explicitly excludes `ownerId` and `createdAt` so they can't be overwritten via the settings form
- In single-tenant mode, `ownerId` is DK's UID; if the couple gets their own Firebase account, their UID can be used instead

---

## ADR-005 — Config in Firestore (not hardcoded `/lib/config.ts`)

**Decision:** All wedding content (couple name, ceremony, reception, dress code, entourage, photo album URL) lives in the `weddings/{weddingId}` Firestore doc. The dashboard's Wedding Settings screen edits it. The guest site fetches it on every page load.

**Why:** Hardcoded config requires a redeployment to change any detail. The couple should be able to update their ceremony time, venue address, or dress code description at 11pm the night before without involving DK. Firestore config makes the guest site a live document.

**Trade-offs accepted:**
- Every guest site page load costs one Firestore read for `getWedding()`. At wedding scale (hundreds of concurrent guests max), this is negligible.
- If `getWedding()` fails, the page must handle a graceful error state (skeleton or error message — not a crash).

**Do not move config back to `/lib/config.ts`.** The file may still exist for constants that are truly static (e.g., fallback Bible verse), but not for wedding-specific content.

---

## ADR-006 — Both Google Sign-in and email/password simultaneously

**Decision:** The sign-in screen supports both Google Sign-in (`signInWithPopup`) and email/password (`signInWithEmailAndPassword`) at the same time. No self-signup — DK creates email/password accounts manually in Firebase Console.

**Why:** The couple prefers not to manage a Google account for dashboard access. DK uses Google Sign-in for convenience. The bride/groom may use email/password. Both methods funnel through the same `AuthGuard` email check, so access control is method-agnostic.

**What to never add:**
- "Create account" or "Sign up" link on the sign-in screen
- "Forgot password" flow (DK resets passwords via Firebase Console)

---

## ADR-007 — `nanoid(12)` for guest tokens

**Decision:** Guest invite tokens are 12-character nanoid strings (URL-safe alphabet, ~71 bits of entropy).

**Why:** Tokens must be short enough to share in a URL, hard enough to guess that enumeration is infeasible, and URL-safe so they don't need encoding. 12 chars gives 71 bits — brute-forcing one token requires ~2.4 quintillion attempts. UUID is overkill and too long.

**Token rules:**
- Generated once on guest creation, never changed
- Stored in `GuestDoc.token`, also used as the URL param `?guest=<token>`
- The token is a shared secret — no additional auth is needed to RSVP

---

## ADR-008 — Single-scroll settings page (no tabs or sub-pages)

**Decision:** The Wedding Settings screen is one long scroll with all six (now seven) sections, one Save button, and one Team Access save. No tabs, no sub-routes.

**Why:** The couple will visit Settings infrequently, typically to fill everything out at once before the wedding. A tab-based UI adds navigation overhead for a form they'll only use a handful of times. One scroll keeps all fields visible and reduces the risk of forgetting to fill a section.

**Exception:** Team Access has its own Save button because it writes to a separate Firestore doc (`private/access`) and shouldn't be bundled with wedding config saves.

---

## ADR-009 — Component library first (atoms → molecules → organisms)

**Decision:** Phase 1 begins with building the entire shared component library before a single screen is assembled. Every button on every screen uses `<Button>`. Every input uses `<FormField>` + `<Input>`. No raw Tailwind in page files.

**Why:** Without this rule, each screen accumulates its own one-off styled elements. By wedding two, the codebase would have 15 different button implementations. The enforced build order ensures visual consistency across 19 screens with zero extra effort.

**Enforcement:** A CI check (or manual grep) should confirm no page files contain raw `rounded-full`, `bg-[#E8C800]`, `shadow-sm`, or `<button className=...>` outside of component files.

---

## ADR-010 — Stitch wireframes as the highest layout authority

**Decision:** Google Stitch wireframe `code.html` and `screen.png` files are the highest authority for layout decisions, overriding `/plan/design.md` where they conflict. Token values (colors, typography) from the theme `DESIGN.md` override the wireframe's inline values.

**Why:** The wireframes represent the approved visual design. DK signed off on them. Deviating from the layout without approval wastes review cycles. Stitch's HTML also encodes exact pixel values that would otherwise require interpretation.

**Priority order:**
1. Theme `DESIGN.md` — tokens (colors, type scale)
2. Wireframe `code.html` / `screen.png` — layout, spacing, DOM structure
3. Plan docs (`design.md`, `design-dashboard.md`) — fills gaps not in wireframes
4. Judgment — last resort
