# invite-splitz — Environment Variables Reference

> **Agent note:** All environment variables are defined in `.env.local` for local development
> and in the Vercel project dashboard for preview/production. The `.env.example` file at the
> repo root contains all keys with empty values — commit that file, never `.env.local`.

---

## Full Variable List

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# App
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_WEDDING_ID=
```

There are **no server-only env vars** (no vars without `NEXT_PUBLIC_`). All vars are browser-safe. Firebase security rules are the access control layer — client-side Firebase config being public is intentional and expected.

---

## Variable Details

### `NEXT_PUBLIC_FIREBASE_API_KEY`

| | |
|---|---|
| **Where to get it** | Firebase Console → Project Settings → General → Your apps → Web app → SDK snippet |
| **Used in** | `/lib/firebase.ts` — `initializeApp()` config |
| **Notes** | Safe to expose publicly. Firebase uses Authorized Domains and security rules to prevent abuse. |

---

### `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`

| | |
|---|---|
| **Where to get it** | Firebase Console → Project Settings → Your apps → SDK snippet |
| **Format** | `{project-id}.firebaseapp.com` |
| **Used in** | `/lib/firebase.ts` — `initializeApp()` config |
| **Notes** | Required for Firebase Auth to work. Must match the Firebase project. |

---

### `NEXT_PUBLIC_FIREBASE_PROJECT_ID`

| | |
|---|---|
| **Where to get it** | Firebase Console → Project Settings → General → Project ID |
| **Format** | e.g. `invite-splitz` |
| **Used in** | `/lib/firebase.ts` — `initializeApp()` config |
| **Notes** | Also determines the Firestore database URL. |

---

### `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`

| | |
|---|---|
| **Where to get it** | Firebase Console → Project Settings → Your apps → SDK snippet |
| **Format** | `{project-id}.appspot.com` or `{project-id}.firebasestorage.app` |
| **Used in** | `/lib/firebase.ts` — `initializeApp()` config |
| **Notes** | Required even if Firebase Storage is not actively used — omitting it causes a Firebase init warning. |

---

### `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`

| | |
|---|---|
| **Where to get it** | Firebase Console → Project Settings → Your apps → SDK snippet |
| **Used in** | `/lib/firebase.ts` — `initializeApp()` config |
| **Notes** | Not used for Firestore or Auth features, but required by Firebase SDK initialization. |

---

### `NEXT_PUBLIC_FIREBASE_APP_ID`

| | |
|---|---|
| **Where to get it** | Firebase Console → Project Settings → Your apps → SDK snippet |
| **Format** | `1:123456789:web:abcdef...` |
| **Used in** | `/lib/firebase.ts` — `initializeApp()` config |
| **Notes** | Identifies this specific web app within the Firebase project. |

---

### `NEXT_PUBLIC_BASE_URL`

| | |
|---|---|
| **Purpose** | Base URL for generating guest invite links |
| **Local value** | `http://localhost:3000` |
| **Preview value** | The Vercel preview URL, e.g. `https://invite-splitz-git-main-dk.vercel.app` |
| **Production value** | The production domain, e.g. `https://bretchandjoyce.vercel.app` |
| **Used in** | `/lib/tokens.ts` → `buildInviteUrl(token)` → `${BASE_URL}/?guest=${token}` |
| **Notes** | No trailing slash. If this is wrong or missing, invite links will be malformed. Verify before sending any invites. |

---

### `NEXT_PUBLIC_WEDDING_ID`

| | |
|---|---|
| **Purpose** | The Firestore document ID for this deployment's wedding |
| **Format** | Lowercase, hyphen-separated, e.g. `bretch-joyce` |
| **Used in** | `/lib/firestore.ts` — all Firestore paths use this as the `weddingId` segment |
| **Used in** | `/lib/nav.ts` → `dashboardHref()` — all dashboard links include this value |
| **Notes** | Must exactly match the document ID in `weddings/{weddingId}` in Firestore. Changing this without updating the Firestore doc ID will break all reads and writes. |

---

## Per-Environment Setup

### Local development (`.env.local`)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=invite-splitz.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=invite-splitz
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=invite-splitz.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_WEDDING_ID=bretch-joyce
```

- `.env.local` is git-ignored — never commit it
- Copy from `.env.example` and fill in values from Firebase Console

---

### Vercel (Preview and Production)

Set these in: Vercel Dashboard → Project → Settings → Environment Variables

| Variable | Preview | Production |
|---|---|---|
| Firebase vars | Same as local (same Firebase project) | Same as local |
| `NEXT_PUBLIC_BASE_URL` | Vercel preview URL (auto-assigned) | Production domain |
| `NEXT_PUBLIC_WEDDING_ID` | `bretch-joyce` (same) | `bretch-joyce` (same) |

**Note:** Vercel auto-assigns preview URLs per branch. If you need invite links to work on preview deployments, set `NEXT_PUBLIC_BASE_URL` to the preview URL for that branch.

---

## `.env.example` (commit this file)

```env
# Firebase — get values from Firebase Console → Project Settings → Your apps → SDK snippet
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# App
NEXT_PUBLIC_BASE_URL=                    # e.g. http://localhost:3000 or https://bretchandjoyce.vercel.app
NEXT_PUBLIC_WEDDING_ID=                  # e.g. bretch-joyce — must match Firestore document ID
```

---

## Adding a New Client Deployment

When deploying for a new wedding client:

1. Create a new Vercel project (or new deployment from the same repo)
2. Set `NEXT_PUBLIC_WEDDING_ID` to the new client's wedding ID (e.g. `john-mary`)
3. Set `NEXT_PUBLIC_BASE_URL` to the new deployment's domain
4. Firebase vars stay the same — all clients share one Firebase project, separated by `weddingId`
5. Seed `weddings/john-mary` and `weddings/john-mary/private/access` in Firestore
