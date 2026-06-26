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

All three methods are active simultaneously. The user can use whichever they prefer.

| Method | How it works |
|---|---|
| Google Sign-in | `signInWithPopup` + `GoogleAuthProvider` — opens Google's auth popup |
| Email + password | `signInWithEmailAndPassword` — standard credential form |
| Self-signup | `createUserWithEmailAndPassword` — anyone can create an account, but the allowlist check below still gates dashboard access |

**After any method succeeds:** check the signed-in email against `authorizedEmails` in `weddings/{weddingId}/private/access`. If not in the list, sign out immediately and show Access Denied. This is the single enforcement gate regardless of sign-in method.

---

## Firebase Auth Setup

1. Enable **Google** as a Sign-in provider in Firebase Console → Authentication → Sign-in method
2. Enable **Email/Password** as a Sign-in provider in the same screen — **enable the "Email/Password" toggle AND keep "Email link (passwordless sign-in)" OFF**
3. **Email/Password self-signup is enabled** — the dashboard's "Create an account" screen calls `createUserWithEmailAndPassword()`. The `authorizedEmails` allowlist in `AuthGuard` is the only security gate; a user who creates an account without being on the list will be signed in then immediately signed out and shown Access Denied.
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
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
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

export async function createAccount(email: string, password: string): Promise<void> {
  await createUserWithEmailAndPassword(auth, email, password)
}

export async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
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

**Sign-up flow (sub-screen):**
- User clicks `"Create an account"` from the Sign-In screen → see Sign-Up screen spec below
- After successful `createAccount()`, `onAuthStateChanged` fires with the new user; `AuthGuard` runs the allowlist check. If their email isn't on the list, they're signed out and shown Access Denied — the same gate as every other sign-in method.

**Forgot password flow (sub-screen):**
- User clicks `"Forgot password?"` from the Sign-In screen → see Forgot Password screen spec below
- Always show the same success message regardless of whether the email exists in Firebase Auth — never reveal account existence

**After any method succeeds:** `onAuthStateChanged` fires → `AuthGuard` calls `getAuthorizedEmails()` and checks the signed-in email automatically.

---

## Sign-Up Screen (inside AuthGuard)

See `design-dashboard.md` "Screen 1b — Sign-Up" for the full visual spec.

This is a sub-view of the unauthenticated state, toggled by clicking `"Create an account"` on the Sign-In screen. It is rendered inline — no URL change, no new route (per G-008).

**Form fields:**
- Email — `type="email"`, `autoComplete="email"`
- Password — `type="password"`, `autoComplete="new-password"`
- Confirm password — `type="password"`, `autoComplete="new-password"`

**Client-side validation (in order):**
1. Password ≥ 6 characters (Firebase's minimum). Show inline error under the password field: `"Password must be at least 6 characters."`
2. Confirm password matches password. Show inline error under the confirm field: `"Passwords do not match."`

**Submit:**
- Call `createAccount(email, password)`.
- On `auth/email-already-in-use`: show `"An account with this email already exists. Try signing in."` (form-level, below the button)
- On `auth/weak-password`: show inline `"Password is too weak. Use at least 6 characters."`
- On `auth/invalid-email`: show inline `"Please enter a valid email address."`
- On other error: show `"Sign-up failed. Please try again."`
- On success: `onAuthStateChanged` fires → `AuthGuard` runs the allowlist check. If allowed → dashboard. If not → Access Denied.

**Body copy:** `"Create an account to access the dashboard. Your email must already be on the access list — ask the couple if it isn't."` — sets expectations so a random signup attempt doesn't surprise the user with Access Denied.

**Back link:** `"Already have an account? Back to sign in"` — returns to the Sign-In screen.

---

## Forgot Password Screen (inside AuthGuard)

See `design-dashboard.md` "Screen 1c — Forgot Password" for the full visual spec.

This is a sub-view of the unauthenticated state, toggled by clicking `"Forgot password?"` on the Sign-In screen.

**Form fields:**
- Email — `type="email"`, `autoComplete="email"`

**Submit:**
- Call `sendPasswordReset(email)`.
- On `auth/invalid-email`: show `"Please enter a valid email address."`
- On `auth/too-many-requests`: show `"Too many requests. Please try again later."`
- On other error: show `"Could not send reset link. Please try again."`
- On success: show a confirmation card (`"Check your inbox."` + `"If an account exists for {email}, we've sent a password reset link."`). Replace the form with this message — the form is gone, only the "Back to sign in" link remains.

**Never reveal whether the email exists.** The success message is the same whether or not the email has a Firebase Auth account. This prevents user enumeration.

**Back link:** `"Back to sign in"` — returns to the Sign-In screen.

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
- [ ] `"Create an account"` link is visible on the Sign-In screen and routes to the Sign-Up screen
- [ ] Sign-Up screen creates an account with valid email + matching passwords (≥ 6 chars)
- [ ] Sign-Up screen rejects mismatched passwords and short passwords with inline errors
- [ ] After a successful sign-up, the allowlist check still runs: allowed → dashboard, not allowed → Access Denied
- [ ] `"Forgot password?"` link is visible on the Sign-In screen and routes to the Forgot Password screen
- [ ] Forgot Password always shows the same success message regardless of whether the email exists (no user enumeration)
- [ ] All three methods (Google, email/password, signup) funnel through the same `AuthGuard` allowlist check
- [ ] A non-allowed email sees Access Denied and is signed out
- [ ] An allowed email sees the dashboard
- [ ] Invalid email/password on the Sign-In screen shows `"Incorrect email or password."` — no crash
- [ ] Too many failed attempts shows the rate-limit message
- [ ] Refreshing while signed in preserves the session (no flash of sign-in screen)
- [ ] Signing out returns to the Sign-In screen
- [ ] `authorizedEmails` is only readable by authenticated users (Firestore rule enforced)
- [ ] Unauthorized emails are signed out and see Access Denied — no dashboard content flashes
- [ ] DK can add/remove emails from Wedding Settings → Team Access without redeploying
