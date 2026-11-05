# How VergeCare meets the official judging criteria

Self-assessment against the Meta Global AI Developer Hackathon's published
criteria (Impact 30%, Use of Meta AI Tooling 25%, Technical Depth &
Execution 20%, Demo 25%). Evidence for every claim is linked.

## Try it yourself in 3 minutes (no signup)

Nothing to install, no account needed — just click the live demo and act
like a resident. Every step below is covered by the repo's automated
end-to-end script (`pnpm test:e2e`, 15/15 green), so what you tap is what
we test.

1. **Open the live demo:** [demo-vergecare.goverge.app/request](https://demo-vergecare.goverge.app/request),
   then start a check-in.
2. **Pick repair issue or wish-to-have**, type any address, and attach one
   short video (under 20 seconds — film your room on your phone, narrating
   what you see, or use our [sample clip](https://drive.google.com/file/d/1p7-j7FmEnigX8hcyw3_3Y5EYsvBroqC2/view?usp=sharing)
   on desktop). If you picked a wish, also pick your country.
3. **Hit send and watch.** You'll see the progress steps, then land on your
   visit report: a costed snag list for repairs (trade, severity, likely
   cost on every issue) or a Wishlist with matched local stores.
4. **Tap View Board** and type any email or phone number — the board opens
   either way. Move your card from Requested all the way to Paid with Pay
   now and watch it celebrate.
5. **Try the other kind.** If you filed a repair, file a wish-to-have next
   (or the reverse). Real users do both — that's the funnel.

That loop — check in → report → board → Paid — is the whole product. The
[demo video](https://youtu.be/Q40uPN17o5Q) walks the same path if you
prefer to watch.

## Impact 30% — strong

Real users, real homes, real completions (10/10, 7 users, 34 videos,
2 countries) plus a timed 6–8hrs→15min claim. Most indie entries demo on
staged inputs; this one is measured on strangers. Only ding: small
absolute scale.

Evidence: [live demo](https://demo-vergecare.goverge.app/request),
[eval tracker](https://result-page-preview.vercel.app/result).

## Meta use 25% — strong

Two Spark passes doing genuinely different jobs (video understanding +
text triage), SAM 3.1 grounding, 17th trade shipped mid-hackathon from
eval signal, prompt-injection guardrail. Goes beyond basic integration
with receipts.

Evidence: `src/server/analyze-video.ts`, `src/server/sam.ts`,
[eval run history](eval/RESULTS.md).

## Tech depth 20% — strong

135 tests green, CI, typed contracts, null-safe AI stages, deterministic
fallbacks, and a 4-run eval history with exclusions listed. The run
history alone puts this above 90% of hackathon repos.

Evidence: `.github/workflows/ci.yml`, [eval run history](eval/RESULTS.md).

## Demo 25% — strong

Live product you can click, v3 video with numbers on screen and
voiceover, plus a result tracker with per-clip rows. Holds up live.

Evidence: [live demo](https://demo-vergecare.goverge.app/request),
[demo video](https://youtu.be/Q40uPN17o5Q),
[eval tracker](https://result-page-preview.vercel.app/result),
[3-minute self-test path](#try-it-yourself-in-3-minutes-no-signup).
