import { getAuthorizedEmails, getWedding } from "@/lib/firestore";
import { serializeWedding } from "@/lib/serialize";
import { SettingsScreen } from "@/components/dashboard/SettingsScreen";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({
  params,
}: {
  params: { weddingId: string };
}) {
  const [wedding, initialAccessEmails] = await Promise.all([
    getWedding().catch(() => null),
    getAuthorizedEmails().catch(() => [] as string[]),
  ]);

  return (
    <SettingsScreen
      weddingId={params.weddingId}
      wedding={serializeWedding(wedding)}
      initialAccessEmails={initialAccessEmails}
    />
  );
}
