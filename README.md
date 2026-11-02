# VergeCare (Beta)

Property check-ins for the Meta AI Global Hackathon (indie track).
Check in on your property, get an organized Issues snag list & Issues
& Bills Tracker Board in under a minute — every visit remembered
forever.

## Pitch

VergeCare is the AI property caretaker: film and narrate a repair
issue, get a snag list, matched handymen, and tracked bills — every
visit remembered. Repairs and bills die in chat threads; VergeCare
gives each property a memory of her own.

## Market

TAM: ~2.3B households worldwide (derived from Euromonitor 2024:
single-person homes were 20.6% of the global total).

SOM: UK + US + Nigeria.

- UK: 2.88M landlords declared rental income in 2024-25 (HMRC); ~5.5M
  privately rented homes.
- US: ~48M rental units; ~10-11M individual landlords (Census RHFS, IRS/HUD).
- Nigeria: ~15M-unit official housing deficit, ~28M including substandard
  homes (Federal Ministry of Housing, 2026); Lagos alone holds 1.38M rental
  households and a 3.4M-unit deficit (State of Lagos Housing Market Vol. 3).

Wedge: UK landlords and Manchester tenants first; Lagos rental density
(~77% renters spending up to 70% of income on rent) makes Nigeria the
scale play.

## Eval results

History, oldest first (Muse Spark 1.2 + SAM 3.1 via the Meta Model API):

- 2026-11-01 tuning: 2 spot-check clips (01 gardener, 06 window), unscored.
  Window work routed to Carpenter → Window fitter joined the trade choices
  the same morning (commit `f37cdde`).
- 2026-11-02 pilot: 6 held-out field clips, filename labels as ground truth.
  - Trade routing: **100% (6/6)** — Gardener, Cleaner x2, Carpenter,
    Painter, Window fitter
  - Severity: 33% (2/6) vs filename truth — all misses high→low/medium;
    the rubric defines high as active water/gas/power/security, so the
    `high` labels are under review, not the model alone
  - SAM 3.1 grounding: 50% (3/6) returned boxes, all containing the
    damage (1 tight)
  - End-to-end pipeline: 12-22s per clip

Runs are tracked in-app at `/results` (data in `src/lib/eval-results.ts`).

## Demo in 5 minutes

```bash
pnpm db:seed   # reset to 3 portfolio check-ins + 3-session home visit + demo board
pnpm dev       # http://localhost:3002
```

1. Landlord: open `/request`, start a check-in, film one ≤20 s video per
   issue narrating what you see, send.
2. Visit report at `/request/[id]` — sessions, Issues snag list, Meta Spark analysis.
3. Owner board at `/track` — move sessions across the kanban, mark Due/Sent, pay completed issues.
4. Requester: email the Issues & Bills Tracker Board link from the report, open `/b/[token]`.

## Check-in flow

Check in → Visit report → Track. Landlords, owners and tenants check in a
property from `/request`: name, contact, address, then one video per issue
(up to 20 seconds each) narrating what they see. Each video becomes a
session — trade detected, reference issued — grouped under its visit on the
visit report (`/request/[id]`), with an Issues snag list and a Meta Spark analysis
block. The owner tracks everything on `/track` (Issues snag list + kanban board),
moving sessions across columns and marking payment Due/Sent. Uploads stay on
this machine under `uploads/`.

Requesters get their property's board without an account: from the visit
report they request a magic link by email and open a read-only kanban at
`/b/[token]`. The link does not expire.

Every screen is mobile-first and adaptive across phone, tablet, and laptop:
single-column forms, 44px touch targets, camera capture on phones degrading
to pickers on desktop, and a horizontally scrolling board on narrow screens.

## Meta AI

Each uploaded video is sent to Meta (Muse Spark 1.2 video understanding),
which returns a speech transcript and a short visual description. The title
and trade are inferred from the transcript plus the requester's note; the
tradesman confirms or corrects both when accepting. Photos skip analysis.

A second pass grounds the damage visually: SAM 3.1 takes a still frame plus
the object phrase from the analysis (e.g. "drawer", "mould patch") and
returns up to three boxes around the matching damage, shown on the visit
report. Regions are optional enrichment — a check-in still completes if
grounding returns nothing.

Setup: add your Meta Model API key to `.env.local`:

```bash
META_MODEL_API_KEY=LLM_...
```

Without a key (or if analysis fails), requests still work end to end —
transcripts show as unavailable and the team uses the note plus the video's
own voice. Duration (20 s) and the one-video rule are enforced in the browser
before submit, with a server-side one-video backstop.

## Stack

- Next.js 15 + React 19 + TypeScript (web only, port **3002**)
- Tailwind CSS v4
- PostgreSQL 16 via Drizzle ORM (database `vergefield` on local Postgres;
  docker-compose alternative runs isolated on port **5433**)

Port 3002 avoids clashing with other local apps on 3000/3001.

## Setup

```bash
cd /Users/igbobaphilip/Projects/vergesnag

# 1. Postgres: local Homebrew instance (default, database `vergefield`),
#    or `docker compose up -d` for the isolated container on port 5433
#    (then use the docker DATABASE_URL from .env.example).
createdb vergefield   # once; skip if the database already exists

# 2. Install
pnpm install

# 3. Push schema + seed demo data
pnpm db:push
pnpm db:seed

# 4. Run
pnpm dev
```

Open [http://localhost:3002](http://localhost:3002) in a browser.

## Checks

- `pnpm typecheck` — TypeScript
- `pnpm lint` — ESLint
- `GET /api/health` — app + database status (`{"ok":true,"db":"up"}`)

## Layout

Standalone project with its own VergeCare brand tokens, button
variants, status badges, page header, and list hero.

```
src/app            Routes: / (→ /request), /request (check-in landing),
                   /request/checkin (film + submit), /request/[id] (visit report),
                   /track (Issues snag list + Issues & Bills Tracker Board), /b/[token] (magic-link board),
                   /results (eval tracker), /api/health, /api/media
src/components     VergeCare UI: button, status badges, page header, list hero
src/lib            Trade inference, report sections, session grouping, eval history
src/server         Reporting, board links, and media storage logic
src/db             Drizzle client + schema (job, site_report, site_media, …)
src/styles         Brand tokens (colours)
scripts/seed.ts    Demo seed data
```

## Secrets rule

What can be pushed: all source, docs, and config. What stays local: API keys
and credentials in `.env.local` (gitignored), `*.pem` / `*.key` files, and
anything under `secrets/`. The demo runs fully without a key (Meta analysis
shows as unavailable); with `META_MODEL_API_KEY` set locally, video analysis
goes live. Run `pnpm check:secrets` before every push — it fails if a
Meta-style key or private key appears in tracked files.
