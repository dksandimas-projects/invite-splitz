# Firebase Setup & Seeding

One-time steps to provision the Firebase project for `invite-splitz`.

## 1. Create the project

1. Go to https://console.firebase.google.com → **Add project** → name it `invite-splitz`.
2. Enable **Google Analytics** (optional).
3. Once created, click the Web icon (`</>`) to register a web app.
4. Copy the web config values into `.env.local` (the Phase 0 scaffold already has them).

## 2. Enable products

In the Firebase Console for the project:

- **Build → Firestore Database** → **Create database** → start in **production mode** → choose region (e.g. `asia-southeast1`).
- **Build → Authentication** → **Get started** → enable:
  - **Google** sign-in provider (add a support email).
  - **Email/Password** sign-in provider.

## 3. Create your owner user

1. **Authentication → Users** → **Add user** → enter your email + a password → **Add user**.
2. Copy the **User UID** shown in the users list — this becomes `ownerId` in the seed config.

## 4. Seed via script (recommended)

The repo includes a seed script that provisions all three docs (wedding, access, optional test guest) in one go.

### 4a. Download a service account key

**Project Settings → Service Accounts → Firebase Admin SDK** → **Generate new private key** → downloads a JSON file.

Save it as `service-account.json` at the project root (it's gitignored).

### 4b. Create the seed config

```bash
cp scripts/seed.config.example.json scripts/seed.config.json
```

Edit `scripts/seed.config.json` and fill in:
- `OWNER_ID` — your Firebase Auth UID from step 3
- `AUTHORIZED_EMAILS` — array of dashboard-allowed emails (start with just your own)
- All other fields are optional and have sensible defaults

### 4c. Run the seed

```bash
npm run seed
```

Output:
```
→ Seeding project: invite-splitz
→ Wedding ID:     bretch-joyce
→ Owner UID:      <your-uid>
→ Authorized:     you@gmail.com
→ Test guest:     Test Guest
  + Creating WeddingDoc at weddings/bretch-joyce
  + Creating AccessDoc at weddings/bretch-joyce/private/access
  + Creating GuestDoc (token=xyz...) at weddings/bretch-joyce/guests/test1
  ℹ Generated token: xyz...

✓ Seed complete.
```

The script is **idempotent** — re-running will overwrite existing docs (with a warning). Pass `npm run seed:strict` to refuse overwrites.

CLI flags:
- `--strict` — refuse to overwrite existing docs
- `--no-test-guest` — skip the test guest

## 5. Seed via Console (fallback if you can't install firebase-admin)

If you'd rather not deal with the Admin SDK, see the original manual walkthrough at the bottom of this file (search for "Doc 1: weddings/bretch-joyce").

## 6. Deploy the security rules

```bash
firebase login
firebase use --add              # link this directory to your Firebase project
firebase deploy --only firestore:rules
```

## 7. Run the emulator (optional, for testing rules locally)

```bash
firebase emulators:start --only auth,firestore
```

To point the app at the emulator, add to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST=localhost:8080
```

(The helpers in `lib/firestore.ts` automatically pick up emulator config once `connectFirestoreEmulator` is wired into `lib/firebase.ts`.)

---

## Manual seeding walkthrough (fallback)

### Doc 1: `weddings/bretch-joyce`

**Build → Firestore Database → Start collection** (or if you see no `weddings` collection, the screen starts automatically)
- Collection ID: `weddings`
- Next
- Document ID: `bretch-joyce`

Add these fields one at a time:

| Field            | Type      | Value                                                              |
| ---------------- | --------- | ------------------------------------------------------------------ |
| `ownerId`        | `string`  | `<your User UID>`                                                  |
| `coupleName`     | `string`  | `Bretch & Joyce`                                                   |
| `weddingDate`    | `string`  | `2026-08-01`                                                       |
| `hashtag`        | `string`  | `#spendtheBRETCHofmylifewithJOYCE`                                 |
| `photoAlbumUrl`  | `string`  | *(empty)*                                                          |
| `ceremony`       | `map`     | `{ time, venue, address, mapsUrl }` (each as `string`)            |
| `reception`      | `map`     | same shape as `ceremony`                                           |
| `dressCode`      | `map`     | `{ description: string, palette: array }`                          |
| `entourage`      | `array`   | `[{ role: string, members: array }]`                              |
| `createdAt`      | `timestamp` | **now**                                                          |
| `updatedAt`      | `timestamp` | **now**                                                          |

### Doc 2: `weddings/bretch-joyce/private/access`

In the `weddings/bretch-joyce` document, click **+ Add collection**.
- Collection ID: `private`
- Next
- Document ID: `access`

Add one field:

| Field              | Type           | Value                                                              |
| ------------------ | -------------- | ------------------------------------------------------------------ |
| `authorizedEmails` | `array`        | `["you@gmail.com"]` (add more later via the dashboard)             |

### (Optional) Test guest `weddings/bretch-joyce/guests/test1`

In the `weddings/bretch-joyce` document, click **+ Add collection**.
- Collection ID: `guests`
- Next
- Document ID: `test1`

Fields:
- `token: string = "testtoken123"`
- `firstName: string = "Test"`
- `lastName: string = "Test"`
- `pax: number = 2`
- `role: string = "Guest"`
- `rsvpCount: null` (type: `null`)
- `rsvpSubmittedAt: null` (type: `null`)
- `createdAt: timestamp = now`
- `updatedAt: timestamp = now`

Test at `http://localhost:3000/?guest=testtoken123`.
