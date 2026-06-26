#!/usr/bin/env node
/**
 * Seed script — provisions the Firestore documents for one wedding.
 *
 * Reads:
 *   - ./service-account.json      (Firebase Admin SDK service account key)
 *   - ./scripts/seed.config.json   (WEDDING_ID, OWNER_ID, AUTHORIZED_EMAILS, optional GUEST)
 *
 * Writes:
 *   - weddings/{WEDDING_ID}                  → WeddingDoc
 *   - weddings/{WEDDING_ID}/private/access   → AccessDoc
 *   - weddings/{WEDDING_ID}/guests/{GUEST.id} → GuestDoc (optional)
 *
 * Idempotent: re-running will not duplicate. Existing docs are overwritten
 * with a warning. Pass --strict to refuse overwriting.
 *
 * Usage:
 *   1. Download a service account key from Firebase Console:
 *      Project Settings → Service Accounts → Generate new private key
 *      Save it as ./service-account.json (gitignored)
 *   2. Copy scripts/seed.config.example.json → scripts/seed.config.json
 *      and fill in your values.
 *   3. node scripts/seed.mjs
 */

import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { customAlphabet } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");

const STRICT = process.argv.includes("--strict");
const SKIP_TEST_GUEST = process.argv.includes("--no-test-guest");

const TOKEN_ALPHABET = "23456789abcdefghjkmnpqrstuvwxyz";
const generateToken = customAlphabet(TOKEN_ALPHABET, 12);

function die(msg, code = 1) {
  console.error(`\n✖ ${msg}\n`);
  process.exit(code);
}

function loadJson(path) {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8"));
}

// --- Load service account -------------------------------------------------
const saPath = resolve(ROOT, "service-account.json");
if (!existsSync(saPath)) {
  die(
    `Missing service account key at ./service-account.json\n` +
      `Download from: Firebase Console → Project Settings → Service Accounts → Generate new private key\n` +
      `Save the JSON file as ./service-account.json (it's already gitignored).`
  );
}
const serviceAccount = loadJson(saPath);
if (!serviceAccount.project_id) {
  die(`service-account.json is missing project_id — is this a real Firebase service account key?`);
}

// --- Load seed config -----------------------------------------------------
const configPath = resolve(__dirname, "seed.config.json");
if (!existsSync(configPath)) {
  die(
    `Missing seed config at scripts/seed.config.json\n` +
      `Copy scripts/seed.config.example.json → scripts/seed.config.json and fill in your values.`
  );
}
const config = loadJson(configPath);
const weddingId = config.WEDDING_ID;
const ownerId = config.OWNER_ID;
const authorizedEmails = config.AUTHORIZED_EMAILS ?? [];
const testGuest = SKIP_TEST_GUEST ? null : config.GUEST ?? null;

if (!weddingId) die("seed.config.json: WEDDING_ID is required");
if (!ownerId) die("seed.config.json: OWNER_ID is required (your Firebase Auth UID)");
if (!Array.isArray(authorizedEmails) || authorizedEmails.length === 0) {
  die("seed.config.json: AUTHORIZED_EMAILS must be a non-empty array");
}

// --- Init Admin SDK --------------------------------------------------------
const app = initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.project_id,
});
const db = getFirestore(app);

console.log(`\n→ Seeding project: ${serviceAccount.project_id}`);
console.log(`→ Wedding ID:     ${weddingId}`);
console.log(`→ Owner UID:      ${ownerId}`);
console.log(`→ Authorized:     ${authorizedEmails.join(", ")}`);
if (testGuest) console.log(`→ Test guest:     ${testGuest.firstName} ${testGuest.lastName}`);

// --- Helpers ---------------------------------------------------------------
async function ensureDoc(collectionPath, docId, data, label) {
  const ref = db.collection(collectionPath).doc(docId);
  const snap = await ref.get();
  if (snap.exists) {
    if (STRICT) {
      die(`Refusing to overwrite existing ${label} at ${collectionPath}/${docId} (--strict mode)`);
    }
    console.log(`  ↻ Overwriting existing ${label} at ${collectionPath}/${docId}`);
    await ref.set(data, { merge: false });
  } else {
    console.log(`  + Creating ${label} at ${collectionPath}/${docId}`);
    await ref.set(data);
  }
}

// --- Wedding doc -----------------------------------------------------------
await ensureDoc(
  "weddings",
  weddingId,
  {
    ownerId,
    coupleName: config.coupleName ?? "Bretch & Joyce",
    weddingDate: config.weddingDate ?? "2026-08-01",
    hashtag:
      config.hashtag ?? "#spendtheBRETCHofmylifewithJOYCE",
    photoAlbumUrl: config.photoAlbumUrl ?? "",
    ceremony: config.ceremony ?? {
      time: "",
      venue: "",
      address: "",
      mapsUrl: "",
    },
    reception: config.reception ?? {
      time: "",
      venue: "",
      address: "",
      mapsUrl: "",
    },
    dressCode: config.dressCode ?? {
      description: "",
      palette: [],
    },
    entourage: config.entourage ?? [],
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  },
  "WeddingDoc"
);

// --- Access doc ------------------------------------------------------------
await ensureDoc(
  `weddings/${weddingId}/private`,
  "access",
  { authorizedEmails },
  "AccessDoc"
);

// --- Optional test guest ---------------------------------------------------
if (testGuest) {
  const token = testGuest.token ?? generateToken();
  const guestId = testGuest.id ?? "test1";
  await ensureDoc(
    `weddings/${weddingId}/guests`,
    guestId,
    {
      id: guestId,
      token,
      firstName: testGuest.firstName ?? "Test",
      lastName: testGuest.lastName ?? "Guest",
      pax: testGuest.pax ?? 2,
      role: testGuest.role ?? "Guest",
      rsvpCount: null,
      rsvpSubmittedAt: null,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    },
    `GuestDoc (token=${token})`
  );
  if (!testGuest.token) {
    console.log(`  ℹ Generated token: ${token}`);
  }
}

console.log(`\n✓ Seed complete.\n`);
process.exit(0);
