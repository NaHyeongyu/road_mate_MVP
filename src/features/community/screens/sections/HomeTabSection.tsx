import type { AppColors } from "../../../../brandTheme";
import type { RouteDraft, RouteKind, RoutePost, VehicleInfo } from "../../../../model";
import type { AppStyles } from "../../../../ui/types";
import { AnimatedEntrance } from "../../../shared/components/AnimatedEntrance";
import type { Mode, StateFilter } from "../../types";
import { DriverHomeSection } from "./home/DriverHomeSection";
import { RiderFeedSection } from "./home/RiderFeedSection";

type HomeTabSectionProps = {
  colors: AppColors;
  styles: AppStyles;
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
  savedVehicle: VehicleInfo;
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
  onRemoveRoute: (id: string) => void;
  onToggleSavedPost: (post: RoutePost) => void;
  isRiderSearchResultsPageVisible: boolean;
  canLoadMoreRiderSearchResults: boolean;
  onOpenRiderSearchResultsPage: () => void;
  onLoadMoreRiderSearchResults: () => void;
};

export function HomeTabSection({
  colors,
  styles,
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
  savedVehicle,
  hasDriverContactMethod,
  currentUserId,
  onFilterChange,
  onStateFilterChange,
  onFromSearchQueryChange,
  onToSearchQueryChange,
  onRouteDraftChange,
  onSaveRouteQuickSettings,
  onOpenDriverRegistrationPage,
  onRemoveRoute,
  onToggleSavedPost,
  isRiderSearchResultsPageVisible,
  canLoadMoreRiderSearchResults,
  onOpenRiderSearchResultsPage,
  onLoadMoreRiderSearchResults,
}: HomeTabSectionProps) {
  return (
    <>
      <AnimatedEntrance delay={40} resetKey={`home-section-${mode}-${driverRouteKind}`}>
        {mode === "driver" ? (
          <DriverHomeSection
            styles={styles}
            driverRouteKind={driverRouteKind}
            routeDraft={routeDraft}
            savedVehicle={savedVehicle}
            hasDriverContactMethod={hasDriverContactMethod}
            myPosts={myPosts}
            onRouteDraftChange={onRouteDraftChange}
            onSaveRouteQuickSettings={onSaveRouteQuickSettings}
            onOpenRouteRegistrationPage={onOpenDriverRegistrationPage}
            onRemoveRoute={onRemoveRoute}
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
            canLoadMoreSearchResults={canLoadMoreRiderSearchResults}
            onOpenSearchResultsPage={onOpenRiderSearchResultsPage}
            onLoadMoreSearchResults={onLoadMoreRiderSearchResults}
          />
        )}
      </AnimatedEntrance>
    </>
  );
}
