import { randomBytes } from "crypto";
import { asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import {
  account,
  job,
  propertyCheckin,
  propertyInvite,
  propertyMember,
  type Job,
} from "@/db/schema";
import { addressFromKey, addressKey } from "@/lib/app-url";
import {
  addressIdentity,
  displayAddress,
  invitePath,
  isAccountRole,
  isAdminRole,
  type AccountRole,
} from "@/lib/account-role";
import { normalizeContact } from "@/lib/waitlist";
import { cookies } from "next/headers";
import { readAccountSession, ACCOUNT_COOKIE } from "@/server/account-session";

export type AccountRecord = {
  contact: string;
  name: string;
  role: AccountRole;
};

export type PropertyPerson = {
  contact: string;
  name: string;
  role: AccountRole;
};

export type SavedInvite = {
  token: string;
  contact: string;
  role: AccountRole;
  href: string;
};

export type BoardProperty = {
  address: string;
  identity: string;
  urlKey: string;
  members: PropertyPerson[];
  invites: SavedInvite[];
  jobs: Job[];
};

export type AccountBoard = {
  account: AccountRecord;
  hasCheckedIn: boolean;
  property: BoardProperty | null;
  properties: { address: string; urlKey: string }[];
};

let tablesReady: Promise<void> | null = null;

export function ensureAccountTables(): Promise<void> {
  if (!tablesReady) {
    tablesReady = createAccountTables().catch((error) => {
      tablesReady = null;
      throw error;
    });
  }
  return tablesReady;
}

async function createAccountTables(): Promise<void> {
  await db.execute(sql`select set_config('client_min_messages', 'warning', false)`);
  await db.execute(sql`
    create table if not exists account (
      contact text primary key,
      name text not null,
      role text not null,
      created_at timestamptz not null default now()
    )
  `);
  await db.execute(sql`
    create table if not exists property_checkin (
      address_key text not null,
      property_address text not null,
      contact text not null,
      created_at timestamptz not null default now(),
      primary key (address_key, contact)
    )
  `);
  await db.execute(sql`
    create table if not exists property_member (
      address_key text not null,
      property_address text not null,
      contact text not null,
      role text not null,
      name text not null,
      created_at timestamptz not null default now(),
      primary key (address_key, contact)
    )
  `);
  await db.execute(sql`
    create table if not exists property_invite (
      token text primary key,
      address_key text not null,
      property_address text not null,
      contact text not null,
      role text not null,
      invited_by text not null,
      created_at timestamptz not null default now()
    )
  `);
}

function asRole(value: string): AccountRole | null {
  return isAccountRole(value) ? value : null;
}

export async function upsertAccount(input: {
  contact: string;
  name: string;
  role: AccountRole;
}): Promise<void> {
  await ensureAccountTables();
  await db
    .insert(account)
    .values({
      contact: input.contact,
      name: input.name,
      role: input.role,
    })
    .onConflictDoUpdate({
      target: account.contact,
      set: { name: input.name, role: input.role },
    });
}

export async function getAccount(contact: string): Promise<AccountRecord | null> {
  await ensureAccountTables();
  const [row] = await db
    .select()
    .from(account)
    .where(eq(account.contact, contact))
    .limit(1);
  if (!row) return null;
  const role = asRole(row.role);
  if (!role) return null;
  return { contact: row.contact, name: row.name, role };
}

export async function currentAccount(): Promise<AccountRecord | null> {
  const jar = await cookies();
  const contact = readAccountSession(jar.get(ACCOUNT_COOKIE)?.value);
  if (!contact) return null;
  try {
    return await getAccount(contact);
  } catch (error) {
    console.error(
      "[account] could not load account",
      error instanceof Error ? error.name : "Error",
    );
    return null;
  }
}

export async function recordPropertyCheckin(
  person: AccountRecord,
  rawAddress: string,
): Promise<void> {
  const propertyAddress = displayAddress(rawAddress);
  const identity = addressIdentity(propertyAddress);
  if (!identity) throw new Error("Address is required");
  await ensureAccountTables();
  await db
    .insert(propertyCheckin)
    .values({
      addressKey: identity,
      propertyAddress,
      contact: person.contact,
    })
    .onConflictDoNothing();
  await db
    .insert(propertyMember)
    .values({
      addressKey: identity,
      propertyAddress,
      contact: person.contact,
      role: person.role,
      name: person.name,
    })
    .onConflictDoUpdate({
      target: [propertyMember.addressKey, propertyMember.contact],
      set: {
        name: person.name,
        role: person.role,
        propertyAddress,
      },
    });
}

export async function createPropertyInvite(input: {
  inviter: AccountRecord;
  identity: string;
  propertyAddress: string;
  contact: string;
  role: AccountRole;
}): Promise<SavedInvite> {
  if (input.contact === input.inviter.contact) {
    throw new Error("Enter someone else's email or phone.");
  }
  if (isAdminRole(input.inviter.role)) {
    if (input.role !== "resident") {
      throw new Error("Invite a resident.");
    }
  } else if (!isAdminRole(input.role)) {
    throw new Error("Choose Landlord or Property Manager.");
  }
  await ensureAccountTables();
  const token = randomBytes(24).toString("base64url");
  await db.insert(propertyInvite).values({
    token,
    addressKey: input.identity,
    propertyAddress: input.propertyAddress,
    contact: input.contact,
    role: input.role,
    invitedBy: input.inviter.contact,
  });
  return {
    token,
    contact: input.contact,
    role: input.role,
    href: invitePath(token),
  };
}

export type StoredInvite = {
  token: string;
  identity: string;
  propertyAddress: string;
  contact: string;
  role: AccountRole;
  invitedBy: string;
};

export async function getInvite(token: string): Promise<StoredInvite | null> {
  if (!/^[A-Za-z0-9_-]{16,128}$/.test(token)) return null;
  await ensureAccountTables();
  const [row] = await db
    .select()
    .from(propertyInvite)
    .where(eq(propertyInvite.token, token))
    .limit(1);
  if (!row) return null;
  const role = asRole(row.role);
  if (!role) return null;
  return {
    token: row.token,
    identity: row.addressKey,
    propertyAddress: row.propertyAddress,
    contact: row.contact,
    role,
    invitedBy: row.invitedBy,
  };
}

export async function acceptInvite(
  person: AccountRecord,
  invite: StoredInvite,
): Promise<void> {
  await ensureAccountTables();
  await db
    .insert(propertyMember)
    .values({
      addressKey: invite.identity,
      propertyAddress: invite.propertyAddress,
      contact: person.contact,
      role: invite.role,
      name: person.name,
    })
    .onConflictDoUpdate({
      target: [propertyMember.addressKey, propertyMember.contact],
      set: {
        name: person.name,
        role: invite.role,
        propertyAddress: invite.propertyAddress,
      },
    });
  if (person.role !== invite.role) {
    await db
      .update(account)
      .set({ role: invite.role })
      .where(eq(account.contact, person.contact));
  }
}

function sameContact(left: string | null | undefined, right: string): boolean {
  if (!left) return false;
  return (normalizeContact(left) ?? left.trim().toLowerCase()) === right;
}

export async function loadAccountBoard(
  person: AccountRecord,
  propertyUrlKey: string | null,
): Promise<AccountBoard> {
  await ensureAccountTables();
  const [checkins, memberships, invites, jobs] = await Promise.all([
    db
      .select()
      .from(propertyCheckin)
      .where(eq(propertyCheckin.contact, person.contact))
      .orderBy(desc(propertyCheckin.createdAt)),
    db
      .select()
      .from(propertyMember)
      .where(eq(propertyMember.contact, person.contact))
      .orderBy(desc(propertyMember.createdAt)),
    db.select().from(propertyInvite).orderBy(desc(propertyInvite.createdAt)),
    db.select().from(job).orderBy(asc(job.createdAt)),
  ]);

  const ownJobs = jobs.filter(
    (row) =>
      row.propertyAddress &&
      sameContact(row.requesterContact, person.contact),
  );
  const hasCheckedIn = checkins.length > 0 || ownJobs.length > 0;

  const byIdentity = new Map<
    string,
    { address: string; at: number }
  >();
  for (const row of memberships) {
    byIdentity.set(row.addressKey, {
      address: row.propertyAddress,
      at: row.createdAt.getTime(),
    });
  }
  for (const row of checkins) {
    if (!byIdentity.has(row.addressKey)) {
      byIdentity.set(row.addressKey, {
        address: row.propertyAddress,
        at: row.createdAt.getTime(),
      });
    }
  }
  for (const row of ownJobs) {
    const identity = addressIdentity(row.propertyAddress ?? "");
    if (!identity || byIdentity.has(identity)) continue;
    byIdentity.set(identity, {
      address: displayAddress(row.propertyAddress ?? ""),
      at: row.createdAt.getTime(),
    });
  }

  const properties = [...byIdentity.entries()]
    .sort((a, b) => b[1].at - a[1].at)
    .map(([identity, entry]) => ({
      identity,
      address: entry.address,
      urlKey: addressKey(entry.address),
    }));

  let selected = properties[0] ?? null;
  if (propertyUrlKey) {
    const decoded = addressFromKey(propertyUrlKey);
    if (decoded) {
      const identity = addressIdentity(decoded);
      selected =
        properties.find((entry) => entry.identity === identity) ?? selected;
    }
  }

  if (!selected) {
    return { account: person, hasCheckedIn, property: null, properties: [] };
  }
  const current = selected;

  const members = await db
    .select()
    .from(propertyMember)
    .where(eq(propertyMember.addressKey, current.identity))
    .orderBy(asc(propertyMember.createdAt));
  const people: PropertyPerson[] = [];
  for (const row of members) {
    const role = asRole(row.role);
    if (!role) continue;
    people.push({ contact: row.contact, name: row.name, role });
  }
  if (!people.some((entry) => entry.contact === person.contact)) {
    people.unshift({
      contact: person.contact,
      name: person.name,
      role: person.role,
    });
  }

  const memberContacts = new Set(people.map((entry) => entry.contact));
  const pending = invites.filter((row) => {
    if (row.addressKey !== current.identity) return false;
    return !memberContacts.has(row.contact);
  });
  const propertyJobs = jobs.filter((row) => {
    if (!row.propertyAddress) return false;
    if (addressIdentity(row.propertyAddress) !== current.identity) return false;
    return Boolean(
      row.requesterContact &&
        memberContacts.has(
          normalizeContact(row.requesterContact) ??
            row.requesterContact.trim().toLowerCase(),
        ),
    );
  });

  return {
    account: person,
    hasCheckedIn,
    properties: properties.map((entry) => ({
      address: entry.address,
      urlKey: entry.urlKey,
    })),
    property: {
      address: current.address,
      identity: current.identity,
      urlKey: current.urlKey,
      members: people,
      invites: pending.map((row) => ({
        token: row.token,
        contact: row.contact,
        role: asRole(row.role) ?? "resident",
        href: invitePath(row.token),
      })),
      jobs: propertyJobs,
    },
  };
}
