/**
 * Where to buy wish-to-have items, per check-in country. Names only, no
 * links, no rival services platforms — VergeCare matches handymen itself.
 * Unknown or missing countries fall back to Others.
 */

import { countryFromPropertyType } from "./property-types";

const FALLBACK_COUNTRY = "Others";

const WISHLIST_STORES: Record<string, readonly string[]> = {
  Nigeria: ["Jumia", "Konga", "Jiji"],
  "United States": ["Wayfair", "Home Depot", "Best Buy"],
  "United Kingdom": ["IKEA", "Argos", "Dunelm", "British Heart Foundation"],
  Canada: ["IKEA", "Canadian Tire", "Kijiji"],
  Turkey: ["IKEA", "Koçtaş", "Trendyol"],
  Qatar: ["IKEA", "Home Centre", "Pan Home Stores"],
  Others: ["Amazon", "IKEA"],
};

export function wishlistStores(country: string | null): readonly string[] {
  if (country) {
    const stores = WISHLIST_STORES[country];
    if (stores) return stores;
  }
  return WISHLIST_STORES[FALLBACK_COUNTRY] ?? [];
}

/**
 * Stores for a job row. Falls back from the picked country to the country
 * prefix of the stored property type, then to Others.
 */
export function wishlistStoresFor(
  country: string | null,
  propertyType: string | null,
): readonly string[] {
  return wishlistStores(country ?? countryFromPropertyType(propertyType));
}
