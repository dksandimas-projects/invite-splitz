# invite-splitz — RSVP Spec

> **Agent note:** This file is the authoritative spec for the RSVP feature.
> It covers UI states, Firestore write behavior, the API route, and all edge cases.
> Read `overview.md` and `backend.md` first.

---

## RSVP Model

RSVP is count-based, not boolean.

| `rsvpCount` value | Meaning |
|---|---|
| `null` | Guest has not responded yet |
| `0` | Guest declined (no one from the group is attending) |
| `1..N` | N people from the group are attending (N ≤ pax) |

**RSVP is one-time.** Once `rsvpCount` is set to a non-null value, it cannot be changed by the guest. Only an authenticated dashboard user can reset it via `resetRSVP()`.

---

## Component

**File:** `/components/site/RSVPSection.tsx`

**Props:**
```ts
interface RSVPSectionProps {
  token: string
  pax: number
  existingRsvpCount: number | null
}
```

**Do not render this component** if no valid guest token is present. The parent page (`/app/page.tsx`) is responsible for this guard.

---

## UI States

### State 1 — Not yet responded (`existingRsvpCount === null`)

Render the RSVP prompt based on `pax`:

**If `pax === 1`:**
```
Heading: "Will you be joining us?"

[I'll be there]    [Can't make it]
```
- "I'll be there" → calls submit with `count = 1`
- "Can't make it" → calls submit with `count = 0`

**If `pax === 2`:**
```
Heading: "Will you be joining us?"

[Just me]    [Both of us]    [Can't make it]
```
- "Just me" → calls submit with `count = 1`
- "Both of us" → calls submit with `count = 2`
- "Can't make it" → calls submit with `count = 0`

**If `pax >= 3`:**
```
Heading: "How many from your group will be joining us?"

[1]  [2]  [3]  ...  [N]    [Can't make it]
```
- Each number button → calls submit with `count = N`
- "Can't make it" → calls submit with `count = 0`
- Render one button per number from 1 to `pax`

---

### State 2 — Submitting (loading)

- Disable all buttons immediately on click
- Show a loading spinner or subtle text: `"Saving your response..."`
- Do not allow re-click

---

### State 3 — Successfully submitted

Show a confirmation message. Do not re-show the RSVP buttons.

**If `count > 0`:**
```
"You're confirmed! We can't wait to celebrate with you."
Attending: {count} of {pax}
```

**If `count === 0`:**
```
"We're sorry you can't make it. You'll be missed!"
```

This state is also shown on page load if `existingRsvpCount` is already non-null (guest already responded in a previous session).

---

### State 4 — Error

If the API call fails (network error, unexpected server error):
```
"Something went wrong. Please try again."
[Retry]
```
- "Retry" re-enables the buttons and returns to State 1
- Do not persist error state across page refreshes

---

## Submission Flow

1. Guest clicks a response button
2. Component enters **State 2** (loading), all buttons disabled
3. Component calls `POST /api/rsvp` with `{ token, count }`
4. On success (HTTP 200): transition to **State 3** (confirmed)
5. On error:
   - HTTP 409 (`ALREADY_RESPONDED`): treat as State 3 — re-fetch guest data and show confirmation
   - HTTP 404 (`GUEST_NOT_FOUND`): show generic error, no retry (invalid token)
   - HTTP 400 (`INVALID_COUNT`): this should never happen if UI is correct — show generic error
   - HTTP 5xx or network error: show **State 4** (error with retry)

---

## API Route

**File:** `/app/api/rsvp/route.ts`
**Method:** `POST`
**Auth:** None (public route — token acts as auth)

**Request body:**
```ts
{
  token: string
  count: number
}
```

**Response codes:**
| Status | Body | When |
|---|---|---|
| 200 | `{ success: true, rsvpCount: number }` | RSVP saved successfully |
| 400 | `{ error: "INVALID_COUNT" }` | count < 0 or count > guest.pax |
| 400 | `{ error: "MISSING_FIELDS" }` | token or count is missing/invalid type |
| 404 | `{ error: "GUEST_NOT_FOUND" }` | no guest with that token |
| 409 | `{ error: "ALREADY_RESPONDED", rsvpCount: number }` | guest already submitted |
| 500 | `{ error: "INTERNAL_ERROR" }` | unexpected Firestore error |

**Implementation:**
```ts
// /app/api/rsvp/route.ts
import { NextRequest, NextResponse } from "next/server"
import { submitRSVP } from "@/lib/firestore"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { token, count } = body

  if (!token || typeof count !== "number") {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 })
  }

  try {
    await submitRSVP(token, count)
    return NextResponse.json({ success: true, rsvpCount: count })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "INTERNAL_ERROR"
    if (message === "GUEST_NOT_FOUND") return NextResponse.json({ error: "GUEST_NOT_FOUND" }, { status: 404 })
    if (message === "ALREADY_RESPONDED") {
      // Re-fetch to get the existing count
      return NextResponse.json({ error: "ALREADY_RESPONDED" }, { status: 409 })
    }
    if (message === "INVALID_COUNT") return NextResponse.json({ error: "INVALID_COUNT" }, { status: 400 })
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 })
  }
}
```

---

## Edge Cases

| Scenario | Expected behavior |
|---|---|
| Guest refreshes page after submitting | Load `existingRsvpCount` from Firestore on page load → show State 3 |
| Guest opens link on two devices simultaneously | Both submit → second write hits `ALREADY_RESPONDED` → second device gets 409 → shows State 3 |
| Token is valid but `pax` is 0 | Should not exist — validate `pax >= 1` on guest creation. If it does exist, hide the RSVP section |
| `count` submitted > `pax` | Rejected by API (400) and by Firestore security rule |
| Guest submits `count = 0` then wants to change | Cannot change — DK must reset via dashboard (`resetRSVP(id)`) |
| No token in URL | `RSVPSection` is not rendered — no RSVP possible |

---

## Dashboard: RSVP Management

**RSVP column in guest table:**

| Value | Display |
|---|---|
| `null` | `—` (em dash, grey) |
| `0` | `Declined` (muted red) |
| `1..pax` | `{count}/{pax} attending` (green) |

**Summary card (top of dashboard):**
```
Confirmed: {total rsvpCount sum where rsvpCount > 0}
Declined:  {count of guests where rsvpCount === 0}
Pending:   {count of guests where rsvpCount === null}
Total invited: {sum of all pax}
```

**Reset RSVP button:** Per guest row — sets `rsvpCount` back to `null` and clears `rsvpSubmittedAt`. Requires confirmation dialog before executing.

---

## Acceptance Criteria

- [ ] Guest with `pax = 1` sees two buttons (yes/no)
- [ ] Guest with `pax = 2` sees three buttons (1, 2, decline)
- [ ] Guest with `pax >= 3` sees N + 1 buttons (1 through N, plus decline)
- [ ] All buttons are disabled during submission
- [ ] Successful submission shows confirmation message, no buttons
- [ ] Refreshing after submission still shows confirmation (loaded from Firestore)
- [ ] Invalid token: RSVP section is not rendered
- [ ] Network error shows retry option
- [ ] API returns correct status codes per the table above
- [ ] Firestore rule prevents `rsvpCount` from being overwritten once set
- [ ] Dashboard shows correct RSVP status per guest
- [ ] Dashboard summary counts are correct
- [ ] Dashboard "Reset RSVP" sets count back to null after confirmation
