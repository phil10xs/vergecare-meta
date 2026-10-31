import { describe, expect, it } from "vitest";
import { normalizeContact, parseWaitlist } from "./waitlist";

describe("normalizeContact", () => {
  it("lowercases emails", () => {
    expect(normalizeContact("  Waitlist-Test@Example.com ")).toBe(
      "waitlist-test@example.com",
    );
  });

  it("treats the same phone formatting as one contact", () => {
    expect(normalizeContact("+44 7700 900123")).toBe(
      normalizeContact("447700900123"),
    );
  });

  it("rejects a contact that is neither email nor phone", () => {
    expect(normalizeContact("not a contact")).toBeNull();
  });
});

describe("parseWaitlist", () => {
  it("accepts a name, business, address, and email", () => {
    const parsed = parseWaitlist({
      name: "Ada",
      businessName: "Lovelace Lets",
      address: "12 Rosebank Road, Manchester",
      contact: "Ada@Example.com",
    });
    expect(parsed).toEqual({
      ok: true,
      data: {
        name: "Ada",
        businessName: "Lovelace Lets",
        address: "12 Rosebank Road, Manchester",
        contact: "ada@example.com",
      },
    });
  });

  it("asks for a real email or phone", () => {
    const parsed = parseWaitlist({
      name: "Ada",
      businessName: "Lovelace Lets",
      address: "12 Rosebank Road",
      contact: "hello",
    });
    expect(parsed.ok).toBe(false);
  });
});
