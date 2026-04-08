import type { AppNotice } from "../../../../app/types";
import type { AppColors } from "../../../../brandTheme";
import type { RouteDraft, RouteKind, RoutePost } from "../../../../model";
import type { AppStyles } from "../../../../ui/types";
import { NoticeBanner } from "../../../shared/components/NoticeBanner";
import type { Mode } from "../../types";
import { DriverHomeSection } from "./home/DriverHomeSection";
import { RiderFeedSection } from "./home/RiderFeedSection";

type HomeTabSectionProps = {
  colors: AppColors;
  styles: AppStyles;
  notice: AppNotice;
  mode: Mode;
  filter: RouteKind;
  driverRouteKind: RouteKind;
  fromSearchQuery: string;
  toSearchQuery: string;
  visiblePosts: RoutePost[];
  myPosts: RoutePost[];
  savedPostKeys: string[];
  routeDraft: RouteDraft;
  currentUserId: string;
  onFilterChange: (filter: RouteKind) => void;
  onFromSearchQueryChange: (value: string) => void;
  onToSearchQueryChange: (value: string) => void;
  onRouteDraftChange: (draft: RouteDraft) => void;
  onSaveRouteQuickSettings: (input: { kind: RouteKind; availableSeats: number; isPublic: boolean }) => void;
  onOpenDriverRegistrationPage: () => void;
  onToggleSavedPost: (post: RoutePost) => void;
};

export function HomeTabSection({
  colors,
  styles,
  notice,
  mode,
  filter,
  driverRouteKind,
  fromSearchQuery,
  toSearchQuery,
  visiblePosts,
  myPosts,
  savedPostKeys,
  routeDraft,
  currentUserId,
  onFilterChange,
  onFromSearchQueryChange,
  onToSearchQueryChange,
  onRouteDraftChange,
  onSaveRouteQuickSettings,
  onOpenDriverRegistrationPage,
  onToggleSavedPost,
}: HomeTabSectionProps) {
  return (
    <>
      <NoticeBanner notice={notice} styles={styles} />

      {mode === "driver" ? (
        <DriverHomeSection
          styles={styles}
          driverRouteKind={driverRouteKind}
          routeDraft={routeDraft}
          myPosts={myPosts}
          onRouteDraftChange={onRouteDraftChange}
          onSaveRouteQuickSettings={onSaveRouteQuickSettings}
          onOpenRouteRegistrationPage={onOpenDriverRegistrationPage}
        />
      ) : (
        <RiderFeedSection
          colors={colors}
          styles={styles}
          filter={filter}
          fromSearchQuery={fromSearchQuery}
          toSearchQuery={toSearchQuery}
          visiblePosts={visiblePosts}
          currentUserId={currentUserId}
          savedPostKeys={savedPostKeys}
          onFilterChange={onFilterChange}
          onFromSearchQueryChange={onFromSearchQueryChange}
          onToSearchQueryChange={onToSearchQueryChange}
          onToggleSavedPost={onToggleSavedPost}
        />
      )}
    </>
  );
}
