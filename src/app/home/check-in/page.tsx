import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { checkInPropertyAction } from "@/app/actions/account";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { currentAccount } from "@/server/account";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Check in" };

export default async function HomeCheckInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const person = await currentAccount();
  if (!person) redirect("/waitinglist");
  const { next } = await searchParams;
  const filmNext = next === "film";

  return (
    <AppShell showCheckIn={false}>
      <PageHeader
        title="Check in"
        description={
          filmNext
            ? "Add the property first. Next you'll film a repair."
            : "Add the property. You can film a repair when you're ready."
        }
        backHref="/home"
        backLabel="Back to board"
      />
      <form
        action={checkInPropertyAction}
        className="max-w-xl space-y-5 rounded-2xl border border-border bg-card p-4 sm:p-6"
      >
        {filmNext ? <input type="hidden" name="next" value="film" /> : null}
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">
            Property address
          </span>
          <input
            name="propertyAddress"
            required
            autoComplete="street-address"
            placeholder="e.g. 12 Rosebank Road, Manchester"
            className="text-field"
          />
        </label>
        <Button type="submit" variant="accent" className="w-full sm:w-auto">
          Check in
        </Button>
      </form>
      <p className="mt-4">
        <Link
          href="/home"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-link hover:underline"
        >
          Back to board
        </Link>
      </p>
    </AppShell>
  );
}
