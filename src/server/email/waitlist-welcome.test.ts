import { describe, expect, it } from "vitest";
import {
  WAITLIST_PAGE_URL,
  WAITLIST_WELCOME_SUBJECT,
  isWaitlistEmail,
  waitlistGreetingName,
  waitlistWelcomeEmail,
} from "./waitlist-welcome";

describe("waitlist welcome email", () => {
  it("greets by first name and points at the production waitlist", () => {
    const mail = waitlistWelcomeEmail({ name: "Ada Lovelace" });
    expect(mail.subject).toBe(WAITLIST_WELCOME_SUBJECT);
    expect(mail.subject).toBe("You're on the VergeCare list");
    expect(mail.text).toContain("Hello Ada,");
    expect(mail.text).toContain("Your place on the beta list is saved.");
    expect(mail.text).toContain(
      "VergeCare films a repair, tracks the bill, and remembers every visit.",
    );
    expect(mail.text).toContain("We'll email you when beta is open.");
    expect(mail.text).toContain(WAITLIST_PAGE_URL);
    expect(mail.html).toContain("Hello Ada,");
    expect(mail.html).toContain(WAITLIST_PAGE_URL);
    expect(mail.html).toContain("#071617");
    expect(mail.html).toContain("#d4f34a");
    expect(mail.html).not.toMatch(/password/i);
    expect(mail.text).not.toMatch(/password/i);
  });

  it("still reads cleanly when the name is blank", () => {
    const mail = waitlistWelcomeEmail({ name: "   " });
    expect(mail.text.startsWith("Hello,")).toBe(true);
    expect(mail.html).toContain("Hello,");
    expect(mail.html).not.toContain("Hello ,");
  });

  it("escapes a name so it cannot change the markup", () => {
    const mail = waitlistWelcomeEmail({ name: "Ada <script>" });
    expect(mail.html).not.toContain("<script>");
    expect(mail.html).toContain("Hello Ada,");
  });

  it("treats only email contacts as mailable", () => {
    expect(isWaitlistEmail("ada@example.com")).toBe(true);
    expect(isWaitlistEmail("447700900123")).toBe(false);
    expect(waitlistGreetingName("Priya S.")).toBe("Priya");
  });
});
