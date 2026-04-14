import type { AppNotice } from "../../../../app/types";
import type { AppColors } from "../../../../brandTheme";
import type { RouteDraft, RouteKind, RoutePost } from "../../../../model";
import type { AppStyles } from "../../../../ui/types";
import { NoticeBanner } from "../../../shared/components/NoticeBanner";
import type { Mode, StateFilter } from "../../types";
import { DriverHomeSection } from "./home/DriverHomeSection";
import { RiderFeedSection } from "./home/RiderFeedSection";

type HomeTabSectionProps = {
  colors: AppColors;
  styles: AppStyles;
  notice: AppNotice;
  mode: Mode;
  filter: RouteKind;
  stateFilter: StateFilter;
  driverRouteKind: RouteKind;
  fromSearchQuery: string;
  toSearchQuery: string;
  visiblePosts: RoutePost[];
  myPosts: RoutePost[];
  savedPostKeys: string[];
  routeDraft: RouteDraft;
  hasDriverContactMethod: boolean;
  currentUserId: string;
  onFilterChange: (filter: RouteKind) => void;
  onStateFilterChange: (value: StateFilter) => void;
  onFromSearchQueryChange: (value: string) => void;
  onToSearchQueryChange: (value: string) => void;
  onRouteDraftChange: (draft: RouteDraft) => void;
  onSaveRouteQuickSettings: (input: {
    kind: RouteKind;
    availableSeats: number;
    isPublic: boolean;
  }) => Promise<void>;
  onOpenDriverRegistrationPage: () => void;
  onToggleSavedPost: (post: RoutePost) => void;
  isRiderSearchResultsPageVisible: boolean;
  onOpenRiderSearchResultsPage: () => void;
  onCloseRiderSearchResultsPage: () => void;
};

export function HomeTabSection({
  colors,
  styles,
  notice,
  mode,
  filter,
  stateFilter,
  driverRouteKind,
  fromSearchQuery,
  toSearchQuery,
  visiblePosts,
  myPosts,
  savedPostKeys,
  routeDraft,
  hasDriverContactMethod,
  currentUserId,
  onFilterChange,
  onStateFilterChange,
  onFromSearchQueryChange,
  onToSearchQueryChange,
  onRouteDraftChange,
  onSaveRouteQuickSettings,
  onOpenDriverRegistrationPage,
  onToggleSavedPost,
  isRiderSearchResultsPageVisible,
  onOpenRiderSearchResultsPage,
  onCloseRiderSearchResultsPage,
}: HomeTabSectionProps) {
  return (
    <>
      <NoticeBanner notice={notice} styles={styles} />

      {mode === "driver" ? (
        <DriverHomeSection
          styles={styles}
          driverRouteKind={driverRouteKind}
          routeDraft={routeDraft}
          hasDriverContactMethod={hasDriverContactMethod}
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
          stateFilter={stateFilter}
          fromSearchQuery={fromSearchQuery}
          toSearchQuery={toSearchQuery}
          visiblePosts={visiblePosts}
          currentUserId={currentUserId}
          savedPostKeys={savedPostKeys}
          onFilterChange={onFilterChange}
          onStateFilterChange={onStateFilterChange}
          onFromSearchQueryChange={onFromSearchQueryChange}
          onToSearchQueryChange={onToSearchQueryChange}
          onToggleSavedPost={onToggleSavedPost}
          isSearchResultsPageVisible={isRiderSearchResultsPageVisible}
          onOpenSearchResultsPage={onOpenRiderSearchResultsPage}
          onCloseSearchResultsPage={onCloseRiderSearchResultsPage}
        />
      )}
    </>
  );
}
