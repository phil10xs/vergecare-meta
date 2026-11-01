"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { tradesmanSearchUrl } from "@/lib/account-role";

export function FindTradesman() {
  const [budget, setBudget] = useState("");
  const [hint, setHint] = useState<string | null>(null);

  function openSearch() {
    const url = tradesmanSearchUrl(budget);
    if (!url) {
      setHint("Enter a budget above zero.");
      return;
    }
    setHint(null);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div>
      <h2 className="font-display text-lg font-semibold tracking-tight">
        Find tradesman
      </h2>
      <label className="mt-3 block" htmlFor="tradesman-budget">
        <span className="mb-1.5 block text-sm font-semibold">Budget</span>
        <input
          id="tradesman-budget"
          inputMode="decimal"
          autoComplete="off"
          value={budget}
          onChange={(event) => setBudget(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.preventDefault();
          }}
          placeholder="e.g. 150"
          className="text-field max-w-xs"
        />
      </label>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button type="button" variant="accent" onClick={openSearch}>
          Find tradesman
        </Button>
        <p className="text-sm text-muted-foreground">Coming soon</p>
      </div>
      {hint ? (
        <p role="status" className="mt-2 text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
