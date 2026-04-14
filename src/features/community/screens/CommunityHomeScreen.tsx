import { useCallback, useEffect, useState } from "react";
import { ScrollView, StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AppNotice } from "../../../app/types";
import type { AppColors } from "../../../brandTheme";
import type { RouteDraft, RouteKind, RoutePost, VehicleInfo } from "../../../model";
import { APP_BAR_BG } from "../../../ui/styleFragments/layout/constants";
import type { AppStyles } from "../../../ui/types";
import { NoticeBanner } from "../../shared/components/NoticeBanner";
import { ScreenHeader } from "../../shared/components/ScreenHeader";
import type { MainTab, Mode, StateFilter } from "../types";
import { RoleModeToggle } from "../components/RoleModeToggle";
import { useDriverRegistrationPageState } from "./useDriverRegistrationPageState";
import { CommunityBottomBar } from "./sections/CommunityBottomBar";
import { CommunityTabContent } from "./sections/CommunityTabContent";
import { DriverRouteComposerSection } from "./sections/home/DriverRouteComposerSection";

export type CommunityHomeScreenProps = {
  colors: AppColors;
  styles: AppStyles;
  notice: AppNotice;
  currentUserId: string;
  currentUserName: string;
  currentUserEmail: string;
  mainTab: MainTab;
  mode: Mode;
  filter: RouteKind;
  stateFilter: StateFilter;
  fromSearchQuery: string;
  toSearchQuery: string;
  visiblePosts: RoutePost[];
  myPosts: RoutePost[];
  savedPosts: RoutePost[];
  savedPostKeys: string[];
  vehicleDraft: VehicleInfo;
  savedVehicle: VehicleInfo;
  hasDriverContactMethod: boolean;
  routeDraft: RouteDraft;
  hasVehicle: boolean;
  onSignOut: () => void;
  onWithdrawAccount: () => void;
  onMainTabChange: (tab: MainTab) => void;
  onModeChange: (mode: Mode) => void;
  onFilterChange: (filter: RouteKind) => void;
  onStateFilterChange: (value: StateFilter) => void;
  onFromSearchQueryChange: (value: string) => void;
  onToSearchQueryChange: (value: string) => void;
  onVehicleDraftChange: (draft: VehicleInfo) => void;
  onSaveVehicle: () => void;
  onRouteDraftChange: (draft: RouteDraft) => void;
  onPostRoute: () => Promise<boolean>;
  onSaveRouteQuickSettings: (input: {
    kind: RouteKind;
    availableSeats: number;
    isPublic: boolean;
  }) => Promise<void>;
  onRemoveRoute: (id: string) => void;
  onToggleSavedPost: (post: RoutePost) => void;
};

export function CommunityHomeScreen({
  colors,
  styles,
  notice,
  currentUserId,
  currentUserName,
  currentUserEmail,
  mainTab,
  mode,
  filter,
  stateFilter,
  fromSearchQuery,
  toSearchQuery,
  visiblePosts,
  myPosts,
  savedPosts,
  savedPostKeys,
  vehicleDraft,
  savedVehicle,
  hasDriverContactMethod,
  routeDraft,
  hasVehicle,
  onSignOut,
  onWithdrawAccount,
  onMainTabChange,
  onModeChange,
  onFilterChange,
  onStateFilterChange,
  onFromSearchQueryChange,
  onToSearchQueryChange,
  onVehicleDraftChange,
  onSaveVehicle,
  onRouteDraftChange,
  onPostRoute,
  onSaveRouteQuickSettings,
  onRemoveRoute,
  onToggleSavedPost,
}: CommunityHomeScreenProps) {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, 8);
  const isRiderMode = mode === "rider";
  const [isRiderSearchResultsPageVisible, setIsRiderSearchResultsPageVisible] = useState(false);
  const openRiderSearchResultsPage = useCallback(() => {
    setIsRiderSearchResultsPageVisible(true);
  }, []);
  const closeRiderSearchResultsPage = useCallback(() => {
    setIsRiderSearchResultsPageVisible(false);
  }, []);
  const isSearchDetailScreen =
    isRiderMode && mainTab === "home" && isRiderSearchResultsPageVisible;
  const {
    isDriverRegistrationPageVisible,
    activeDriverRouteKind,
    activeRouteDraft,
    openDriverRegistrationPage,
    closeDriverRegistrationPage,
    handleSaveRouteRegistration,
  } = useDriverRegistrationPageState({
    mode,
    mainTab,
    myPosts,
    routeDraft,
    hasDriverContactMethod,
    onRouteDraftChange,
    onPostRoute,
  });

  useEffect(() => {
    if (!isRiderMode || mainTab !== "home") {
      closeRiderSearchResultsPage();
    }
  }, [closeRiderSearchResultsPage, isRiderMode, mainTab]);

  if (isDriverRegistrationPageVisible) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle="dark-content" backgroundColor={APP_BAR_BG} translucent={false} />
        <View
          style={[
            styles.headerDock,
            {
              paddingTop: insets.top + 6,
            },
          ]}
        >
          <ScreenHeader
            title={activeDriverRouteKind === "regular" ? "Regular registration" : "One-time registration"}
            leftActionType="back"
            leftActionLabel="Back"
            onLeftActionPress={closeDriverRegistrationPage}
            styles={styles}
          />
        </View>

        <ScrollView
          style={styles.screenScroll}
          contentContainerStyle={styles.screenContent}
          keyboardShouldPersistTaps="always"
        >
          <NoticeBanner notice={notice} styles={styles} />
          <DriverRouteComposerSection
            colors={colors}
            styles={styles}
            activeRouteKind={activeDriverRouteKind}
            routeDraft={activeRouteDraft}
            hasVehicle={hasVehicle}
            showVehicleSetup={!hasVehicle}
            vehicleDraft={vehicleDraft}
            savedVehicle={savedVehicle}
            onVehicleDraftChange={onVehicleDraftChange}
            onSaveVehicle={onSaveVehicle}
            onRouteDraftChange={onRouteDraftChange}
            onPostRoute={handleSaveRouteRegistration}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.panelAlt} translucent={false} />
      {isSearchDetailScreen ? (
        <View
          style={[
            styles.headerDock,
            {
              paddingTop: insets.top + 6,
            },
          ]}
        >
          <ScreenHeader
            title="Search results"
            leftActionType="back"
            leftActionLabel="Back"
            onLeftActionPress={closeRiderSearchResultsPage}
            styles={styles}
          />
        </View>
      ) : (
        <View
          style={[
            styles.roleToggleTop,
            {
              paddingTop: insets.top + 10,
            },
          ]}
        >
          <RoleModeToggle mode={mode} onChangeMode={onModeChange} styles={styles} />
        </View>
      )}

      <ScrollView
        style={styles.screenScroll}
        contentContainerStyle={styles.screenContent}
        keyboardShouldPersistTaps="always"
      >
        <CommunityTabContent
          colors={colors}
          styles={styles}
          notice={notice}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          currentUserEmail={currentUserEmail}
          mainTab={mainTab}
          mode={mode}
          filter={filter}
          stateFilter={stateFilter}
          fromSearchQuery={fromSearchQuery}
          toSearchQuery={toSearchQuery}
          visiblePosts={visiblePosts}
          myPosts={myPosts}
          savedPosts={savedPosts}
          savedPostKeys={savedPostKeys}
          vehicleDraft={vehicleDraft}
          savedVehicle={savedVehicle}
          hasDriverContactMethod={hasDriverContactMethod}
          routeDraft={routeDraft}
          hasVehicle={hasVehicle}
          onSignOut={onSignOut}
          onWithdrawAccount={onWithdrawAccount}
          onFilterChange={onFilterChange}
          onStateFilterChange={onStateFilterChange}
          onFromSearchQueryChange={onFromSearchQueryChange}
          onToSearchQueryChange={onToSearchQueryChange}
          onVehicleDraftChange={onVehicleDraftChange}
          onSaveVehicle={onSaveVehicle}
          onRouteDraftChange={onRouteDraftChange}
          onPostRoute={onPostRoute}
          onSaveRouteQuickSettings={onSaveRouteQuickSettings}
          onOpenDriverRegistrationPage={openDriverRegistrationPage}
          onRemoveRoute={onRemoveRoute}
          onToggleSavedPost={onToggleSavedPost}
          isRiderSearchResultsPageVisible={isRiderSearchResultsPageVisible}
          onOpenRiderSearchResultsPage={openRiderSearchResultsPage}
          onCloseRiderSearchResultsPage={closeRiderSearchResultsPage}
        />
      </ScrollView>

      {!isSearchDetailScreen ? (
        <CommunityBottomBar
          colors={colors}
          styles={styles}
          mainTab={mainTab}
          isRiderMode={isRiderMode}
          bottomInset={bottomInset}
          onMainTabChange={onMainTabChange}
        />
      ) : null}
    </View>
  );
}
