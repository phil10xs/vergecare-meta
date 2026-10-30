import Link from "next/link";
import type { Metadata } from "next";
import { House } from "lucide-react";
import { brand, howItWorks } from "@/brand";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Check in your property" };

const AUDIENCE = ["Landlords", "Homeowners", "Tenants"] as const;

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
          <Link
            href="/request"
            className="flex min-h-11 min-w-0 items-center gap-2.5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <House className="h-4 w-4" aria-hidden />
            </span>
            <span className="truncate font-display text-base font-semibold tracking-tight">
              {brand.shortName}
            </span>
            <span className="hidden rounded-md bg-secondary px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:inline">
              Beta
            </span>
          </Link>
          <Link href="/request/checkin" className="shrink-0">
            <Button variant="accent">Check in</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="px-3 pt-3 sm:px-5 sm:pt-5 lg:px-6 lg:pt-6">
          <div className="relative isolate mx-auto w-full max-w-7xl overflow-hidden rounded-[1.75rem] text-[#f7faf9] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <figure className="pointer-events-none absolute inset-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/checkin-after.jpg"
                alt="Cared-for UK house with fixed wall, sink and window close-ups"
                className="h-full w-full origin-[32%_42%] scale-[1.72] object-cover object-[32%_42%]"
              />
              <figcaption className="sr-only">
                A cared-for brick house after the snags were fixed
              </figcaption>
            </figure>
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(105deg,rgba(7,22,23,0.86)_0%,rgba(7,22,23,0.74)_46%,rgba(7,22,23,0.58)_100%)]"
            />

            <div className="relative px-5 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-16">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d4f34a]">
                Landlords, homeowners, and tenants
              </p>
              <h1 className="mt-4 max-w-3xl font-display text-[1.85rem] font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-[2.35rem] lg:text-[3rem] lg:leading-[1.06] xl:text-[3.4rem]">
                Check in your property for free
              </h1>
              <p className="mt-4 max-w-2xl font-display text-lg font-medium leading-snug tracking-[-0.03em] text-white/80 sm:text-xl lg:text-2xl">
                Record the issues. Get your Issues snag list. Track fixes and
                bills on us.
              </p>
              <Link
                href="/request/checkin"
                className="mt-6 flex w-full sm:inline-flex sm:w-auto"
              >
                <Button
                  variant="accent"
                  size="lg"
                  className="h-14 w-full px-8 text-lg sm:w-auto"
                >
                  Start your check-in
                </Button>
              </Link>
              <ul
                className="mt-8 flex flex-wrap gap-2"
                aria-label="Who VergeSnag is for"
              >
                {AUDIENCE.map((label) => (
                  <li key={label}>
                    <span className="inline-flex border border-white/25 px-3 py-2 text-xs font-semibold tracking-[0.04em] text-white/90">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

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
            Powered by {brand.engine}.
          </p>
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
              </li>
            ))}
          </ol>
        </section>

        <section
          aria-label="Before and after VergeSnag"
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

        <section className="px-3 pb-[max(3rem,env(safe-area-inset-bottom))] sm:px-5 sm:pb-16 lg:px-6">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[linear-gradient(120deg,#071617,#134e4a_55%,#1f7a72)] px-6 py-12 text-[#f7faf9] sm:px-12 sm:py-14">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Festive offer
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/75 sm:text-lg">
                {brand.shortName} matches your bills on home fixes checked in
                this festive season.
              </p>
              <Link
                href="/request/checkin"
                className="mt-6 flex w-full sm:inline-flex sm:w-auto"
              >
                <Button
                  variant="accent"
                  size="lg"
                  className="h-14 w-full px-8 text-lg sm:w-auto"
                >
                  Start your check-in
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
