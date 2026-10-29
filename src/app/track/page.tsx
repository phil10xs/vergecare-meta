import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2, ClipboardCheck, KanbanSquare } from "lucide-react";
import { ListHero } from "@/components/layout/list-overview";
import { Button } from "@/components/ui/button";
import { TrackBoard } from "@/components/track/track-board";
import { TrackList } from "@/components/track/track-list";
import { ReportCelebration } from "@/components/request/report-celebration";
import { db } from "@/db";
import { job } from "@/db/schema";
import { asc } from "drizzle-orm";

export const metadata: Metadata = { title: "Track" };

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; paid?: string }>;
}) {
  const { view, paid } = await searchParams;
  const current = view === "list" ? "list" : "board";
  const jobs = await db.select().from(job).orderBy(asc(job.createdAt));

  return (
    <main className="mx-auto w-full max-w-[var(--app-page-max)] px-[var(--app-gutter)] py-8">
      <ReportCelebration active={paid === "1"} />
      <ListHero
        title="Track"
        description="Every property's visits and sessions — as an Issues snag list or your Home/Property's Issues & Bills Tracker Board."
        icon={current === "board" ? KanbanSquare : ClipboardCheck}
        count={jobs.length}
        countLabel={jobs.length === 1 ? "session" : "sessions"}
        actionHref="/request"
        actionLabel="New check-in"
      />

      {paid === "1" ? (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
          <CheckCircle2
            className="mt-0.5 h-5 w-5 shrink-0 text-[var(--gv-teal-bright)]"
            aria-hidden
          />
          <div className="text-sm">
            <p className="font-semibold">Your payment has been confirmed.</p>
            <p className="mt-0.5 text-muted-foreground">
              The issue now shows as Paid on the board.
            </p>
          </div>
        </div>
      ) : null}

      <nav aria-label="Track view" className="mb-4 flex gap-2">
        <Link href="/track?view=list">
          <Button size="sm" variant={current === "list" ? "accent" : "outline"}>
            List
          </Button>
        </Link>
        <Link href="/track?view=board">
          <Button size="sm" variant={current === "board" ? "accent" : "outline"}>
            Board
          </Button>
        </Link>
      </nav>

      {current === "board" ? (
        <TrackBoard jobs={jobs} />
      ) : (
        <TrackList jobs={jobs} />
      )}
    </main>
  );
}
