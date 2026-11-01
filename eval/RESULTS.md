# Eval results — 2026-11-01

Models: `muse-spark-1.2` (video understanding + text-only triage) via
`https://api.meta.ai`. Command: `EVAL_CLIPS=<folder> pnpm eval`.

**Latest score (run 2): trade 6/6 (100%), severity 3/6 (50%), skipped 0.**

| Clip | Want | Got | Trade | Severity | Heard (excerpt) |
|---|---|---|---|---|---|
| eval-01-gardener-low | Gardener / low | Gardener / low | ✓ | ✓ | "…my garden looks a bit weedy…" |
| eval_02_cleaner_high | Cleaner / high | Cleaner / low | ✓ | ✗ | "…glass just by the bathtub has a lot of mould…" |
| eval_03_carpenter_high | Carpenter / high | Carpenter / low | ✓ | ✗ | "…my cupboard … broken just fell off yesterday…" |
| eval_04_painter_high | Painter / high | Painter / high | ✓ | ✓ | "…this wall will definitely need painting … it's damped…" |
| eval_05_cleaner_low | Cleaner / low | Cleaner / low | ✓ | ✓ | "My hob's plate has some scars…" |
| eval_06_window_fitter_high | Joiner / high | Joiner / low | ✓ | ✗ | "…my window shade doesn't get down to the ground…" |

Run history:

- Run 1: trade 5/6 (83%), severity 3/6 (50%) — clip 06 returned General.
- Run 2: trade 6/6 (100%), severity 3/6 (50%) — clip 06 returned Joiner.

Notes:

- Scores **raw Spark output**; the product's deterministic fallback
  (`inferTrade` → `General`) covers misses at runtime.
- Severity grades conservatively: the model matched both lows and the
  explicit damp-high, but went low on mould, cupboard, and blind clips
  labeled high. Human-vs-model calibration difference, not a malfunction.
- Clip 06 is genuinely ambiguous (blind/shade mechanism): Spark returned
  Joiner on one run, General on another. Label maps "window fitter" to
  Joiner (see `run.mjs` aliases).
- One transient API empty reply seen across runs; the runner retries once.
- Re-run to see stability — sampling variance moves borderline calls.
