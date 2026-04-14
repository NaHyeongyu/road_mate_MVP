import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { Keyboard } from "react-native";
import type { TextInput } from "react-native";

import { usePlaceSuggestions } from "../../../hooks/usePlaceSuggestions";
import type { StateFilter } from "../../../types";

type SearchField = "from" | "to";

type UseRiderSearchSuggestionsOptions = {
  stateFilter: StateFilter;
  fromSearchQuery: string;
  toSearchQuery: string;
  toInputRef: RefObject<TextInput | null>;
  onFromSearchQueryChange: (value: string) => void;
  onToSearchQueryChange: (value: string) => void;
};

export function useRiderSearchSuggestions({
  stateFilter,
  fromSearchQuery,
  toSearchQuery,
  toInputRef,
  onFromSearchQueryChange,
  onToSearchQueryChange,
}: UseRiderSearchSuggestionsOptions) {
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeField, setActiveField] = useState<SearchField | null>(null);

  const fromSuggestions = usePlaceSuggestions(fromSearchQuery, 8, stateFilter);
  const toSuggestions = usePlaceSuggestions(toSearchQuery, 8, stateFilter);

  const showFromSuggestions =
    activeField === "from" && fromSearchQuery.trim().length > 0 && fromSuggestions.length > 0;
  const showToSuggestions =
    activeField === "to" && toSearchQuery.trim().length > 0 && toSuggestions.length > 0;

  const clearBlurTimeout = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  };

  const focusField = (field: SearchField) => {
    clearBlurTimeout();
    setActiveField(field);
  };

  const scheduleCloseSuggestions = (field: SearchField) => {
    clearBlurTimeout();
    blurTimeoutRef.current = setTimeout(() => {
      setActiveField((prev) => (prev === field ? null : prev));
    }, 120);
  };

  useEffect(
    () => () => {
      clearBlurTimeout();
    },
    []
  );

  const handleSelectFromSuggestion = (value: string) => {
    clearBlurTimeout();
    onFromSearchQueryChange(value);
    setActiveField("to");
    toInputRef.current?.focus();
  };

  const handleSelectToSuggestion = (value: string) => {
    clearBlurTimeout();
    onToSearchQueryChange(value);
    setActiveField(null);
    Keyboard.dismiss();
  };

  return {
    fromSuggestions,
    toSuggestions,
    showFromSuggestions,
    showToSuggestions,
    handleFromFocus: () => focusField("from"),
    handleToFocus: () => focusField("to"),
    handleFromBlur: () => scheduleCloseSuggestions("from"),
    handleToBlur: () => scheduleCloseSuggestions("to"),
    handleClearFrom: () => {
      onFromSearchQueryChange("");
      focusField("from");
    },
    handleClearTo: () => {
      onToSearchQueryChange("");
      focusField("to");
    },
    handleSelectFromSuggestion,
    handleSelectToSuggestion,
  };
}
