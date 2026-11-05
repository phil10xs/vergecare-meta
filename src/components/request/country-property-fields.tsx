"use client";

import * as React from "react";
import {
  COUNTRY_OPTIONS,
  groupsForCountry,
  propertyTypeOptionValue,
} from "@/lib/property-types";

/**
 * Country picker plus the property-type list it filters. Picking a country
 * narrows the list to local wording; "Others" skips the list — those
 * residents describe the type in the free-text field below instead.
 */
export function CountryPropertyFields() {
  const [country, setCountry] = React.useState("");
  const groups = groupsForCountry(country || null);
  return (
    <>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">Country</span>
        <select
          name="country"
          className="text-field"
          value={country}
          onChange={(event) => setCountry(event.target.value)}
        >
          <option value="">Select country</option>
          {COUNTRY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      {groups.length > 0 ? (
        <label className="block" key={country}>
          <span className="mb-1.5 block text-sm font-semibold">
            Property type
          </span>
          <select name="propertyType" className="text-field" defaultValue="">
            <option value="">Select property type</option>
            {groups.map((group) => (
              <optgroup key={group.id} label={group.label}>
                {group.types.map((type) => {
                  const value = propertyTypeOptionValue(group.label, type);
                  return (
                    <option key={value} value={value}>
                      {type}
                    </option>
                  );
                })}
              </optgroup>
            ))}
          </select>
        </label>
      ) : (
        <p className="text-sm text-muted-foreground">
          Tell us your property type in the field below.
        </p>
      )}
    </>
  );
}
