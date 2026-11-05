/**
 * Property types a landlord or resident can pick on check-in.
 * Labels stay in the local wording per country; the same name may appear
 * in more than one country, and the stored value keeps the country.
 */

export const PROPERTY_TYPE_OTHER_MAX = 120;

export type PropertyTypeGroup = {
  id: "NG" | "US" | "UK" | "CA" | "TR" | "QA" | "OTHER";
  label:
    | "Nigeria"
    | "United States"
    | "United Kingdom"
    | "Canada"
    | "Turkey"
    | "Qatar"
    | "Others";
  types: readonly string[];
};

export const PROPERTY_TYPE_GROUPS: readonly PropertyTypeGroup[] = [
  {
    id: "NG",
    label: "Nigeria",
    types: [
      "Detached house",
      "Duplex",
      "Bungalow",
      "Flat",
      "Self-contain",
      "Boys' quarters",
      "Face-me-I-face-you",
      "Semi-detached",
      "Terrace",
      "Penthouse",
    ],
  },
  {
    id: "US",
    label: "United States",
    types: [
      "Single-family home",
      "Townhouse",
      "Condo",
      "Apartment",
      "Duplex",
      "Multi-family",
      "Mobile home",
      "Studio",
    ],
  },
  {
    id: "UK",
    label: "United Kingdom",
    types: [
      "Detached house",
      "Semi-detached house",
      "Terraced house",
      "Flat",
      "Bungalow",
      "Maisonette",
      "Cottage",
      "HMO",
      "Studio",
    ],
  },
  {
    id: "CA",
    label: "Canada",
    types: [
      "Detached house",
      "Semi-detached house",
      "Townhouse",
      "Condo",
      "Apartment",
      "Duplex",
      "Triplex",
      "Bungalow",
      "Cottage",
      "Mobile home",
    ],
  },
  {
    id: "TR",
    label: "Turkey",
    types: [
      "Apartment",
      "Duplex",
      "Triplex",
      "Villa",
      "Detached house",
      "Residence flat",
      "Studio",
      "Penthouse",
      "Farmhouse",
      "Summer house",
    ],
  },
  {
    id: "QA",
    label: "Qatar",
    types: [
      "Apartment",
      "Studio",
      "Hotel apartment",
      "Duplex",
      "Triplex",
      "Townhouse",
      "Villa",
      "Compound villa",
      "Penthouse",
      "Detached house",
    ],
  },
  {
    id: "OTHER",
    label: "Others",
    types: [
      "House",
      "Apartment",
      "Duplex",
      "Bungalow",
      "Villa",
      "Studio",
      "Terrace",
      "Penthouse",
      "Cottage",
      "Farmhouse",
    ],
  },
];

/** Stored form of a listed type. Country stays attached so shared names do not collapse. */
export function propertyTypeOptionValue(groupLabel: string, type: string): string {
  return `${groupLabel}: ${type}`;
}

const ALLOWED_PROPERTY_TYPES = new Set(
  PROPERTY_TYPE_GROUPS.flatMap((group) =>
    group.types.map((type) => propertyTypeOptionValue(group.label, type)),
  ),
);

/** Country picker options, one per property-type group. */
export const COUNTRY_OPTIONS: readonly string[] = PROPERTY_TYPE_GROUPS.map(
  (group) => group.label,
);

export function parseCountry(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return COUNTRY_OPTIONS.includes(trimmed) ? trimmed : null;
}

/**
 * Groups shown for a picked country. Blank or unknown shows everything;
 * "Others" shows none — those residents describe the type in free text.
 */
export function groupsForCountry(
  country: string | null,
): readonly PropertyTypeGroup[] {
  if (!country) return PROPERTY_TYPE_GROUPS;
  if (country === "Others") return [];
  const groups = PROPERTY_TYPE_GROUPS.filter(
    (group) => group.label === country,
  );
  return groups.length > 0 ? groups : PROPERTY_TYPE_GROUPS;
}

/** Country prefix of a stored "Country: Type" value, when it names a picker country. */
export function countryFromPropertyType(value: string | null): string | null {
  if (!value) return null;
  const label = value.split(":")[0]?.trim() ?? "";
  return parseCountry(label);
}

export function parseSelectedPropertyType(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return ALLOWED_PROPERTY_TYPES.has(trimmed) ? trimmed : null;
}

/** Optional free text. Blank is empty, and a long note is shortened rather than rejected. */
export function parseOtherPropertyType(value: string | null): string | null {
  if (!value) return null;
  const trimmed = value.replace(/\s+/g, " ").trim();
  if (!trimmed) return null;
  return trimmed.slice(0, PROPERTY_TYPE_OTHER_MAX);
}

export function propertyTypesFromCheckin(input: {
  propertyType: string | null;
  propertyTypeOther: string | null;
}): { propertyType: string | null; propertyTypeOther: string | null } {
  return {
    propertyType: parseSelectedPropertyType(input.propertyType),
    propertyTypeOther: parseOtherPropertyType(input.propertyTypeOther),
  };
}
