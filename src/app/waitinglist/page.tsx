import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/brand";
import { BrandWordmark } from "@/components/layout/brand-wordmark";
import { CaretakerHero } from "@/components/request/caretaker-hero";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";
import { roleFromDoor } from "@/lib/account-role";
import { currentAccount, getInvite } from "@/server/account";

const shareTitle = "VergeCare waiting list";
const shareDescription = `Join the ${brand.shortName} waitlist. We'll email you when beta is live.`;
const shareImage = {
  url: "https://vergecare.goverge.app/images/vergecare-waitlist-thumbnail.jpg",
  width: 1024,
  height: 576,
  alt: shareTitle,
  type: "image/jpeg",
} as const;

export const metadata: Metadata = {
  title: { absolute: shareTitle },
  description: shareDescription,
  openGraph: {
    title: shareTitle,
    description: shareDescription,
    url: "https://vergecare.goverge.app/waitinglist",
    type: "website",
    images: [shareImage],
  },
  twitter: {
    card: "summary_large_image",
    title: shareTitle,
    description: shareDescription,
    images: [shareImage],
  },
};

const frame = "mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-6";

export default async function WaitingListPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; invite?: string }>;
}) {
  const params = await searchParams;
  const invite = params.invite ? await getInvite(params.invite) : null;
  const lockedRole = invite?.role ?? null;
  const defaultRole = lockedRole ?? roleFromDoor(params.role);
  const account = await currentAccount();
  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className={`${frame} flex h-16 items-center`}>
          <BrandWordmark />
        </div>
      </header>
      <main className="flex-1">
        <CaretakerHero />
        <section className={`${frame} py-6 sm:py-8`}>
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gv-teal-bright)]">
                {brand.shortName}
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Join the waitlist
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Watch how it works, then leave your details. We&apos;ll email you
                when beta is live.
              </p>
              <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-[#071617]">
                <iframe
                  className="aspect-video w-full"
                  src="https://www.youtube-nocookie.com/embed/ehPcJFHetC0"
                  title="How VergeCare works"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                />
              </div>
            </div>
            <div className="min-w-0 lg:[&>#waitlist-form]:mt-0">
              {account ? (
                <p className="mb-2">
                  <Link
                    href="/home"
                    className="inline-flex min-h-11 items-center text-sm font-semibold text-link hover:underline"
                  >
                    Back to board
                  </Link>
                </p>
              ) : null}
              <WaitlistForm
                defaultRole={defaultRole}
                lockedRole={lockedRole}
                invite={invite?.token ?? null}
                defaultContact={invite?.contact ?? ""}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
