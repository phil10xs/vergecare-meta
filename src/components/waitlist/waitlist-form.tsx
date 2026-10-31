"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

const CONFIRMATION =
  "You're on the list. We'll email you when beta is live.";

export function WaitlistForm() {
  const [pending, setPending] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    setConfirmation(null);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          businessName: form.get("businessName"),
          address: form.get("address"),
          contact: form.get("contact"),
        }),
      });
      const body = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;
      if (response.ok && body?.ok) {
        setConfirmation(CONFIRMATION);
        return;
      }
      setError(
        body?.error ??
          "We couldn't save your place on the list yet. Please try again later.",
      );
    } catch {
      setError(
        "We couldn't save your place on the list yet. Please try again later.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-xl space-y-4" noValidate>
      <label className="block" htmlFor="waitlist-name">
        <span className="mb-1.5 block text-sm font-semibold">Name</span>
        <input
          id="waitlist-name"
          name="name"
          required
          autoComplete="name"
          className="text-field"
        />
      </label>
      <label className="block" htmlFor="waitlist-business">
        <span className="mb-1.5 block text-sm font-semibold">
          Business name
        </span>
        <input
          id="waitlist-business"
          name="businessName"
          required
          autoComplete="organization"
          className="text-field"
        />
      </label>
      <label className="block" htmlFor="waitlist-address">
        <span className="mb-1.5 block text-sm font-semibold">Address</span>
        <input
          id="waitlist-address"
          name="address"
          required
          autoComplete="street-address"
          className="text-field"
        />
      </label>
      <label className="block" htmlFor="waitlist-contact">
        <span className="mb-1.5 block text-sm font-semibold">
          Email or phone
        </span>
        <input
          id="waitlist-contact"
          name="contact"
          required
          inputMode="email"
          autoComplete="email"
          className="text-field"
        />
      </label>
      <Button
        type="submit"
        variant="accent"
        size="lg"
        className="h-14 w-full px-8 text-lg sm:w-auto"
        disabled={pending}
      >
        {pending ? "Joining…" : "Join the waitlist"}
      </Button>
      {confirmation ? (
        <p role="status" className="text-base font-medium text-foreground">
          {confirmation}
        </p>
      ) : null}
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </form>
  );
}
