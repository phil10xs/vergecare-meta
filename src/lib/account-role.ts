export const ACCOUNT_ROLES = [
  "resident",
  "landlord",
  "property_manager",
] as const;

export type AccountRole = (typeof ACCOUNT_ROLES)[number];

export function isAccountRole(value: unknown): value is AccountRole {
  return (
    value === "resident" ||
    value === "landlord" ||
    value === "property_manager"
  );
}

export function parseAccountRole(value: unknown): AccountRole | null {
  return isAccountRole(value) ? value : null;
}

/** Resident unless they arrived from the landlord or property manager door. */
export function roleFromDoor(value: unknown): AccountRole {
  if (value === "admin") return "landlord";
  return parseAccountRole(value) ?? "resident";
}

export function isAdminRole(role: AccountRole): boolean {
  return role === "landlord" || role === "property_manager";
}

export function roleLabel(role: AccountRole): string {
  switch (role) {
    case "resident":
      return "Resident";
    case "landlord":
      return "Landlord";
    case "property_manager":
      return "Property Manager";
  }
}

export function displayAddress(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function addressIdentity(value: string): string {
  return displayAddress(value).toLowerCase();
}

/**
 * Google search for a tradesman, including the typed budget.
 * Empty and non-positive amounts do not produce a URL.
 */
export function tradesmanSearchUrl(amount: string): string | null {
  const trimmed = amount.trim().replace(/,/g, "").replace(/^£/, "");
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null;
  const value = Number(trimmed);
  if (!Number.isFinite(value) || value <= 0) return null;
  return `https://www.google.com/search?q=${encodeURIComponent(`tradesman ${trimmed}`)}`;
}

export function invitePath(token: string): string {
  return `/i/${encodeURIComponent(token)}`;
}
