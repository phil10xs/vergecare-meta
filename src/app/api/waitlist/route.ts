import { NextResponse } from "next/server";
import { roleFromDoor } from "@/lib/account-role";
import { parseWaitlist } from "@/lib/waitlist";
import { acceptInvite, getInvite, upsertAccount } from "@/server/account";
import {
  ACCOUNT_COOKIE,
  accountCookieOptions,
  signAccountSession,
} from "@/server/account-session";
import {
  isWaitlistEmail,
  sendWaitlistWelcome,
} from "@/server/email/waitlist-welcome";

function bodyField(body: unknown, key: string): unknown {
  if (!body || typeof body !== "object") return undefined;
  return (body as Record<string, unknown>)[key];
}

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
    const { sql } = await import("drizzle-orm");
    await db.execute(sql`select set_config('client_min_messages', 'warning', false)`);
    await db.execute(sql`
      create table if not exists waitlist (
        contact text primary key,
        name text not null,
        business_name text not null,
        address text not null,
        created_at timestamptz not null default now()
      )
    `);
    // A repeat contact is already on the list, so confirm instead of erroring.
    // RETURNING is empty on conflict, so a second signup does not email again.
    const inserted = await db
      .insert(waitlist)
      .values(parsed.data)
      .onConflictDoNothing({ target: waitlist.contact })
      .returning({ contact: waitlist.contact });
    if (inserted.length > 0 && isWaitlistEmail(parsed.data.contact)) {
      await sendWaitlistWelcome({
        name: parsed.data.name,
        email: parsed.data.contact,
      });
    }
    const response = NextResponse.json({ ok: true, stored: true, next: "/home" });
    try {
      const inviteToken = bodyField(body, "invite");
      const invite =
        typeof inviteToken === "string" && inviteToken
          ? await getInvite(inviteToken)
          : null;
      const role = invite?.role ?? roleFromDoor(bodyField(body, "role"));
      await upsertAccount({
        contact: parsed.data.contact,
        name: parsed.data.name,
        role,
      });
      if (invite) {
        await acceptInvite(
          { contact: parsed.data.contact, name: parsed.data.name, role },
          invite,
        );
      }
      response.cookies.set(
        ACCOUNT_COOKIE,
        signAccountSession(parsed.data.contact),
        accountCookieOptions(),
      );
    } catch (error) {
      console.error(
        "[account] signup saved the list but not the board",
        error instanceof Error ? error.name : "Error",
      );
      return NextResponse.json({ ok: true, stored: true, next: null });
    }
    return response;
  } catch (error) {
    const code =
      error && typeof error === "object" && "code" in error
        ? String((error as { code: unknown }).code)
        : error instanceof Error
          ? error.name
          : "Error";
    console.error("[waitlist]", code);
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
