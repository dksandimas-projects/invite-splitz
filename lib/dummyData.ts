import { Guest } from "@/types";

export const DUMMY_GUESTS: Guest[] = [
  {
    id: "g1",
    firstName: "Maria",
    lastName: "Santos",
    pax: 2,
    role: "principal_sponsor",
    token: "abc123def456",
    rsvpCount: 2,
    rsvpSubmittedAt: Date.now() - 1000 * 60 * 30,
  },
  {
    id: "g2",
    firstName: "Ricardo",
    lastName: "Dela Cruz",
    pax: 4,
    role: "secondary_sponsor",
    token: "ric987cba654",
    rsvpCount: null,
  },
  {
    id: "g3",
    firstName: "Isabella",
    lastName: "Montenegro",
    pax: 1,
    role: "entourage",
    token: "isa456xyz789",
    rsvpCount: 1,
    rsvpSubmittedAt: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: "g4",
    firstName: "Rafael",
    lastName: "Gomez",
    pax: 2,
    role: "guest",
    token: "raf321qwe987",
    rsvpCount: 0,
    rsvpSubmittedAt: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: "g5",
    firstName: "Liam",
    lastName: "Wilson",
    pax: 1,
    role: "entourage",
    token: "lia555abc111",
    rsvpCount: null,
  },
  {
    id: "g6",
    firstName: "Emma",
    lastName: "Watson",
    pax: 1,
    role: "entourage",
    token: "emm222def333",
    rsvpCount: 1,
    rsvpSubmittedAt: Date.now() - 1000 * 60 * 60 * 8,
  },
  {
    id: "g7",
    firstName: "Noah",
    lastName: "Garcia",
    pax: 1,
    role: "entourage",
    token: "noa777ghi444",
    rsvpCount: null,
  },
  {
    id: "g8",
    firstName: "Olivia",
    lastName: "Chen",
    pax: 2,
    role: "guest",
    token: "oli888jkl555",
    rsvpCount: 2,
    rsvpSubmittedAt: Date.now() - 1000 * 60 * 60 * 24,
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
