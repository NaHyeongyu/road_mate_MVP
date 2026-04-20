import type { AppColors } from "../../brandTheme";
import type { AuthEmailScreenProps } from "../../features/auth/screens/AuthEmailScreen";
import type { AuthPasswordResetScreenProps } from "../../features/auth/screens/AuthPasswordResetScreen";
import type { CommunityHomeScreenProps } from "../../features/community/screens/CommunityHomeScreen";
import type { AppStyles } from "../../ui/types";
import type { RoadmateAppState } from "../useRoadmateAppState";

type AuthEmailBindingsArgs = {
  appState: RoadmateAppState;
  colors: AppColors;
  styles: AppStyles;
};

type AuthPasswordResetBindingsArgs = {
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
    authPasswordConfirm: appState.authPasswordConfirm,
    isAuthSubmitting: appState.isAuthSubmitting,
    pendingVerificationEmail: appState.pendingVerificationEmail,
    isResendingVerification: appState.isResendingVerification,
    isPasswordRecoveryMode: appState.isPasswordRecoveryMode,
    isPasswordResetEmailSending: appState.isPasswordResetEmailSending,
    isPasswordResetSubmitting: appState.isPasswordResetSubmitting,
    emailDuplicateCheckStatus: appState.emailDuplicateCheckStatus,
    isCheckingEmailDuplicate: appState.isCheckingEmailDuplicate,
    onBack: () => {
      clearNotice(appState);
      appState.handleCloseEmailAuth();
    },
    onChangeAuthMode: appState.setAuthMode,
    onChangeEmail: appState.setAuthEmail,
    onChangePassword: appState.setAuthPassword,
    onChangePasswordConfirm: appState.setAuthPasswordConfirm,
    onSubmit: appState.handleSubmitAuth,
    onCheckEmailDuplicate: appState.handleCheckEmailDuplicate,
    onOpenPasswordResetPage: appState.handleOpenPasswordReset,
    onCompletePasswordReset: appState.handleCompletePasswordReset,
    onResendVerificationEmail: appState.handleResendVerificationEmail,
  };
}

export function buildAuthPasswordResetScreenProps({
  appState,
  colors,
  styles,
}: AuthPasswordResetBindingsArgs): AuthPasswordResetScreenProps {
  return {
    colors,
    styles,
    authEmail: appState.authEmail,
    authPassword: appState.authPassword,
    authPasswordConfirm: appState.authPasswordConfirm,
    isPasswordRecoveryMode: appState.isPasswordRecoveryMode,
    isPasswordResetEmailSending: appState.isPasswordResetEmailSending,
    isPasswordResetSubmitting: appState.isPasswordResetSubmitting,
    passwordResetEmailStatus: appState.passwordResetEmailStatus,
    passwordResetSentEmail: appState.passwordResetSentEmail,
    passwordResetEmailCooldownSeconds: appState.passwordResetEmailCooldownSeconds,
    isPasswordResetReadyToChange: appState.isPasswordResetReadyToChange,
    isCheckingPasswordResetEmail: appState.isCheckingPasswordResetEmail,
    onBack: () => {
      clearNotice(appState);
      appState.handleCloseEmailAuth();
    },
    onChangeEmail: appState.setAuthEmail,
    onChangePassword: appState.setAuthPassword,
    onChangePasswordConfirm: appState.setAuthPasswordConfirm,
    onCheckRegisteredEmail: appState.handleCheckPasswordResetEmail,
    onStartPasswordResetRecovery: appState.handleStartPasswordResetRecovery,
    onSendPasswordResetEmail: appState.handleRequestPasswordReset,
    onCompletePasswordReset: appState.handleCompletePasswordReset,
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
    currentUserId: appState.currentUserId,
    currentUserName: appState.currentUserName,
    currentUserEmail: appState.currentUserEmail,
    appThemeMode: appState.appThemeMode,
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
    onRequestAuth: () => appState.openEmailAuthGate("accountAccess"),
    onAppThemeModeChange: appState.setAppThemeMode,
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
