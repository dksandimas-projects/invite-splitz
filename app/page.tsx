import { Metadata } from "next";
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
import { ScrollDownGuide } from "@/components/site/ScrollDownGuide";

interface SearchParams {
  guest?: string;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const wedding = await getWedding();
  const coupleName = wedding?.coupleName ?? fallbackConfig.coupleName;
  const dateLabel = wedding?.weddingDate
    ? formatWeddingDate(wedding.weddingDate)
    : fallbackConfig.weddingDateLabel;
  const title = `${coupleName} • ${dateLabel}`;
  const description = `You're invited to celebrate the wedding of ${coupleName} on ${dateLabel}.`;

  let personalized = "";
  if (searchParams?.guest) {
    const guest = await getGuestByToken(searchParams.guest);
    if (guest?.firstName) {
      personalized = ` — for ${guest.firstName}`;
    }
  }

  return {
    title: `${title}${personalized}`,
    description,
    openGraph: {
      title,
      description,
      images: ["/og"],
    },
  };
}

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
        <div data-scroll-section>
          <HeroSection
            coupleName={coupleName}
            weddingDate={weddingDate}
            weddingDateLabel={weddingDateLabel}
          />
        </div>

        <div data-scroll-section className="relative flex flex-col items-center w-full">
          <GreetingSection guestName={guestName} />
          <ImageBreak />
          <NoPlusOneNotice text={fallbackConfig.noPlusOneText} />
          <GiftNote body={fallbackConfig.giftNoteText} />
          <ScrollDownGuide
            label={guest ? "Scroll down for RSVP" : "Scroll down for entourage"}
          />
        </div>

        {guest ? (
          <div data-scroll-section id="rsvp" className="relative flex flex-col items-center w-full">
            <RSVPSection
              token={guest.token}
              pax={guest.pax}
              existingRsvpCount={guest.rsvpCount}
            />
            <ScrollDownGuide label="Scroll down for entourage" />
          </div>
        ) : null}

        <div data-scroll-section className="relative flex flex-col items-center w-full">
          <EntourageSection entourage={entourage} />
          <ScrollDownGuide label="Scroll down for celebration details" />
        </div>

        <div data-scroll-section className="relative flex flex-col items-center w-full">
          <EventDetails ceremony={ceremony} reception={reception} />
          <DressCode
            description={dressCode.description}
            palette={dressCode.palette}
          />
          <ScrollDownGuide label="Scroll down for photo sharing" />
        </div>

        <div data-scroll-section className="relative flex flex-col items-center w-full">
          <PhotoQR
            albumUrl={photoAlbumUrl}
            headline={fallbackConfig.photoQRHeadline}
            body={fallbackConfig.photoQRBody}
          />
        </div>

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
