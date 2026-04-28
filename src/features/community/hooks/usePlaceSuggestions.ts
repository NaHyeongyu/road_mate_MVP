import { useEffect, useMemo, useState } from "react";

import { STATE_SEARCH_ALIASES } from "../data/australianStates";
import { searchPostcodeApiSuggestions } from "../data/postcodeApiRepository";
import type { StateFilter } from "../types";
import { getPlaceSuggestions } from "../utils/placeQuickSearch";
import { normalizeEnglishPlaceInput, normalizePlaceSearchText } from "../utils/placeInput";

const API_REQUEST_DEBOUNCE_MS = 180;
const MIN_QUERY_LENGTH_FOR_API = 3;

const isPostcodeApiEnabled = () => process.env.NODE_ENV !== "test";
const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function usePlaceSuggestions(
  query: string,
  limit = 8,
  stateFilter: StateFilter = "ALL",
  isRemoteEnabled = true
) {
  const [apiQuery, setApiQuery] = useState("");
  const [apiSuggestions, setApiSuggestions] = useState<string[]>([]);

  const normalizedInput = normalizeEnglishPlaceInput(query);
  const trimmedQuery = normalizedInput.trim();
  const normalizedSearchInput = normalizePlaceSearchText(trimmedQuery);
  const normalizedQuery = normalizedSearchInput;
  const fallbackSuggestions = useMemo(() => {
    const localSuggestions = getPlaceSuggestions(normalizedSearchInput, Math.max(limit * 3, limit));
    if (stateFilter === "ALL") {
      return localSuggestions.slice(0, limit);
    }

    const aliases = STATE_SEARCH_ALIASES[stateFilter];
    return localSuggestions
      .filter((item) => {
        const normalizedItem = normalizeText(item);
        return aliases.some((alias) => normalizedItem.includes(alias));
      })
      .slice(0, limit);
  }, [limit, normalizedSearchInput, stateFilter]);

  useEffect(() => {
    setApiQuery(normalizedQuery);

    const hasEnoughLocalSuggestions = fallbackSuggestions.length >= limit;
    if (
      !isRemoteEnabled ||
      !isPostcodeApiEnabled() ||
      trimmedQuery.length < MIN_QUERY_LENGTH_FOR_API ||
      hasEnoughLocalSuggestions
    ) {
      setApiSuggestions([]);
      return;
    }

    const abortController = new AbortController();
    const timeoutId = setTimeout(() => {
      void searchPostcodeApiSuggestions(
        trimmedQuery,
        limit,
        abortController.signal,
        stateFilter === "ALL" ? undefined : stateFilter
      )
        .then((suggestions) => {
          if (abortController.signal.aborted) {
            return;
          }

          setApiQuery(normalizedQuery);
          setApiSuggestions(suggestions);
        })
        .catch(() => {
          if (abortController.signal.aborted) {
            return;
          }

          setApiQuery(normalizedQuery);
          setApiSuggestions([]);
        });
    }, API_REQUEST_DEBOUNCE_MS);

    return () => {
      clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [fallbackSuggestions.length, isRemoteEnabled, limit, normalizedQuery, stateFilter, trimmedQuery]);

  if (apiQuery === normalizedQuery && apiSuggestions.length > 0) {
    return apiSuggestions;
  }

  return fallbackSuggestions;
}
