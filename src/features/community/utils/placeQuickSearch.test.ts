import { describe, expect, it } from "vitest";

import { getPlaceSuggestions } from "./placeQuickSearch";

describe("getPlaceSuggestions", () => {
  it("returns an empty list for blank query", () => {
    expect(getPlaceSuggestions("   ")).toEqual([]);
  });

  it("matches Sydney region places", () => {
    const suggestions = getPlaceSuggestions("syd");
    expect(suggestions).toContain("Sydney CBD, NSW");
  });

  it("matches Melbourne region places", () => {
    const suggestions = getPlaceSuggestions("melb");
    expect(suggestions).toContain("Melbourne CBD, VIC");
  });

  it("matches Western Australia places", () => {
    const suggestions = getPlaceSuggestions("perth");
    expect(suggestions).toContain("Perth CBD, WA");
  });
});
