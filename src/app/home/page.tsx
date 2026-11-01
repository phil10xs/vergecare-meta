import Link from "next/link";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { FindTradesman } from "@/components/home/find-tradesman";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { JobStatusBadge } from "@/components/ui/status-badge";
import { isAdminRole, roleLabel } from "@/lib/account-role";
import { currentAccount, loadAccountBoard } from "@/server/account";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Board" };

export default async function HomeBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ property?: string }>;
}) {
  const person = await currentAccount();
  if (!person) redirect("/waitinglist");
  const { property: propertyKey } = await searchParams;
  const board = await loadAccountBoard(person, propertyKey ?? null);
  const property = board.property;
  const admin = isAdminRole(person.role);
  const filmHref = property
    ? `/request/checkin?from=board&address=${encodeURIComponent(property.address)}`
    : "/home/check-in?next=film";

  return (
    <AppShell showCheckIn={false}>
      <PageHeader
        title="Board"
        description={
          property
            ? property.address
            : "Check in a property when you're ready. Filming a repair can wait."
        }
        actions={
          <Link href="/home/settings" className="flex w-full">
            <Button variant="outline" className="w-full">
              Settings
            </Button>
          </Link>
        }
      />

      {board.properties.length > 1 ? (
        <nav aria-label="Properties" className="mb-6 flex flex-wrap gap-2">
          {board.properties.map((entry) => {
            const current = property?.urlKey === entry.urlKey;
            return (
              <Link
                key={entry.urlKey}
                href={`/home?property=${entry.urlKey}`}
                className={
                  current
                    ? "inline-flex min-h-11 items-center rounded-xl bg-secondary px-3 text-sm font-semibold"
                    : "inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-link hover:underline"
                }
                aria-current={current ? "page" : undefined}
              >
                {entry.address}
              </Link>
            );
          })}
        </nav>
      ) : null}

      <div className="max-w-xl space-y-8">
        {property ? (
          <section className="space-y-3">
            <h2 className="font-display text-lg font-semibold tracking-tight">
              People
            </h2>
            <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
              {property.members.map((member) => (
                <li key={member.contact} className="px-4 py-3">
                  <p className="font-semibold">{member.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {roleLabel(member.role)} · {member.contact}
                  </p>
                </li>
              ))}
              {property.invites.map((invite) => (
                <li key={invite.token} className="px-4 py-3">
                  <p className="font-semibold">Invite saved</p>
                  <p className="text-sm text-muted-foreground">
                    {invite.contact} · {roleLabel(invite.role)}
                  </p>
                  <a
                    href={invite.href}
                    className="mt-1 inline-flex min-h-11 items-center break-all text-sm font-semibold text-link hover:underline"
                  >
                    {invite.href}
                  </a>
                </li>
              ))}
            </ul>
            <Link
              href={`/home/invite?property=${encodeURIComponent(property.urlKey)}`}
              className="inline-flex"
            >
              <Button variant="accent">
                {admin
                  ? "Invite resident"
                  : "Invite landlord or property manager"}
              </Button>
            </Link>
          </section>
        ) : (
          <Link href="/home/check-in" className="inline-flex">
            <Button variant="accent" size="lg">
              Check in
            </Button>
          </Link>
        )}

        <Link href={filmHref} className="inline-flex">
          <Button variant="outline">Film a repair</Button>
        </Link>

        {property && property.jobs.length > 0 ? (
          <section>
            <h2 className="font-display text-lg font-semibold tracking-tight">
              Repairs
            </h2>
            <ul className="mt-3 space-y-3">
              {property.jobs.map((entry) => (
                <li key={entry.id}>
                  <Link
                    href={
                      entry.source === "public"
                        ? `/request/${entry.id}?from=board`
                        : "/home"
                    }
                    className="block rounded-xl border border-border bg-card px-4 py-3"
                  >
                    <span className="font-semibold">{entry.title}</span>
                    <span className="mt-2 block">
                      <JobStatusBadge status={entry.status} />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <FindTradesman />

        <p className="text-base font-semibold">
          Docs{" "}
          <span className="font-normal text-muted-foreground">Coming soon</span>
        </p>

        {admin ? (
          <p className="text-base font-semibold">
            Rent collection{" "}
            <span className="font-normal text-muted-foreground">
              Coming soon
            </span>
          </p>
        ) : null}
      </div>
    </AppShell>
  );
}
