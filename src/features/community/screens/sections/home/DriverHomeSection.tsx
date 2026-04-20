import type { RouteDraft, RouteKind, RoutePost, VehicleInfo } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { DriverOverviewSection } from "./DriverOverviewSection";
import { useDriverHomeOverviewState } from "./useDriverHomeOverviewState";

type DriverHomeSectionProps = {
  styles: AppStyles;
  driverRouteKind: "regular" | "one_time";
  routeDraft: RouteDraft;
  savedVehicle: VehicleInfo;
  hasDriverContactMethod: boolean;
  myPosts: RoutePost[];
  onRouteDraftChange: (draft: RouteDraft) => void;
  onSaveRouteQuickSettings: (input: {
    kind: RouteKind;
    availableSeats: number;
    isPublic: boolean;
  }) => Promise<void>;
  onOpenRouteRegistrationPage: () => void;
  onOpenRouteDetailPage: (post: RoutePost) => void;
  onOpenPreviousNoticesPage: () => void;
};

export function DriverHomeSection({
  styles,
  driverRouteKind,
  routeDraft,
  savedVehicle,
  hasDriverContactMethod,
  myPosts,
  onRouteDraftChange,
  onSaveRouteQuickSettings,
  onOpenRouteRegistrationPage,
  onOpenRouteDetailPage,
  onOpenPreviousNoticesPage,
}: DriverHomeSectionProps) {
  const overviewState = useDriverHomeOverviewState({
    driverRouteKind,
    routeDraft,
    hasDriverContactMethod,
    myPosts,
    onRouteDraftChange,
    onSaveRouteQuickSettings,
    onOpenRouteRegistrationPage,
  });

  return (
    <DriverOverviewSection
      styles={styles}
      driverRouteKind={driverRouteKind}
      savedVehicle={savedVehicle}
      onOpenRouteDetailPage={onOpenRouteDetailPage}
      onOpenPreviousNoticesPage={onOpenPreviousNoticesPage}
      {...overviewState}
    />
  );
}
