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
  "firstName" | "lastName" | "pax" | "role"
>;

export async function createGuest(data: GuestCreateInput): Promise<GuestDoc> {
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
    rsvpCount: null,
    rsvpSubmittedAt: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(newRef, payload);
  // Re-read so we can return a doc with resolved timestamps
  const snap = await getDoc(newRef);
  return snap.data() as GuestDoc;
}

export async function updateGuest(
  id: string,
  data: Partial<Pick<GuestDoc, "firstName" | "lastName" | "pax" | "role">>
): Promise<void> {
  await updateDoc(guestRef(id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteGuest(id: string): Promise<void> {
  await deleteDoc(guestRef(id));
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
