# invite-splitz — Auth & Roles

> **Agent note:** This file covers Firebase Auth, dashboard sign-in (Google + email/password),
> and access control. Guests do not authenticate. Auth is for the couple's dashboard only.
> Read `overview.md` first.

---

## Auth Model

| Actor | Auth method | Access |
|---|---|---|
| Guest | None — identified by URL token only | Public site (`/`) read-only |
| Couple / DK | Google Sign-in OR email + password via Firebase Auth | `/dashboard/[weddingId]` and all sub-routes |

**There are no other roles.** Do not implement role-based access beyond this.

---

## Supported Sign-In Methods

Both methods are active simultaneously. The user can use whichever they prefer.

| Method | How it works |
|---|---|
| Google Sign-in | `signInWithPopup` + `GoogleAuthProvider` — opens Google's auth popup |
| Email + password | `signInWithEmailAndPassword` — standard credential form |

**After either method succeeds:** check the signed-in email against `ALLOWED_DASHBOARD_EMAILS`. If not in the list, sign out immediately and show Access Denied. This is the single enforcement gate regardless of sign-in method.

---

## Firebase Auth Setup

1. Enable **Google** as a Sign-in provider in Firebase Console → Authentication → Sign-in method
2. Enable **Email/Password** as a Sign-in provider in the same screen
3. **Do not enable Email/Password self-signup** — DK creates email/password accounts manually via Firebase Console → Authentication → Users
4. Add the Vercel domain to **Authorized domains** in Firebase Console → Authentication → Settings
5. Google Sign-in accounts are controlled by the allowlist — any Google account can attempt, only listed emails succeed

---

## Allowed Emails

Dashboard access is restricted to a whitelist stored in Firestore at `weddings/{weddingId}/private/access` — no environment variable needed.

- **Stored in:** `weddings/{weddingId}/private/access` → field `authorizedEmails: string[]`
- **Managed from:** Wedding Settings → Team Access section in the dashboard
- **Seeded by:** DK manually when setting up the wedding doc (see `roadmap.md` Phase 2)
- **Checked in:** `AuthGuard`, immediately after `onAuthStateChanged` fires with a non-null user, via `getAuthorizedEmails()` from `/lib/firestore.ts`
- **If not in list:** call `signOutUser()`, show Access Denied screen

**Do not rely on Firestore rules alone for this.** Always validate in `AuthGuard` client-side.

---

## Files

```
/lib/auth.ts                        ← Firebase Auth helpers
/components/dashboard/AuthGuard.tsx ← Route protection wrapper
/app/dashboard/[weddingId]/layout.tsx ← Wraps all dashboard routes with AuthGuard
/app/dashboard/[weddingId]/page.tsx   ← Dashboard home
```

---

## `/lib/auth.ts`

```ts
import {
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth"
import { app } from "./firebase"

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()

export async function signInWithGoogle(): Promise<void> {
  await signInWithPopup(auth, googleProvider)
}

export async function signInWithEmail(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password)
}

export async function signOutUser(): Promise<void> {
  await signOut(auth)
}
```

---

## `AuthGuard` Component

**File:** `/components/dashboard/AuthGuard.tsx`

**Behavior:**

1. Subscribe to `onAuthStateChanged`
2. While loading auth state: show a neutral loading spinner (not a redirect)
3. If user is `null`: show the Sign-In screen (inline — not a redirect)
4. If user is signed in: call `getAuthorizedEmails()` from `/lib/firestore.ts`
5. If the signed-in email is NOT in the returned list:
   - Call `signOutUser()`
   - Show the Access Denied screen
6. If the signed-in email IS in the list: render `{children}`

```ts
interface AuthGuardProps {
  children: React.ReactNode
}
```

---

## Sign-In Screen (inside AuthGuard)

See `design-dashboard.md` Screen 1 for the full visual spec.

**Google Sign-In flow:**
- User clicks `"Sign in with Google"` → call `signInWithGoogle()`
- On popup cancel: do nothing (no error shown)
- On error: show `"Google sign-in failed. Please try again."`

**Email + password flow:**
- User fills email + password → clicks `"Sign In"` → call `signInWithEmail(email, password)`
- On `auth/invalid-credential`: show `"Incorrect email or password."`
- On `auth/too-many-requests`: show `"Too many attempts. Please try again later."`
- On other error: show `"Sign-in failed. Please try again."`
- Do not reveal whether the email exists

**After either method succeeds:** `onAuthStateChanged` fires → `AuthGuard` calls `getAuthorizedEmails()` and checks the signed-in email automatically.

---

## Dashboard Layout

**File:** `/app/dashboard/[weddingId]/layout.tsx`

```tsx
import { AuthGuard } from "@/components/dashboard/AuthGuard"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>
}
```

All routes under `/dashboard/[weddingId]/` are automatically protected. Do not add auth checks to individual dashboard pages.

---

## Sign-out

- `"Sign out"` button in the dashboard `TopNav`
- On click: call `signOutUser()` — `AuthGuard` will automatically show the Sign-In screen

---

## Acceptance Criteria

- [ ] Visiting `/dashboard/[weddingId]` without being signed in shows the Sign-In screen
- [ ] `"Sign in with Google"` opens the Google auth popup
- [ ] Email + password form signs in with valid credentials
- [ ] Both methods: a non-allowed email sees Access Denied and is signed out
- [ ] Both methods: an allowed email sees the dashboard
- [ ] Invalid email/password shows `"Incorrect email or password."` — no crash
- [ ] Too many failed attempts shows the rate-limit message
- [ ] Refreshing while signed in preserves the session (no flash of sign-in screen)
- [ ] Signing out returns to the Sign-In screen
- [ ] No "Create account" or "Forgot password" link is visible
- [ ] `authorizedEmails` is only readable by authenticated users (Firestore rule enforced)
- [ ] Unauthorized emails are signed out and see Access Denied — no dashboard content flashes
- [ ] DK can add/remove emails from Wedding Settings → Team Access without redeploying
