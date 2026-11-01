import Link from "next/link";
import { buttonVariants } from "@/components/ui/button-variants";
import { cn } from "@/lib/utils";

const AUDIENCE = [
  "Residents",
  "Landlords",
  "Homeowners",
  "Property managers",
] as const;

const PROMISES = [
  "Finds handymen on your budget",
  "Spots filmed home repair issues",
  "Creates snag list + tracker boards",
  "Tracks bill till paid",
] as const;

function MetaMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 shrink-0 text-foreground"
    >
      <path
        fill="currentColor"
        d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
      />
    </svg>
  );
}

function CheckInLink({ href, label }: { href: string; label: string }) {
  const className = cn(
    buttonVariants({ variant: "accent", size: "lg" }),
    "flex h-11 w-full px-6 text-base sm:inline-flex sm:w-auto",
  );
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

export function CaretakerHero({
  checkInHref,
  ctaLabel = "Get early access",
}: {
  checkInHref?: string;
  ctaLabel?: string;
}) {
  return (
    <section className="px-3 pt-3 sm:px-5 sm:pt-5 lg:px-6 lg:pt-6">
      <div className="relative isolate mx-auto flex h-[50dvh] min-h-[17.5rem] w-full max-w-7xl items-center overflow-hidden rounded-[1.75rem] bg-[#071617] text-[#f7faf9] shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
        <figure className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/checkin-after.jpg"
            alt="Cared-for house with fixed wall, tap and window"
            className="h-full w-full object-cover object-[center_42%] brightness-[0.72] sm:object-[right_center]"
          />
          <figcaption className="sr-only">
            The cared-for house, with the fixed wall, tap and window shown beside it
          </figcaption>
        </figure>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(100deg,rgba(7,22,23,0.88)_0%,rgba(7,22,23,0.78)_34%,rgba(7,22,23,0.66)_62%,rgba(7,22,23,0.55)_100%)]"
        />

        <div className="relative z-10 w-full min-w-0 px-5 py-5 sm:w-[68%] sm:px-10 md:w-[60%] lg:w-[58%] lg:px-12">
          <div className="min-w-0">
            <h1 className="max-w-3xl text-balance font-display text-[clamp(1.7rem,4.2vh,2.8rem)] font-semibold leading-[1.05] tracking-[-0.045em] text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.55)]">
              Your AI Property Caretaker.
            </h1>
            <ul className="mt-3 max-w-2xl space-y-1.5 font-display text-[clamp(0.92rem,2vh,1.28rem)] font-bold leading-snug tracking-[-0.03em] text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.6)]">
              {PROMISES.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="mt-2 max-w-2xl text-[clamp(0.8rem,1.7vh,1rem)] font-semibold leading-relaxed text-[var(--gv-signal)] [text-shadow:0_1px_8px_rgba(0,0,0,0.55)]">
              VergeCare gets things sorted.
            </p>
            {checkInHref ? (
              <div className="mt-4">
                <CheckInLink href={checkInHref} label={ctaLabel} />
              </div>
            ) : null}
            <ul
              className="mt-4 flex flex-wrap gap-2"
              aria-label="Who VergeCare is for"
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
      </div>
      <p className="mx-auto mt-4 flex w-full max-w-7xl items-center gap-2 text-sm font-medium text-muted-foreground sm:mt-5">
        <MetaMark />
        Powered by Meta
      </p>
    </section>
  );
}
