import type { Metadata } from "next";
import { createPublicRequestAction } from "@/app/actions/requests";
import { howItWorks } from "@/brand";
import { PROPERTY_TYPE_OTHER_MAX } from "@/lib/property-types";
import { CapturePicker } from "@/components/capture/capture-picker";
import { CountryPropertyFields } from "@/components/request/country-property-fields";
import { AppShell } from "@/components/layout/app-shell";
import { CheckinForm } from "@/components/request/checkin-form";
import { SubmitCheckinButton } from "@/components/request/submit-checkin-button";
import {
  ensureCheckinTypeColumn,
  ensureCountryColumn,
  ensurePropertyTypeColumns,
} from "@/server/job-columns";

export const metadata: Metadata = { title: "New check-in" };
export const maxDuration = 300;

const DEMO_VIDEO_ID = "aHLs56BK9LY";
const DEMO_VIDEO_TITLE =
  "VergeCare Demo (Beta) — Meta Global AI Hackathon 2026";

export default async function CheckinPage() {
  try {
    await ensurePropertyTypeColumns();
    await ensureCheckinTypeColumn();
    await ensureCountryColumn();
  } catch (error) {
    console.error(
      "[job] could not add job columns",
      error instanceof Error ? error.name : "Error",
    );
  }
  return (
    <AppShell showCheckIn={false}>
      <section aria-label="Demo video" className="mb-8">
        <h2 className="mb-3 font-display text-lg font-semibold tracking-tight">
          Watch how it works
        </h2>
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="aspect-video w-full">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${DEMO_VIDEO_ID}`}
              title={DEMO_VIDEO_TITLE}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {DEMO_VIDEO_TITLE}. Film a repair issue, get a snag list, matched
          handymen and stores, and tracked bills.
        </p>
      </section>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-12 xl:gap-16">
        <div className="min-w-0 max-w-prose">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Your check-in
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Film &amp; narrate what you want fixed or wish to have in your
            property, and your AI caretaker builds you a bill snag list,
            matched handymen and stores, tracked till done.
          </p>
          <ol className="mt-6 space-y-3">
            {howItWorks.map((step, index) => (
              <li key={step.title} className="flex items-start gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <p className="pt-0.5 text-sm leading-relaxed">
                  <span className="font-semibold">{step.title}. </span>
                  <span className="text-muted-foreground">{step.body}</span>
                </p>
              </li>
            ))}
          </ol>
        </div>

        <CheckinForm action={createPublicRequestAction}>
          <fieldset>
            <legend className="mb-1.5 block text-sm font-semibold">
              What is this check-in for?
            </legend>
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium">
                <input
                  type="radio"
                  name="checkinType"
                  value="repair"
                  defaultChecked
                  className="h-4 w-4 shrink-0 accent-primary"
                />
                Repair issue
              </label>
              <label className="flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium">
                <input
                  type="radio"
                  name="checkinType"
                  value="wishlist"
                  className="h-4 w-4 shrink-0 accent-primary"
                />
                Wish-to-have
              </label>
            </div>
          </fieldset>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">
              Property address
            </span>
            <input
              name="propertyAddress"
              required
              autoComplete="street-address"
              placeholder="e.g. 12 Rosebank Road, Manchester"
              className="text-field"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">
              What trade do you need?
            </span>
            <select
              name="trade"
              className="text-field"
              defaultValue="auto"
              disabled
            >
              <option value="auto">Auto-detect from my videos</option>
            </select>
            <span className="mt-1.5 block text-sm text-muted-foreground">
              Manual trade picker coming soon — auto-detect is on for now.
            </span>
          </label>
          <CountryPropertyFields />
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">
              Other property type (optional)
            </span>
            <input
              name="propertyTypeOther"
              autoComplete="off"
              maxLength={PROPERTY_TYPE_OTHER_MAX}
              placeholder="e.g. Room and parlour"
              className="text-field"
            />
          </label>
          <fieldset>
            <legend className="mb-1.5 block text-sm font-semibold leading-relaxed">
              Do a video clip for each issue. Narrate as you film
            </legend>
            <CapturePicker />
          </fieldset>
          <div>
            <SubmitCheckinButton />
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Your caretaker gives you a repair or a wishlist tracker board
              with costed budget, finds matched handymen and stores.
            </p>
          </div>
        </CheckinForm>
      </div>
    </AppShell>
  );
}
