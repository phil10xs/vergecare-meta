import type { Metadata } from "next";
import { cookies } from "next/headers";
import { brand } from "@/brand";
import { BrandWordmark } from "@/components/layout/brand-wordmark";
import { LoginForm } from "@/components/platform/login-form";
import { LogoutButton } from "@/components/platform/logout-button";
import { ADMIN_COOKIE, readAdminSession } from "@/server/admin-auth";
import { loadWaitlist } from "@/server/waitlist-admin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Platform",
  robots: { index: false, follow: false },
};

const frame = "mx-auto w-full max-w-7xl px-3 sm:px-5 lg:px-6";

const joined = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
});

export default async function PlatformPage() {
  const jar = await cookies();
  const session = readAdminSession(jar.get(ADMIN_COOKIE)?.value);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className={`${frame} flex h-16 items-center justify-between gap-3`}>
          <BrandWordmark />
          {session ? <LogoutButton /> : null}
        </div>
      </header>
      <main className="flex-1">
        <section className={`${frame} py-8 sm:py-12`}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--gv-teal-bright)]">
            {brand.shortName}
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            {session ? "Waiting list" : "Platform"}
          </h1>
          {session ? <WaitlistPanel /> : <LoginForm />}
        </section>
      </main>
    </div>
  );
}

async function WaitlistPanel() {
  const list = await loadWaitlist();
  if (list.status === "unconfigured") {
    return (
      <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
        The waiting list cannot be stored until a hosted database is connected.
      </p>
    );
  }
  if (list.status === "error") {
    return (
      <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
        The waiting list could not be loaded.
      </p>
    );
  }
  if (list.rows.length === 0) {
    return (
      <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
        No one has joined yet.
      </p>
    );
  }
  return (
    <ul className="mt-8 space-y-3">
      {list.rows.map((row) => (
        <li
          key={row.contact}
          className="rounded-2xl border border-border bg-card px-4 py-4 sm:px-5"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-display text-lg font-semibold tracking-tight">
              {row.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {joined.format(row.createdAt)} UTC
            </p>
          </div>
          <dl className="mt-3 space-y-1 text-sm leading-relaxed">
            <div>
              <dt className="inline font-semibold">Business name </dt>
              <dd className="inline text-muted-foreground">{row.businessName}</dd>
            </div>
            <div>
              <dt className="inline font-semibold">Address </dt>
              <dd className="inline text-muted-foreground">{row.address}</dd>
            </div>
            <div>
              <dt className="inline font-semibold">Contact </dt>
              <dd className="inline break-all text-muted-foreground">{row.contact}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
