const NON_ENGLISH_PLACE_CHARACTER_PATTERN = /[^A-Za-z0-9\s,.'\-()/&]/g;
const MULTI_SPACE_PATTERN = /\s{2,}/g;

export const normalizeEnglishPlaceInput = (value: string) =>
  value
    .replace(NON_ENGLISH_PLACE_CHARACTER_PATTERN, "")
    .replace(MULTI_SPACE_PATTERN, " ")
    .trimStart();
