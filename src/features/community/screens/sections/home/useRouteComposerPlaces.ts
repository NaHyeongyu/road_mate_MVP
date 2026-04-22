import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import type { TextInput } from "react-native";

import type { RouteDraft } from "../../../../../model";
import { usePlaceSuggestions } from "../../../hooks/usePlaceSuggestions";
import { normalizeEnglishPlaceInput } from "../../../utils/placeInput";

type PlaceField = "from" | "to";

type UseRouteComposerPlacesOptions = {
  routeDraft: RouteDraft;
  toInputRef: RefObject<TextInput | null>;
  onPatchDraft: (patch: Partial<RouteDraft>) => void;
  onCompleteDestination: () => void;
};

export function useRouteComposerPlaces({
  routeDraft,
  toInputRef,
  onPatchDraft,
  onCompleteDestination,
}: UseRouteComposerPlacesOptions) {
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activePlaceField, setActivePlaceField] = useState<PlaceField | null>(null);
  const [fromInputValue, setFromInputValue] = useState(routeDraft.from);
  const [toInputValue, setToInputValue] = useState(routeDraft.to);
  const selectedFromRef = useRef(routeDraft.from);
  const selectedToRef = useRef(routeDraft.to);
  const fromInputValueRef = useRef(routeDraft.from);
  const toInputValueRef = useRef(routeDraft.to);

  const updateFromInputValue = (value: string) => {
    fromInputValueRef.current = value;
    setFromInputValue(value);
  };

  const updateToInputValue = (value: string) => {
    toInputValueRef.current = value;
    setToInputValue(value);
  };

  const fromSuggestions = usePlaceSuggestions(fromInputValue, 8, "ALL", activePlaceField === "from");
  const toSuggestions = usePlaceSuggestions(toInputValue, 8, "ALL", activePlaceField === "to");

  const showFromSuggestions =
    activePlaceField === "from" && fromInputValue.trim().length > 0 && fromSuggestions.length > 0;
  const showToSuggestions =
    activePlaceField === "to" && toInputValue.trim().length > 0 && toSuggestions.length > 0;
  const hasSelectedFrom =
    routeDraft.from.trim().length > 0 && fromInputValue.trim() === routeDraft.from.trim();
  const hasSelectedTo =
    routeDraft.to.trim().length > 0 && toInputValue.trim() === routeDraft.to.trim();

  useEffect(() => {
    selectedFromRef.current = routeDraft.from;
    updateFromInputValue(routeDraft.from);
  }, [routeDraft.from]);

  useEffect(() => {
    selectedToRef.current = routeDraft.to;
    updateToInputValue(routeDraft.to);
  }, [routeDraft.to]);

  const clearBlurTimeout = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
      blurTimeoutRef.current = null;
    }
  };

  const focusField = (field: PlaceField) => {
    clearBlurTimeout();
    setActivePlaceField(field);
  };

  const scheduleCloseSuggestions = (field: PlaceField) => {
    clearBlurTimeout();
    blurTimeoutRef.current = setTimeout(() => {
      setActivePlaceField((prev) => (prev === field ? null : prev));
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
    onPatchDraft({ from: selectedValue });
    setActivePlaceField("to");
    toInputRef.current?.focus();
  };

  const handleSelectToSuggestion = (value: string) => {
    const selectedValue = value.trim();
    clearBlurTimeout();
    selectedToRef.current = selectedValue;
    updateToInputValue(selectedValue);
    onPatchDraft({ to: selectedValue });
    setActivePlaceField(null);
    onCompleteDestination();
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
      onPatchDraft({ from: "" });
      focusField("from");
    },
    handleClearTo: () => {
      selectedToRef.current = "";
      updateToInputValue("");
      onPatchDraft({ to: "" });
      focusField("to");
    },
    handleSelectFromSuggestion,
    handleSelectToSuggestion,
  };
}
