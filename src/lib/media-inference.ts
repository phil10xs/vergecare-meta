import { labelTrade, TRADES } from "./chat-parse";

const TRADE_KEYWORDS: { trade: string; words: string[] }[] = [
  {
    trade: "Plumber",
    words: [
      "leak",
      "leaking",
      "drip",
      "tap",
      "faucet",
      "pipe",
      "drain",
      "drainage",
      "blocked",
      "blockage",
      "toilet",
      "sink",
      "bath",
      "shower",
      "cistern",
      "overflow",
      "stopcock",
      "water pressure",
      "flood",
    ],
  },
  {
    trade: "Electrician",
    words: [
      "socket",
      "wiring",
      "fuse",
      "fusebox",
      "consumer unit",
      "bulb",
      "downlight",
      "dimmer",
      "circuit",
      "meter",
      "no power",
      "power cut",
      "switch",
      "light",
      "flicker",
      "sparking",
      "electric",
      "trip switch",
    ],
  },
  {
    trade: "Carpenter",
    words: [
      "wardrobe",
      "door",
      "hinge",
      "shelf",
      "shelves",
      "cupboard",
      "drawer",
      "floorboard",
      "skirting",
      "banister",
      "architrave",
      "decking",
      "fence",
      "gate",
      "timber",
      "wood",
    ],
  },
  {
    trade: "Heating engineer",
    words: [
      "boiler",
      "boiler pressure",
      "pilot light",
      "heating",
      "radiator",
      "cold radiator",
      "hot water",
      "no hot water",
      "thermostat",
      "cylinder",
      "pump",
    ],
  },
  {
    trade: "Gas engineer",
    words: [
      "gas",
      "gas leak",
      "gas safety",
      "gas certificate",
      "carbon monoxide",
      "cp12",
    ],
  },
  {
    trade: "Painter",
    words: [
      "damp",
      "mould",
      "mold",
      "paint",
      "wallpaper",
      "gloss",
      "emulsion",
      "peeling",
      "stain",
      "crack",
    ],
  },
  {
    trade: "Plasterer",
    words: [
      "plaster",
      "skim",
      "coving",
      "dry lining",
      "partition",
      "render",
    ],
  },
  {
    trade: "Roofer",
    words: [
      "roof",
      "flat roof",
      "gutter",
      "downpipe",
      "slate",
      "tiles",
      "flashing",
      "fascia",
      "soffit",
      "chimney",
      "loft",
    ],
  },
  {
    trade: "Tiler",
    words: [
      "tile",
      "grout",
      "shower tray",
      "splashback",
      "silicone",
      "bathroom",
    ],
  },
  {
    trade: "Joiner",
    words: [
      "window",
      "glazing",
      "double glazing",
      "upvc",
      "sash",
      "window frame",
      "patio door",
      "lock",
      "frame",
    ],
  },
  {
    trade: "Window fitter",
    words: [
      "window",
      "glazing",
      "double glazing",
      "upvc",
      "sash",
      "window frame",
    ],
  },
  {
    trade: "Bricklayer",
    words: ["brick", "mortar", "wall", "pointing", "repointing", "lintel"],
  },
  {
    trade: "Welder",
    words: ["weld", "metal gate", "railing"],
  },
  {
    trade: "Scaffolder",
    words: ["scaffold"],
  },
  {
    trade: "Gardener",
    words: [
      "garden",
      "weed",
      "weeds",
      "weedy",
      "moss",
      "mossy",
      "lawn",
      "grass",
      "hedge",
      "overgrown",
      "flowerbed",
      "pruning",
      "mow",
    ],
  },
  {
    trade: "Cleaner",
    words: [
      "cleaner",
      "clean",
      "deep clean",
      "scrub",
      "pressure wash",
      "jet wash",
    ],
  },
];

const WINDOW_WORDS = [
  "window frame",
  "double glazing",
  "glazing",
  "window",
  "upvc",
  "sash",
];

/** Related trade when the primary is already chosen. Joiner falls through to Window fitter, not Carpenter. */
const NEXT_TRADE: Record<string, string> = {
  Joiner: "Window fitter",
};

function wordPattern(word: string): RegExp {
  return new RegExp(`\\b${word}s?\\b`);
}

function hasWindowLanguage(lower: string): boolean {
  return WINDOW_WORDS.some((word) => wordPattern(word).test(lower));
}

/**
 * On a hit-count tie, window and glazing language keeps Joiner first and
 * Window fitter next. Carpenter only wins that tie when the text has no
 * window language, which is the previous list order.
 */
function tiePreference(trade: string, windowJob: boolean): number {
  if (!windowJob) return 0;
  if (trade === "Joiner") return 0;
  if (trade === "Window fitter") return 1;
  if (trade === "Carpenter") return 3;
  return 2;
}

export function nextTrade(trade: string | null): string | null {
  if (!trade) return null;
  return NEXT_TRADE[trade] ?? null;
}

function withNext(primary: string, ranked: string[]): string[] {
  const next = nextTrade(primary);
  const rest = ranked.filter((trade) => trade !== primary && trade !== next);
  return next ? [primary, next, ...rest] : [primary, ...rest];
}

export function rankTrades(text: string): string[] {
  const lower = text.toLowerCase();
  if (!lower.trim()) return [];
  const named = [...TRADES].sort((a, b) => b.length - a.length);
  for (const trade of named) {
    if (wordPattern(trade).test(lower)) {
      return withNext(labelTrade(trade), []);
    }
  }
  const windowJob = hasWindowLanguage(lower);
  const scored = TRADE_KEYWORDS.map((entry, index) => ({
    trade: entry.trade,
    index,
    hits: entry.words.filter((word) =>
      wordPattern(word.toLowerCase()).test(lower),
    ).length,
  }))
    .filter((entry) => entry.hits > 0)
    .sort((a, b) => {
      if (b.hits !== a.hits) return b.hits - a.hits;
      const preference =
        tiePreference(a.trade, windowJob) - tiePreference(b.trade, windowJob);
      if (preference !== 0) return preference;
      return a.index - b.index;
    });
  const primary = scored[0]?.trade;
  if (!primary) return [];
  return withNext(
    primary,
    scored.map((entry) => entry.trade),
  );
}

export function inferTrade(text: string): string | null {
  return rankTrades(text)[0] ?? null;
}

export function buildTitle(
  trade: string | null,
  address: string,
  text: string,
): string {
  const short = address.split(",")[0]?.trim() || "Site";
  const label = trade ?? "General";
  const lead = text
    .split(/[.\n]/)
    .map((sentence) => sentence.trim())
    .find(Boolean)
    ?.slice(0, 60);
  const title = lead
    ? `${label} request — ${short}: ${lead}`
    : `${label} request — ${short}`;
  return title.slice(0, 120);
}
