export function dashboardHref(weddingId: string, path: string = ""): string {
  const trimmed = path.startsWith("/") ? path.slice(1) : path;
  return trimmed
    ? `/dashboard/${weddingId}/${trimmed}`
    : `/dashboard/${weddingId}`;
}
