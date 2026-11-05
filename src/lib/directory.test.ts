import { describe, expect, it } from "vitest";
import { wishlistStores, wishlistStoresFor } from "./directory";
import { COUNTRY_OPTIONS } from "./property-types";

describe("wishlist directory", () => {
  it("lists stores per country with an Others fallback", () => {
    expect(wishlistStores("United Kingdom")).toContain(
      "British Heart Foundation",
    );
    expect(wishlistStores(null)).toEqual(wishlistStores("Others"));
    expect(wishlistStores("France")).toEqual(wishlistStores("Others"));
  });

  it("covers every picker country", () => {
    for (const country of COUNTRY_OPTIONS) {
      expect(wishlistStores(country).length).toBeGreaterThan(0);
    }
  });

  it("falls back through property type to Others", () => {
    expect(wishlistStoresFor("Qatar", null)).toContain("Home Centre");
    expect(wishlistStoresFor(null, "Turkey: Villa")).toContain("Koçtaş");
    expect(wishlistStoresFor(null, null)).toEqual(wishlistStores("Others"));
    expect(wishlistStoresFor(null, "Room and parlour")).toEqual(
      wishlistStores("Others"),
    );
  });
});
