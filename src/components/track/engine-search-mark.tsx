import { Wrench } from "lucide-react";

/**
 * Animated "engine at work" mark: a sweeping search ring around a wrench,
 * for the board header while the caretaker matches handymen and manages
 * the board. The sweep pauses for reduced-motion users.
 */
export function EngineSearchMark() {
  return (
    <span
      role="img"
      aria-label="Caretaker engine searching for handymen"
      className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center"
    >
      <svg
        className="absolute inset-0 h-full w-full motion-safe:animate-[spin_9s_linear_infinite]"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <circle
          cx="24"
          cy="24"
          r="20"
          fill="none"
          strokeWidth="2.5"
          strokeDasharray="8 7"
          strokeLinecap="round"
          className="stroke-[var(--gv-teal-bright)]"
        />
        <circle cx="24" cy="4" r="3.5" className="fill-[var(--gv-teal-bright)]" />
      </svg>
      <Wrench className="h-5 w-5 text-foreground" aria-hidden="true" />
    </span>
  );
}
