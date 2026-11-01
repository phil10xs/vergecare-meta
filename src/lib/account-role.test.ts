import { describe, expect, it } from "vitest";
import {
  addressIdentity,
  invitePath,
  isAdminRole,
  roleFromDoor,
  roleLabel,
  tradesmanSearchUrl,
} from "./account-role";

describe("roleFromDoor", () => {
  it("defaults to resident", () => {
    expect(roleFromDoor(undefined)).toBe("resident");
    expect(roleFromDoor("tenant")).toBe("resident");
  });

  it("keeps an admin role from the landlord door", () => {
    expect(roleFromDoor("landlord")).toBe("landlord");
    expect(roleFromDoor("property_manager")).toBe("property_manager");
    expect(roleFromDoor("admin")).toBe("landlord");
  });
});

describe("isAdminRole", () => {
  it("treats landlord and property manager as admin", () => {
    expect(isAdminRole("landlord")).toBe(true);
    expect(isAdminRole("property_manager")).toBe(true);
    expect(isAdminRole("resident")).toBe(false);
  });
});

describe("roleLabel", () => {
  it("uses the profile labels", () => {
    expect(roleLabel("resident")).toBe("Resident");
    expect(roleLabel("landlord")).toBe("Landlord");
    expect(roleLabel("property_manager")).toBe("Property Manager");
  });
});

describe("tradesmanSearchUrl", () => {
  it("includes a positive budget in a tradesman query", () => {
    expect(tradesmanSearchUrl("150")).toBe(
      "https://www.google.com/search?q=tradesman%20150",
    );
    expect(tradesmanSearchUrl("£1,200")).toBe(
      "https://www.google.com/search?q=tradesman%201200",
    );
  });

  it("does not build a URL for an empty or non-positive amount", () => {
    expect(tradesmanSearchUrl("")).toBeNull();
    expect(tradesmanSearchUrl("  ")).toBeNull();
    expect(tradesmanSearchUrl("0")).toBeNull();
    expect(tradesmanSearchUrl("-20")).toBeNull();
    expect(tradesmanSearchUrl("soon")).toBeNull();
  });
});

describe("addressIdentity", () => {
  it("matches the same address with different spacing and case", () => {
    expect(addressIdentity("  12  Rosebank Road ")).toBe(
      addressIdentity("12 rosebank road"),
    );
  });
});

describe("invitePath", () => {
  it("is one openable path", () => {
    expect(invitePath("abc_DEF-123")).toBe("/i/abc_DEF-123");
  });
});
