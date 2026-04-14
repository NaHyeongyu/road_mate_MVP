type PostcodeApiStateRecord = {
  abbreviation?: unknown;
};

type PostcodeApiSuburbRecord = {
  name?: unknown;
  postcode?: unknown;
  state?: PostcodeApiStateRecord | string | null;
};

const POSTCODE_API_BASE_URL = (
  process.env.EXPO_PUBLIC_POSTCODE_API_BASE_URL ?? "https://v0.postcodeapi.com.au"
).replace(/\/+$/, "");

const suggestionsCache = new Map<string, string[]>();

const normalizeQuery = (value: string) => value.trim().toLowerCase();

const toStateAbbreviation = (state: PostcodeApiSuburbRecord["state"]) => {
  if (typeof state === "string") {
    return state.trim().toUpperCase();
  }

  if (!state || typeof state !== "object") {
    return "";
  }

  const abbreviation = state.abbreviation;
  return typeof abbreviation === "string" ? abbreviation.trim().toUpperCase() : "";
};

const toLabel = (record: PostcodeApiSuburbRecord) => {
  const name = typeof record.name === "string" ? record.name.trim() : "";
  if (!name) {
    return null;
  }

  const postcode =
    typeof record.postcode === "number" || typeof record.postcode === "string"
      ? String(record.postcode).trim()
      : "";
  const state = toStateAbbreviation(record.state);

  if (state && postcode) {
    return `${name}, ${state} ${postcode}`;
  }

  if (state) {
    return `${name}, ${state}`;
  }

  if (postcode) {
    return `${name}, ${postcode}`;
  }

  return name;
};

export async function searchPostcodeApiSuggestions(
  query: string,
  limit = 8,
  signal?: AbortSignal,
  state?: string
): Promise<string[]> {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  const normalizedQuery = normalizeQuery(trimmedQuery);
  const normalizedState = String(state ?? "").trim().toUpperCase();
  const cacheKey = `${normalizedQuery}:${limit}:${normalizedState}`;
  const cached = suggestionsCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const endpoint = new URL(`${POSTCODE_API_BASE_URL}/suburbs.json`);
  endpoint.searchParams.set("q", trimmedQuery);
  if (normalizedState) {
    endpoint.searchParams.set("state", normalizedState);
  }

  const response = await fetch(endpoint.toString(), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Postcode API request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as unknown;
  if (!Array.isArray(payload)) {
    return [];
  }

  const uniqueSuggestions: string[] = [];
  const seen = new Set<string>();

  for (const record of payload) {
    const label = toLabel(record as PostcodeApiSuburbRecord);
    if (!label || seen.has(label)) {
      continue;
    }

    seen.add(label);
    uniqueSuggestions.push(label);

    if (uniqueSuggestions.length >= limit) {
      break;
    }
  }

  suggestionsCache.set(cacheKey, uniqueSuggestions);
  return uniqueSuggestions;
}

export function clearPostcodeApiSuggestionsCache() {
  suggestionsCache.clear();
}
