export const WEDDING_ID = process.env.NEXT_PUBLIC_WEDDING_ID ?? "";

export function dashboardHref(weddingId: string, path: string = ""): string {
  const trimmed = path.startsWith("/") ? path.slice(1) : path;
  return trimmed
    ? `/dashboard/${weddingId}/${trimmed}`
    : `/dashboard/${weddingId}`;
}

export function inviteHref(weddingId: string, token?: string): string {
  const base = `/${weddingId}`;
  return token ? `${base}?guest=${token}` : base;
}
