import type { Metadata } from "next";
import { createPublicRequestAction } from "@/app/actions/requests";
import { brand, howItWorks } from "@/brand";
import { CapturePicker } from "@/components/capture/capture-picker";
import { AppShell } from "@/components/layout/app-shell";
import { CheckinForm } from "@/components/request/checkin-form";
import { NoteField } from "@/components/request/note-field";
import { SubmitCheckinButton } from "@/components/request/submit-checkin-button";

export const metadata: Metadata = { title: "New check-in" };

export default function CheckinPage() {
  return (
    <AppShell showCheckIn={false}>
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-12 xl:gap-16">
        <div className="min-w-0 max-w-prose">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Your check-in
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground">
            Leave your details, film what you see, and {brand.engine} builds
            your Issues snag list and your property&apos;s Issues &amp; Bills
            Tracker Board.
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
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">Full name</span>
            <input
              name="requesterName"
              required
              autoComplete="name"
              placeholder="e.g. Jordan Lee"
              className="text-field"
            />
          </label>
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
              Business name{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </span>
            <input
              name="businessName"
              autoComplete="organization"
              placeholder="e.g. Lee Property Care"
              className="text-field"
            />
          </label>
          <div className="grid gap-4 @md:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">
                Phone or email
              </span>
              <input
                name="requesterContact"
                required
                autoComplete="tel"
                placeholder="How should the team reach you?"
                className="text-field"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">
                How urgent?
              </span>
              <select name="urgency" className="text-field" defaultValue="normal">
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>
            <label className="block @md:col-span-2">
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
          </div>
          <fieldset>
            <legend className="mb-1.5 text-sm font-semibold">
              Videos — film the issues
            </legend>
            <CapturePicker />
          </fieldset>
          <NoteField />
          <div>
            <SubmitCheckinButton />
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {brand.engine} detects the trade and builds your report and
              tracker.
            </p>
          </div>
        </CheckinForm>
      </div>
    </AppShell>
  );
}
