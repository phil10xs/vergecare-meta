"use server";

import { redirect } from "next/navigation";
import { addressFromKey } from "@/lib/app-url";
import { addressIdentity, displayAddress, isAdminRole, parseAccountRole } from "@/lib/account-role";
import { normalizeContact } from "@/lib/waitlist";
import {
  createPropertyInvite,
  currentAccount,
  loadAccountBoard,
  recordPropertyCheckin,
} from "@/server/account";

function formText(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

export async function checkInPropertyAction(formData: FormData): Promise<void> {
  const person = await currentAccount();
  if (!person) redirect("/waitinglist");
  const raw = formText(formData, "propertyAddress");
  if (!raw) throw new Error("Address is required");
  await recordPropertyCheckin(person, raw);
  const address = displayAddress(raw);
  if (formText(formData, "next") === "film") {
    redirect(
      `/request/checkin?from=board&address=${encodeURIComponent(address)}`,
    );
  }
  redirect("/home");
}

export async function createInviteAction(formData: FormData): Promise<void> {
  const person = await currentAccount();
  if (!person) redirect("/waitinglist");
  const urlKey = formText(formData, "property");
  const decoded = urlKey ? addressFromKey(urlKey) : null;
  if (!urlKey || !decoded) redirect("/home");
  const board = await loadAccountBoard(person, urlKey);
  const property = board.property;
  if (!property || addressIdentity(decoded) !== property.identity) redirect("/home");
  const inviteBack = `/home/invite?property=${encodeURIComponent(property.urlKey)}`;
  const contact = normalizeContact(formText(formData, "contact") ?? "");
  if (!contact) redirect(`${inviteBack}&error=contact`);
  const role = isAdminRole(person.role)
    ? "resident"
    : parseAccountRole(formText(formData, "role"));
  if (!role || (isAdminRole(person.role) ? false : !isAdminRole(role))) {
    redirect(`${inviteBack}&error=role`);
  }
  try {
    await createPropertyInvite({
      inviter: person,
      identity: property.identity,
      propertyAddress: property.address,
      contact,
      role,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    redirect(`${inviteBack}&error=${message.includes("someone else") ? "self" : "save"}`);
  }
  redirect(`/home?property=${encodeURIComponent(property.urlKey)}`);
}
