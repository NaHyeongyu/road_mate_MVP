import { AU_PLACE_OPTIONS } from "../data/qldPlaceOptions";

const normalizePlaceText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const toTokens = (value: string) => normalizePlaceText(value).split(" ").filter(Boolean);

type ScoredPlace = {
  label: string;
  score: number;
};

const scorePlaceMatch = (place: string, query: string) => {
  const normalizedPlace = normalizePlaceText(place);
  const normalizedQuery = normalizePlaceText(query);
  const tokens = toTokens(query);

  if (!tokens.length) {
    return null;
  }

  if (!tokens.every((token) => normalizedPlace.includes(token))) {
    return null;
  }

  if (normalizedPlace === normalizedQuery) {
    return 0;
  }

  if (normalizedPlace.startsWith(normalizedQuery)) {
    return 1;
  }

  const firstToken = tokens[0];
  if (firstToken && normalizedPlace.startsWith(firstToken)) {
    return 2;
  }

  return 3;
};

export const getPlaceSuggestions = (query: string, limit = 8) => {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) {
    return [];
  }

  const scored = AU_PLACE_OPTIONS.flatMap((place): ScoredPlace[] => {
    const score = scorePlaceMatch(place, trimmedQuery);
    if (score === null) {
      return [];
    }

    return [{ label: place, score }];
  });

  return scored
    .sort((left, right) => {
      if (left.score !== right.score) {
        return left.score - right.score;
      }

      return left.label.localeCompare(right.label, "en-AU");
    })
    .slice(0, limit)
    .map((item) => item.label);
};

export const getQldPlaceSuggestions = getPlaceSuggestions;
