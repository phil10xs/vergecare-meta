import { createHmac, scryptSync, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "vc_platform";
const SESSION_MS = 7 * 24 * 60 * 60 * 1000;

export function scryptPasswordHash(password: string, salt: string): string {
  return scryptSync(password, salt, 64).toString("hex");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function verifyAdminLogin(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const salt = process.env.ADMIN_PASSWORD_SALT;
  if (!expectedEmail || !hash || !salt) return false;
  const emailOk = safeEqual(email.trim().toLowerCase(), expectedEmail);
  let passwordOk = false;
  try {
    passwordOk = safeEqual(scryptPasswordHash(password, salt), hash);
  } catch {
    passwordOk = false;
  }
  return emailOk && passwordOk;
}

export function signAdminSession(email: string, now = Date.now()): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return null;
  const body = Buffer.from(
    JSON.stringify({ email: email.trim().toLowerCase(), exp: now + SESSION_MS }),
  ).toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function readAdminSession(
  token: string | undefined,
  now = Date.now(),
): string | null {
  const secret = process.env.ADMIN_SESSION_SECRET;
  const expected = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  if (!secret || !expected || !token) return null;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const body = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expectedSig = createHmac("sha256", secret).update(body).digest("base64url");
  if (!safeEqual(sig, expectedSig)) return null;
  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as { email?: unknown; exp?: unknown };
    if (typeof payload.email !== "string" || typeof payload.exp !== "number") {
      return null;
    }
    if (payload.exp <= now) return null;
    if (!safeEqual(payload.email, expected)) return null;
    return payload.email;
  } catch {
    return null;
  }
}

export function adminCookieMaxAge(): number {
  return SESSION_MS / 1000;
}
