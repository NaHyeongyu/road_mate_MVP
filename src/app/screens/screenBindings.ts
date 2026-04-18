import type { AppColors } from "../../brandTheme";
import { isSocialAuthEnabled } from "../../features/auth/config";
import type { AuthEmailScreenProps } from "../../features/auth/screens/AuthEmailScreen";
import type { AuthOptionsScreenProps } from "../../features/auth/screens/AuthOptionsScreen";
import type { CommunityHomeScreenProps } from "../../features/community/screens/CommunityHomeScreen";
import type { AppStyles } from "../../ui/types";
import type { RoadmateAppState } from "../useRoadmateAppState";

type AuthOptionsBindingsArgs = {
  appState: RoadmateAppState;
  styles: AppStyles;
  logoSource: unknown;
};

type AuthEmailBindingsArgs = {
  appState: RoadmateAppState;
  colors: AppColors;
  styles: AppStyles;
};

type CommunityBindingsArgs = {
  appState: RoadmateAppState;
  colors: AppColors;
  styles: AppStyles;
};

function clearNotice(appState: RoadmateAppState) {
  appState.setNotice({ tone: "info", text: "" });
}

export function buildAuthOptionsScreenProps({
  appState,
  styles,
  logoSource,
}: AuthOptionsBindingsArgs): AuthOptionsScreenProps {
  return {
    logoSource,
    styles,
    notice: appState.notice,
    isSocialAuthEnabled,
    oauthProviderPending: appState.oauthProviderPending,
    onPressEmail: () => {
      clearNotice(appState);
      appState.setAuthEntryMethod("email");
    },
    onPressGoogle: () => void appState.handleOAuthSignIn("google"),
    onPressApple: () => void appState.handleOAuthSignIn("apple"),
    onPressFacebook: () => void appState.handleOAuthSignIn("facebook"),
    onPressKakao: () => void appState.handleOAuthSignIn("kakao"),
  };
}

export function buildAuthEmailScreenProps({
  appState,
  colors,
  styles,
}: AuthEmailBindingsArgs): AuthEmailScreenProps {
  return {
    colors,
    styles,
    authMode: appState.authMode,
    authEmail: appState.authEmail,
    authPassword: appState.authPassword,
    isAuthSubmitting: appState.isAuthSubmitting,
    notice: appState.notice,
    onBack: () => {
      clearNotice(appState);
      appState.setAuthEntryMethod("options");
    },
    onChangeAuthMode: appState.setAuthMode,
    onChangeEmail: appState.setAuthEmail,
    onChangePassword: appState.setAuthPassword,
    onSubmit: appState.handleSubmitAuth,
  };
}

export function buildCommunityHomeScreenProps({
  appState,
  colors,
  styles,
}: CommunityBindingsArgs): CommunityHomeScreenProps {
  return {
    colors,
    styles,
    notice: appState.notice,
    currentUserId: appState.currentUserId,
    currentUserName: appState.currentUserName,
    currentUserEmail: appState.currentUserEmail,
    isAuthenticated: appState.isAuthenticated,
    mainTab: appState.mainTab,
    mode: appState.mode,
    filter: appState.filter,
    stateFilter: appState.stateFilter,
    fromSearchQuery: appState.fromSearchQuery,
    toSearchQuery: appState.toSearchQuery,
    visiblePosts: appState.visiblePosts,
    myPosts: appState.myPosts,
    savedPosts: appState.savedPosts,
    savedPostKeys: appState.savedPostKeys,
    vehicleDraft: appState.vehicleDraft,
    savedVehicle: appState.savedVehicle,
    hasDriverContactMethod: appState.hasDriverContactMethod,
    routeDraft: appState.routeDraft,
    hasVehicle: appState.hasVehicle,
    onSignOut: appState.handleSignOut,
    onWithdrawAccount: appState.withdrawAccount,
    onRequestAuth: () => appState.openEmailAuthGate("Account access"),
    onMainTabChange: appState.setMainTab,
    onModeChange: appState.handleModeChange,
    onFilterChange: appState.setFilter,
    onStateFilterChange: appState.setStateFilter,
    onFromSearchQueryChange: appState.setFromSearchQuery,
    onToSearchQueryChange: appState.setToSearchQuery,
    onVehicleDraftChange: appState.setVehicleDraft,
    onSaveVehicle: appState.saveVehicle,
    onRouteDraftChange: appState.setRouteDraft,
    onPostRoute: appState.postRoute,
    onSaveRouteQuickSettings: appState.saveRouteQuickSettings,
    onRemoveRoute: appState.removeRoute,
    onToggleSavedPost: appState.toggleSavedPost,
    isRiderSearchResultsPageVisible: appState.isRiderSearchResultsPageVisible,
    canLoadMoreRiderSearchResults: appState.canLoadMoreRiderSearchResults,
    onOpenRiderSearchResultsPage: appState.openRiderSearchResultsPage,
    onCloseRiderSearchResultsPage: appState.closeRiderSearchResultsPage,
    onLoadMoreRiderSearchResults: appState.loadMoreRiderSearchResults,
  };
}
