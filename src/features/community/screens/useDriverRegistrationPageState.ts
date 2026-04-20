import { useEffect, useMemo, useState } from "react";

import type { RouteDraft, RouteKind, RoutePost } from "../../../model";
import { isActiveOneTimePost } from "../utils/storage";
import { hasRouteDraftInput, isRouteDraftReady, toDraftFromPost } from "../utils/routeDraftState";
import type { MainTab, Mode } from "../types";

type UseDriverRegistrationPageStateOptions = {
  mode: Mode;
  mainTab: MainTab;
  myPosts: RoutePost[];
  routeDraft: RouteDraft;
  hasDriverContactMethod: boolean;
  onRouteDraftChange: (draft: RouteDraft) => void;
  onPostRoute: () => Promise<boolean>;
};

export function useDriverRegistrationPageState({
  mode,
  mainTab,
  myPosts,
  routeDraft,
  hasDriverContactMethod,
  onRouteDraftChange,
  onPostRoute,
}: UseDriverRegistrationPageStateOptions) {
  const [isDriverRegistrationPageOpen, setIsDriverRegistrationPageOpen] = useState(false);
  const activeDriverRouteKind: RouteKind =
    mode === "driver" && mainTab === "saved" ? "one_time" : "regular";
  const myPostsForActiveKind = useMemo(
    () => myPosts.filter((post) => post.kind === activeDriverRouteKind),
    [activeDriverRouteKind, myPosts]
  );
  const latestRegisteredPost =
    activeDriverRouteKind === "one_time"
      ? myPostsForActiveKind.find((post) => isActiveOneTimePost(post)) ?? null
      : myPostsForActiveKind[0] ?? null;
  const activeRouteDraft =
    isRouteDraftReady(routeDraft, hasDriverContactMethod) || !latestRegisteredPost
      ? routeDraft
      : toDraftFromPost(latestRegisteredPost);

  useEffect(() => {
    if (mode !== "driver" || !(mainTab === "home" || mainTab === "saved")) {
      setIsDriverRegistrationPageOpen(false);
    }
  }, [mainTab, mode]);

  useEffect(() => {
    if (
      !isDriverRegistrationPageOpen ||
      isRouteDraftReady(routeDraft, hasDriverContactMethod) ||
      hasRouteDraftInput(routeDraft) ||
      !latestRegisteredPost
    ) {
      return;
    }

    onRouteDraftChange(toDraftFromPost(latestRegisteredPost));
  }, [
    hasDriverContactMethod,
    isDriverRegistrationPageOpen,
    latestRegisteredPost,
    onRouteDraftChange,
    routeDraft,
  ]);

  const handleSaveRouteRegistration = async () => {
    const didSave = await onPostRoute();
    if (!didSave) {
      return false;
    }

    setIsDriverRegistrationPageOpen(false);
    return true;
  };

  return {
    isDriverRegistrationPageVisible: isDriverRegistrationPageOpen && mode === "driver",
    activeDriverRouteKind,
    activeRegisteredPost: latestRegisteredPost,
    activeRouteDraft,
    openDriverRegistrationPage: () => setIsDriverRegistrationPageOpen(true),
    closeDriverRegistrationPage: () => setIsDriverRegistrationPageOpen(false),
    handleSaveRouteRegistration,
  };
}
