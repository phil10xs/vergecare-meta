import { describe, expect, it } from "vitest";
import { checkinTypeLabel, parseCheckinType } from "./checkin-type";

describe("check-in type", () => {
  it("accepts repair and wishlist, defaulting to repair", () => {
    expect(parseCheckinType("repair")).toBe("repair");
    expect(parseCheckinType("wishlist")).toBe("wishlist");
    expect(parseCheckinType(null)).toBe("repair");
    expect(parseCheckinType("")).toBe("repair");
    expect(parseCheckinType("WISHLIST")).toBe("repair");
  });

  it("labels legacy rows as repair", () => {
    expect(checkinTypeLabel("repair")).toBe("Repair");
    expect(checkinTypeLabel("wishlist")).toBe("Wishlist");
    expect(checkinTypeLabel(null)).toBe("Repair");
  });
});
