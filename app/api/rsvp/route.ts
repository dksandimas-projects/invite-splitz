import { NextRequest, NextResponse } from "next/server";
import { submitRSVP } from "@/lib/firestore";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_BODY" }, { status: 400 });
  }

  if (
    !body ||
    typeof body !== "object" ||
    typeof (body as { token?: unknown }).token !== "string" ||
    typeof (body as { count?: unknown }).count !== "number"
  ) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }

  const { token, count } = body as { token: string; count: number };

  try {
    await submitRSVP(token, count);
    return NextResponse.json({ success: true, rsvpCount: count });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "INTERNAL_ERROR";
    if (message === "GUEST_NOT_FOUND") {
      return NextResponse.json({ error: "GUEST_NOT_FOUND" }, { status: 404 });
    }
    if (message === "ALREADY_RESPONDED") {
      return NextResponse.json(
        { error: "ALREADY_RESPONDED" },
        { status: 409 }
      );
    }
    if (message === "INVALID_COUNT") {
      return NextResponse.json({ error: "INVALID_COUNT" }, { status: 400 });
    }
    return NextResponse.json({ error: "INTERNAL_ERROR" }, { status: 500 });
  }
}
