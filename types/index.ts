import { Timestamp } from "firebase/firestore";

export type GuestRole =
  | "Principal Sponsor"
  | "Secondary Sponsor"
  | "Officiant"
  | "Entourage"
  | "Guest";


export interface GuestDoc {
  id: string;
  token: string;
  firstName: string;
  lastName: string;
  pax: number;
  role: GuestRole;
  subRole?: string;
  rsvpCount: number | null;
  rsvpSubmittedAt: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type Guest = GuestDoc;

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface EntourageGroup {
  role: string;
  members: string[];
}

export interface EventInfo {
  time: string;
  venue: string;
  address: string;
  mapsUrl: string;
}

export interface WeddingDoc {
  ownerId: string;
  coupleName: string;
  weddingDate: string;
  hashtag: string;
  photoAlbumUrl: string;
  ceremony: EventInfo;
  reception: EventInfo;
  dressCode: {
    description: string;
    palette: ColorSwatch[];
  };
  entourage: EntourageGroup[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface AccessDoc {
  authorizedEmails: string[];
}

export type WeddingConfigUpdate = Partial<
  Pick<
    WeddingDoc,
    | "coupleName"
    | "weddingDate"
    | "hashtag"
    | "photoAlbumUrl"
    | "ceremony"
    | "reception"
    | "dressCode"
    | "entourage"
  >
>;
