import type { BoardEmailStatus } from "@/lib/view-board";
import { clientEmailErrorMessage } from "@/server/email/ses";

const COPY: Record<BoardEmailStatus, string> = {
  scheduled: "Sending your properties link.",
  skipped_not_configured:
    "Email is not configured (SES_FROM_EMAIL). Nothing was sent.",
  failed:
    "That email could not be delivered. Check the address and try again. The board is still open.",
};

/**
 * Decide the email side of View Board without waiting for SES.
 * `queue` must not run the send before this function returns.
 */
export function startBoardEmail(input: {
  email: string;
  propertiesUrl: string;
  recipientName?: string | null;
  configured: boolean;
  blocked: boolean;
  queue: (task: () => Promise<void>) => void;
  send: (email: string, url: string, recipientName?: string | null) => Promise<void>;
}): { emailStatus: BoardEmailStatus; message: string } {
  if (!input.configured) {
    return {
      emailStatus: "skipped_not_configured",
      message: COPY.skipped_not_configured,
    };
  }
  if (input.blocked) {
    return { emailStatus: "failed", message: COPY.failed };
  }
  try {
    const email = input.email;
    const propertiesUrl = input.propertiesUrl;
    const recipientName = input.recipientName;
    input.queue(() => input.send(email, propertiesUrl, recipientName));
  } catch (error) {
    return { emailStatus: "failed", message: clientEmailErrorMessage(error) };
  }
  return { emailStatus: "scheduled", message: COPY.scheduled };
}
