import { useCallback, useMemo } from "react";
import { deriveDisplayName } from "../features/auth/utils/authHelpers";
import { useAuthFlow } from "../features/auth/hooks/useAuthFlow";
import { useCommunityActions } from "../features/community/hooks/useCommunityActions";
import { useCommunityCollections } from "../features/community/hooks/useCommunityCollections";
import { useCommunityUiState } from "../features/community/hooks/useCommunityUiState";
import { useUserCommunityStorageState } from "../features/community/hooks/useUserCommunityStorageState";
import type { FetchRoutePostsQuery } from "../features/community/data/routePostRepository";
import { isSupabaseConfigured } from "../lib/supabase";
import { useDriverRouteDraftState } from "./hooks/useDriverRouteDraftState";
import { useSavedPostKeysCleanup } from "./hooks/useSavedPostKeysCleanup";
import { useSessionState } from "./hooks/useSessionState";
import { useStoredPostsState } from "./hooks/useStoredPostsState";

export function useRoadmateAppState() {
  const {
    mode,
    setMode,
    filter,
    setFilter,
    stateFilter,
    setStateFilter,
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
  const isRiderSearchReady = Boolean(
    (fromSearchQuery.trim() && toSearchQuery.trim()) || stateFilter !== "ALL"
  );
  const remoteQuery = useMemo<FetchRoutePostsQuery | undefined>(() => {
    if (mode !== "rider" || mainTab !== "home" || !isRiderSearchReady) {
      return undefined;
    }

    return {
      kind: filter,
      stateFilter,
      fromQuery: fromSearchQuery,
      toQuery: toSearchQuery,
    };
  }, [filter, fromSearchQuery, isRiderSearchReady, mainTab, mode, stateFilter, toSearchQuery]);
  const shouldSyncRemotePosts = mode === "driver" || isRiderSearchReady;
  const { storedPosts, isPostsLoading, persistPosts } = useStoredPostsState({
    currentUserId,
    shouldSyncRemotePosts,
    remoteQuery,
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
  const { routeDraft, setRouteDraft } = useDriverRouteDraftState({
    mode,
    mainTab,
    regularRouteDraft,
    oneTimeRouteDraft,
    setRegularRouteDraft,
    setOneTimeRouteDraft,
  });

  const { myPosts, savedPostKeySet, savedPosts, visiblePosts } = useCommunityCollections({
    currentUserId,
    filter,
    stateFilter,
    fromSearchQuery,
    toSearchQuery,
    storedPosts,
    savedPostKeys,
  });

  useSavedPostKeysCleanup({
    currentUserId,
    savedPostKeys,
    storedPosts,
    persistSavedPostKeys,
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
    setStateFilter,
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
    handleOAuthSignIn,
    handleSignOut,
    oauthProviderPending,
  } = useAuthFlow({
    onNotice: setNotice,
    onResetSignedInExperience: resetSignedInExperience,
  });

  const isAuthenticated = Boolean(currentUserId);

  const openEmailAuthGate = useCallback(
    (reason: string) => {
      setAuthMode("signUp");
      setAuthEntryMethod("email");
      setNotice({
        tone: "info",
        text: `${reason} requires an account. Verify your email and set a password to continue.`,
      });
    },
    [setAuthEntryMethod, setAuthMode, setNotice]
  );

  const ensureAuthenticated = useCallback(
    (reason: string) => {
      if (isAuthenticated) {
        return true;
      }
      openEmailAuthGate(reason);
      return false;
    },
    [isAuthenticated, openEmailAuthGate]
  );

  const handleSaveVehicle = useCallback(() => {
    if (!ensureAuthenticated("Driver registration")) {
      return;
    }
    void saveVehicle();
  }, [ensureAuthenticated, saveVehicle]);

  const handlePostRoute = useCallback(async () => {
    if (!ensureAuthenticated("Route posting")) {
      return false;
    }
    return postRoute();
  }, [ensureAuthenticated, postRoute]);

  const handleToggleSavedPost = useCallback(
    (post: Parameters<typeof toggleSavedPost>[0]) => {
      if (!ensureAuthenticated("Saving rides")) {
        return;
      }
      void toggleSavedPost(post);
    },
    [ensureAuthenticated, toggleSavedPost]
  );

  const handleSaveRouteQuickSettings = useCallback(
    async (input: Parameters<typeof saveRouteQuickSettings>[0]) => {
      if (!ensureAuthenticated("Updating route settings")) {
        return;
      }
      await saveRouteQuickSettings(input);
    },
    [ensureAuthenticated, saveRouteQuickSettings]
  );

  const handleModeChangeWithAuth = useCallback(
    (nextMode: Parameters<typeof handleModeChange>[0]) => {
      if (nextMode === "driver" && !ensureAuthenticated("Driver mode")) {
        return;
      }
      handleModeChange(nextMode);
    },
    [ensureAuthenticated, handleModeChange]
  );

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
    isAuthenticated,
    filter,
    stateFilter,
    fromSearchQuery,
    hasVehicle,
    hasDriverContactMethod,
    isAuthSubmitting,
    oauthProviderPending,
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

    handleModeChange: handleModeChangeWithAuth,
    handleSignOut,
    openEmailAuthGate,
    handleSubmitAuth,
    handleOAuthSignIn,
    postRoute: handlePostRoute,
    removeRoute,
    saveVehicle: handleSaveVehicle,
    setAuthEmail,
    setAuthEntryMethod,
    setAuthMode,
    setAuthPassword,
    setAuthDisplayName,
    setFilter,
    setStateFilter,
    setFromSearchQuery,
    setMainTab,
    setNotice,
    setRouteDraft,
    setToSearchQuery,
    setVehicleDraft,
    toggleSavedPost: handleToggleSavedPost,
    saveRouteQuickSettings: handleSaveRouteQuickSettings,
    withdrawAccount,

    isSupabaseConfigured,
  };
}

export type RoadmateAppState = ReturnType<typeof useRoadmateAppState>;
