import { headers } from "next/headers";
import { getWedding, listGuests } from "@/lib/firestore";
import { serializeGuests, serializeWedding } from "@/lib/serialize";
import { GuestList } from "@/components/dashboard/GuestList";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({
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

  const [wedding, guests] = await Promise.all([
    getWedding().catch(() => null),
    listGuests().catch(() => []),
  ]);

  return (
    <GuestList
      weddingId={params.weddingId}
      wedding={serializeWedding(wedding)}
      initialGuests={serializeGuests(guests)}
      baseUrl={baseUrl}
    />
  );
}
