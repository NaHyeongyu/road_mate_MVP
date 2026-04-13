import { useState } from "react";

import type { RouteDraft, VehicleInfo } from "../../../../../model";
import { isRouteDateValue, isRouteTimeValue } from "../../../../community/utils/routeForm";
import {
  buildRequiredChecks,
  normalizeSeatCount,
  toRemainingRequiredText,
} from "./driverRouteComposerState";

type UseDriverComposerSubmitStateOptions = {
  routeDraft: RouteDraft;
  savedVehicle: VehicleInfo;
  hasVehicle: boolean;
  isOneTimeRoute: boolean;
  isOneTimeRoundTrip: boolean;
  minSeats: number;
  maxSeats: number;
  onPatchDraft: (patch: Partial<RouteDraft>) => void;
  onPostRoute: () => Promise<boolean>;
};

export function useDriverComposerSubmitState({
  routeDraft,
  savedVehicle,
  hasVehicle,
  isOneTimeRoute,
  isOneTimeRoundTrip,
  minSeats,
  maxSeats,
  onPatchDraft,
  onPostRoute,
}: UseDriverComposerSubmitStateOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentSeatCount = normalizeSeatCount(
    Number.parseInt(routeDraft.availableSeats, 10) || minSeats,
    minSeats,
    maxSeats
  );

  const updateSeatCount = (nextSeatCount: number) => {
    const normalized = normalizeSeatCount(nextSeatCount, minSeats, maxSeats);
    onPatchDraft({ availableSeats: String(normalized) });
  };

  const applyOperatingDays = (days: readonly string[]) => {
    onPatchDraft({ operatingDays: [...days] });
  };

  const hasFrom = Boolean(routeDraft.from.trim());
  const hasTo = Boolean(routeDraft.to.trim());
  const hasNoticeDate = isRouteDateValue(routeDraft.noticeDate);
  const hasDepartureTime = isRouteTimeValue(routeDraft.schedule);
  const hasReturnTime = isRouteTimeValue(routeDraft.returnSchedule);
  const hasSeats = currentSeatCount >= minSeats;
  const hasOperatingDays = routeDraft.operatingDays.length > 0;
  const hasProfileContactMethod = Boolean(savedVehicle.contactPhone.trim() || savedVehicle.contactLink.trim());
  const hasDraftContactMethod = Boolean(routeDraft.contactPhone.trim() || routeDraft.contactLink.trim());
  const hasContactMethod = hasProfileContactMethod || hasDraftContactMethod;

  const requiredChecks = buildRequiredChecks({
    isOneTimeRoute,
    isOneTimeRoundTrip,
    hasVehicle,
    hasFrom,
    hasTo,
    hasNoticeDate,
    hasDepartureTime,
    hasReturnTime,
    hasSeats,
    hasOperatingDays,
    hasContactMethod,
  });

  const remainingRequired = requiredChecks.filter((check) => !check.done).map((check) => check.label);
  const isReadyToSave = remainingRequired.length === 0;
  const remainingRequiredText = toRemainingRequiredText(remainingRequired);

  const handlePressSaveRegistration = async () => {
    if (isSubmitting || !isReadyToSave) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onPostRoute();
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    currentSeatCount,
    updateSeatCount,
    applyOperatingDays,
    isSubmitting,
    isReadyToSave,
    remainingRequired,
    remainingRequiredText,
    handlePressSaveRegistration,
  };
}
