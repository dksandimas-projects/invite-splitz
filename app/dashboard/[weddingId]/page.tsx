import { DashboardHome } from "@/components/dashboard/DashboardHome";
import { weddingConfig } from "@/lib/config";

export default function Page({
  params,
}: {
  params: { weddingId: string };
}) {
  return <DashboardHome weddingId={params.weddingId} />;
}

export const metadata = {
  title: `Dashboard • ${weddingConfig.coupleName}`,
};
