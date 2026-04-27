import { useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AppThemeMode } from "../../../app/theme";
import { isDarkAppColors, type AppColors } from "../../../brandTheme";
import { useAppCopy } from "../../../i18n/AppI18nContext";
import type { RouteDraft, RouteKind, RoutePost, VehicleInfo } from "../../../model";
import type { AppStyles } from "../../../ui/types";
import { useAppViewport } from "../../../ui/viewport";
import { ScreenHeader } from "../../shared/components/ScreenHeader";
import { AnimatedEntrance } from "../../shared/components/AnimatedEntrance";
import { BottomBannerAd } from "../../ads/components/BottomBannerAd";
import type { MainTab, Mode, StateFilter } from "../types";
import { RoleModeToggle } from "../components/RoleModeToggle";
import { RoutePostDetailPage } from "../components/RoutePostDetailPage";
import { getPostSaveKey } from "../utils/storage";
import { useDriverRegistrationPageState } from "./useDriverRegistrationPageState";
import { CommunityBottomBar } from "./sections/CommunityBottomBar";
import { CommunityTabContent } from "./sections/CommunityTabContent";
import { SettingsTabSection } from "./sections/SettingsTabSection";
import { DriverRouteComposerSection } from "./sections/home/DriverRouteComposerSection";
import { PreviousNoticesPage } from "./sections/home/PreviousNoticesPage";
import type { PreviousNoticesPeriod } from "./sections/home/useDriverHomeOverviewState";

export type CommunityHomeScreenProps = {
  colors: AppColors;
  styles: AppStyles;
  currentUserId: string;
  currentUserName: string;
  currentUserEmail: string;
  appThemeMode: AppThemeMode;
  isAuthenticated: boolean;
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
  onRequestAuth: () => void;
  onAppThemeModeChange: (mode: AppThemeMode) => void;
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
  isRiderSearchResultsPageVisible: boolean;
  canLoadMoreRiderSearchResults: boolean;
  onOpenRiderSearchResultsPage: () => void;
  onCloseRiderSearchResultsPage: () => void;
  onLoadMoreRiderSearchResults: () => void;
};

export function CommunityHomeScreen({
  colors,
  styles,
  currentUserId,
  currentUserName,
  currentUserEmail,
  appThemeMode,
  isAuthenticated,
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
  onRequestAuth,
  onAppThemeModeChange,
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
  isRiderSearchResultsPageVisible,
  canLoadMoreRiderSearchResults,
  onOpenRiderSearchResultsPage,
  onCloseRiderSearchResultsPage,
  onLoadMoreRiderSearchResults,
}: CommunityHomeScreenProps) {
  const copy = useAppCopy();
  const insets = useSafeAreaInsets();
  const { width } = useAppViewport();
  const bottomInset = Math.max(insets.bottom, 8);
  const isCompactLayout = width < 390;
  const isRiderMode = mode === "rider";
  const statusBarStyle = isDarkAppColors(colors) ? "light-content" : "dark-content";
  const isSearchDetailScreen =
    isRiderMode && mainTab === "home" && isRiderSearchResultsPageVisible;
  const [isSettingsPageVisible, setIsSettingsPageVisible] = useState(false);
  const [isPreviousNoticesPageVisible, setIsPreviousNoticesPageVisible] = useState(false);
  const [previousNoticesPeriod, setPreviousNoticesPeriod] =
    useState<PreviousNoticesPeriod>("all");
  const [selectedDetailPostSnapshot, setSelectedDetailPostSnapshot] = useState<RoutePost | null>(null);
  const scrollContentStyle = [
    styles.screenContent,
    isCompactLayout
      ? {
          paddingHorizontal: 14,
          paddingTop: 12,
          paddingBottom: 28,
          gap: 12,
        }
      : null,
  ];
  const {
    isDriverRegistrationPageVisible,
    activeDriverRouteKind,
    activeRegisteredPost,
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
  const selectedDetailPost = useMemo(() => {
    if (!selectedDetailPostSnapshot) {
      return null;
    }

    return (
      [...visiblePosts, ...myPosts, ...savedPosts].find(
        (post) => post.id === selectedDetailPostSnapshot.id
      ) ?? selectedDetailPostSnapshot
    );
  }, [myPosts, savedPosts, selectedDetailPostSnapshot, visiblePosts]);
  const isSelectedDetailPostSaved = selectedDetailPost
    ? savedPostKeys.includes(getPostSaveKey(selectedDetailPost))
    : false;
  const isSelectedDetailPostOwned = selectedDetailPost?.ownerUserId === currentUserId;

  useEffect(() => {
    if (!isRiderMode || mainTab !== "home") {
      onCloseRiderSearchResultsPage();
    }
  }, [isRiderMode, mainTab, onCloseRiderSearchResultsPage]);

  useEffect(() => {
    if (mainTab !== "mypage") {
      setIsSettingsPageVisible(false);
    }
  }, [mainTab]);

  useEffect(() => {
    if (mode !== "driver" || mainTab !== "saved") {
      setIsPreviousNoticesPageVisible(false);
    }
  }, [mainTab, mode]);

  if (selectedDetailPost) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle={statusBarStyle} backgroundColor={colors.appBarBg} translucent={false} />
        <View
          style={[
            styles.headerDock,
            {
              paddingTop: insets.top + 6,
            },
            isCompactLayout
              ? {
                  paddingHorizontal: 14,
                }
              : null,
          ]}
        >
          <ScreenHeader
            title={copy.common.rideDetails}
            leftActionType="back"
            leftActionLabel={copy.common.back}
            onLeftActionPress={() => setSelectedDetailPostSnapshot(null)}
            styles={styles}
          />
        </View>

        <ScrollView
          style={styles.screenScroll}
          contentContainerStyle={scrollContentStyle}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
        >
          <AnimatedEntrance delay={70} resetKey={selectedDetailPost.id}>
            <RoutePostDetailPage
              post={selectedDetailPost}
              styles={styles}
              isOwnedByCurrentUser={isSelectedDetailPostOwned}
              isSaved={isSelectedDetailPostSaved}
              onToggleSave={
                !isSelectedDetailPostOwned
                  ? () => onToggleSavedPost(selectedDetailPost)
                  : undefined
              }
            />
          </AnimatedEntrance>
        </ScrollView>

        <BottomBannerAd bottomInset={bottomInset} />
      </View>
    );
  }

  if (isDriverRegistrationPageVisible) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle={statusBarStyle} backgroundColor={colors.appBarBg} translucent={false} />
        <View
          style={[
            styles.headerDock,
            {
              paddingTop: insets.top + 6,
            },
            isCompactLayout
              ? {
                  paddingHorizontal: 14,
                }
              : null,
          ]}
        >
          <ScreenHeader
            title={
              activeDriverRouteKind === "regular"
                ? copy.community.regularRegistration
                : copy.community.oneTimeRegistration
            }
            leftActionType="back"
            leftActionLabel={copy.common.back}
            onLeftActionPress={closeDriverRegistrationPage}
            styles={styles}
          />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            style={styles.screenScroll}
            contentContainerStyle={scrollContentStyle}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
          >
            <AnimatedEntrance delay={90} resetKey={activeDriverRouteKind}>
              <DriverRouteComposerSection
                colors={colors}
                styles={styles}
                activeRouteKind={activeDriverRouteKind}
                activeRegisteredPost={activeRegisteredPost}
                routeDraft={activeRouteDraft}
                hasVehicle={hasVehicle}
                showVehicleSetup={!hasVehicle}
                vehicleDraft={vehicleDraft}
                savedVehicle={savedVehicle}
                onVehicleDraftChange={onVehicleDraftChange}
                onSaveVehicle={onSaveVehicle}
                onRouteDraftChange={onRouteDraftChange}
                onPostRoute={handleSaveRouteRegistration}
                onRemoveRoute={onRemoveRoute}
              />
            </AnimatedEntrance>
          </ScrollView>
        </KeyboardAvoidingView>

        <BottomBannerAd bottomInset={bottomInset} />
      </View>
    );
  }

  if (isSettingsPageVisible) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle={statusBarStyle} backgroundColor={colors.appBarBg} translucent={false} />
        <View
          style={[
            styles.headerDock,
            {
              paddingTop: insets.top + 6,
            },
            isCompactLayout
              ? {
                  paddingHorizontal: 14,
                }
              : null,
          ]}
        >
          <ScreenHeader
            title={copy.common.settings}
            leftActionType="back"
            leftActionLabel={copy.common.back}
            onLeftActionPress={() => setIsSettingsPageVisible(false)}
            styles={styles}
          />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            style={styles.screenScroll}
            contentContainerStyle={scrollContentStyle}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
          >
            <AnimatedEntrance delay={90}>
              <SettingsTabSection
                colors={colors}
                styles={styles}
                isAuthenticated={isAuthenticated}
                currentUserId={currentUserId}
                currentUserEmail={currentUserEmail}
                appThemeMode={appThemeMode}
                onSignOut={onSignOut}
                onWithdrawAccount={onWithdrawAccount}
                onRequestAuth={onRequestAuth}
                onAppThemeModeChange={onAppThemeModeChange}
              />
            </AnimatedEntrance>
          </ScrollView>
        </KeyboardAvoidingView>

        <BottomBannerAd bottomInset={bottomInset} />
      </View>
    );
  }

  if (isPreviousNoticesPageVisible) {
    return (
      <View style={styles.screen}>
        <StatusBar barStyle={statusBarStyle} backgroundColor={colors.appBarBg} translucent={false} />
        <View
          style={[
            styles.headerDock,
            {
              paddingTop: insets.top + 6,
            },
            isCompactLayout
              ? {
                  paddingHorizontal: 14,
                }
              : null,
          ]}
        >
          <ScreenHeader
            title={copy.community.previousNotices}
            leftActionType="back"
            leftActionLabel={copy.common.back}
            onLeftActionPress={() => setIsPreviousNoticesPageVisible(false)}
            styles={styles}
          />
        </View>

        <ScrollView
          style={styles.screenScroll}
          contentContainerStyle={scrollContentStyle}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
        >
          <AnimatedEntrance delay={90} resetKey={`previous-notices-${previousNoticesPeriod}`}>
            <PreviousNoticesPage
              styles={styles}
              posts={myPosts}
              period={previousNoticesPeriod}
              onPeriodChange={setPreviousNoticesPeriod}
              onOpenRouteDetailPage={setSelectedDetailPostSnapshot}
            />
          </AnimatedEntrance>
        </ScrollView>

        <BottomBannerAd bottomInset={bottomInset} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={colors.panelAlt} translucent={false} />
      {isSearchDetailScreen ? (
        <View
          style={[
            styles.headerDock,
            {
              paddingTop: insets.top + 6,
            },
            isCompactLayout
              ? {
                  paddingHorizontal: 14,
                }
              : null,
          ]}
        >
          <ScreenHeader
            title={copy.common.searchResults}
            leftActionType="back"
            leftActionLabel={copy.common.back}
            onLeftActionPress={onCloseRiderSearchResultsPage}
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
            isCompactLayout
              ? {
                  paddingBottom: 4,
                }
              : null,
          ]}
        >
          <RoleModeToggle mode={mode} onChangeMode={onModeChange} styles={styles} />
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.screenScroll}
          contentContainerStyle={scrollContentStyle}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
        >
          <CommunityTabContent
            colors={colors}
            styles={styles}
            currentUserId={currentUserId}
            currentUserName={currentUserName}
            currentUserEmail={currentUserEmail}
            isAuthenticated={isAuthenticated}
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
            onRequestAuth={onRequestAuth}
            onOpenSettingsPage={() => setIsSettingsPageVisible(true)}
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
            onOpenRouteDetailPage={setSelectedDetailPostSnapshot}
            onOpenPreviousNoticesPage={() => setIsPreviousNoticesPageVisible(true)}
            onRemoveRoute={onRemoveRoute}
            onToggleSavedPost={onToggleSavedPost}
            isRiderSearchResultsPageVisible={isRiderSearchResultsPageVisible}
            canLoadMoreRiderSearchResults={canLoadMoreRiderSearchResults}
            onOpenRiderSearchResultsPage={onOpenRiderSearchResultsPage}
            onLoadMoreRiderSearchResults={onLoadMoreRiderSearchResults}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomBannerAd bottomInset={isSearchDetailScreen ? bottomInset : 0} />

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
