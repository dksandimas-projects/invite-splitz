import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { generateToken } from "./tokens";
import type {
  AccessDoc,
  GuestDoc,
  WeddingConfigUpdate,
  WeddingDoc,
} from "@/types";

const WEDDING_ID = process.env.NEXT_PUBLIC_WEDDING_ID ?? "";

function weddingRef() {
  return doc(db, "weddings", WEDDING_ID);
}

function weddingCollection(name: "guests" | "private") {
  return collection(db, "weddings", WEDDING_ID, name);
}

function guestRef(id: string) {
  return doc(db, "weddings", WEDDING_ID, "guests", id);
}

function accessRef() {
  return doc(db, "weddings", WEDDING_ID, "private", "access");
}

// ---------------- Wedding ----------------

export async function getWedding(): Promise<WeddingDoc | null> {
  const snap = await getDoc(weddingRef());
  if (!snap.exists()) return null;
  return snap.data() as WeddingDoc;
}

export async function updateWeddingConfig(
  data: WeddingConfigUpdate
): Promise<void> {
  await updateDoc(weddingRef(), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ---------------- Access ----------------

export async function getAuthorizedEmails(): Promise<string[]> {
  const snap = await getDoc(accessRef());
  if (!snap.exists()) return [];
  return (snap.data() as AccessDoc).authorizedEmails ?? [];
}

export async function updateAuthorizedEmails(
  emails: string[]
): Promise<void> {
  await setDoc(accessRef(), { authorizedEmails: emails });
}

// ---------------- Guests (public) ----------------

export async function getGuestByToken(
  token: string
): Promise<GuestDoc | null> {
  const q = query(weddingCollection("guests"), where("token", "==", token), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return { id: docSnap.id, ...(docSnap.data() as Omit<GuestDoc, "id">) };
}

// ---------------- Guests (authenticated) ----------------

export async function listGuests(): Promise<GuestDoc[]> {
  const snap = await getDocs(weddingCollection("guests"));
  return snap.docs.map((d) => ({
    id: d.id,
    ...(d.data() as Omit<GuestDoc, "id">),
  }));
}

type GuestCreateInput = Pick<
  GuestDoc,
  "firstName" | "lastName" | "pax" | "role" | "subRole"
>;

export async function syncEntourageFromGuests(): Promise<void> {
  const guests = await listGuests();
  const groupsMap: Record<string, string[]> = {};

  for (const guest of guests) {
    if (guest.role === "Guest") continue;

    let groupName = "Entourage";
    if (guest.role === "Principal Sponsor") {
      groupName = "Principal Sponsors";
    } else if (guest.role === "Secondary Sponsor") {
      groupName = "Secondary Sponsors";
    } else if (guest.role === "Entourage") {
      groupName = guest.subRole ? guest.subRole.trim() : "Entourage";
    }

    if (!groupName) {
      groupName = "Entourage";
    }

    if (!groupsMap[groupName]) {
      groupsMap[groupName] = [];
    }

    const fullName = `${guest.firstName} ${guest.lastName}`.trim();
    if (fullName) {
      groupsMap[groupName].push(fullName);
    }
  }

  const entourageList: { role: string; members: string[] }[] = Object.keys(groupsMap).map((role) => ({
    role,
    members: groupsMap[role],
  }));

  const PRIORITY: Record<string, number> = {
    "Principal Sponsors": 1,
    "Secondary Sponsors": 2,
    "Best Man": 3,
    "Maid of Honor": 4,
    "Groomsmen": 5,
    "Bridesmaids": 6,
  };

  entourageList.sort((a, b) => {
    const pA = PRIORITY[a.role] ?? 999;
    const pB = PRIORITY[b.role] ?? 999;
    if (pA !== pB) {
      return pA - pB;
    }
    return a.role.localeCompare(b.role);
  });

  await updateDoc(weddingRef(), {
    entourage: entourageList,
    updatedAt: serverTimestamp(),
  });
}

export async function createGuest(
  data: GuestCreateInput,
  skipSync = false
): Promise<GuestDoc> {
  const newRef = doc(weddingCollection("guests"));
  const id = newRef.id;
  const token = generateToken();
  const payload: Omit<GuestDoc, "createdAt" | "updatedAt"> & {
    createdAt: ReturnType<typeof serverTimestamp>;
    updatedAt: ReturnType<typeof serverTimestamp>;
  } = {
    id,
    token,
    firstName: data.firstName,
    lastName: data.lastName,
    pax: data.pax,
    role: data.role,
    subRole: data.subRole || "",
    rsvpCount: null,
    rsvpSubmittedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(newRef, payload);

  if (!skipSync) {
    await syncEntourageFromGuests();
  }

  const snap = await getDoc(newRef);
  return snap.data() as GuestDoc;
}

export async function updateGuest(
  id: string,
  data: Partial<Pick<GuestDoc, "firstName" | "lastName" | "pax" | "role" | "subRole">>,
  skipSync = false
): Promise<void> {
  await updateDoc(guestRef(id), {
    ...data,
    updatedAt: serverTimestamp(),
  });

  if (!skipSync) {
    await syncEntourageFromGuests();
  }
}

export async function deleteGuest(id: string, skipSync = false): Promise<void> {
  await deleteDoc(guestRef(id));

  if (!skipSync) {
    await syncEntourageFromGuests();
  }
}

export async function deleteAllGuests(): Promise<void> {
  const snap = await getDocs(weddingCollection("guests"));
  if (snap.empty) return;

  // Firestore batches are capped at 500 ops each
  const BATCH_SIZE = 500;
  const docs = snap.docs;

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    docs.slice(i, i + BATCH_SIZE).forEach((d) => batch.delete(d.ref));
    await batch.commit();
  }

  // Clear the entourage list in the wedding doc
  await updateDoc(weddingRef(), {
    entourage: [],
    updatedAt: serverTimestamp(),
  });
}

export async function resetRSVP(id: string): Promise<void> {
  await updateDoc(guestRef(id), {
    rsvpCount: null,
    rsvpSubmittedAt: null,
    updatedAt: serverTimestamp(),
  });
}

// ---------------- RSVP (public) ----------------

export async function submitRSVP(
  token: string,
  count: number
): Promise<void> {
  if (count < 0 || !Number.isInteger(count)) {
    throw new Error("INVALID_COUNT");
  }
  const q = query(weddingCollection("guests"), where("token", "==", token), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) {
    throw new Error("GUEST_NOT_FOUND");
  }
  const guestDoc = snap.docs[0];
  const data = guestDoc.data() as GuestDoc;
  if (data.rsvpCount !== null) {
    throw new Error("ALREADY_RESPONDED");
  }
  if (count > data.pax) {
    throw new Error("INVALID_COUNT");
  }
  const batch = writeBatch(db);
  // Public RSVP rule only permits rsvpCount + rsvpSubmittedAt — do not
  // touch updatedAt here (the rule's affectedKeys().hasOnly() check
  // would deny the write otherwise).
  batch.update(guestDoc.ref, {
    rsvpCount: count,
    rsvpSubmittedAt: serverTimestamp(),
  });
  await batch.commit();
}

// ---------------- Real-time subscriptions ----------------

export function subscribeToWedding(
  callback: (wedding: WeddingDoc | null) => void
): () => void {
  return onSnapshot(
    weddingRef(),
    (snap) => {
      callback(snap.exists() ? (snap.data() as WeddingDoc) : null);
    },
    (err) => {
      console.error("subscribeToWedding error:", err);
      callback(null);
    }
  );
}

export function subscribeToGuests(
  callback: (guests: GuestDoc[]) => void
): () => void {
  return onSnapshot(
    weddingCollection("guests"),
    (snap) => {
      const guests = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<GuestDoc, "id">),
      }));
      callback(guests);
    },
    (err) => {
      console.error("subscribeToGuests error:", err);
      callback([]);
    }
  );
}
