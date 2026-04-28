import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { Keyboard } from "react-native";
import type { TextInput } from "react-native";

import { usePlaceSuggestions } from "../../../hooks/usePlaceSuggestions";
import type { StateFilter } from "../../../types";
import {
  findExactPlaceSuggestionMatch,
  normalizeEnglishPlaceInput,
} from "../../../utils/placeInput";

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
  const [fromInputValue, setFromInputValue] = useState(fromSearchQuery);
  const [toInputValue, setToInputValue] = useState(toSearchQuery);
  const selectedFromRef = useRef(fromSearchQuery);
  const selectedToRef = useRef(toSearchQuery);
  const fromInputValueRef = useRef(fromSearchQuery);
  const toInputValueRef = useRef(toSearchQuery);

  const updateFromInputValue = (value: string) => {
    fromInputValueRef.current = value;
    setFromInputValue(value);
  };

  const updateToInputValue = (value: string) => {
    toInputValueRef.current = value;
    setToInputValue(value);
  };

  const fromSuggestions = usePlaceSuggestions(fromInputValue, 8, stateFilter, activeField === "from");
  const toSuggestions = usePlaceSuggestions(toInputValue, 8, stateFilter, activeField === "to");

  const showFromSuggestions =
    activeField === "from" && fromInputValue.trim().length > 0 && fromSuggestions.length > 0;
  const showToSuggestions =
    activeField === "to" && toInputValue.trim().length > 0 && toSuggestions.length > 0;
  const hasSelectedFrom =
    fromSearchQuery.trim().length > 0 && fromInputValue.trim() === fromSearchQuery.trim();
  const hasSelectedTo =
    toSearchQuery.trim().length > 0 && toInputValue.trim() === toSearchQuery.trim();
  const fromExactSuggestion = findExactPlaceSuggestionMatch(fromInputValue, fromSuggestions);
  const toExactSuggestion = findExactPlaceSuggestionMatch(toInputValue, toSuggestions);
  const canResolveFromInput = !fromInputValue.trim() || hasSelectedFrom || Boolean(fromExactSuggestion);
  const canResolveToInput = !toInputValue.trim() || hasSelectedTo || Boolean(toExactSuggestion);

  useEffect(() => {
    selectedFromRef.current = fromSearchQuery;
    updateFromInputValue(fromSearchQuery);
  }, [fromSearchQuery]);

  useEffect(() => {
    selectedToRef.current = toSearchQuery;
    updateToInputValue(toSearchQuery);
  }, [toSearchQuery]);

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
      if (field === "from" && fromInputValueRef.current.trim() !== selectedFromRef.current.trim()) {
        updateFromInputValue(selectedFromRef.current);
      }
      if (field === "to" && toInputValueRef.current.trim() !== selectedToRef.current.trim()) {
        updateToInputValue(selectedToRef.current);
      }
    }, 120);
  };

  useEffect(
    () => () => {
      clearBlurTimeout();
    },
    []
  );

  const handleSelectFromSuggestion = (value: string) => {
    const selectedValue = value.trim();
    clearBlurTimeout();
    selectedFromRef.current = selectedValue;
    updateFromInputValue(selectedValue);
    onFromSearchQueryChange(selectedValue);
    setActiveField("to");
    toInputRef.current?.focus();
  };

  const handleSelectToSuggestion = (value: string) => {
    const selectedValue = value.trim();
    clearBlurTimeout();
    selectedToRef.current = selectedValue;
    updateToInputValue(selectedValue);
    onToSearchQueryChange(selectedValue);
    setActiveField(null);
    Keyboard.dismiss();
  };

  const resolvePendingSearchSelections = () => {
    const fromInput = fromInputValueRef.current.trim();
    const toInput = toInputValueRef.current.trim();
    const resolvedFrom = fromInput
      ? selectedFromRef.current.trim() === fromInput
        ? selectedFromRef.current.trim()
        : findExactPlaceSuggestionMatch(fromInput, fromSuggestions)
      : "";
    const resolvedTo = toInput
      ? selectedToRef.current.trim() === toInput
        ? selectedToRef.current.trim()
        : findExactPlaceSuggestionMatch(toInput, toSuggestions)
      : "";

    if (fromInput && !resolvedFrom) {
      return {
        isValid: false,
        from: "",
        to: resolvedTo || "",
        invalidField: "from" as const,
      };
    }

    if (toInput && !resolvedTo) {
      return {
        isValid: false,
        from: resolvedFrom || "",
        to: "",
        invalidField: "to" as const,
      };
    }

    if (resolvedFrom && resolvedFrom !== selectedFromRef.current.trim()) {
      selectedFromRef.current = resolvedFrom;
      updateFromInputValue(resolvedFrom);
      onFromSearchQueryChange(resolvedFrom);
    }

    if (resolvedTo && resolvedTo !== selectedToRef.current.trim()) {
      selectedToRef.current = resolvedTo;
      updateToInputValue(resolvedTo);
      onToSearchQueryChange(resolvedTo);
    }

    return {
      isValid: true,
      from: resolvedFrom || "",
      to: resolvedTo || "",
      invalidField: null,
    };
  };

  return {
    fromInputValue,
    toInputValue,
    fromSuggestions,
    toSuggestions,
    showFromSuggestions,
    showToSuggestions,
    hasSelectedFrom,
    hasSelectedTo,
    canResolveFromInput,
    canResolveToInput,
    handleFromChangeText: (value: string) => {
      updateFromInputValue(normalizeEnglishPlaceInput(value));
    },
    handleToChangeText: (value: string) => {
      updateToInputValue(normalizeEnglishPlaceInput(value));
    },
    handleFromFocus: () => focusField("from"),
    handleToFocus: () => focusField("to"),
    handleFromBlur: () => scheduleCloseSuggestions("from"),
    handleToBlur: () => scheduleCloseSuggestions("to"),
    handleClearFrom: () => {
      selectedFromRef.current = "";
      updateFromInputValue("");
      onFromSearchQueryChange("");
      focusField("from");
    },
    handleClearTo: () => {
      selectedToRef.current = "";
      updateToInputValue("");
      onToSearchQueryChange("");
      focusField("to");
    },
    handleSelectFromSuggestion,
    handleSelectToSuggestion,
    resolvePendingSearchSelections,
  };
}
