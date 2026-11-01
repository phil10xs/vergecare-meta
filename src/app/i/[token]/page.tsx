import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { addressKey } from "@/lib/app-url";
import { roleLabel } from "@/lib/account-role";
import { normalizeContact } from "@/lib/waitlist";
import { acceptInvite, currentAccount, getInvite } from "@/server/account";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Invite" };

export default async function InviteLinkPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = await getInvite(token);
  if (!invite) {
    return (
      <AppShell showCheckIn={false}>
        <PageHeader
          title="Invite not found"
          description="This invite link does not match a property."
          backHref="/request"
          backLabel="Back"
        />
        <Link href="/waitinglist" className="inline-flex">
          <Button variant="accent">Get early access</Button>
        </Link>
      </AppShell>
    );
  }

  const person = await currentAccount();
  if (!person) {
    redirect(`/waitinglist?invite=${encodeURIComponent(invite.token)}`);
  }

  const samePerson =
    (normalizeContact(person.contact) ?? person.contact) === invite.contact;
  if (samePerson) {
    await acceptInvite(person, invite);
    redirect(`/home?property=${encodeURIComponent(addressKey(invite.propertyAddress))}`);
  }

  return (
    <AppShell showCheckIn={false}>
      <PageHeader
        title={roleLabel(invite.role)}
        description={`This invite is for ${invite.contact}. Continue to join ${invite.propertyAddress}.`}
        backHref="/home"
        backLabel="Back to board"
      />
      <Link
        href={`/waitinglist?invite=${encodeURIComponent(invite.token)}`}
        className="inline-flex"
      >
        <Button variant="accent">Continue</Button>
      </Link>
    </AppShell>
  );
}
