import { useEffect, useMemo, useState } from "react";

import type { RouteDraft, RouteKind, RoutePost } from "../../../../../model";
import { hasRouteDraftInput, isRouteDraftReady, toDraftFromPost } from "../../../utils/routeDraftState";
import {
  getDriverHomeMissingRequiredLabels,
  normalizeDriverHomeSeats,
  DRIVER_HOME_MIN_SEATS,
} from "./driverHomeState";

type UseDriverHomeOverviewStateOptions = {
  driverRouteKind: "regular" | "one_time";
  routeDraft: RouteDraft;
  hasDriverContactMethod: boolean;
  myPosts: RoutePost[];
  onRouteDraftChange: (draft: RouteDraft) => void;
  onSaveRouteQuickSettings: (input: {
    kind: RouteKind;
    availableSeats: number;
    isPublic: boolean;
  }) => Promise<void>;
  onOpenRouteRegistrationPage: () => void;
};

export function useDriverHomeOverviewState({
  driverRouteKind,
  routeDraft,
  hasDriverContactMethod,
  myPosts,
  onRouteDraftChange,
  onSaveRouteQuickSettings,
  onOpenRouteRegistrationPage,
}: UseDriverHomeOverviewStateOptions) {
  const [isQuickSettingSaving, setIsQuickSettingSaving] = useState(false);

  const hasDraftInput = hasRouteDraftInput(routeDraft);
  const isDraftReady = isRouteDraftReady(routeDraft, hasDriverContactMethod);
  const missingRequiredLabels = useMemo(
    () => getDriverHomeMissingRequiredLabels(routeDraft, hasDriverContactMethod),
    [hasDriverContactMethod, routeDraft]
  );

  const myPostsForActiveKind = useMemo(
    () => myPosts.filter((post) => post.kind === driverRouteKind),
    [driverRouteKind, myPosts]
  );
  const latestRegisteredPost = myPostsForActiveKind[0] ?? null;
  const hasPublishedRoute = Boolean(latestRegisteredPost);

  const activeRouteDraft =
    isDraftReady || !latestRegisteredPost ? routeDraft : toDraftFromPost(latestRegisteredPost);

  useEffect(() => {
    if (isDraftReady || hasDraftInput || !latestRegisteredPost) {
      return;
    }

    onRouteDraftChange(toDraftFromPost(latestRegisteredPost));
  }, [hasDraftInput, isDraftReady, latestRegisteredPost, onRouteDraftChange]);

  const handleOpenRouteRegistration = () => {
    if (!isDraftReady && !hasDraftInput && latestRegisteredPost) {
      onRouteDraftChange(toDraftFromPost(latestRegisteredPost));
    }

    onOpenRouteRegistrationPage();
  };

  const handleAdjustSeats = (delta: number) => {
    if (!hasPublishedRoute || isQuickSettingSaving) {
      return;
    }

    const currentSeats = normalizeDriverHomeSeats(
      Number.parseInt(activeRouteDraft.availableSeats, 10) || DRIVER_HOME_MIN_SEATS
    );
    const nextSeats = normalizeDriverHomeSeats(currentSeats + delta);

    if (nextSeats === currentSeats) {
      return;
    }

    const nextDraft = {
      ...activeRouteDraft,
      kind: driverRouteKind,
      availableSeats: String(nextSeats),
    };

    onRouteDraftChange(nextDraft);
    setIsQuickSettingSaving(true);
    void onSaveRouteQuickSettings({
      kind: driverRouteKind,
      availableSeats: nextSeats,
      isPublic: nextDraft.isPublic,
    })
      .catch(() => {
        // Notice is handled in action layer; avoid unhandled rejections here.
      })
      .finally(() => {
        setIsQuickSettingSaving(false);
      });
  };

  const handleRouteVisibilityChange = (isPublic: boolean) => {
    if (!hasPublishedRoute || isQuickSettingSaving || activeRouteDraft.isPublic === isPublic) {
      return;
    }

    const nextDraft = {
      ...activeRouteDraft,
      kind: driverRouteKind,
      isPublic,
    };

    onRouteDraftChange(nextDraft);
    setIsQuickSettingSaving(true);
    void onSaveRouteQuickSettings({
      kind: driverRouteKind,
      availableSeats: normalizeDriverHomeSeats(
        Number.parseInt(nextDraft.availableSeats, 10) || DRIVER_HOME_MIN_SEATS
      ),
      isPublic,
    })
      .catch(() => {
        // Notice is handled in action layer; avoid unhandled rejections here.
      })
      .finally(() => {
        setIsQuickSettingSaving(false);
      });
  };

  return {
    hasRouteRegistration: hasPublishedRoute,
    hasDraftInput,
    isDraftReady,
    missingRequiredLabels,
    isQuickSettingSaving,
    routeDraft: activeRouteDraft,
    onOpenRouteRegistration: handleOpenRouteRegistration,
    onAdjustSeats: handleAdjustSeats,
    onRouteVisibilityChange: handleRouteVisibilityChange,
  };
}
