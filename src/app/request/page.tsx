import Link from "next/link";
import type { Metadata } from "next";
import { brand, howItWorks } from "@/brand";
import { BrandWordmark } from "@/components/layout/brand-wordmark";
import { BoardPreview } from "@/components/request/board-preview";
import { CaretakerHero } from "@/components/request/caretaker-hero";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: { absolute: brand.name },
  description: brand.description,
};

const TESTIMONIALS = [
  {
    quote:
      "Filmed the damp on Tuesday, plumber booked by Friday — and every visit stays on the board.",
    name: "Amara O.",
    role: "Landlord, Manchester",
  },
  {
    quote: "Snag rounds used to die in WhatsApp. Now each flat has a memory.",
    name: "Tom W.",
    role: "Facility manager",
  },
  {
    quote:
      "No account, no app. Just a link where I watch my repair move to done.",
    name: "Priya S.",
    role: "Tenant",
  },
];

const frame = "mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-6";

export default function PublicRequestPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className={`${frame} flex h-16 items-center justify-between gap-3`}>
          <BrandWordmark />
          <Link href="/waitinglist" className="shrink-0">
            <Button variant="accent">Check in for free</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <CaretakerHero checkInHref="/waitinglist" />

        <section
          aria-label="How it works"
          className={`${frame} py-12 sm:py-16`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gv-teal-bright)]">
            How it works
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            From a short clip to a board you can follow
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Your caretaker watches every clip and builds the board.
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-[#071617]">
            <iframe
              className="aspect-video w-full"
              src="https://www.youtube-nocookie.com/embed/ehPcJFHetC0"
              title="How VergeCare works"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <BoardPreview />
          <ol className="mt-8 grid gap-6 md:grid-cols-3">
            {howItWorks.map((step, index) => (
              <li key={step.title} className="min-w-0">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {step.body}
                </p>
                {index === 0 ? (
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                    Film &amp; narrate what you see, and {brand.engine} builds
                    your Issues snag list and your property&apos;s Bills
                    Tracker.
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-label="Before and after VergeCare"
          className={`${frame} pb-12 sm:pb-16`}
        >
          <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Before and after
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <figure className="overflow-hidden rounded-2xl border border-border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/checkin-before.jpg"
                alt="Neglected UK house with mould, bad sink and broken window close-ups"
                className="aspect-[3/2] w-full object-cover"
              />
              <figcaption className="px-4 py-4 sm:px-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-destructive">
                  Before
                </p>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  Issues spotted too late, scattered across chats.
                </p>
              </figcaption>
            </figure>
            <figure className="overflow-hidden rounded-2xl border border-border bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/checkin-after.jpg"
                alt="Cared-for UK house with fixed wall, sink and window close-ups"
                className="aspect-[3/2] w-full object-cover"
              />
              <figcaption className="px-4 py-4 sm:px-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--gv-teal-bright)]">
                  After
                </p>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  Checked in, tracked and fixed with {brand.shortName}.
                </p>
              </figcaption>
            </figure>
          </div>
        </section>

        <section
          aria-label="What VergeCare looks after"
          className={`${frame} pb-12 sm:pb-16`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gv-teal-bright)]">
            What VergeCare looks after
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Issues and bills today. Rent, docs, and chats coming soon.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card px-4 py-4 sm:px-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--gv-teal-bright)]">
                Live now
              </p>
              <ul className="mt-3 space-y-3 text-base leading-relaxed">
                <li>
                  <span className="font-semibold">Issues. </span>
                  <span className="text-muted-foreground">
                    Film a clip, get a costed snag list, track every fix to
                    done.
                  </span>
                </li>
                <li>
                  <span className="font-semibold">Bills. </span>
                  <span className="text-muted-foreground">
                    Every bill tracked until it&apos;s paid.
                  </span>
                </li>
                <li>
                  <span className="font-semibold">Clips kept. </span>
                  <span className="text-muted-foreground">
                    Every video you upload stays with the property. Giving her
                    a memory.
                  </span>
                </li>
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card px-4 py-4 sm:px-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
                Coming soon
              </p>
              <ul className="mt-3 space-y-3 text-base leading-relaxed">
                <li>
                  <span className="font-semibold">Rent. </span>
                  <span className="text-muted-foreground">
                    Rent due, paid, and chased — on the same board.
                  </span>
                </li>
                <li>
                  <span className="font-semibold">Docs. </span>
                  <span className="text-muted-foreground">
                    Certificates, contracts, and inventories — upload and keep
                    them with the property.
                  </span>
                </li>
                <li>
                  <span className="font-semibold">Chats. </span>
                  <span className="text-muted-foreground">
                    Owner, tenant, and tradesman talking around the fix — not
                    lost threads.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section
          aria-label="Why VergeCare"
          className={`${frame} pb-12 sm:pb-16`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gv-teal-bright)]">
            Why VergeCare
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Perfect for care across multiple homes and portfolios.
          </h2>
          <ul className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed sm:text-lg">
            <li>
              <span className="font-semibold">
                One check-in. Every issue looked after.{" "}
              </span>
              <span className="text-muted-foreground">
                Film &amp; narrate every issue in a single visit; your
                caretaker lists each one with its trade and likely cost.
              </span>
            </li>
            <li>
              <span className="font-semibold">
                Follow every bill to paid.{" "}
              </span>
              <span className="text-muted-foreground">
                Update the price on the board and watch each fix move to done.
              </span>
            </li>
            <li>
              <span className="font-semibold">
                Bidding and clips-to-pay are next.{" "}
              </span>
              <span className="text-muted-foreground">
                Name your price with tradesmen, then pay from the board.
              </span>
            </li>
          </ul>
          <Link
            href="/waitinglist"
            className="mt-8 flex w-full sm:inline-flex sm:w-auto"
          >
            <Button
              variant="accent"
              size="lg"
              className="h-14 w-full px-8 text-lg sm:w-auto"
            >
              Check in for free
            </Button>
          </Link>
        </section>

        <section
          aria-label="What owners say"
          className={`${frame} pb-12 sm:pb-16`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gv-teal-bright)]">
            What owners say
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Visits that stay on the record
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {TESTIMONIALS.map((item) => (
              <figure key={item.name} className="min-w-0">
                <blockquote className="font-display text-xl font-medium leading-snug tracking-[-0.03em] sm:text-2xl">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {item.name}
                  </span>
                  {" · "}
                  {item.role}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}
