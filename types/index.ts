export type GuestRole =
  | "principal_sponsor"
  | "secondary_sponsor"
  | "entourage"
  | "guest";

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  pax: number;
  role: GuestRole;
  token: string;
  rsvpCount: number | null;
  rsvpSubmittedAt?: number | null;
}

export interface EventInfo {
  time: string;
  venue: string;
  address: string;
  mapsUrl: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
}

export interface EntourageGroup {
  role: string;
  members: string[];
}

export interface WeddingDoc {
  id: string;
  coupleName: string;
  partnerOne: string;
  partnerTwo: string;
  weddingDate: string; // ISO date
  hashtag: string;
  photoAlbumUrl: string;
  ceremony: EventInfo;
  reception: EventInfo;
  dressCode: {
    description: string;
    palette: ColorSwatch[];
  };
  entourage: EntourageGroup[];
  bibleVerse: { text: string; reference: string };
  ownerId: string;
  createdAt: number;
  updatedAt: number;
}
