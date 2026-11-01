"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  roleLabel,
  type AccountRole,
} from "@/lib/account-role";

const CONFIRMATION =
  "You're on the list. We'll email you when beta is live.";

const ROLES: AccountRole[] = ["resident", "landlord", "property_manager"];

export function WaitlistForm({
  defaultRole = "resident",
  lockedRole = null,
  invite = null,
  defaultContact = "",
}: {
  defaultRole?: AccountRole;
  lockedRole?: AccountRole | null;
  invite?: string | null;
  defaultContact?: string;
}) {
  const router = useRouter();
  const [role, setRole] = useState<AccountRole>(lockedRole ?? defaultRole);
  const [pending, setPending] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const activeRole = lockedRole ?? role;
  const showBusinessName = activeRole !== "resident";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const submittedRole = form.get("role");
    const businessName = form.get("businessName");
    setPending(true);
    setError(null);
    setConfirmation(null);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          businessName:
            submittedRole === "resident" || typeof businessName !== "string"
              ? ""
              : businessName,
          address: form.get("address"),
          contact: form.get("contact"),
          role: submittedRole,
          invite,
        }),
      });
      const body = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        next?: string | null;
      } | null;
      if (response.ok && body?.ok) {
        if (body.next?.startsWith("/")) {
          router.push(body.next);
          return;
        }
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
    <form
      id="waitlist-form"
      onSubmit={onSubmit}
      className="mt-8 max-w-xl scroll-mt-24 space-y-4"
      noValidate
    >
      <fieldset>
        <legend className="mb-2 block text-sm font-semibold">
          Are you a resident, landlord or property manager?
        </legend>
        <div className="grid gap-2">
          {ROLES.map((option) => {
            const selected = activeRole === option;
            return (
              <label
                key={option}
                className="flex min-h-11 items-center gap-2 text-sm font-semibold"
              >
                <input
                  type="radio"
                  name={lockedRole ? undefined : "role"}
                  value={option}
                  checked={selected}
                  onChange={() => {
                    if (!lockedRole) setRole(option);
                  }}
                  disabled={Boolean(lockedRole)}
                  className="h-4 w-4"
                />
                {roleLabel(option)}
              </label>
            );
          })}
        </div>
        {lockedRole ? (
          <input type="hidden" name="role" value={lockedRole} />
        ) : null}
      </fieldset>
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
      {showBusinessName ? (
        <label className="block" htmlFor="waitlist-business">
          <span className="mb-1.5 block text-sm font-semibold">
            Business name (optional)
          </span>
          <input
            id="waitlist-business"
            name="businessName"
            autoComplete="organization"
            className="text-field"
          />
        </label>
      ) : null}
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
          defaultValue={defaultContact}
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
