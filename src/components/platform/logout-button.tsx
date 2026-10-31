"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    try {
      await fetch("/api/platform/logout", { method: "POST" });
    } finally {
      window.location.assign("/platform");
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={logout}
      disabled={pending}
    >
      {pending ? "Logging out…" : "Log out"}
    </Button>
  );
}
