// Golden-clip eval: measures Spark trade/severity accuracy on human-labeled clips.
//
// Clips stay OUT of git — download the eval folder, then run:
//   EVAL_CLIPS=~/Downloads/eval node eval/run.mjs   (or: pnpm eval)
// Folder: https://drive.google.com/drive/folders/1DZAycWSGwuoPyWkRYvgu-__Tfe4PPQ2a?usp=sharing
//
// Labels come from filenames: eval<sep><NN><sep><trade><sep><severity>.mp4
// (both - and _ separators accepted). Needs META_MODEL_API_KEY in .env.local.
//
// Scores RAW Spark output; the product's deterministic fallback covers misses
// at runtime. Informational only (always exits 0): model sampling means exact
// scores vary run to run — re-run to see stability, not to chase 100%.
import { readdirSync, readFileSync } from "node:fs";
import { join, basename } from "node:path";
import { analyzeVideo, assessIssue } from "../src/server/analyze-video.ts";

const DRIVE =
  "https://drive.google.com/drive/folders/1DZAycWSGwuoPyWkRYvgu-__Tfe4PPQ2a?usp=sharing";
const EVAL_CLIPS = process.env.EVAL_CLIPS?.trim() || null;
if (!EVAL_CLIPS) {
  console.error(
    `EVAL_CLIPS is required: download the golden clips (${DRIVE}), then\n` +
      `  EVAL_CLIPS=~/Downloads/eval node eval/run.mjs`,
  );
  process.exit(2);
}
const ROOT = new URL("..", import.meta.url).pathname;
const key =
  readFileSync(join(ROOT, ".env.local"), "utf8")
    .split("\n")
    .map((row) => row.trim())
    .find((row) => row.startsWith("META_MODEL_API_KEY=") && !row.startsWith("#"))
    ?.slice("META_MODEL_API_KEY=".length)
    .trim() ?? "";
if (!key) {
  console.error("META_MODEL_API_KEY is missing in .env.local");
  process.exit(2);
}
process.env.META_MODEL_API_KEY = key;

// Mirror of TRADE_CHOICES in src/server/analyze-video.ts (labels must be choices).
// Aliases map everyday trade names to their nearest choice (human decision,
// applied before scoring and printed per clip so the mapping stays visible).
const TRADE_ALIASES = {
  // Clip 06 shows a window blind/shade mechanism (joinery), not glass.
  "window fitter": "joiner",
};
const CHOICES = [
  "plumber", "electrician", "carpenter", "heating engineer", "gas engineer",
  "painter", "plasterer", "roofer", "tiler", "joiner", "bricklayer",
  "welder", "scaffolder", "gardener", "cleaner", "general",
];

function parseLabel(file) {
  const parts = basename(file, ".mp4").split(/[-_]/).filter(Boolean);
  if (parts[0] !== "eval" || parts.length < 4) return { skip: "unparseable name" };
  const severity = parts[parts.length - 1].toLowerCase();
  if (!["low", "medium", "high"].includes(severity)) {
    return { skip: "no severity in name (want low|medium|high)" };
  }
  const rawTrade = parts.slice(2, -1).join(" ").toLowerCase();
  const trade = TRADE_ALIASES[rawTrade] ?? rawTrade;
  const aliased = trade !== rawTrade ? ` (alias for "${rawTrade}")` : "";
  if (!CHOICES.includes(trade)) {
    return { skip: `"${rawTrade}" is outside the 16 trade choices` };
  }
  return { trade, severity, aliased };
}

const clips = readdirSync(EVAL_CLIPS).filter((f) => f.endsWith(".mp4")).sort();
if (clips.length === 0) {
  console.error(`no .mp4 clips in ${EVAL_CLIPS} — download them from ${DRIVE}`);
  process.exit(2);
}

let tradeHits = 0, sevHits = 0, scored = 0, skipped = 0;
for (const file of clips) {
  const label = parseLabel(file);
  if (label.skip) {
    console.log(`SKIP  ${file} — ${label.skip}`);
    skipped++;
    continue;
  }
  const bytes = readFileSync(join(EVAL_CLIPS, file));
  let analysis = await analyzeVideo(bytes, file);
  if (!analysis) {
    console.log("      (empty analysis — one retry)");
    analysis = await analyzeVideo(bytes, file);
  }
  let assessment = analysis
    ? await assessIssue(analysis.transcript, analysis.description)
    : null;
  if (analysis && !assessment) {
    console.log("      (empty assessment — one retry)");
    assessment = await assessIssue(analysis.transcript, analysis.description);
  }
  const gotTrade = (analysis?.trade ?? "(none)").toLowerCase();
  const gotSev = assessment?.severity ?? "(none)";
  const tradeOk = gotTrade === label.trade;
  const sevOk = gotSev === label.severity;
  scored++;
  if (tradeOk) tradeHits++;
  if (sevOk) sevHits++;
  console.log(
    `${tradeOk && sevOk ? "PASS" : "PART"}  ${file}\n` +
      `      trade: want ${label.trade}${label.aliased ?? ""} / got ${gotTrade} ${tradeOk ? "✓" : "✗"}\n` +
      `      severity: want ${label.severity} / got ${gotSev} ${sevOk ? "✓" : "✗"}\n` +
      `      heard: ${JSON.stringify(String(analysis?.transcript ?? "").slice(0, 110))}`,
  );
}
console.log(
  `\neval: trade ${tradeHits}/${scored} (${Math.round((100 * tradeHits) / Math.max(scored, 1))}%), ` +
    `severity ${sevHits}/${scored} (${Math.round((100 * sevHits) / Math.max(scored, 1))}%), ` +
    `skipped ${skipped}`,
);
