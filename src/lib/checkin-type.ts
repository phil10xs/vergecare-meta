/** One check-in covers a single kind of visit: fixing or wishing. */
export const CHECKIN_TYPES = ["repair", "wishlist"] as const;

export type CheckinType = (typeof CHECKIN_TYPES)[number];

/** Unknown, blank, or legacy values read as repair. */
export function parseCheckinType(value: string | null): CheckinType {
  return value === "wishlist" ? "wishlist" : "repair";
}

/** Board label. Rows stored before the type existed (null) read as repair. */
export function checkinTypeLabel(value: string | null): "Repair" | "Wishlist" {
  return value === "wishlist" ? "Wishlist" : "Repair";
}
