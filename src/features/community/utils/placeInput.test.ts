import { describe, expect, it } from "vitest";

import { normalizeEnglishPlaceInput } from "./placeInput";

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
});
