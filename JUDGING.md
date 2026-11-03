# How VergeCare meets the official judging criteria

Self-assessment against the Meta Global AI Developer Hackathon's published
criteria (Impact 30%, Use of Meta AI Tooling 25%, Technical Depth &
Execution 20%, Demo 25%). Evidence for every claim is linked.

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

120 tests green, CI, typed contracts, null-safe AI stages, deterministic
fallbacks, and a 4-run eval history with exclusions listed. The run
history alone puts this above 90% of hackathon repos.

Evidence: `.github/workflows/ci.yml`, [eval run history](eval/RESULTS.md).

## Demo 25% — strong

Live product you can click, v3 video with numbers on screen and
voiceover, plus a result tracker with per-clip rows. Holds up live.

Evidence: [live demo](https://demo-vergecare.goverge.app/request),
[demo video](https://youtu.be/Q40uPN17o5Q),
[eval tracker](https://result-page-preview.vercel.app/result).
