import { useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import type { TextInput } from "react-native";

import type { RouteDraft } from "../../../../../model";
import { getQldPlaceSuggestions } from "../../../utils/placeQuickSearch";

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

  const fromSuggestions = useMemo(() => getQldPlaceSuggestions(routeDraft.from), [routeDraft.from]);
  const toSuggestions = useMemo(() => getQldPlaceSuggestions(routeDraft.to), [routeDraft.to]);

  const showFromSuggestions =
    activePlaceField === "from" && routeDraft.from.trim().length > 0 && fromSuggestions.length > 0;
  const showToSuggestions =
    activePlaceField === "to" && routeDraft.to.trim().length > 0 && toSuggestions.length > 0;

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
    onPatchDraft({ from: value });
    setActivePlaceField("to");
    toInputRef.current?.focus();
  };

  const handleSelectToSuggestion = (value: string) => {
    clearBlurTimeout();
    onPatchDraft({ to: value });
    setActivePlaceField(null);
    onCompleteDestination();
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
      onPatchDraft({ from: "" });
      focusField("from");
    },
    handleClearTo: () => {
      onPatchDraft({ to: "" });
      focusField("to");
    },
    handleSelectFromSuggestion,
    handleSelectToSuggestion,
  };
}
