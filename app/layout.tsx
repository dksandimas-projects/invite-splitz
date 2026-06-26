import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/shared/ToastProvider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const weddingId = process.env.NEXT_PUBLIC_WEDDING_ID || "bretch-joyce";
const isBretchJoyce = weddingId === "bretch-joyce";
const ogImageUrl = isBretchJoyce ? "/images/og-image.png" : "/og";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  ),
  title: {
    default: "Bretch & Joyce • August 1, 2026",
    template: "%s • Bretch & Joyce",
  },
  description:
    "You're invited to celebrate the wedding of Bretch & Joyce on August 1, 2026.",
  openGraph: {
    title: "Bretch & Joyce • August 1, 2026",
    description:
      "You're invited to celebrate the wedding of Bretch & Joyce on August 1, 2026.",
    type: "website",
    siteName: "Bretch & Joyce",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Bretch & Joyce — August 1, 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bretch & Joyce • August 1, 2026",
    description:
      "You're invited to celebrate the wedding of Bretch & Joyce on August 1, 2026.",
    images: [ogImageUrl],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
