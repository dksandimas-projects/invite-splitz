import { getGuestByToken, getWedding } from "@/lib/firestore";
import { weddingConfig as fallbackConfig } from "@/lib/config";
import { GuestTopNav } from "@/components/site/GuestTopNav";
import { HeroSection } from "@/components/site/HeroSection";
import { GreetingSection } from "@/components/site/GreetingSection";
import { ImageBreak } from "@/components/site/ImageBreak";
import { NoPlusOneNotice } from "@/components/site/NoPlusOneNotice";
import { GiftNote } from "@/components/site/GiftNote";
import { RSVPSection } from "@/components/site/RSVPSection";
import { EntourageSection } from "@/components/site/EntourageSection";
import { EventDetails } from "@/components/site/EventDetails";
import { DressCode } from "@/components/site/DressCode";
import { PhotoQR } from "@/components/site/PhotoQR";
import { BibleVerseFooter } from "@/components/site/BibleVerseFooter";

interface SearchParams {
  guest?: string;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const wedding = await getWedding();
  const token = searchParams?.guest ?? "";
  const guest = token ? await getGuestByToken(token) : null;

  // Use the Firestore wedding doc when present; fall back to the local
  // weddingConfig so the site still renders before the first deploy.
  const coupleName = wedding?.coupleName ?? fallbackConfig.coupleName;
  const weddingDate = wedding?.weddingDate ?? fallbackConfig.weddingDate;
  const weddingDateLabel =
    wedding?.weddingDate ? formatWeddingDate(wedding.weddingDate) : fallbackConfig.weddingDateLabel;
  const photoAlbumUrl = wedding?.photoAlbumUrl ?? fallbackConfig.photoAlbumUrl;
  const ceremony = wedding?.ceremony ?? fallbackConfig.ceremony;
  const reception = wedding?.reception ?? fallbackConfig.reception;
  const dressCode = wedding?.dressCode ?? fallbackConfig.dressCode;
  const entourage = wedding?.entourage ?? fallbackConfig.entourage;
  const guestName = guest ? guest.firstName : null;

  return (
    <>
      <GuestTopNav coupleName={coupleName} />
      <main className="bg-offwhite min-h-screen">
        <HeroSection
          coupleName={coupleName}
          weddingDate={weddingDate}
          weddingDateLabel={weddingDateLabel}
        />
        <GreetingSection guestName={guestName} />
        <ImageBreak />
        <NoPlusOneNotice text={fallbackConfig.noPlusOneText} />
        <GiftNote body={fallbackConfig.giftNoteText} />
        {guest ? (
          <div id="rsvp">
            <RSVPSection
              token={guest.token}
              pax={guest.pax}
              existingRsvpCount={guest.rsvpCount}
            />
          </div>
        ) : null}
        <EntourageSection entourage={entourage} />
        <EventDetails ceremony={ceremony} reception={reception} />
        <DressCode
          description={dressCode.description}
          palette={dressCode.palette}
        />
        <PhotoQR
          albumUrl={photoAlbumUrl}
          headline={fallbackConfig.photoQRHeadline}
          body={fallbackConfig.photoQRBody}
        />
        <BibleVerseFooter
          text={fallbackConfig.bibleVerse.text}
          reference={fallbackConfig.bibleVerse.reference}
          coupleName={coupleName}
        />
      </main>
    </>
  );
}

function formatWeddingDate(iso: string): string {
  // "2026-08-01" → "August 1, 2026"
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
