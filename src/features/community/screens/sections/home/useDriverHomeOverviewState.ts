import { useEffect, useMemo, useState } from "react";

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
  const [isQuickSettingSaving, setIsQuickSettingSaving] = useState(false);
  const [isPreviousNoticesVisible, setIsPreviousNoticesVisible] = useState(false);
  const [previousNoticesPeriod, setPreviousNoticesPeriod] = useState<PreviousNoticesPeriod>("all");

  const toNoticeTimestamp = (post: RoutePost) => {
    const noticeDate = String(post.noticeDate ?? "").trim();
    if (noticeDate) {
      const noticeTimestamp = Date.parse(`${noticeDate}T00:00:00`);
      if (Number.isFinite(noticeTimestamp)) {
        return noticeTimestamp;
      }
    }

    const createdAt = Date.parse(post.createdAt);
    return Number.isFinite(createdAt) ? createdAt : 0;
  };

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
  const filteredPreviousOneTimePosts = useMemo(() => {
    if (previousNoticesPeriod === "all") {
      return previousOneTimePosts;
    }

    const days = previousNoticesPeriod === "30d" ? 30 : previousNoticesPeriod === "90d" ? 90 : 365;
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;

    return previousOneTimePosts.filter((post) => toNoticeTimestamp(post) >= threshold);
  }, [previousNoticesPeriod, previousOneTimePosts]);
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
    previousOneTimePosts: filteredPreviousOneTimePosts,
    previousOneTimeCount: previousOneTimePosts.length,
    hasPreviousOneTimePosts: previousOneTimePosts.length > 0,
    isPreviousNoticesVisible,
    previousNoticesPeriod,
    routeDraft: activeRouteDraft,
    onOpenRouteRegistration: handleOpenRouteRegistration,
    onAdjustSeats: handleAdjustSeats,
    onRouteVisibilityChange: handleRouteVisibilityChange,
    onTogglePreviousNoticesVisibility: () =>
      setIsPreviousNoticesVisible((current) => !current),
    onPreviousNoticesPeriodChange: setPreviousNoticesPeriod,
  };
}
