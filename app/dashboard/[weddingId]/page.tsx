import { getWedding, listGuests } from "@/lib/firestore";
import { serializeGuests, serializeWedding } from "@/lib/serialize";
import { DashboardHome } from "@/components/dashboard/DashboardHome";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: { weddingId: string };
}) {
  // AuthGuard (client component) gates visibility based on auth state. We
  // still try the server reads; if they fail (e.g. not signed in yet, or the
  // wedding doc doesn't exist), we render an empty shell rather than 500.
  const [wedding, guests] = await Promise.all([
    getWedding().catch(() => null),
    listGuests().catch(() => []),
  ]);
  return (
    <DashboardHome
      weddingId={params.weddingId}
      wedding={serializeWedding(wedding)}
      guests={serializeGuests(guests)}
    />
  );
}
