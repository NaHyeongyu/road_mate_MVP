import { describe, expect, it } from "vitest";

import { formatPlaceWithPostcode } from "./placePostcode";

describe("formatPlaceWithPostcode", () => {
  it("adds a known postcode after a state label", () => {
    expect(formatPlaceWithPostcode("Brisbane CBD, QLD")).toBe("Brisbane CBD, QLD 4000");
    expect(formatPlaceWithPostcode("St Lucia, QLD")).toBe("St Lucia, QLD 4067");
  });

  it("matches stored labels without commas", () => {
    expect(formatPlaceWithPostcode("Brisbane CBD QLD")).toBe("Brisbane CBD QLD 4000");
  });

  it("does not duplicate an existing postcode", () => {
    expect(formatPlaceWithPostcode("Melbourne CBD, VIC 3000")).toBe("Melbourne CBD, VIC 3000");
  });

  it("leaves unknown places unchanged", () => {
    expect(formatPlaceWithPostcode("Custom pickup spot")).toBe("Custom pickup spot");
  });
});
