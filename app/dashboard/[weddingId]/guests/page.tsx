import { headers } from "next/headers";
import { GuestList } from "@/components/dashboard/GuestList";
import { weddingConfig } from "@/lib/config";

export default function Page({
  params,
}: {
  params: { weddingId: string };
}) {
  const h = headers();
  const host = h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ??
    `${proto}://${host}`;

  return <GuestList weddingId={params.weddingId} baseUrl={baseUrl} />;
}

export const metadata = {
  title: `Guests • ${weddingConfig.coupleName}`,
};
