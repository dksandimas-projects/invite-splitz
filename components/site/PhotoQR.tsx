"use client";

import * as React from "react";
import Image from "next/image";
import QRCode from "react-qr-code";
import { Card } from "@/components/shared/Card";

interface PhotoQRProps {
  albumUrl: string;
  headline?: string;
  body?: string;
  qrImageSrc?: string;
  qrImageAlt?: string;
}

export function PhotoQR({
  albumUrl,
  headline = "Snap & Share",
  body = "Scan the QR code below to upload your photos to our shared album!",
  qrImageSrc,
  qrImageAlt = "QR code for the shared photo album",
}: PhotoQRProps) {
  return (
    <section className="px-6 py-section-gap-mobile md:py-section-gap-desktop text-center">
      <div className="max-w-guest mx-auto">
        <h2 className="font-serif text-section-heading text-charcoal mb-3">
          {headline}
        </h2>
        <p className="text-warm-grey mb-8">{body}</p>
        <Card padding="sm" className="inline-block">
          {qrImageSrc ? (
            <Image
              src={qrImageSrc}
              alt={qrImageAlt}
              width={208}
              height={208}
              className="w-[208px] h-[208px]"
            />
          ) : albumUrl ? (
            <QRCode
              value={albumUrl}
              size={208}
              style={{ height: "auto", maxWidth: "100%", width: "208px" }}
            />
          ) : (
            <div
              className="w-[208px] h-[208px] flex items-center justify-center text-warm-grey text-xs uppercase tracking-widest border border-dashed border-stone rounded-md"
              aria-label="QR code placeholder"
            >
              No album URL set
            </div>
          )}
        </Card>
        {albumUrl ? (
          <div className="mt-6 flex flex-col items-center gap-3">
            <span className="text-xs tracking-widest uppercase text-warm-grey">or</span>
            <a
              href={albumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-forest text-white text-sm font-medium tracking-wide hover:bg-garden transition-colors duration-200 min-h-[48px] shadow-sm"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              Open Photo Album
            </a>
          </div>
        ) : null}
      </div>
    </section>
  );
}
