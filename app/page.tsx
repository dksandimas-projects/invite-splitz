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
import { weddingConfig } from "@/lib/config";
import { DUMMY_GUESTS } from "@/lib/dummyData";

interface SearchParams {
  guest?: string;
}

export default function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Phase 1: token resolution is static. Find a dummy guest whose token matches.
  const token = searchParams?.guest ?? "";
  const resolvedGuest = token
    ? DUMMY_GUESTS.find((g) => g.token === token) ?? null
    : null;
  const guestName = resolvedGuest
    ? resolvedGuest.firstName
    : null;

  return (
    <>
      <GuestTopNav coupleName={weddingConfig.coupleName} />
      <main className="bg-offwhite min-h-screen">
        <HeroSection
          coupleName={weddingConfig.coupleName}
          weddingDate={weddingConfig.weddingDate}
          weddingDateLabel={weddingConfig.weddingDateLabel}
        />
        <GreetingSection guestName={guestName} />
        <ImageBreak />
        <NoPlusOneNotice text={weddingConfig.noPlusOneText} />
        <GiftNote body={weddingConfig.giftNoteText} />
        {resolvedGuest ? (
          <div id="rsvp">
            <RSVPSection
              token={resolvedGuest.token}
              pax={resolvedGuest.pax}
              existingRsvpCount={resolvedGuest.rsvpCount}
            />
          </div>
        ) : null}
        <EntourageSection entourage={weddingConfig.entourage} />
        <EventDetails
          ceremony={weddingConfig.ceremony}
          reception={weddingConfig.reception}
        />
        <DressCode
          description={weddingConfig.dressCode.description}
          palette={weddingConfig.dressCode.palette}
        />
        <PhotoQR
          albumUrl={weddingConfig.photoAlbumUrl}
          headline={weddingConfig.photoQRHeadline}
          body={weddingConfig.photoQRBody}
        />
        <BibleVerseFooter
          text={weddingConfig.bibleVerse.text}
          reference={weddingConfig.bibleVerse.reference}
          coupleName={weddingConfig.coupleName}
        />
      </main>
    </>
  );
}
