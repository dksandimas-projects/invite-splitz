import { SettingsScreen } from "@/components/dashboard/SettingsScreen";
import { weddingConfig } from "@/lib/config";

export default function Page({
  params,
}: {
  params: { weddingId: string };
}) {
  return <SettingsScreen weddingId={params.weddingId} />;
}

export const metadata = {
  title: `Settings • ${weddingConfig.coupleName}`,
};
