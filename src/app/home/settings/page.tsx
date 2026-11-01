import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { roleLabel } from "@/lib/account-role";
import { currentAccount, loadAccountBoard } from "@/server/account";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Profile" };

export default async function SettingsPage() {
  const person = await currentAccount();
  if (!person) redirect("/waitinglist");
  const board = await loadAccountBoard(person, null);

  return (
    <AppShell showCheckIn={false}>
      <PageHeader
        eyebrow="Settings"
        title="Profile"
        description="Name, role, and how to reach you."
        backHref="/home"
        backLabel="Back to board"
      />
      <dl className="max-w-xl divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid gap-1 px-4 py-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
          <dt className="text-sm text-muted-foreground">Name</dt>
          <dd className="font-semibold break-words">{person.name}</dd>
        </div>
        <div className="grid gap-1 px-4 py-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
          <dt className="text-sm text-muted-foreground">Role</dt>
          <dd className="font-semibold">{roleLabel(person.role)}</dd>
        </div>
        <div className="grid gap-1 px-4 py-3 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-4">
          <dt className="text-sm text-muted-foreground">Contact</dt>
          <dd className="font-semibold break-words">{person.contact}</dd>
        </div>
      </dl>
      {board.hasCheckedIn ? null : (
        <Link href="/home/check-in" className="mt-6 inline-flex">
          <Button variant="accent">Check in</Button>
        </Link>
      )}
    </AppShell>
  );
}
