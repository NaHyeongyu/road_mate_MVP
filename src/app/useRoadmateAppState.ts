import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { deriveDisplayName } from "../features/auth/utils/authHelpers";
import { useAuthFlow } from "../features/auth/hooks/useAuthFlow";
import { useCommunityActions } from "../features/community/hooks/useCommunityActions";
import { useCommunityCollections } from "../features/community/hooks/useCommunityCollections";
import { useCommunityUiState } from "../features/community/hooks/useCommunityUiState";
import { useUserCommunityStorageState } from "../features/community/hooks/useUserCommunityStorageState";
import type { FetchRoutePostsQuery } from "../features/community/data/routePostRepository";
import { getAppCopy } from "../i18n/copy";
import type { AppLanguage } from "../i18n/types";
import { isSupabaseConfigured } from "../lib/supabase";
import { useDriverRouteDraftState } from "./hooks/useDriverRouteDraftState";
import { useSavedPostKeysCleanup } from "./hooks/useSavedPostKeysCleanup";
import { useSessionState } from "./hooks/useSessionState";
import { useStoredPostsState } from "./hooks/useStoredPostsState";

const RIDER_SEARCH_RESULTS_PAGE_SIZE = 40;
const APP_LANGUAGE_STORAGE_KEY = "roadmate_mvp.app_language";
const SUPPORTED_APP_LANGUAGES = ["en", "fr", "ko", "ja", "zh"] as const satisfies readonly AppLanguage[];

function isSupportedAppLanguage(value: string): value is AppLanguage {
  return SUPPORTED_APP_LANGUAGES.includes(value as AppLanguage);
}

function getPreferredAppLanguage(): AppLanguage {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale;
    const normalizedLocale = String(locale ?? "").trim().toLowerCase();
    const languageCode = normalizedLocale.split("-")[0] ?? "";

    if (isSupportedAppLanguage(languageCode)) {
      return languageCode;
    }
  } catch {
    // Fall back to English when locale detection is unavailable.
  }

  return "en";
}

type AccountRequiredReason =
  | "driverRegistration"
  | "routePosting"
  | "savingRides"
  | "updatingRouteSettings"
  | "driverMode"
  | "accountAccess";

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
  const [appLanguage, setAppLanguageState] = useState<AppLanguage>(() => getPreferredAppLanguage());
  const [hasCompletedLanguageSelection, setHasCompletedLanguageSelection] = useState(false);
  const [isAppLanguageLoading, setIsAppLanguageLoading] = useState(true);
  const [isRiderSearchResultsPageVisible, setIsRiderSearchResultsPageVisible] = useState(false);
  const [riderSearchResultsLimit, setRiderSearchResultsLimit] = useState(
    RIDER_SEARCH_RESULTS_PAGE_SIZE
  );
  const copy = useMemo(() => getAppCopy(appLanguage), [appLanguage]);

  useEffect(() => {
    let isMounted = true;

    void (async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem(APP_LANGUAGE_STORAGE_KEY);
        if (isMounted && storedLanguage && isSupportedAppLanguage(storedLanguage)) {
          setAppLanguageState(storedLanguage);
          setHasCompletedLanguageSelection(true);
        }
      } catch {
        // Keep the locale-derived default when stored preference cannot be read.
      } finally {
        if (isMounted) {
          setIsAppLanguageLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const setAppLanguage = useCallback((nextLanguage: AppLanguage) => {
    setAppLanguageState(nextLanguage);
    setHasCompletedLanguageSelection(true);
    void AsyncStorage.setItem(APP_LANGUAGE_STORAGE_KEY, nextLanguage);
  }, []);

  const openRiderSearchResultsPage = useCallback(() => {
    setRiderSearchResultsLimit(RIDER_SEARCH_RESULTS_PAGE_SIZE);
    setIsRiderSearchResultsPageVisible(true);
  }, []);
  const closeRiderSearchResultsPage = useCallback(() => {
    setIsRiderSearchResultsPageVisible(false);
  }, []);
  const loadMoreRiderSearchResults = useCallback(() => {
    setRiderSearchResultsLimit((current) => current + RIDER_SEARCH_RESULTS_PAGE_SIZE);
  }, []);

  const { authSession, isSessionLoading } = useSessionState({
    onLoadError: handleLoadError,
  });
  const currentUser = authSession?.user ?? null;
  const currentUserId = currentUser?.id ?? "";
  const isRiderSearchReady = Boolean(
    (fromSearchQuery.trim() && toSearchQuery.trim()) || stateFilter !== "ALL"
  );
  const remoteQuery = useMemo<FetchRoutePostsQuery | undefined>(() => {
    if (mode === "driver") {
      return currentUserId
        ? {
            ownerUserId: currentUserId,
          }
        : undefined;
    }

    if (
      mode !== "rider" ||
      mainTab !== "home" ||
      !isRiderSearchReady ||
      !isRiderSearchResultsPageVisible
    ) {
      return undefined;
    }

    return {
      kind: filter,
      stateFilter,
      fromQuery: fromSearchQuery,
      toQuery: toSearchQuery,
      limit: riderSearchResultsLimit,
    };
  }, [
    currentUserId,
    filter,
    fromSearchQuery,
    isRiderSearchReady,
    isRiderSearchResultsPageVisible,
    mainTab,
    mode,
    riderSearchResultsLimit,
    stateFilter,
    toSearchQuery,
  ]);
  const shouldSyncRemotePosts = Boolean(remoteQuery);
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
  const loading = isAppLanguageLoading || isSessionLoading || isPostsLoading;
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

  const setModeWithSearchReset = useCallback(
    (nextMode: Parameters<typeof setMode>[0]) => {
      closeRiderSearchResultsPage();
      setMode(nextMode);
    },
    [closeRiderSearchResultsPage, setMode]
  );

  const handleMainTabChange = useCallback(
    (nextTab: Parameters<typeof setMainTab>[0]) => {
      if (nextTab !== "home") {
        closeRiderSearchResultsPage();
      }
      setMainTab(nextTab);
    },
    [closeRiderSearchResultsPage, setMainTab]
  );

  const handleFilterChange = useCallback(
    (nextFilter: Parameters<typeof setFilter>[0]) => {
      closeRiderSearchResultsPage();
      setFilter(nextFilter);
    },
    [closeRiderSearchResultsPage, setFilter]
  );

  const handleStateFilterChange = useCallback(
    (nextStateFilter: Parameters<typeof setStateFilter>[0]) => {
      closeRiderSearchResultsPage();
      setStateFilter(nextStateFilter);
    },
    [closeRiderSearchResultsPage, setStateFilter]
  );

  const handleFromSearchQueryChange = useCallback(
    (value: string) => {
      closeRiderSearchResultsPage();
      setFromSearchQuery(value);
    },
    [closeRiderSearchResultsPage, setFromSearchQuery]
  );

  const handleToSearchQueryChange = useCallback(
    (value: string) => {
      closeRiderSearchResultsPage();
      setToSearchQuery(value);
    },
    [closeRiderSearchResultsPage, setToSearchQuery]
  );

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
    copy,
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
    setMode: setModeWithSearchReset,
    setFilter: handleFilterChange,
    setStateFilter: handleStateFilterChange,
    setMainTab: handleMainTabChange,
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
    authEmail,
    authPassword,
    authPasswordConfirm,
    isAuthSubmitting,
    pendingVerificationEmail,
    isResendingVerification,
    isPasswordRecoveryMode,
    isPasswordResetEmailSending,
    isPasswordResetSubmitting,
    passwordResetEmailStatus,
    passwordResetSentEmail,
    passwordResetEmailCooldownSeconds,
    isPasswordResetReadyToChange,
    isCheckingPasswordResetEmail,
    emailDuplicateCheckStatus,
    isCheckingEmailDuplicate,
    setAuthMode,
    setAuthEntryMethod,
    setAuthEmail,
    setAuthPassword,
    setAuthPasswordConfirm,
    handleSubmitAuth,
    handleCheckEmailDuplicate,
    handleCheckPasswordResetEmail,
    handleOpenPasswordReset,
    handleStartPasswordResetRecovery,
    handleRequestPasswordReset,
    handleCloseEmailAuth,
    handleResendVerificationEmail,
    handleCompletePasswordReset,
    handleOAuthSignIn,
    handleSignOut,
    oauthProviderPending,
  } = useAuthFlow({
    copy,
    onNotice: setNotice,
    onResetSignedInExperience: resetSignedInExperience,
  });

  const isAuthenticated = Boolean(currentUserId);
  const canLoadMoreRiderSearchResults =
    mode === "rider" &&
    isRiderSearchResultsPageVisible &&
    storedPosts.length >= riderSearchResultsLimit;

  useEffect(() => {
    if (mode !== "rider" || mainTab !== "home") {
      setIsRiderSearchResultsPageVisible(false);
    }
  }, [mainTab, mode]);

  useEffect(() => {
    if (isAuthenticated && authEntryMethod !== "options" && !isPasswordRecoveryMode) {
      setAuthEntryMethod("options");
    }
  }, [authEntryMethod, isAuthenticated, isPasswordRecoveryMode, setAuthEntryMethod]);

  const openEmailAuthGate = useCallback(
    (reason: AccountRequiredReason) => {
      setAuthMode("signUp");
      setAuthEntryMethod("email");
      setNotice({
        tone: "info",
        text: copy.notices.accountRequired(copy.reasons[reason]),
      });
    },
    [copy, setAuthEntryMethod, setAuthMode, setNotice]
  );

  const ensureAuthenticated = useCallback(
    (reason: AccountRequiredReason) => {
      if (isAuthenticated) {
        return true;
      }
      openEmailAuthGate(reason);
      return false;
    },
    [isAuthenticated, openEmailAuthGate]
  );

  const handleSaveVehicle = useCallback(() => {
    if (!ensureAuthenticated("driverRegistration")) {
      return;
    }
    void saveVehicle();
  }, [ensureAuthenticated, saveVehicle]);

  const handlePostRoute = useCallback(async () => {
    if (!ensureAuthenticated("routePosting")) {
      return false;
    }
    return postRoute();
  }, [ensureAuthenticated, postRoute]);

  const handleToggleSavedPost = useCallback(
    (post: Parameters<typeof toggleSavedPost>[0]) => {
      if (!ensureAuthenticated("savingRides")) {
        return;
      }
      void toggleSavedPost(post);
    },
    [ensureAuthenticated, toggleSavedPost]
  );

  const handleSaveRouteQuickSettings = useCallback(
    async (input: Parameters<typeof saveRouteQuickSettings>[0]) => {
      if (!ensureAuthenticated("updatingRouteSettings")) {
        return;
      }
      await saveRouteQuickSettings(input);
    },
    [ensureAuthenticated, saveRouteQuickSettings]
  );

  const handleModeChangeWithAuth = useCallback(
    (nextMode: Parameters<typeof handleModeChange>[0]) => {
      if (nextMode === "driver" && !ensureAuthenticated("driverMode")) {
        return;
      }
      closeRiderSearchResultsPage();
      handleModeChange(nextMode);
    },
    [closeRiderSearchResultsPage, ensureAuthenticated, handleModeChange]
  );

  return {
    authEntryMethod,
    authEmail,
    authMode,
    authPassword,
    authPasswordConfirm,
    currentUser,
    currentUserEmail,
    currentUserId,
    currentUserName,
    appLanguage,
    hasCompletedLanguageSelection,
    isAuthenticated,
    filter,
    stateFilter,
    fromSearchQuery,
    hasVehicle,
    hasDriverContactMethod,
    isAuthSubmitting,
    pendingVerificationEmail,
    isResendingVerification,
    isPasswordRecoveryMode,
    isPasswordResetEmailSending,
    isPasswordResetSubmitting,
    passwordResetEmailStatus,
    passwordResetSentEmail,
    passwordResetEmailCooldownSeconds,
    isPasswordResetReadyToChange,
    isCheckingPasswordResetEmail,
    emailDuplicateCheckStatus,
    isCheckingEmailDuplicate,
    oauthProviderPending,
    isVehicleLoading,
    isRiderSearchResultsPageVisible,
    loading,
    canLoadMoreRiderSearchResults,
    copy,
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

    setAppLanguage,
    handleModeChange: handleModeChangeWithAuth,
    openRiderSearchResultsPage,
    closeRiderSearchResultsPage,
    loadMoreRiderSearchResults,
    handleSignOut,
    openEmailAuthGate,
    handleSubmitAuth,
    handleCheckEmailDuplicate,
    handleCheckPasswordResetEmail,
    handleOpenPasswordReset,
    handleStartPasswordResetRecovery,
    handleRequestPasswordReset,
    handleCloseEmailAuth,
    handleResendVerificationEmail,
    handleCompletePasswordReset,
    handleOAuthSignIn,
    postRoute: handlePostRoute,
    removeRoute,
    saveVehicle: handleSaveVehicle,
    setAuthEmail,
    setAuthEntryMethod,
    setAuthMode,
    setAuthPassword,
    setAuthPasswordConfirm,
    setFilter: handleFilterChange,
    setStateFilter: handleStateFilterChange,
    setFromSearchQuery: handleFromSearchQueryChange,
    setMainTab: handleMainTabChange,
    setNotice,
    setRouteDraft,
    setToSearchQuery: handleToSearchQueryChange,
    setVehicleDraft,
    toggleSavedPost: handleToggleSavedPost,
    saveRouteQuickSettings: handleSaveRouteQuickSettings,
    withdrawAccount,

    isSupabaseConfigured,
  };
}

export type RoadmateAppState = ReturnType<typeof useRoadmateAppState>;
