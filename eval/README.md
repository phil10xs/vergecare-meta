# Golden-clip eval

The smallest honest measure of the Meta path: human-labeled property clips,
run through the real `analyzeVideo` + `assessIssue` functions, scored on
trade and severity accuracy.

**Latest scoreboard: [RESULTS.md](RESULTS.md)** — trade 6/6 (100%),
severity 3/6 (50%) on 2026-11-01.

## Clips (6, human-labeled by filename)

| File | Trade | Severity |
|---|---|---|
| `eval-01-gardener-low.mp4` | Gardener | low |
| `eval_02_cleaner_high.mp4` | Cleaner | high |
| `eval_03_carpenter_high.mp4` | Carpenter | high |
| `eval_04_painter_high.mp4` | Painter | high |
| `eval_05_cleaner_low.mp4` | Cleaner | low |
| `eval_06_window_fitter_high.mp4` | Joiner (alias for "window fitter": blind/shade mechanism) | high |

Folder (public Google Drive):
https://drive.google.com/drive/folders/1DZAycWSGwuoPyWkRYvgu-__Tfe4PPQ2a?usp=sharing

Clips stay out of git — download the folder, then run:

```bash
EVAL_CLIPS=~/Downloads/eval node eval/run.mjs   # or: pnpm eval
```

Needs `META_MODEL_API_KEY` in `.env.local`. No server or database required.

## Reading the score

- Scores **raw Spark output**. The product's deterministic fallback
  (`inferTrade` → `General`) covers misses at runtime, so a miss here never
  breaks a check-in.
- Model sampling means exact scores vary run to run — re-run to see
  stability, not to chase 100%.
- `eval_06` is skipped until a human maps it to one of the 16 trade choices
  plus a severity.
