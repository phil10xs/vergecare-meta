import { describe, expect, it } from "vitest";
import { buildTitle, inferTrade, nextTrade, rankTrades } from "./media-inference";

describe("inferTrade", () => {
  it.each([
    ["kitchen tap leaking under the sink", "Plumber"],
    ["fusebox keeps tripping", "Electrician"],
    ["broken wardrobe door hinge", "Carpenter"],
    ["boiler kettling, no hot water", "Heating engineer"],
    ["damp patch spreading on the wall", "Painter"],
    ["slipped slates after the storm", "Roofer"],
    ["grout crumbling around the tiles", "Tiler"],
    ["strong smell of gas in the kitchen", "Gas engineer"],
    ["ceiling needs a fresh skim", "Plasterer"],
    ["blocked kitchen drain", "Plumber"],
    [
      "narrow side garden between brick walls, mossy slabs with weeds, overgrown edges",
      "Gardener",
    ],
    ["hot plate needs a proper clean, send a cleaner", "Cleaner"],
  ])("infers %s → %s", (text, trade) => {
    expect(inferTrade(text)).toBe(trade);
  });

  it("matches whole words only", () => {
    expect(inferTrade("blocked drain")).toBe("Plumber");
    expect(inferTrade("hello there")).toBeNull();
  });

  it("prefers an explicitly named trade", () => {
    expect(inferTrade("need a roofer, and the tap drips")).toBe("Roofer");
  });

  it("returns null when nothing matches", () => {
    expect(inferTrade("hello there")).toBeNull();
    expect(inferTrade("   ")).toBeNull();
  });

  it.each([
    "the sash window will not close",
    "double glazing has failed",
    "uPVC window frame is cracked",
    "glazing cracked in the bedroom",
  ])("keeps window language as Joiner: %s", (text) => {
    expect(inferTrade(text)).toBe("Joiner");
    expect(rankTrades(text).slice(0, 2)).toEqual(["Joiner", "Window fitter"]);
  });

  it("uses Window fitter as the next trade when a window job also matches carpentry", () => {
    expect(rankTrades("timber sash window")).toEqual([
      "Joiner",
      "Window fitter",
      "Carpenter",
    ]);
    expect(nextTrade("Joiner")).toBe("Window fitter");
    expect(nextTrade("Carpenter")).toBeNull();
  });

  it("does not turn ordinary carpentry into window fitting", () => {
    expect(inferTrade("broken wardrobe door hinge")).toBe("Carpenter");
    expect(rankTrades("wooden cupboard drawer")).toEqual(["Carpenter"]);
  });

  it("keeps an explicitly named window fitter", () => {
    expect(inferTrade("book a window fitter for Tuesday")).toBe("Window fitter");
  });
});

describe("buildTitle", () => {
  it("combines trade, short address, and lead phrase", () => {
    expect(
      buildTitle(
        "Plumber",
        "12 Rosebank Road, Manchester",
        "Kitchen tap leaking. Worse at night.",
      ),
    ).toBe("Plumber request — 12 Rosebank Road: Kitchen tap leaking");
  });

  it("falls back to General and Site", () => {
    expect(buildTitle(null, "", "")).toBe("General request — Site");
  });
});
