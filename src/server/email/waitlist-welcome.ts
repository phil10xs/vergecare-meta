import { colors } from "@/brand";
import { emailConfigured, sendEmail } from "@/server/email/ses";

export const WAITLIST_WELCOME_SUBJECT = "You're on the VergeCare list";
export const WAITLIST_PAGE_URL = "https://vergecare.goverge.app/waitinglist";

const LOGO_URL = "https://vergecare.goverge.app/brand/vergecare-96.png";

export function isWaitlistEmail(contact: string): boolean {
  return contact.includes("@");
}

/** First word of the form name, or null when there is nothing to greet. */
export function waitlistGreetingName(name: string): string | null {
  const token = name.trim().split(/\s+/)[0] ?? "";
  const cleaned = token.replace(/^[^\p{L}]+|[^\p{L}'’-]+$/gu, "");
  return cleaned || null;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function waitlistWelcomeEmail(input: { name: string }) {
  const first = waitlistGreetingName(input.name);
  const hello = first ? `Hello ${first},` : "Hello,";
  const what =
    "VergeCare films a repair, tracks the bill, and remembers every visit.";
  const saved = "Your place on the beta list is saved.";
  const later = "We'll email you when beta is open.";
  const text = [
    hello,
    "",
    saved,
    "",
    what,
    "",
    later,
    "",
    WAITLIST_PAGE_URL,
    "",
    "VergeCare",
    "Property care, remembered.",
  ].join("\n");

  const safeHello = escapeHtml(hello);
  const bodyHtml = `
    <p style="margin:22px 0 0;font-family:Georgia,'Iowan Old Style',Palatino,serif;font-size:28px;line-height:1.15;font-weight:600;letter-spacing:-0.03em;color:#f7faf9;">
      You're on the list.
    </p>
    <p style="margin:18px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5;color:#f7faf9;">
      ${safeHello}
    </p>
    <p style="margin:10px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5;color:#f7faf9;">
      ${saved}
    </p>
    <p style="margin:10px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5;color:#d5e0dd;">
      ${what}
    </p>
    <p style="margin:10px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5;color:#d5e0dd;">
      ${later}
    </p>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 0;">
      <tr>
        <td bgcolor="${colors.signal}" style="border-radius:999px;">
          <a href="${WAITLIST_PAGE_URL}"
             style="display:inline-block;padding:14px 22px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1;font-weight:700;color:${colors.ink};text-decoration:none;">
            See VergeCare
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:14px 0 0;font-family:Helvetica,Arial,sans-serif;font-size:13px;line-height:1.5;color:#8ea09c;">
      <a href="${WAITLIST_PAGE_URL}" style="color:#c5d4d0;text-decoration:underline;">${WAITLIST_PAGE_URL}</a>
    </p>
  `.trim();

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(WAITLIST_WELCOME_SUBJECT)}</title>
  </head>
  <body style="margin:0;padding:0;background:${colors.ink};">
    <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">
      ${escapeHtml(saved)}
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${colors.ink};">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:520px;">
            <tr>
              <td style="padding:8px 8px 28px;border-bottom:1px solid rgba(212,243,74,0.35);">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="vertical-align:middle;padding-right:12px;">
                      <img src="${LOGO_URL}" width="44" height="44" alt=""
                        style="display:block;border:0;border-radius:12px;" />
                    </td>
                    <td style="vertical-align:middle;font-family:Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;letter-spacing:-0.02em;color:#f7faf9;">
                      VergeCare
                    </td>
                  </tr>
                </table>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 8px 0;font-family:Helvetica,Arial,sans-serif;font-size:12px;line-height:1.5;color:#8ea09c;">
                VergeCare · Property care, remembered.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return { subject: WAITLIST_WELCOME_SUBJECT, html, text };
}

function logWelcomeFailure(error: unknown) {
  const detail =
    error instanceof Error &&
    error.message === "SES_FROM_EMAIL is not configured"
      ? "SES is not configured"
      : error instanceof Error
        ? error.name
        : "Error";
  console.error("[waitlist] welcome email failed:", detail);
}

/** Sends only for an email contact. Failures are logged and never thrown. */
export async function sendWaitlistWelcome(input: {
  name: string;
  email: string;
}): Promise<void> {
  if (!isWaitlistEmail(input.email)) return;
  if (!emailConfigured()) {
    console.error("[waitlist] welcome email skipped: SES is not configured");
    return;
  }
  const content = waitlistWelcomeEmail({ name: input.name });
  try {
    await sendEmail({
      to: input.email,
      subject: content.subject,
      html: content.html,
      text: content.text,
      fromName: "VergeCare",
    });
  } catch (error) {
    logWelcomeFailure(error);
  }
}
