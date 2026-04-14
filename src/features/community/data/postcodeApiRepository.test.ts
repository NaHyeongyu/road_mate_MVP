import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearPostcodeApiSuggestionsCache,
  searchPostcodeApiSuggestions,
} from "./postcodeApiRepository";

describe("postcodeApiRepository", () => {
  beforeEach(() => {
    clearPostcodeApiSuggestionsCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("formats suburb suggestions with state and postcode", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        {
          name: "Collingwood",
          postcode: 3066,
          state: { abbreviation: "VIC" },
        },
        {
          name: "Perth",
          postcode: 6000,
          state: { abbreviation: "WA" },
        },
      ],
    });
    vi.stubGlobal("fetch", fetchMock);

    const suggestions = await searchPostcodeApiSuggestions("col");
    expect(suggestions).toEqual(["Collingwood, VIC 3066", "Perth, WA 6000"]);
  });

  it("deduplicates and applies result limits", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { name: "Sydney", postcode: 2000, state: { abbreviation: "NSW" } },
        { name: "Sydney", postcode: 2000, state: { abbreviation: "NSW" } },
        { name: "Parramatta", postcode: 2150, state: { abbreviation: "NSW" } },
      ],
    });
    vi.stubGlobal("fetch", fetchMock);

    const suggestions = await searchPostcodeApiSuggestions("syd", 1);
    expect(suggestions).toEqual(["Sydney, NSW 2000"]);
  });

  it("reuses cached responses for the same query", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ name: "Melbourne", postcode: 3000, state: { abbreviation: "VIC" } }],
    });
    vi.stubGlobal("fetch", fetchMock);

    const first = await searchPostcodeApiSuggestions("melb", 8);
    const second = await searchPostcodeApiSuggestions("melb", 8);

    expect(first).toEqual(["Melbourne, VIC 3000"]);
    expect(second).toEqual(["Melbourne, VIC 3000"]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("includes state parameter when provided", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ name: "Perth", postcode: 6000, state: { abbreviation: "WA" } }],
    });
    vi.stubGlobal("fetch", fetchMock);

    await searchPostcodeApiSuggestions("per", 8, undefined, "wa");

    const requestUrl = String(fetchMock.mock.calls[0]?.[0] ?? "");
    expect(requestUrl).toContain("q=per");
    expect(requestUrl).toContain("state=WA");
  });
});
