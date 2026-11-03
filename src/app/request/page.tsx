import Link from "next/link";
import type { Metadata } from "next";
import { brand } from "@/brand";
import { BrandWordmark } from "@/components/layout/brand-wordmark";
import { BoardPreview } from "@/components/request/board-preview";
import { CaretakerHero } from "@/components/request/caretaker-hero";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: { absolute: brand.name },
  description: brand.description,
};

const CHECK_IN_HREF = "/request/checkin";
const CHECK_IN_LABEL = "Check in";

const TESTIMONIALS = [
  {
    quote:
      "Filmed the damp on Tuesday. The repair stayed on the board until it was done.",
    name: "Amara O.",
    role: "Landlord, Manchester",
  },
  {
    quote:
      "Snag rounds used to die in WhatsApp. Now every repair issue stays with the property.",
    name: "Tom W.",
    role: "Property manager",
  },
  {
    quote:
      "No account, no app. Just a link where I watch my repair move to done.",
    name: "Priya S.",
    role: "Tenant",
  },
] as const;

const STEPS = [
  {
    number: "01",
    title: "Check in",
    body: "Show VergeCare around your property. Film and tell it what needs attention.",
  },
  {
    number: "02",
    title: "Get your snag list",
    body: "VergeCare spots the repair issues and organises everything that needs fixing.",
  },
  {
    number: "03",
    title: "Find the right handyman",
    body: "VergeCare finds local handymen by skill, location and price. You approve the handyman and price before work starts.",
  },
  {
    number: "04",
    title: "Keep things moving",
    body: "VergeCare helps you stay within budget, follows repair progress and keeps track of every bill until it's paid.",
  },
] as const;

const FEATURES = [
  {
    title: "Property Care",
    items: [
      "AI-powered property check-ins.",
      "Snag lists and maintenance tracking.",
      "Property history.",
    ],
  },
  {
    title: "Repairs & Handymen",
    items: [
      "Automated handyman matching.",
      "Availability and price comparisons.",
      "Repair progress tracking.",
    ],
  },
  {
    title: "Rent & Bills",
    items: [
      "Rent collection and payment reminders.",
      "Maintenance bills and invoices.",
      "Track what's been paid and what's outstanding.",
    ],
  },
  {
    title: "Chats & Messages",
    items: [
      "Chat with tenants and handymen.",
      "Keep property conversations together.",
      "Stay updated on repairs and requests.",
    ],
  },
  {
    title: "Property Records",
    items: [
      "Keep tenancy agreements.",
      "Store inspection reports.",
      "Save invoices and receipts.",
      "Find important documents when needed.",
    ],
  },
] as const;

const ACTIONS = [
  {
    prompt: "Something needs fixing?",
    action: "VergeCare adds it to your snag list.",
  },
  {
    prompt: "Got a repair bill?",
    action: "VergeCare helps check it against your budget.",
  },
  {
    prompt: "A repair is finished?",
    action: "VergeCare helps you update your property record.",
  },
] as const;

const frame = "mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-6";

const ctaClassName = cn(
  buttonVariants({ variant: "accent", size: "lg" }),
  "h-14 px-8 text-lg",
);

export default function PublicRequestPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className={`${frame} flex h-16 items-center justify-between gap-3`}>
          <BrandWordmark />
          <Link
            href={CHECK_IN_HREF}
            className={cn(buttonVariants({ variant: "accent" }), "shrink-0")}
          >
            {CHECK_IN_LABEL}
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <CaretakerHero
          checkInHref={CHECK_IN_HREF}
          ctaLabel={CHECK_IN_LABEL}
        />

        <section
          aria-labelledby="demo-heading"
          className={`${frame} py-12 sm:py-16`}
        >
          <h2
            id="demo-heading"
            className="max-w-2xl font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl"
          >
            See VergeCare in action.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            From spotting repair issues to finding the right handyman, see how
            VergeCare helps you look after your property.
          </p>
          <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-[#071617]">
            <iframe
              className="aspect-video w-full"
              src="https://www.youtube-nocookie.com/embed/Q40uPN17o5Q"
              title="See VergeCare in action"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </section>

        <section
          aria-labelledby="how-heading"
          className={`${frame} pb-12 sm:pb-16`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gv-teal-bright)]">
            How it works
          </p>
          <h2
            id="how-heading"
            className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl"
          >
            Spots problems. Finds solutions. Keeps things moving.
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            VergeCare doesn&apos;t just spot problems. It helps put things
            right.
          </p>
          <ol className="mt-10 max-w-3xl list-none">
            {STEPS.map((step, index) => (
              <li key={step.number} className="flex gap-4 sm:gap-6">
                <div className="flex w-12 shrink-0 flex-col items-center">
                  <span
                    aria-hidden
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-primary font-display text-sm font-bold tracking-tight text-primary-foreground"
                  >
                    {step.number}
                  </span>
                  {index < STEPS.length - 1 ? (
                    <span
                      aria-hidden
                      className="mt-2 w-px flex-1 bg-border"
                    />
                  ) : null}
                </div>
                <div
                  className={
                    index < STEPS.length - 1
                      ? "min-w-0 pb-8 pt-2 sm:pb-10"
                      : "min-w-0 pt-2"
                  }
                >
                  <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-12">
            <h3 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
              Your property, on one board
            </h3>
            <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Follow each repair, and every bill, until it&apos;s paid.
            </p>
            <BoardPreview />
          </div>
        </section>

        <section
          aria-labelledby="before-after-heading"
          className={`${frame} pb-12 sm:pb-16`}
        >
          <h2
            id="before-after-heading"
            className="font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl"
          >
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
                  Problems left too late, scattered across chats.
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
                  Spotted, sorted and looked after with {brand.shortName}.
                </p>
              </figcaption>
            </figure>
          </div>
        </section>

        <section className={`${frame} pb-12 sm:pb-16`}>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card px-5 py-6 sm:px-6 sm:py-8">
              <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                Budget-friendly repairs
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                Know what a repair might cost before committing. VergeCare
                compares prices and helps you find the right person within
                your budget.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card px-5 py-6 sm:px-6 sm:py-8">
              <h2 className="font-display text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
                Every property has a story.
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                VergeCare remembers every repair issue and little detail that
                helps you look after it.
              </p>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="features-heading"
          className={`${frame} pb-12 sm:pb-16`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gv-teal-bright)]">
            What VergeCare looks after
          </p>
          <h2
            id="features-heading"
            className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl"
          >
            A little help with the whole property.
          </h2>
          <ul className="mt-8 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
            {FEATURES.map((area) => (
              <li
                key={area.title}
                className="grid gap-3 px-4 py-5 sm:grid-cols-[13rem_minmax(0,1fr)] sm:items-start sm:gap-8 sm:px-6 sm:py-6"
              >
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {area.title}
                </h3>
                <ul className="grid gap-2 sm:grid-cols-2">
                  {area.items.map((item) => (
                    <li
                      key={item}
                      className="flex gap-2.5 text-base leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gv-teal-bright)]"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="actions-heading"
          className={`${frame} pb-12 sm:pb-16`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gv-teal-bright)]">
            On the job
          </p>
          <h2
            id="actions-heading"
            className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl"
          >
            VergeCare helps put things right.
          </h2>
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {ACTIONS.map((item) => (
              <li
                key={item.prompt}
                className="rounded-2xl border border-border bg-card px-4 py-5 sm:px-5"
              >
                <h3 className="font-display text-xl font-semibold tracking-tight">
                  {item.prompt}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {item.action}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="owners-heading"
          className={`${frame} pb-12 sm:pb-16`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gv-teal-bright)]">
            What owners say
          </p>
          <h2
            id="owners-heading"
            className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl"
          >
            Care that stays with the property
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

        <section
          aria-labelledby="cta-heading"
          className={`${frame} pb-16 sm:pb-20`}
        >
          <div className="rounded-[1.75rem] border border-white/10 bg-[#071617] px-6 py-10 text-[#f7faf9] shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:px-10 sm:py-14">
            <h2
              id="cta-heading"
              className="max-w-2xl font-display text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl"
            >
              A little help with everything your property needs.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              From collecting rent and sorting repairs to keeping track of
              bills and tenant messages, VergeCare helps you stay on top of
              it all.
            </p>
            <Link
              href={CHECK_IN_HREF}
              className={cn(ctaClassName, "mt-8 flex w-full sm:inline-flex sm:w-auto")}
            >
              {CHECK_IN_LABEL}
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
