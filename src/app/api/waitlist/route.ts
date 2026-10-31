import { NextResponse } from "next/server";
import { parseWaitlist } from "@/lib/waitlist";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Check the form and try again." },
      { status: 400 },
    );
  }

  const parsed = parseWaitlist(body);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, error: parsed.error },
      { status: 400 },
    );
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        ok: false,
        stored: false,
        error: "We couldn't save your place on the list yet. Please try again later.",
      },
      { status: 503 },
    );
  }

  try {
    const { db } = await import("@/db");
    const { waitlist } = await import("@/db/schema");
    // A repeat contact is already on the list, so confirm instead of erroring.
    await db
      .insert(waitlist)
      .values(parsed.data)
      .onConflictDoNothing({ target: waitlist.contact });
    return NextResponse.json({ ok: true, stored: true });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        stored: false,
        error: "We couldn't save your place on the list yet. Please try again later.",
      },
      { status: 503 },
    );
  }
}
