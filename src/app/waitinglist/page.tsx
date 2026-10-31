import type { Metadata } from "next";
import { brand } from "@/brand";
import { BrandWordmark } from "@/components/layout/brand-wordmark";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

export const metadata: Metadata = {
  title: "Waitlist",
  description: `Join the ${brand.shortName} waitlist. We'll email you when beta is live.`,
};

const frame = "mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-6";

export default function WaitingListPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className={`${frame} flex h-16 items-center`}>
          <BrandWordmark />
        </div>
      </header>
      <main className="flex-1">
        <section className={`${frame} py-8 sm:py-12`}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gv-teal-bright)]">
            {brand.shortName}
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Join the waitlist
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Watch how it works, then leave your details. We&apos;ll email you
            when beta is live.
          </p>
          <div className="mt-8 max-w-3xl overflow-hidden rounded-2xl border border-border bg-[#071617]">
            <iframe
              className="aspect-video w-full"
              src="https://www.youtube-nocookie.com/embed/qDxQgBvIJ8A"
              title="How VergeCare works"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
          <WaitlistForm />
        </section>
      </main>
    </div>
  );
}
