import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createInviteAction } from "@/app/actions/account";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { isAdminRole } from "@/lib/account-role";
import { currentAccount, loadAccountBoard } from "@/server/account";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Invite" };

const ERRORS: Record<string, string> = {
  contact: "Enter a valid email or phone number.",
  role: "Choose Landlord or Property Manager.",
  self: "Enter someone else's email or phone.",
  save: "We couldn't save that invite. Please try again.",
};

export default async function InvitePage({
  searchParams,
}: {
  searchParams: Promise<{ property?: string; error?: string }>;
}) {
  const person = await currentAccount();
  if (!person) redirect("/waitinglist");
  const params = await searchParams;
  const board = await loadAccountBoard(person, params.property ?? null);
  if (!board.property) redirect("/home");
  const admin = isAdminRole(person.role);
  const error = params.error ? ERRORS[params.error] : null;

  return (
    <AppShell showCheckIn={false}>
      <PageHeader
        title={admin ? "Invite resident" : "Invite landlord or property manager"}
        description={board.property.address}
        backHref={`/home?property=${encodeURIComponent(board.property.urlKey)}`}
        backLabel="Back to board"
      />
      <form
        action={createInviteAction}
        className="max-w-xl space-y-5 rounded-2xl border border-border bg-card p-4 sm:p-6"
      >
        <input type="hidden" name="property" value={board.property.urlKey} />
        <label className="block" htmlFor="invite-contact">
          <span className="mb-1.5 block text-sm font-semibold">
            Email or phone
          </span>
          <input
            id="invite-contact"
            name="contact"
            required
            autoComplete="email"
            className="text-field"
          />
        </label>
        {admin ? (
          <input type="hidden" name="role" value="resident" />
        ) : (
          <fieldset>
            <legend className="mb-2 block text-sm font-semibold">
              Landlord or Property Manager
            </legend>
            <div className="grid gap-2">
              <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
                <input
                  type="radio"
                  name="role"
                  value="landlord"
                  defaultChecked
                  className="h-4 w-4"
                />
                Landlord
              </label>
              <label className="flex min-h-11 items-center gap-2 text-sm font-semibold">
                <input
                  type="radio"
                  name="role"
                  value="property_manager"
                  className="h-4 w-4"
                />
                Property Manager
              </label>
            </div>
          </fieldset>
        )}
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <Button type="submit" variant="accent" className="w-full sm:w-auto">
          Send
        </Button>
      </form>
      <p className="mt-4">
        <Link
          href={`/home?property=${encodeURIComponent(board.property.urlKey)}`}
          className="inline-flex min-h-11 items-center text-sm font-semibold text-link hover:underline"
        >
          Back to board
        </Link>
      </p>
    </AppShell>
  );
}
