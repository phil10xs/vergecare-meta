import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const job = pgTable("job", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  siteName: text("site_name"),
  status: text("status").notNull().default("requested"),
  priority: text("priority").notNull().default("medium"),
  assignee: text("assignee"),
  tradesmanName: text("tradesman_name"),
  tradesmanTrade: text("tradesman_trade"),
  severity: text("severity"),
  costBand: text("cost_band"),
  source: text("source").notNull().default("internal"),
  requesterName: text("requester_name"),
  requesterContact: text("requester_contact"),
  businessName: text("business_name"),
  propertyAddress: text("property_address"),
  paymentStatus: text("payment_status").notNull().default("none"),
  paymentAmount: integer("payment_amount"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const siteReport = pgTable("site_report", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id").references(() => job.id, { onDelete: "cascade" }),
  author: text("author"),
  notes: text("notes").notNull(),
  siteCondition: text("site_condition"),
  hazards: text("hazards"),
  materials: text("materials"),
  nextSteps: text("next_steps"),
  mediaUrls: text("media_urls").array(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const siteMedia = pgTable("site_media", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .references(() => job.id, { onDelete: "cascade" })
    .notNull(),
  kind: text("kind").notNull(),
  filename: text("filename").notNull(),
  mimeType: text("mime_type").notNull(),
  sizeBytes: integer("size_bytes").notNull(),
  narration: text("narration"),
  transcript: text("transcript"),
  visualDescription: text("visual_description"),
  detectedTrade: text("detected_trade"),
  regions: text("regions"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const checklistItem = pgTable("checklist_item", {
  id: uuid("id").primaryKey().defaultRandom(),
  jobId: uuid("job_id")
    .references(() => job.id, { onDelete: "cascade" })
    .notNull(),
  section: text("section").notNull(),
  label: text("label").notNull(),
  checked: boolean("checked").notNull().default(false),
  note: text("note"),
  sort: integer("sort").notNull().default(0),
});

export const jobNotes = pgTable("job_notes", {
  jobId: uuid("job_id")
    .primaryKey()
    .references(() => job.id, { onDelete: "cascade" }),
  siteCondition: text("site_condition"),
  hazards: text("hazards"),
  materials: text("materials"),
  nextSteps: text("next_steps"),
});

// Magic-link credential. Access is this token, independent of any future password.
// jobId is the check-in the link was requested from, not a password binding.
export const boardToken = pgTable("board_token", {
  token: text("token").primaryKey(),
  jobId: uuid("job_id")
    .references(() => job.id, { onDelete: "cascade" })
    .notNull(),
  email: text("email").notNull(),
  // Set when a magic-link email has been queued for this token.
  // Later properties reuse the token and do not send again.
  emailedAt: timestamp("emailed_at", { withTimezone: true }),
  // Older rows stored a 7-day cutoff. Access does not read it, and new links leave it empty.
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Beta waitlist. Contact is an email or phone, stored in a normalized form
// so the same person joining again is already on the list.
export const waitlist = pgTable("waitlist", {
  contact: text("contact").primaryKey(),
  name: text("name").notNull(),
  businessName: text("business_name").notNull(),
  address: text("address").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Signed-in account. Role is who they are. Landlord and property manager
// share one admin capability; the label does not grant extra powers.
export const account = pgTable("account", {
  contact: text("contact").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Address-only check-in. Filming a repair is separate and optional.
export const propertyCheckin = pgTable(
  "property_checkin",
  {
    addressKey: text("address_key").notNull(),
    propertyAddress: text("property_address").notNull(),
    contact: text("contact").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.addressKey, table.contact] }),
  ],
);

export const propertyMember = pgTable(
  "property_member",
  {
    addressKey: text("address_key").notNull(),
    propertyAddress: text("property_address").notNull(),
    contact: text("contact").notNull(),
    role: text("role").notNull(),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    primaryKey({ columns: [table.addressKey, table.contact] }),
  ],
);

export const propertyInvite = pgTable("property_invite", {
  token: text("token").primaryKey(),
  addressKey: text("address_key").notNull(),
  propertyAddress: text("property_address").notNull(),
  contact: text("contact").notNull(),
  role: text("role").notNull(),
  invitedBy: text("invited_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Job = typeof job.$inferSelect;
export type NewJob = typeof job.$inferInsert;
export type BoardToken = typeof boardToken.$inferSelect;
export type SiteReport = typeof siteReport.$inferSelect;
export type NewSiteReport = typeof siteReport.$inferInsert;
export type SiteMedia = typeof siteMedia.$inferSelect;
export type ChecklistItem = typeof checklistItem.$inferSelect;
export type WaitlistEntry = typeof waitlist.$inferSelect;
