import { useEffect, useMemo, useState } from "react";
import { ScrollView, StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AppNotice } from "../../../app/types";
import type { AppColors } from "../../../brandTheme";
import type { RouteDraft, RouteKind, RoutePost, VehicleInfo } from "../../../model";
import { APP_BAR_BG } from "../../../ui/styleFragments/layout/constants";
import type { AppStyles } from "../../../ui/types";
import { isRouteDateValue, isRouteTimeValue } from "../utils/routeForm";
import { NoticeBanner } from "../../shared/components/NoticeBanner";
import { ScreenHeader } from "../../shared/components/ScreenHeader";
import type { MainTab, Mode } from "../types";
import { RoleModeToggle } from "../components/RoleModeToggle";
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

const isRouteDraftReady = (routeDraft: RouteDraft, hasDriverContactMethod: boolean) => {
  if (routeDraft.kind === "one_time") {
    const hasReturnTime =
      routeDraft.oneTimeTripType !== "round_trip" || isRouteTimeValue(routeDraft.returnSchedule);

    return Boolean(
      isRouteDateValue(routeDraft.noticeDate) &&
      routeDraft.from.trim() &&
      routeDraft.to.trim() &&
      isRouteTimeValue(routeDraft.schedule) &&
      hasReturnTime
    );
  }

  const hasContactMethod = Boolean(
    hasDriverContactMethod || routeDraft.contactPhone.trim() || routeDraft.contactLink.trim()
  );
  const hasCoreRouteInfo = Boolean(
    routeDraft.from.trim() &&
      routeDraft.to.trim() &&
      isRouteTimeValue(routeDraft.schedule) &&
      isRouteTimeValue(routeDraft.returnSchedule)
  );

  return hasContactMethod && hasCoreRouteInfo;
};

const hasRouteDraftInput = (routeDraft: RouteDraft) =>
  Boolean(
    routeDraft.noticeDate.trim() ||
    routeDraft.from.trim() ||
      routeDraft.to.trim() ||
      routeDraft.schedule.trim() ||
      routeDraft.returnSchedule.trim() ||
      routeDraft.contactPhone.trim() ||
      routeDraft.contactLink.trim() ||
      routeDraft.note.trim()
  );

const toDraftFromPost = (post: RoutePost): RouteDraft => ({
  kind: post.kind,
  oneTimeTripType:
    post.kind === "one_time"
      ? post.oneTimeTripType ?? (post.returnSchedule ? "round_trip" : "one_way")
      : "round_trip",
  noticeDate: post.noticeDate ?? "",
  from: post.from,
  to: post.to,
  schedule: post.schedule,
  returnSchedule: post.returnSchedule ?? "",
  availableSeats: String(post.availableSeats),
  operatingDays: post.operatingDays,
  contactPhone: post.contactPhone ?? "",
  contactLink: post.contactLink ?? "",
  note: post.note,
  isPublic: post.isPublic,
});

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
  const [isDriverRegistrationPageOpen, setIsDriverRegistrationPageOpen] = useState(false);
  const activeDriverRouteKind = mode === "driver" && mainTab === "saved" ? "one_time" : "regular";
  const myPostsForActiveKind = useMemo(
    () => myPosts.filter((post) => post.kind === activeDriverRouteKind),
    [activeDriverRouteKind, myPosts]
  );
  const latestRegisteredPost = myPostsForActiveKind[0] ?? null;
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

  if (isDriverRegistrationPageOpen && mode === "driver") {
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
            onLeftActionPress={() => setIsDriverRegistrationPageOpen(false)}
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
          onFromSearchQueryChange={onFromSearchQueryChange}
          onToSearchQueryChange={onToSearchQueryChange}
          onVehicleDraftChange={onVehicleDraftChange}
          onSaveVehicle={onSaveVehicle}
          onRouteDraftChange={onRouteDraftChange}
          onPostRoute={onPostRoute}
          onSaveRouteQuickSettings={onSaveRouteQuickSettings}
          onOpenDriverRegistrationPage={() => setIsDriverRegistrationPageOpen(true)}
          onRemoveRoute={onRemoveRoute}
          onToggleSavedPost={onToggleSavedPost}
        />
      </ScrollView>

      <CommunityBottomBar
        colors={colors}
        styles={styles}
        mainTab={mainTab}
        isRiderMode={isRiderMode}
        bottomInset={bottomInset}
        onMainTabChange={onMainTabChange}
      />
    </View>
  );
}
