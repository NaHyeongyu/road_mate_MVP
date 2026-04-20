import { useEffect, useMemo, useState } from "react";

import { useAppCopy } from "../../../../../i18n/AppI18nContext";
import type { RouteDraft, RouteKind, RoutePost } from "../../../../../model";
import { isActiveOneTimePost } from "../../../utils/storage";
import { hasRouteDraftInput, isRouteDraftReady, toDraftFromPost } from "../../../utils/routeDraftState";
import {
  getDriverHomeMissingRequiredLabels,
  normalizeDriverHomeSeats,
  DRIVER_HOME_MIN_SEATS,
} from "./driverHomeState";

export type PreviousNoticesPeriod = "all" | "30d" | "90d" | "365d";

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
  const copy = useAppCopy();
  const [isQuickSettingSaving, setIsQuickSettingSaving] = useState(false);

  const hasDraftInput = hasRouteDraftInput(routeDraft);
  const isDraftReady = isRouteDraftReady(routeDraft, hasDriverContactMethod);
  const missingRequiredLabels = useMemo(
    () =>
      getDriverHomeMissingRequiredLabels(routeDraft, hasDriverContactMethod, {
        from: copy.common.from,
        to: copy.common.to,
        departureDate: copy.common.departureDate,
        returnDate: copy.common.returnDate,
        departureTime: copy.common.departureTime,
        returnTime: copy.common.returnTime,
        arrivalTime: copy.common.arrivalTime,
        contact: copy.common.contact,
      }),
    [copy, hasDriverContactMethod, routeDraft]
  );

  const myPostsForActiveKind = useMemo(
    () => myPosts.filter((post) => post.kind === driverRouteKind),
    [driverRouteKind, myPosts]
  );
  const activePublishedPost =
    driverRouteKind === "one_time"
      ? myPostsForActiveKind.find((post) => isActiveOneTimePost(post)) ?? null
      : myPostsForActiveKind[0] ?? null;
  const previousOneTimePosts = useMemo(
    () =>
      driverRouteKind === "one_time"
        ? myPostsForActiveKind.filter((post) => !isActiveOneTimePost(post))
        : [],
    [driverRouteKind, myPostsForActiveKind]
  );
  const hasPublishedRoute = Boolean(activePublishedPost);

  const activeRouteDraft =
    isDraftReady || !activePublishedPost ? routeDraft : toDraftFromPost(activePublishedPost);

  useEffect(() => {
    if (isDraftReady || hasDraftInput || !activePublishedPost) {
      return;
    }

    onRouteDraftChange(toDraftFromPost(activePublishedPost));
  }, [activePublishedPost, hasDraftInput, isDraftReady, onRouteDraftChange]);

  const handleOpenRouteRegistration = () => {
    if (!isDraftReady && !hasDraftInput && activePublishedPost) {
      onRouteDraftChange(toDraftFromPost(activePublishedPost));
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
    activePublishedPost,
    hasRouteRegistration: hasPublishedRoute,
    hasDraftInput,
    isDraftReady,
    missingRequiredLabels,
    isQuickSettingSaving,
    hasPreviousOneTimePosts: previousOneTimePosts.length > 0,
    routeDraft: activeRouteDraft,
    onOpenRouteRegistration: handleOpenRouteRegistration,
    onAdjustSeats: handleAdjustSeats,
    onRouteVisibilityChange: handleRouteVisibilityChange,
  };
}
