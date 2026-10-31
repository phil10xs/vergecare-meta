import type { WaitlistEntry } from "@/db/schema";

function hostedDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  if (!url) return false;
  try {
    const host = new URL(url).hostname;
    return (
      host !== "localhost" &&
      host !== "127.0.0.1" &&
      host !== "::1" &&
      host !== "postgres"
    );
  } catch {
    return false;
  }
}

export async function loadWaitlist(): Promise<
  | { status: "unconfigured" }
  | { status: "error" }
  | { status: "ok"; rows: WaitlistEntry[] }
> {
  if (!hostedDatabaseConfigured()) return { status: "unconfigured" };
  try {
    const { desc } = await import("drizzle-orm");
    const { db } = await import("@/db");
    const { waitlist } = await import("@/db/schema");
    const rows = await db
      .select()
      .from(waitlist)
      .orderBy(desc(waitlist.createdAt));
    return { status: "ok", rows };
  } catch {
    return { status: "error" };
  }
}
