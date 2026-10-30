import { randomBytes } from "crypto";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { boardToken, job, type Job } from "@/db/schema";
import {
  addressFromKey,
  landlordPropertiesUrl,
  propertyBoardPath,
} from "@/lib/app-url";
import {
  BOARD_TOKEN_TTL_MS,
  isBoardTokenLive,
  isBoardTokenShape,
  isValidEmail,
  jobsForLandlord,
  normalizeContact,
} from "@/lib/board-token";
import { sessionAddress } from "@/lib/sessions";
import type { BoardOpenResult } from "@/lib/view-board";
import { sendBoardLinkEmail } from "@/server/board-mail";
import { startBoardEmail } from "@/server/board-open";
import { queueBoardLinkSend } from "@/server/email/schedule-send";
import {
  emailConfigured,
  isBlockedEmailRecipient,
} from "@/server/email/ses";

/**
 * Landlord magic link. The token is the credential. A password added later
 * must not be required here and must not invalidate tokens already sent.
 */
export async function ensureLandlordLink(
  jobId: string,
  email: string,
): Promise<{
  token: string;
  email: string;
  boardPath: string;
  propertiesUrl: string;
  recipientName: string | null;
}> {
  const clean = normalizeContact(email);
  if (!isValidEmail(clean)) throw new Error("Enter a valid email address");
  const [anchor] = await db.select().from(job).where(eq(job.id, jobId));
  if (!anchor) throw new Error("Job not found");

  const [existing] = await db
    .select()
    .from(boardToken)
    .where(eq(boardToken.email, clean))
    .orderBy(desc(boardToken.createdAt))
    .limit(1);

  const expiresAt = new Date(Date.now() + BOARD_TOKEN_TTL_MS);
  let token: string;
  if (existing && isBoardTokenLive(existing.expiresAt)) {
    token = existing.token;
    await db
      .update(boardToken)
      .set({ expiresAt })
      .where(eq(boardToken.token, token));
  } else {
    token = randomBytes(24).toString("base64url");
    await db.insert(boardToken).values({
      token,
      jobId,
      email: clean,
      expiresAt,
    });
  }

  return {
    token,
    email: clean,
    boardPath: propertyBoardPath(token, sessionAddress(anchor)),
    propertiesUrl: landlordPropertiesUrl(token),
    recipientName: anchor.requesterName,
  };
}

export async function beginPropertyBoard(
  jobId: string,
  email: string,
): Promise<BoardOpenResult> {
  const link = await ensureLandlordLink(jobId, email);
  const delivery = startBoardEmail({
    email: link.email,
    propertiesUrl: link.propertiesUrl,
    recipientName: link.recipientName,
    configured: emailConfigured(),
    blocked: isBlockedEmailRecipient(link.email),
    queue: queueBoardLinkSend,
    send: async (to, url, recipientName) => {
      await sendBoardLinkEmail(to, url, recipientName);
    },
  });
  return {
    boardPath: link.boardPath,
    propertiesUrl: link.propertiesUrl,
    email: link.email,
    emailStatus: delivery.emailStatus,
    message: delivery.message,
  };
}

export async function getLandlordAccess(token: string): Promise<
  | {
      token: string;
      email: string;
      jobs: Job[];
    }
  | undefined
> {
  if (!isBoardTokenShape(token)) return undefined;
  const [link] = await db
    .select()
    .from(boardToken)
    .where(eq(boardToken.token, token));
  if (!link || !isBoardTokenLive(link.expiresAt)) return undefined;

  const [anchor] = await db.select().from(job).where(eq(job.id, link.jobId));
  const jobs = await db.select().from(job).orderBy(asc(job.createdAt));
  return {
    token: link.token,
    email: link.email,
    jobs: jobsForLandlord(jobs, {
      email: link.email,
      anchorContact: anchor?.requesterContact,
    }),
  };
}

export async function loadPropertyForToken(
  token: string,
  key: string,
): Promise<
  | { kind: "expired" }
  | { kind: "missing"; token: string }
  | {
      kind: "ok";
      token: string;
      email: string;
      address: string;
      jobs: Job[];
    }
> {
  const access = await getLandlordAccess(token);
  if (!access) return { kind: "expired" };
  const address = addressFromKey(key);
  if (!address) return { kind: "missing", token: access.token };
  const jobs = access.jobs.filter((row) => sessionAddress(row) === address);
  if (jobs.length === 0) return { kind: "missing", token: access.token };
  return {
    kind: "ok",
    token: access.token,
    email: access.email,
    address,
    jobs,
  };
}
