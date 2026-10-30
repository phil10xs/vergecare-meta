import Link from "next/link";
import { House } from "lucide-react";
import { brand } from "@/brand";
import { cn } from "@/lib/utils";

/** House mark, VergeSnag, and a BETA pill. Accessible name stays “VergeSnag, beta”. */
export function BrandWordmark({ className }: { className?: string }) {
  return (
    <Link
      href="/request"
      aria-label="VergeSnag, beta"
      className={cn(
        "flex min-h-11 shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg",
        className,
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <House className="h-4 w-4" aria-hidden />
      </span>
      <span className="flex items-center gap-2">
        <span className="font-display text-base font-bold tracking-tight">
          {brand.shortName}
        </span>
        <span
          aria-hidden="true"
          className="inline-flex shrink-0 items-center rounded-full border border-foreground/20 bg-foreground/[0.06] px-2 py-[0.3rem] text-[10px] font-semibold uppercase leading-none tracking-[0.16em] text-muted-foreground"
        >
          Beta
        </span>
      </span>
    </Link>
  );
}
