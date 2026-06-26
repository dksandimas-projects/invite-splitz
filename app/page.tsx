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
import { ScrollDownGuide } from "@/components/site/ScrollDownGuide";
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
        <div data-scroll-section>
          <HeroSection
            coupleName={weddingConfig.coupleName}
            weddingDate={weddingConfig.weddingDate}
            weddingDateLabel={weddingConfig.weddingDateLabel}
          />
          <ScrollDownGuide />
        </div>

        <div data-scroll-section>
          <GreetingSection guestName={guestName} />
          <ScrollDownGuide />
        </div>

        <div data-scroll-section>
          <ImageBreak />
          <ScrollDownGuide />
        </div>

        <div>
          <NoPlusOneNotice text={weddingConfig.noPlusOneText} />
        </div>

        <div data-scroll-section>
          <GiftNote body={weddingConfig.giftNoteText} />
          {!resolvedGuest && <ScrollDownGuide />}
        </div>

        {resolvedGuest ? (
          <div id="rsvp" data-scroll-section>
            <RSVPSection
              token={resolvedGuest.token}
              pax={resolvedGuest.pax}
              existingRsvpCount={resolvedGuest.rsvpCount}
            />
            <ScrollDownGuide />
          </div>
        ) : null}

        <div data-scroll-section>
          <EntourageSection entourage={weddingConfig.entourage} />
          <ScrollDownGuide />
        </div>

        <div data-scroll-section>
          <EventDetails
            ceremony={weddingConfig.ceremony}
            reception={weddingConfig.reception}
          />
          <ScrollDownGuide />
        </div>

        <div data-scroll-section>
          <DressCode
            description={weddingConfig.dressCode.description}
            palette={weddingConfig.dressCode.palette}
          />
          <ScrollDownGuide />
        </div>

        <div data-scroll-section>
          <PhotoQR
            albumUrl={weddingConfig.photoAlbumUrl}
            headline={weddingConfig.photoQRHeadline}
            body={weddingConfig.photoQRBody}
          />
          <ScrollDownGuide />
        </div>

        <div>
          <BibleVerseFooter
            text={weddingConfig.bibleVerse.text}
            reference={weddingConfig.bibleVerse.reference}
            coupleName={weddingConfig.coupleName}
          />
        </div>
      </main>
    </>
  );
}

