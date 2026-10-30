"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { openPropertyBoardAction } from "@/app/actions/requests";
import { Button } from "@/components/ui/button";
import { useSafeTransition } from "@/components/ui/use-form-action-pending";
import { ErrorText } from "@/components/layout/page-header";
import { isValidEmail } from "@/lib/board-token";
import { runViewBoardClick } from "@/lib/view-board";

export function ViewBoardButton({
  jobId,
  knownEmail,
}: {
  jobId: string;
  knownEmail?: string | null;
}) {
  const router = useRouter();
  const [pending, startTransition, beginSubmit] = useSafeTransition();
  const lock = React.useRef(false);
  const known =
    knownEmail && isValidEmail(knownEmail) ? knownEmail.trim() : null;
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [navError, setNavError] = React.useState<string | null>(null);
  const [fallbackHref, setFallbackHref] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!pending) lock.current = false;
  }, [pending]);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (lock.current || pending) return;
    const address = known ?? email;
    if (!isValidEmail(address)) {
      setError("Enter a valid email address");
      return;
    }
    lock.current = true;
    beginSubmit();
    setError(null);
    setNavError(null);
    setFallbackHref(null);
    startTransition(async () => {
      try {
        const outcome = await runViewBoardClick({
          open: () => openPropertyBoardAction(jobId, address),
          navigate: (path) => router.push(path),
        });
        if (!outcome.navigated) {
          setNavError(outcome.navError);
          setFallbackHref(outcome.href);
        }
      } catch (caught) {
        setError(
          caught instanceof Error ? caught.message : "Could not open the board",
        );
      } finally {
        lock.current = false;
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full min-w-0 flex-col gap-2">
      {known ? (
        <p className="text-sm leading-relaxed text-muted-foreground break-words">
          Emails <strong className="text-foreground">{known}</strong> and opens
          this property&apos;s board. No password.
        </p>
      ) : (
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          aria-label="Email for your properties link"
          disabled={pending}
          className="text-field"
        />
      )}
      <Button
        type="submit"
        variant="accent"
        disabled={pending}
        aria-busy={pending}
        className="w-full"
      >
        {pending ? "Sending…" : "View Board"}
      </Button>
      {error ? <ErrorText>{error}</ErrorText> : null}
      {navError ? (
        <p className="text-sm text-muted-foreground">
          {navError}{" "}
          {fallbackHref ? (
            <Link href={fallbackHref} className="font-semibold text-link hover:underline">
              Open the board
            </Link>
          ) : null}
        </p>
      ) : null}
    </form>
  );
}
