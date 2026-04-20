import type { AppCopy } from "../../../i18n/copy";
import type { RouteDraft, RoutePost, VehicleInfo } from "../../../model";
import { isRouteDateValue, isRouteTimeValue } from "./routeForm";

const MAX_SEATS = 8;

type RouteValidationCopy = Pick<
  AppCopy["validation"],
  | "routeNoticeDateRequired"
  | "routeEndpointsRequired"
  | "routeDepartureTimeRequired"
  | "routeAvailableSeatsRequired"
  | "routeContactRequired"
  | "routeReturnDateRequired"
  | "routeReturnTimeRequired"
  | "routeArrivalTimeRequired"
  | "routeOperatingDaysRequired"
>;

const DEFAULT_ROUTE_VALIDATION_COPY: RouteValidationCopy = {
  routeNoticeDateRequired: "Set notice date using calendar picker.",
  routeEndpointsRequired: "Add both from and to before posting.",
  routeDepartureTimeRequired: "Set departure time in HH:MM format (24-hour).",
  routeAvailableSeatsRequired: "Set available seats to at least 1.",
  routeContactRequired: "Add at least one contact method in driver profile (phone or chat link).",
  routeReturnDateRequired: "Set return date using calendar picker for round-trip notice.",
  routeReturnTimeRequired: "Set return time in HH:MM format (24-hour) for round-trip notice.",
  routeArrivalTimeRequired: "Set arrival time in HH:MM format (24-hour).",
  routeOperatingDaysRequired: "Select at least one operating day.",
};

type BuildRoutePostArgs = {
  routeDraft: RouteDraft;
  savedVehicle: VehicleInfo;
  currentUserId: string;
  currentUserName: string;
};

export const buildRoutePost = ({
  routeDraft,
  savedVehicle,
  currentUserId,
  currentUserName,
}: BuildRoutePostArgs): RoutePost => {
  const isOneTime = routeDraft.kind === "one_time";
  const isOneTimeRoundTrip = isOneTime && routeDraft.oneTimeTripType === "round_trip";
  const profileContactPhone = savedVehicle.contactPhone.trim();
  const profileContactLink = savedVehicle.contactLink.trim();
  const fallbackDraftContactPhone = routeDraft.contactPhone.trim();
  const fallbackDraftContactLink = routeDraft.contactLink.trim();
  const contactPhone = isOneTime
    ? profileContactPhone || fallbackDraftContactPhone || undefined
    : profileContactPhone || undefined;
  const contactLink = isOneTime
    ? profileContactLink || fallbackDraftContactLink || undefined
    : profileContactLink || undefined;

  return {
    id: `mine-${Date.now()}`,
    kind: routeDraft.kind,
    oneTimeTripType: isOneTime ? routeDraft.oneTimeTripType : undefined,
    noticeDate: isOneTime ? routeDraft.noticeDate.trim() : undefined,
    returnDate:
      isOneTime && isOneTimeRoundTrip
        ? routeDraft.returnDate?.trim() || routeDraft.noticeDate.trim() || undefined
        : undefined,
    from: routeDraft.from.trim(),
    to: routeDraft.to.trim(),
    schedule: routeDraft.schedule.trim(),
    returnSchedule: isOneTime
      ? isOneTimeRoundTrip
        ? routeDraft.returnSchedule.trim() || undefined
        : undefined
      : routeDraft.returnSchedule.trim() || undefined,
    availableSeats: isOneTime
      ? 1
      : Math.min(Number.parseInt(String(routeDraft.availableSeats ?? "").trim(), 10) || 0, MAX_SEATS),
    operatingDays: isOneTime ? [] : routeDraft.operatingDays,
    contactPhone,
    contactLink,
    note: routeDraft.note.trim(),
    vehicleModel: savedVehicle.model,
    vehiclePlate: savedVehicle.plate,
    ownerUserId: currentUserId,
    ownerName: currentUserName,
    isPublic: isOneTime ? true : routeDraft.isPublic,
    createdAt: new Date().toISOString(),
  };
};

export const validateRoutePost = (
  routePost: RoutePost,
  validationCopy: RouteValidationCopy = DEFAULT_ROUTE_VALIDATION_COPY
): string | null => {
  if (routePost.kind === "one_time" && !isRouteDateValue(routePost.noticeDate ?? "")) {
    return validationCopy.routeNoticeDateRequired;
  }

  if (!routePost.from || !routePost.to) {
    return validationCopy.routeEndpointsRequired;
  }

  if (!routePost.schedule || !isRouteTimeValue(routePost.schedule)) {
    return validationCopy.routeDepartureTimeRequired;
  }

  if (!Number.isFinite(routePost.availableSeats) || routePost.availableSeats < 1) {
    return validationCopy.routeAvailableSeatsRequired;
  }

  if (!routePost.contactPhone && !routePost.contactLink) {
    return validationCopy.routeContactRequired;
  }

  if (
    routePost.kind === "one_time" &&
    routePost.oneTimeTripType === "round_trip" &&
    (!routePost.returnDate || !isRouteDateValue(routePost.returnDate))
  ) {
    return validationCopy.routeReturnDateRequired;
  }

  if (
    routePost.kind === "one_time" &&
    routePost.oneTimeTripType === "round_trip" &&
    (!routePost.returnSchedule || !isRouteTimeValue(routePost.returnSchedule))
  ) {
    return validationCopy.routeReturnTimeRequired;
  }

  if (routePost.kind === "regular") {
    if (!routePost.returnSchedule || !isRouteTimeValue(routePost.returnSchedule)) {
      return validationCopy.routeArrivalTimeRequired;
    }

    if (!routePost.operatingDays.length) {
      return validationCopy.routeOperatingDaysRequired;
    }

  }

  return null;
};
