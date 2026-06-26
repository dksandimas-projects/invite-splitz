# Handoff — invite-splitz

Everything you need to manage the site after launch.

## Live URLs

| Where | URL |
|---|---|
| **Guest site** | `https://rsvp.splitz.me` |
| **Per-guest invite** | `https://rsvp.splitz.me/?guest=<token>` |
| **Dashboard** | `https://rsvp.splitz.me/dashboard/bretch-joyce` |
| **Open Graph image** | `https://rsvp.splitz.me/og` (auto-generated PNG) |

`bretch-joyce` is the Firestore document ID (= `NEXT_PUBLIC_WEDDING_ID`).

## Sign in

1. Go to `https://rsvp.splitz.me/dashboard/bretch-joyce`
2. Click **Sign in with Google** and pick the `dksandimas@gmail.com` account (or enter email + password)
3. AuthGuard checks `weddings/bretch-joyce/private/access` and shows the dashboard only if your email is in `authorizedEmails`

To add/remove authorized dashboard users (e.g. the bride, the groom):
1. Sign in → **Settings → Team Access**
2. Type the email → **+ Add** → **Save Access List**
3. The new user can now sign in immediately. No redeploy needed.

## Add guests

There are three ways:

### 1. Manually (1 at a time)

1. Sign in → **Guests** → **Add Guest**
2. Fill in First Name, Last Name, Pax, Role
3. Click **Add Guest**
4. Find the new guest in the list → click **Copy** to grab their invite link

### 2. CSV import (bulk)

1. Sign in → **Guests** → **Import CSV**
2. Upload a `.csv` file with these columns (header row required):

```csv
firstName,lastName,pax,role
Maria,Santos,2,Principal Sponsor
Ricardo,Dela Cruz,4,Secondary Sponsor
Isabella,Montenegro,1,Entourage
Rafael,Gomez,2,Guest
```

- `pax` defaults to `1` if missing; must be a positive integer
- `role` is one of: `Principal Sponsor`, `Secondary Sponsor`, `Entourage`, `Guest` (case-insensitive; defaults to `Guest`; underscores/hyphens tolerated)
- Rows missing `firstName` or `lastName` are skipped (shown in the preview's "skipped rows" section)
- Rows whose `firstName|lastName` already exists are skipped (no duplicates)

3. Preview shows the first 5 rows; review, then **Import N Guests**
4. Each guest gets an auto-generated 12-char token (e.g. `a3k8mz2pq9xw`) in the form `?guest=<token>`

### 3. Directly in Firestore (advanced)

For one-off fixes, edit/add a doc at `weddings/bretch-joyce/guests/<docId>` in the Firebase Console. Required fields:

| Field | Type |
|---|---|
| `token` | string (must be unique; suggest 12+ chars) |
| `firstName` | string |
| `lastName` | string |
| `pax` | number (≥ 1) |
| `role` | string (Title Case from list above) |
| `rsvpCount` | number or null |
| `rsvpSubmittedAt` | timestamp or null |
| `createdAt` | timestamp |
| `updatedAt` | timestamp |

## Share invite links

Each guest has a unique URL: `https://rsvp.splitz.me/?guest=<token>`

The **Copy** button on each guest row copies the full URL to the clipboard. You can also:
- Send the link via SMS, WhatsApp, email — whatever you prefer
- Print QR codes that point to each link (a future feature)

When a guest opens their link:
- They see a personalized greeting ("You're invited, Maria!")
- The RSVP form shows their party size (1 button for solo, 1/2 buttons for couples, N buttons for groups)
- They can decline or confirm a count, one time
- They see the "Thank you" state on subsequent visits

The token never expires. To revoke access, delete the guest doc.

## Change wedding details

1. Sign in → **Settings**
2. Edit any section (The Couple, Ceremony, Reception, Dress Code, Photo Album, Entourage)
3. Click **Save Changes** at the bottom of the form
4. The guest site reflects the new data on the next page load (live updates via Firestore subscription)

For Team Access, use the **Save Access List** button inside that section (not the bottom Save Changes).

## Reset a guest's RSVP

If a guest submits the wrong count or changes their mind:

1. **Guests** → find the row → click the **↺** icon on the right
2. Confirm **Reset** in the dialog
3. The guest can now submit again. Their old RSVP is wiped from Firestore.

The guest site shows a "Thank you" state once a guest has responded. After a reset, they'll see the RSVP form again on next page load.

## Update the photo album

1. Create a Google Photos shared album (or any URL-accessible photo collection)
2. Copy the share link
3. **Settings → Photo Album** → paste the URL → **Save Changes**
4. The guest site shows a QR code linking to that album in the **Snap & Share** section

## Live data — what updates without a refresh

The dashboard auto-updates for:
- New RSVPs (you'll see them in the Overview summary and Recent Responses)
- New/edited/deleted guests (the list updates in place)
- Settings changes (TopNav couple name updates)

The guest site re-fetches on every page load. No caching. So changes are visible on the next page load.

## Deployment

- **Hosting**: Vercel
- **Domain**: `rsvp.splitz.me` (CNAME `cname.vercel-dns.com`)
- **Auto-deploys**: every push to `main` triggers a new deployment
- **Env vars** (set in Vercel → Project Settings → Environment Variables):
  - `NEXT_PUBLIC_FIREBASE_API_KEY` = `AIzaSyBuHzdJn9_y0wenkeV8cGlvPPcLWXQShDk`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` = `invite-splitz.firebaseapp.com`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID` = `invite-splitz`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` = `invite-splitz.firebasestorage.app`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` = `504817981822`
  - `NEXT_PUBLIC_FIREBASE_APP_ID` = `1:504817981822:web:49d48c16dcba7f00f43b2f`
  - `NEXT_PUBLIC_BASE_URL` = `https://rsvp.splitz.me`
  - `NEXT_PUBLIC_WEDDING_ID` = `bretch-joyce`

## Local dev

```bash
# Install
npm install

# Seed (overwrites all docs in Firestore)
npm run seed

# Run dev server
npm run dev

# Build (verifies production build)
npm run build

# Deploy rules to Firestore
firebase deploy --only firestore:rules
```

The seed script needs `service-account.json` (gitignored) at the project root. Get one from Firebase Console → Project Settings → Service Accounts → Generate new private key.

## Things to know

- **No email is sent** from this app. The couple (you) sends invite links manually.
- **No payment integration.** Out of scope.
- **Single wedding per deployment.** This is a single-tenant build. For a new wedding, clone the repo and re-seed.
- **Auth uses allowlist emails.** No self-signup. The only sign-in methods are Google and email/password (created manually in Firebase Console).
- **The dashboard is private.** Only listed emails can sign in; everyone else gets "Access Denied".
- **Guests never log in.** They RSVP via the URL token, no account needed.

## Emergency / "oh no" actions

| What happened | Fix |
|---|---|
| Invited the wrong person | Delete the guest row. The token stops working immediately. |
| Couple split, wedding cancelled | Set the wedding doc to inactive in Firestore (future: add an "active" flag). For now, just don't share the link. |
| Spammer found a token | Tokens are 31^12 ≈ 8.2e17 combinations. The RSVP rule only allows one write per guest, so the worst they can do is submit a single fake RSVP. Delete the guest to invalidate. |
| Need to add the bride/groom as admins | Settings → Team Access → add their email → Save. |
| Dashboard site looks broken | Check Vercel deploy logs. The site is fully server-rendered; check `NEXT_PUBLIC_*` env vars in Vercel. |
| Rules rejection errors | Check `firebase deploy --only firestore:rules` output. The current deployed rules are at `firestore.rules` in this repo. |

## Where things live in the code

```
app/
  page.tsx              ← guest site, reads wedding + guest by token
  layout.tsx            ← root, fonts, OG metadata, ToastProvider
  og/route.tsx          ← dynamic Open Graph image generator
  api/rsvp/route.ts     ← POST endpoint for guest RSVP submissions
  dashboard/[weddingId]/
    layout.tsx          ← AuthGuard wrapper
    page.tsx            ← Overview / RSVP summary
    guests/page.tsx     ← Guest list (table on desktop, cards on mobile)
    settings/page.tsx   ← Wedding settings + Team Access

components/
  shared/               ← atoms + molecules (Button, Modal, Toast, etc.)
  site/                 ← guest site components (Hero, Greeting, etc.)
  dashboard/            ← dashboard components (TopNav, GuestTable, etc.)

lib/
  firebase.ts           ← Firebase client init
  firestore.ts          ← Firestore helpers (reads, writes, subscriptions)
  auth.ts               ← Firebase Auth helpers
  tokens.ts             ← token generator (nanoid 12, ambiguous chars excluded)
  config.ts             ← seed content (couple names, entourage, etc.)
  serialize.ts          ← Timestamp → ISO string converters
  nav.ts                ← dashboardHref() path builder
  dummyData.ts          ← legacy Phase 1 dummy data (no longer used at runtime)

firestore.rules         ← security rules
firebase.json           ← Firebase CLI / emulator config
scripts/seed.mjs        ← Firestore seeder (idempotent)
scripts/seed.config.json ← your seed values (gitignored)
service-account.json    ← Firebase Admin SDK key (gitignored)

types/index.ts          ← Firestore document types
```

## Roadmap status

All 8 phases from `plan/roadmap.md` are implemented:

- [x] **Phase 0** — Next.js 14 + Firebase init
- [x] **Phase 1** — Static site + dashboard
- [x] **Phase 2** — Firestore data model + types + rules
- [x] **Phase 3** — Invite link system (token generation + `?guest=` resolution)
- [x] **Phase 4** — Guest-facing site (Firestore-driven)
- [x] **Phase 5** — RSVP (public API route + form states)
- [x] **Phase 6** — Couple dashboard (auth, all CRUD, settings)
- [x] **Phase 7** — CSV import (papaparse + dedup)
- [x] **Phase 8** — Polish & handoff (OG image, metadata, this doc)
