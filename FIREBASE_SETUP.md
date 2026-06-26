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
2. Copy the **User UID** shown in the users list — this becomes `ownerId`.

## 4. Seed the wedding doc

**Build → Firestore Database → Start collection** → collection ID `weddings` → document ID `bretch-joyce` (matches `NEXT_PUBLIC_WEDDING_ID`).

Add fields:

| Field           | Type        | Value                                            |
| --------------- | ----------- | ------------------------------------------------ |
| `ownerId`       | string      | `<paste your User UID from step 3>`              |
| `coupleName`    | string      | `Bretch & Joyce`                                 |
| `weddingDate`   | string      | `2026-08-01`                                     |
| `hashtag`       | string      | `#spendtheBRETCHofmylifewithJOYCE`               |
| `photoAlbumUrl` | string      | *(leave empty for now)*                           |
| `ceremony`      | map         | `{ time, venue, address, mapsUrl }` (see below) |
| `reception`     | map         | `{ time, venue, address, mapsUrl }`              |
| `dressCode`     | map         | `{ description, palette }`                       |
| `entourage`     | array (map) | `[{ role, members: [] }, ...]`                   |
| `createdAt`     | timestamp   | **now**                                          |
| `updatedAt`     | timestamp   | **now**                                          |

Minimum ceremony/reception maps:
```json
{ "time": "3:00 PM", "venue": "TBD", "address": "TBD", "mapsUrl": "" }
```

Minimum dressCode map:
```json
{ "description": "Semi-formal / Garden Party", "palette": [] }
```

Minimum entourage array (one example group, more can be added later):
```json
[{ "role": "Principal Sponsors", "members": [] }]
```

## 5. Seed the access doc

Inside the `weddings/bretch-joyce` document, **Add collection** → collection ID `private` → document ID `access`.

Add one field:

| Field              | Type           | Value                                              |
| ------------------ | -------------- | -------------------------------------------------- |
| `authorizedEmails` | array (string) | `["you@gmail.com", "bride@gmail.com", "groom@gmail.com"]` |

Replace the three emails with the real authorized dashboard users. DK is always one of them.

## 6. (Optional) Seed a test guest

**Add collection** inside `weddings/bretch-joyce` → collection ID `guests` → document ID anything (e.g. `test1`).

Add fields:

| Field            | Type      | Value                                          |
| ---------------- | --------- | ---------------------------------------------- |
| `token`          | string    | `testtoken123` (any 12+ char string)           |
| `firstName`      | string    | `Test`                                         |
| `lastName`       | string    | `Guest`                                        |
| `pax`            | number    | `2`                                            |
| `role`           | string    | `Guest`                                        |
| `rsvpCount`      | number    | `null` (no response yet)                       |
| `rsvpSubmittedAt`| timestamp | (leave empty / null)                           |
| `createdAt`      | timestamp | **now**                                        |
| `updatedAt`      | timestamp | **now**                                        |

Test it by visiting `http://localhost:3000/?guest=testtoken123`.

## 7. Deploy the security rules

From the project root, with the Firebase CLI installed (`npm i -D firebase-tools`):

```bash
firebase login                  # if not already authenticated
firebase use --add              # link this directory to your Firebase project
firebase deploy --only firestore:rules
```

## 8. Run the emulator (optional, for testing rules locally)

```bash
firebase emulators:start --only auth,firestore
```

Then in another terminal, point the app at the emulator. Add to `.env.local` (only used when running the app with the emulator):

```env
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST=localhost:9099
NEXT_PUBLIC_FIREBASE_FIRESTORE_EMULATOR_HOST=localhost:8080
```

(Add emulator detection in `lib/firebase.ts` when you're ready to test the rules end-to-end. The helpers in `lib/firestore.ts` already use the `db` export from `firebase.ts`, so they will pick up the emulator config automatically once `connectFirestoreEmulator` is called in `lib/firebase.ts`.)
