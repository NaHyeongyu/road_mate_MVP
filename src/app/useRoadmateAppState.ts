import { deriveDisplayName } from "../features/auth/utils/authHelpers";
import { useAuthFlow } from "../features/auth/hooks/useAuthFlow";
import { useCommunityActions } from "../features/community/hooks/useCommunityActions";
import { useCommunityCollections } from "../features/community/hooks/useCommunityCollections";
import { useCommunityUiState } from "../features/community/hooks/useCommunityUiState";
import { useUserCommunityStorageState } from "../features/community/hooks/useUserCommunityStorageState";
import { isSupabaseConfigured } from "../lib/supabase";
import type { RouteDraft } from "../model";
import { useSessionState } from "./hooks/useSessionState";
import { useStoredPostsState } from "./hooks/useStoredPostsState";

export function useRoadmateAppState() {
  const {
    mode,
    setMode,
    filter,
    setFilter,
    mainTab,
    setMainTab,
    fromSearchQuery,
    setFromSearchQuery,
    toSearchQuery,
    setToSearchQuery,
    regularRouteDraft,
    setRegularRouteDraft,
    oneTimeRouteDraft,
    setOneTimeRouteDraft,
    resetAllRouteDrafts,
    notice,
    setNotice,
    handleLoadError,
  } = useCommunityUiState();

  const { authSession, isSessionLoading } = useSessionState({
    onLoadError: handleLoadError,
  });
  const currentUser = authSession?.user ?? null;
  const currentUserId = currentUser?.id ?? "";
  const { storedPosts, isPostsLoading, persistPosts } = useStoredPostsState({
    currentUserId,
    onLoadError: handleLoadError,
  });

  const {
    vehicleDraft,
    setVehicleDraft,
    savedVehicle,
    savedPostKeys,
    isVehicleLoading,
    persistSavedPostKeys,
    persistVehicle,
    clearCurrentUserStorage,
  } = useUserCommunityStorageState({
    currentUserId,
    onLoadError: handleLoadError,
  });

  const currentUserName = deriveDisplayName(authSession);
  const currentUserEmail = String(currentUser?.email ?? "").trim();
  const hasVehicle = Boolean(savedVehicle.model && savedVehicle.plate);
  const hasDriverContactMethod = Boolean(
    savedVehicle.contactPhone.trim() || savedVehicle.contactLink.trim()
  );
  const loading = isSessionLoading || isPostsLoading;
  const activeDriverRouteKind = mode === "driver" && mainTab === "saved" ? "one_time" : "regular";
  const routeDraft = activeDriverRouteKind === "regular" ? regularRouteDraft : oneTimeRouteDraft;
  const setRouteDraft = (nextDraft: RouteDraft) => {
    if (activeDriverRouteKind === "regular") {
      setRegularRouteDraft({
        ...nextDraft,
        kind: "regular",
        oneTimeTripType: "round_trip",
      });
      return;
    }

    setOneTimeRouteDraft({
      ...nextDraft,
      kind: "one_time",
      oneTimeTripType: nextDraft.oneTimeTripType ?? "one_way",
    });
  };

  const { myPosts, savedPostKeySet, savedPosts, visiblePosts } = useCommunityCollections({
    currentUserId,
    filter,
    fromSearchQuery,
    toSearchQuery,
    storedPosts,
    savedPostKeys,
  });

  const {
    handleModeChange,
    withdrawAccount,
    saveVehicle,
    postRoute,
    removeRoute,
    toggleSavedPost,
    saveRouteQuickSettings,
    resetSignedInExperience,
  } = useCommunityActions({
    currentUserId,
    currentUserName,
    mainTab,
    hasVehicle,
    storedPosts,
    savedPostKeys,
    savedPostKeySet,
    routeDraft,
    savedVehicle,
    vehicleDraft,
    setMode,
    setFilter,
    setMainTab,
    setRouteDraft,
    resetAllRouteDrafts,
    onNotice: setNotice,
    persistPosts,
    persistSavedPostKeys,
    persistVehicle,
    clearCurrentUserStorage,
  });

  const {
    authMode,
    authEntryMethod,
    authDisplayName,
    authEmail,
    authPassword,
    isAuthSubmitting,
    setAuthMode,
    setAuthEntryMethod,
    setAuthDisplayName,
    setAuthEmail,
    setAuthPassword,
    handleSubmitAuth,
    handleSignOut,
  } = useAuthFlow({
    onNotice: setNotice,
    onResetSignedInExperience: resetSignedInExperience,
  });

  return {
    authEntryMethod,
    authEmail,
    authMode,
    authPassword,
    authDisplayName,
    currentUser,
    currentUserEmail,
    currentUserId,
    currentUserName,
    filter,
    fromSearchQuery,
    hasVehicle,
    hasDriverContactMethod,
    isAuthSubmitting,
    isVehicleLoading,
    loading,
    mainTab,
    mode,
    myPosts,
    notice,
    routeDraft,
    savedPostKeys,
    savedPosts,
    toSearchQuery,
    savedVehicle,
    vehicleDraft,
    visiblePosts,

    handleModeChange,
    handleSignOut,
    handleSubmitAuth,
    postRoute,
    removeRoute,
    saveVehicle,
    setAuthEmail,
    setAuthEntryMethod,
    setAuthMode,
    setAuthPassword,
    setAuthDisplayName,
    setFilter,
    setFromSearchQuery,
    setMainTab,
    setNotice,
    setRouteDraft,
    setToSearchQuery,
    setVehicleDraft,
    toggleSavedPost,
    saveRouteQuickSettings,
    withdrawAccount,

    isSupabaseConfigured,
  };
}

export type RoadmateAppState = ReturnType<typeof useRoadmateAppState>;
