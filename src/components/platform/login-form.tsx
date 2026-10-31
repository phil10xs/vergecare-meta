"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/platform/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      if (response.ok) {
        window.location.assign("/platform");
        return;
      }
      setError("Email or password is incorrect.");
    } catch {
      setError("Email or password is incorrect.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 max-w-md space-y-4">
      <label className="block" htmlFor="platform-email">
        <span className="mb-1.5 block text-sm font-semibold">Email</span>
        <input
          id="platform-email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="text-field"
        />
      </label>
      <label className="block" htmlFor="platform-password">
        <span className="mb-1.5 block text-sm font-semibold">Password</span>
        <input
          id="platform-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
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
        {pending ? "Signing in…" : "Sign in"}
      </Button>
      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </form>
  );
}
