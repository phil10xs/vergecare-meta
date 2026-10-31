import { NextResponse } from "next/server";
import { z } from "zod";
import {
  ADMIN_COOKIE,
  adminCookieMaxAge,
  signAdminSession,
  verifyAdminLogin,
} from "@/server/admin-auth";

const GENERIC = "Email or password is incorrect.";

const loginSchema = z.object({
  email: z.string().trim().min(1).max(200),
  password: z.string().min(1).max(200),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: GENERIC }, { status: 401 });
  }
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success || !verifyAdminLogin(parsed.data.email, parsed.data.password)) {
    return NextResponse.json({ ok: false, error: GENERIC }, { status: 401 });
  }
  const token = signAdminSession(parsed.data.email);
  if (!token) {
    return NextResponse.json({ ok: false, error: GENERIC }, { status: 401 });
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: adminCookieMaxAge(),
  });
  return response;
}
