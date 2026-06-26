import { Guest } from "@/types";
import { Timestamp } from "firebase/firestore";

const now = Timestamp.now();

export const DUMMY_GUESTS: Guest[] = [
  {
    id: "g1",
    firstName: "Maria",
    lastName: "Santos",
    pax: 2,
    role: "Principal Sponsor",
    token: "abc123def456",
    rsvpCount: 2,
    rsvpSubmittedAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "g2",
    firstName: "Ricardo",
    lastName: "Dela Cruz",
    pax: 4,
    role: "Secondary Sponsor",
    token: "ric987cba654",
    rsvpCount: null,
    rsvpSubmittedAt: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "g3",
    firstName: "Isabella",
    lastName: "Montenegro",
    pax: 1,
    role: "Entourage",
    token: "isa456xyz789",
    rsvpCount: 1,
    rsvpSubmittedAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "g4",
    firstName: "Rafael",
    lastName: "Gomez",
    pax: 2,
    role: "Guest",
    token: "raf321qwe987",
    rsvpCount: 0,
    rsvpSubmittedAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "g5",
    firstName: "Liam",
    lastName: "Wilson",
    pax: 1,
    role: "Entourage",
    token: "lia555abc111",
    rsvpCount: null,
    rsvpSubmittedAt: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "g6",
    firstName: "Emma",
    lastName: "Watson",
    pax: 1,
    role: "Entourage",
    token: "emm222def333",
    rsvpCount: 1,
    rsvpSubmittedAt: now,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "g7",
    firstName: "Noah",
    lastName: "Garcia",
    pax: 1,
    role: "Entourage",
    token: "noa777ghi444",
    rsvpCount: null,
    rsvpSubmittedAt: null,
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "g8",
    firstName: "Olivia",
    lastName: "Chen",
    pax: 2,
    role: "Guest",
    token: "oli888jkl555",
    rsvpCount: 2,
    rsvpSubmittedAt: now,
    createdAt: now,
    updatedAt: now,
  },
];

export function rsvpSummary(guests: Guest[]) {
  const totalPax = guests.reduce((sum, g) => sum + g.pax, 0);
  let confirmed = 0;
  let declined = 0;
  let pending = 0;
  for (const g of guests) {
    if (g.rsvpCount === null) pending += 1;
    else if (g.rsvpCount === 0) declined += 1;
    else confirmed += g.rsvpCount;
  }
  return { confirmed, declined, pending, totalPax };
}
