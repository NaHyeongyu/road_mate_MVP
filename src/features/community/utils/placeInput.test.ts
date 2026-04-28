import { describe, expect, it } from "vitest";

import {
  findExactPlaceSuggestionMatch,
  normalizeEnglishPlaceInput,
  normalizePlaceSearchText,
} from "./placeInput";

describe("normalizeEnglishPlaceInput", () => {
  it("removes non-English characters from place input", () => {
    expect(normalizeEnglishPlaceInput("멜버른 Melbourne CBD, VIC 3000")).toBe(
      "Melbourne CBD, VIC 3000"
    );
  });

  it("preserves common place punctuation", () => {
    expect(normalizeEnglishPlaceInput("St Kilda Rd / South Yarra (East)")).toBe(
      "St Kilda Rd / South Yarra (East)"
    );
  });

  it("normalizes postcode tokens out of place search text", () => {
    expect(normalizePlaceSearchText("Brisbane CBD, QLD 4000")).toBe("brisbane cbd qld");
  });

  it("matches exact suggestions while tolerating punctuation and postcode differences", () => {
    expect(
      findExactPlaceSuggestionMatch("Brisbane CBD QLD 4000", [
        "Brisbane CBD, QLD",
        "South Brisbane, QLD",
      ])
    ).toBe("Brisbane CBD, QLD");
  });
});
