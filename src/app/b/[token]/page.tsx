import Link from "next/link";
import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState, PageHeader } from "@/components/layout/page-header";
import { ExpiredBoardLink } from "@/components/track/expired-link";
import { Button } from "@/components/ui/button";
import { propertySnagPath } from "@/lib/app-url";
import { groupSessionsByPropertyVisit } from "@/lib/sessions";
import { getLandlordAccess } from "@/server/board-access";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My properties" };

export default async function MyPropertiesPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const access = await getLandlordAccess(token);
  if (!access) return <ExpiredBoardLink />;

  const groups = groupSessionsByPropertyVisit(access.jobs);

  return (
    <AppShell>
      <PageHeader
        title="My properties"
        description="Every property on this link. Open a snag list, then View Board to move issues. No password."
        meta={`${groups.length} ${groups.length === 1 ? "property" : "properties"}`}
        actions={
          <Link href="/request" className="flex w-full">
            <Button variant="accent" className="w-full">
              New check-in
            </Button>
          </Link>
        }
      />
      {groups.length === 0 ? (
        <EmptyState
          title="No check-ins on this link yet"
          description="Properties show up here after you check in with this email."
          href="/request"
          actionLabel="New check-in"
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <li key={group.address} className="min-w-0">
              <Link
                href={propertySnagPath(token, group.address)}
                className="flex h-full min-h-16 items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-4 hover:bg-secondary/40"
              >
                <span className="min-w-0">
                  <span className="block font-display text-base font-bold tracking-tight break-words">
                    {group.address}
                  </span>
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {group.sessionCount}{" "}
                    {group.sessionCount === 1 ? "issue" : "issues"}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-semibold text-link">
                  Snag list
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-6 text-sm text-muted-foreground">
        This link is for {access.email}. It expires 7 days after it was last
        refreshed.
      </p>
    </AppShell>
  );
}
