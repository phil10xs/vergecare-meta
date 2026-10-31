import { afterEach, describe, expect, it } from "vitest";
import {
  readAdminSession,
  scryptPasswordHash,
  signAdminSession,
  verifyAdminLogin,
} from "./admin-auth";

const envKeys = [
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD_HASH",
  "ADMIN_PASSWORD_SALT",
  "ADMIN_SESSION_SECRET",
] as const;

describe("admin auth", () => {
  const previous = Object.fromEntries(
    envKeys.map((key) => [key, process.env[key]]),
  );

  afterEach(() => {
    for (const key of envKeys) {
      const value = previous[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  it("accepts the configured email and password only", () => {
    const salt = "test-salt";
    process.env.ADMIN_EMAIL = "owner@example.com";
    process.env.ADMIN_PASSWORD_SALT = salt;
    process.env.ADMIN_PASSWORD_HASH = scryptPasswordHash("correct-horse", salt);
    process.env.ADMIN_SESSION_SECRET = "test-secret";

    expect(verifyAdminLogin("Owner@Example.com", "correct-horse")).toBe(true);
    expect(verifyAdminLogin("owner@example.com", "wrong")).toBe(false);
    expect(verifyAdminLogin("other@example.com", "correct-horse")).toBe(false);
  });

  it("round-trips a signed session and rejects tampering", () => {
    process.env.ADMIN_EMAIL = "owner@example.com";
    process.env.ADMIN_SESSION_SECRET = "test-secret";
    const token = signAdminSession("owner@example.com", 1_000);
    expect(token).toBeTruthy();
    expect(readAdminSession(token!, 1_000)).toBe("owner@example.com");
    expect(readAdminSession(`${token}x`, 1_000)).toBeNull();
    expect(readAdminSession(token!, 1_000 + 8 * 24 * 60 * 60 * 1000)).toBeNull();
  });
});
