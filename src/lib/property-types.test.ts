import { describe, expect, it } from "vitest";
import {
  COUNTRY_OPTIONS,
  PROPERTY_TYPE_GROUPS,
  PROPERTY_TYPE_OTHER_MAX,
  countryFromPropertyType,
  groupsForCountry,
  parseCountry,
  parseOtherPropertyType,
  parseSelectedPropertyType,
  propertyTypeOptionValue,
  propertyTypesFromCheckin,
} from "./property-types";

describe("property type options", () => {
  it("lists per-country types in local wording", () => {
    expect(PROPERTY_TYPE_GROUPS.map((group) => group.label)).toEqual([
      "Nigeria",
      "United States",
      "United Kingdom",
      "Canada",
      "Turkey",
      "Qatar",
      "Others",
    ]);
    expect(PROPERTY_TYPE_GROUPS.map((group) => group.id)).toEqual([
      "NG",
      "US",
      "UK",
      "CA",
      "TR",
      "QA",
      "OTHER",
    ]);
    expect(PROPERTY_TYPE_GROUPS[0]?.types).toEqual([
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
    ]);
    expect(PROPERTY_TYPE_GROUPS[1]?.types).toEqual([
      "Single-family home",
      "Townhouse",
      "Condo",
      "Apartment",
      "Duplex",
      "Multi-family",
      "Mobile home",
      "Studio",
    ]);
    expect(PROPERTY_TYPE_GROUPS[2]?.types).toEqual([
      "Detached house",
      "Semi-detached house",
      "Terraced house",
      "Flat",
      "Bungalow",
      "Maisonette",
      "Cottage",
      "HMO",
      "Studio",
    ]);
    expect(PROPERTY_TYPE_GROUPS[3]?.types).toEqual([
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
    ]);
    expect(PROPERTY_TYPE_GROUPS[4]?.types).toEqual([
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
    ]);
    expect(PROPERTY_TYPE_GROUPS[5]?.types).toEqual([
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
    ]);
    expect(PROPERTY_TYPE_GROUPS[6]?.types).toEqual([
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
    ]);
  });

  it("keeps each label once inside a country and distinct across countries", () => {
    for (const group of PROPERTY_TYPE_GROUPS) {
      expect(new Set(group.types).size).toBe(group.types.length);
    }
    const nigeriaDetached = propertyTypeOptionValue("Nigeria", "Detached house");
    const ukDetached = propertyTypeOptionValue("United Kingdom", "Detached house");
    expect(nigeriaDetached).not.toBe(ukDetached);
    expect(parseSelectedPropertyType(nigeriaDetached)).toBe(nigeriaDetached);
    expect(parseSelectedPropertyType(ukDetached)).toBe(ukDetached);
  });
});

describe("property type check-in values", () => {
  it("stores a blank selection as empty and ignores values that are not listed", () => {
    expect(parseSelectedPropertyType(null)).toBeNull();
    expect(parseSelectedPropertyType("")).toBeNull();
    expect(parseSelectedPropertyType("   ")).toBeNull();
    expect(parseSelectedPropertyType("Detached house")).toBeNull();
    expect(parseSelectedPropertyType("France: Chateau")).toBeNull();
    expect(
      propertyTypesFromCheckin({ propertyType: "", propertyTypeOther: "" }),
    ).toEqual({ propertyType: null, propertyTypeOther: null });
  });

  it("keeps the listed type and an optional free-text type together", () => {
    const selected = propertyTypeOptionValue("United States", "Condo");
    expect(
      propertyTypesFromCheckin({
        propertyType: selected,
        propertyTypeOther: "  Garden  flat  ",
      }),
    ).toEqual({
      propertyType: "United States: Condo",
      propertyTypeOther: "Garden flat",
    });
  });

  it("lets free text stand alone and does not require a listed type", () => {
    expect(
      propertyTypesFromCheckin({
        propertyType: null,
        propertyTypeOther: "Room and parlour",
      }),
    ).toEqual({
      propertyType: null,
      propertyTypeOther: "Room and parlour",
    });
    expect(parseOtherPropertyType("   ")).toBeNull();
    const long = "x".repeat(PROPERTY_TYPE_OTHER_MAX + 40);
    expect(parseOtherPropertyType(long)).toHaveLength(PROPERTY_TYPE_OTHER_MAX);
  });
});

describe("country picker", () => {
  it("lists one option per group", () => {
    expect(COUNTRY_OPTIONS).toEqual([
      "Nigeria",
      "United States",
      "United Kingdom",
      "Canada",
      "Turkey",
      "Qatar",
      "Others",
    ]);
  });

  it("keeps listed countries and drops the rest", () => {
    expect(parseCountry("Qatar")).toBe("Qatar");
    expect(parseCountry(null)).toBeNull();
    expect(parseCountry("")).toBeNull();
    expect(parseCountry("France")).toBeNull();
  });

  it("filters groups by country and sends Others to free text", () => {
    expect(groupsForCountry(null)).toBe(PROPERTY_TYPE_GROUPS);
    expect(groupsForCountry("")).toBe(PROPERTY_TYPE_GROUPS);
    expect(groupsForCountry("France")).toBe(PROPERTY_TYPE_GROUPS);
    expect(groupsForCountry("Others")).toEqual([]);
    expect(groupsForCountry("Canada").map((group) => group.id)).toEqual([
      "CA",
    ]);
  });

  it("reads the country back from a stored property type", () => {
    expect(countryFromPropertyType("Canada: Condo")).toBe("Canada");
    expect(countryFromPropertyType(null)).toBeNull();
    expect(countryFromPropertyType("Room and parlour")).toBeNull();
    expect(countryFromPropertyType("France: Chateau")).toBeNull();
  });
});
