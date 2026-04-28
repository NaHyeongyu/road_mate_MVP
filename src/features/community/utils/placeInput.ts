const NON_ENGLISH_PLACE_CHARACTER_PATTERN = /[^A-Za-z0-9\s,.'\-()/&]/g;
const MULTI_SPACE_PATTERN = /\s{2,}/g;
const AUSTRALIAN_POSTCODE_TOKEN_PATTERN = /\b\d{4}\b/g;

export const normalizeEnglishPlaceInput = (value: string) =>
  value
    .replace(NON_ENGLISH_PLACE_CHARACTER_PATTERN, "")
    .replace(MULTI_SPACE_PATTERN, " ")
    .trimStart();

export const normalizePlaceSearchText = (value: string) =>
  normalizeEnglishPlaceInput(value)
    .replace(AUSTRALIAN_POSTCODE_TOKEN_PATTERN, " ")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const findExactPlaceSuggestionMatch = (
  input: string,
  suggestions: readonly string[]
) => {
  const normalizedInput = normalizePlaceSearchText(input);
  if (!normalizedInput) {
    return null;
  }

  return (
    suggestions.find((suggestion) => normalizePlaceSearchText(suggestion) === normalizedInput) ??
    null
  );
};
