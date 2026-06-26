"use client";

import * as React from "react";
import QRCode from "react-qr-code";
import { Card } from "@/components/shared/Card";

interface PhotoQRProps {
  albumUrl: string;
  headline?: string;
  body?: string;
}

export function PhotoQR({
  albumUrl,
  headline = "Snap & Share",
  body = "Scan the QR code below to upload your photos to our shared album!",
}: PhotoQRProps) {
  return (
    <section className="px-6 py-section-gap-mobile md:py-section-gap-desktop text-center">
      <div className="max-w-guest mx-auto">
        <h2 className="font-serif text-section-heading text-charcoal mb-3">
          {headline}
        </h2>
        <p className="text-warm-grey mb-8">{body}</p>
        <Card padding="sm" className="inline-block">
          {albumUrl ? (
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
          <p className="mt-4">
            <a
              href={albumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest text-sm font-medium hover:underline min-h-[44px] inline-flex items-center"
            >
              Or tap here to open the album
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
