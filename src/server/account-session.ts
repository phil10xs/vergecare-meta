import { createHmac, timingSafeEqual } from "crypto";

export const ACCOUNT_COOKIE = "vc_account";
const SESSION_MS = 30 * 24 * 60 * 60 * 1000;

function sessionSecret(): string {
  return (
    process.env.ACCOUNT_SESSION_SECRET?.trim() ||
    process.env.DATABASE_URL?.trim() ||
    "vergecare-account-dev"
  );
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function signAccountSession(contact: string, now = Date.now()): string {
  const body = Buffer.from(
    JSON.stringify({ contact, exp: now + SESSION_MS }),
  ).toString("base64url");
  const sig = createHmac("sha256", sessionSecret()).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function readAccountSession(
  token: string | undefined,
  now = Date.now(),
): string | null {
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expectedSig = createHmac("sha256", sessionSecret())
    .update(body)
    .digest("base64url");
  if (!safeEqual(sig, expectedSig)) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as { contact?: unknown; exp?: unknown };
    if (typeof payload.contact !== "string" || typeof payload.exp !== "number") {
      return null;
    }
    if (payload.exp <= now) return null;
    if (!payload.contact) return null;
    return payload.contact;
  } catch {
    return null;
  }
}

export function accountCookieMaxAge(): number {
  return SESSION_MS / 1000;
}

export function accountCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: accountCookieMaxAge(),
  };
}
