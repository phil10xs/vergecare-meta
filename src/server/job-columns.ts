import { sql } from "drizzle-orm";
import { db } from "@/db";

let propertyTypeColumnsReady: Promise<void> | null = null;

/**
 * Nullable columns for the check-in property type. Safe to run more than once.
 * Existing rows stay as they are.
 */
export function ensurePropertyTypeColumns(): Promise<void> {
  if (!propertyTypeColumnsReady) {
    propertyTypeColumnsReady = addPropertyTypeColumns().catch((error: unknown) => {
      propertyTypeColumnsReady = null;
      throw error;
    });
  }
  return propertyTypeColumnsReady;
}

async function addPropertyTypeColumns(): Promise<void> {
  await db.execute(
    sql`alter table job add column if not exists property_type text`,
  );
  await db.execute(
    sql`alter table job add column if not exists property_type_other text`,
  );
}

let checkinTypeColumnReady: Promise<void> | null = null;

/**
 * Nullable check-in kind for the job row. Safe to run more than once.
 * Rows stored before the column read as repair.
 */
export function ensureCheckinTypeColumn(): Promise<void> {
  if (!checkinTypeColumnReady) {
    checkinTypeColumnReady = addCheckinTypeColumn().catch((error: unknown) => {
      checkinTypeColumnReady = null;
      throw error;
    });
  }
  return checkinTypeColumnReady;
}

async function addCheckinTypeColumn(): Promise<void> {
  await db.execute(
    sql`alter table job add column if not exists checkin_type text`,
  );
}

let countryColumnReady: Promise<void> | null = null;

/**
 * Nullable check-in country for the job row. Safe to run more than once.
 * Rows stored before the column fall back to the Others directory.
 */
export function ensureCountryColumn(): Promise<void> {
  if (!countryColumnReady) {
    countryColumnReady = addCountryColumn().catch((error: unknown) => {
      countryColumnReady = null;
      throw error;
    });
  }
  return countryColumnReady;
}

async function addCountryColumn(): Promise<void> {
  await db.execute(sql`alter table job add column if not exists country text`);
}
