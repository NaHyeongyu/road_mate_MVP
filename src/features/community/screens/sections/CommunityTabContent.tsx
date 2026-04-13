import type { AppNotice } from "../../../../app/types";
import type { AppColors } from "../../../../brandTheme";
import type { RouteDraft, RouteKind, RoutePost, VehicleInfo } from "../../../../model";
import type { AppStyles } from "../../../../ui/types";
import type { MainTab, Mode } from "../../types";
import { HomeTabSection } from "./HomeTabSection";
import { MyPageTabSection } from "./MyPageTabSection";
import { SavedTabSection } from "./SavedTabSection";

type CommunityTabContentProps = {
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
  onOpenDriverRegistrationPage: () => void;
  onRemoveRoute: (id: string) => void;
  onToggleSavedPost: (post: RoutePost) => void;
};

export function CommunityTabContent({
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
  onFilterChange,
  onFromSearchQueryChange,
  onToSearchQueryChange,
  onVehicleDraftChange,
  onSaveVehicle,
  onRouteDraftChange,
  onPostRoute,
  onSaveRouteQuickSettings,
  onOpenDriverRegistrationPage,
  onRemoveRoute,
  onToggleSavedPost,
}: CommunityTabContentProps) {
  const isRiderMode = mode === "rider";
  const shouldRenderHomeTab = mainTab === "home" || (mode === "driver" && mainTab === "saved");
  const driverRouteKind = mode === "driver" && mainTab === "saved" ? "one_time" : "regular";
  const homeTabProps = {
    colors,
    styles,
    notice,
    mode,
    filter,
    fromSearchQuery,
    toSearchQuery,
    visiblePosts,
    myPosts,
    savedPostKeys,
    routeDraft,
    hasDriverContactMethod,
    currentUserId,
    driverRouteKind,
    onFilterChange,
    onFromSearchQueryChange,
    onToSearchQueryChange,
    onRouteDraftChange,
    onSaveRouteQuickSettings,
    onOpenDriverRegistrationPage,
    onToggleSavedPost,
  } as const;

  if (shouldRenderHomeTab) {
    return <HomeTabSection {...homeTabProps} />;
  }

  if (mainTab === "saved") {
    return (
      <SavedTabSection
        styles={styles}
        notice={notice}
        isRiderMode={isRiderMode}
        savedPosts={savedPosts}
        currentUserId={currentUserId}
        savedPostKeys={savedPostKeys}
        onToggleSavedPost={onToggleSavedPost}
      />
    );
  }

  return (
    <MyPageTabSection
      colors={colors}
      styles={styles}
      currentUserName={currentUserName}
      currentUserEmail={currentUserEmail}
      mode={mode}
      myPostsCount={myPosts.length}
      hasVehicle={hasVehicle}
      vehicleDraft={vehicleDraft}
      savedVehicle={savedVehicle}
      onVehicleDraftChange={onVehicleDraftChange}
      onSaveVehicle={onSaveVehicle}
      onSignOut={onSignOut}
      onWithdrawAccount={onWithdrawAccount}
    />
  );
}
