import type { AppColors } from "../../brandTheme";
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
    onPressEmail: () => {
      clearNotice(appState);
      appState.setAuthEntryMethod("email");
    },
    onPressGoogle: () => {
      appState.setNotice({
        tone: "info",
        text: "Google sign-in will be connected in the next step.",
      });
    },
    onPressApple: () => {
      appState.setNotice({
        tone: "info",
        text: "Apple sign-in will be connected in the next step.",
      });
    },
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
    authDisplayName: appState.authDisplayName,
    authEmail: appState.authEmail,
    authPassword: appState.authPassword,
    isAuthSubmitting: appState.isAuthSubmitting,
    notice: appState.notice,
    onBack: () => {
      clearNotice(appState);
      appState.setAuthEntryMethod("options");
    },
    onChangeAuthMode: appState.setAuthMode,
    onChangeDisplayName: appState.setAuthDisplayName,
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
    mainTab: appState.mainTab,
    mode: appState.mode,
    filter: appState.filter,
    fromSearchQuery: appState.fromSearchQuery,
    toSearchQuery: appState.toSearchQuery,
    visiblePosts: appState.visiblePosts,
    myPosts: appState.myPosts,
    savedPosts: appState.savedPosts,
    savedPostKeys: appState.savedPostKeys,
    vehicleDraft: appState.vehicleDraft,
    savedVehicle: appState.savedVehicle,
    routeDraft: appState.routeDraft,
    hasVehicle: appState.hasVehicle,
    onSignOut: appState.handleSignOut,
    onWithdrawAccount: appState.withdrawAccount,
    onMainTabChange: appState.setMainTab,
    onModeChange: appState.handleModeChange,
    onFilterChange: appState.setFilter,
    onFromSearchQueryChange: appState.setFromSearchQuery,
    onToSearchQueryChange: appState.setToSearchQuery,
    onVehicleDraftChange: appState.setVehicleDraft,
    onSaveVehicle: appState.saveVehicle,
    onRouteDraftChange: appState.setRouteDraft,
    onPostRoute: appState.postRoute,
    onSaveRouteQuickSettings: appState.saveRouteQuickSettings,
    onRemoveRoute: appState.removeRoute,
    onToggleSavedPost: appState.toggleSavedPost,
  };
}
