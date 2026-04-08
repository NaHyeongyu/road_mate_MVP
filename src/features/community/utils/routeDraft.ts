import type { RouteDraft, RoutePost, VehicleInfo } from "../../../model";
import { isRouteTimeValue } from "./routeForm";

const MAX_SEATS = 8;

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

  return {
    id: `mine-${Date.now()}`,
    kind: routeDraft.kind,
    from: routeDraft.from.trim(),
    to: routeDraft.to.trim(),
    schedule: routeDraft.schedule.trim(),
    returnSchedule: isOneTime ? undefined : routeDraft.returnSchedule.trim() || undefined,
    availableSeats: isOneTime
      ? 1
      : Math.min(Number.parseInt(String(routeDraft.availableSeats ?? "").trim(), 10) || 0, MAX_SEATS),
    operatingDays: isOneTime ? [] : routeDraft.operatingDays,
    contactPhone: isOneTime ? undefined : routeDraft.contactPhone.trim() || undefined,
    contactLink: isOneTime ? undefined : routeDraft.contactLink.trim() || undefined,
    note: routeDraft.note.trim(),
    vehicleModel: savedVehicle.model,
    vehiclePlate: savedVehicle.plate,
    ownerUserId: currentUserId,
    ownerName: currentUserName,
    isPublic: isOneTime ? true : routeDraft.isPublic,
    createdAt: new Date().toISOString(),
  };
};

export const validateRoutePost = (routePost: RoutePost): string | null => {
  if (!routePost.from || !routePost.to) {
    return "Add both from and to before posting.";
  }

  if (!routePost.schedule || !isRouteTimeValue(routePost.schedule)) {
    return "Set departure time in HH:MM format (24-hour).";
  }

  if (!Number.isFinite(routePost.availableSeats) || routePost.availableSeats < 1) {
    return "Set available seats to at least 1.";
  }

  if (routePost.kind === "regular") {
    if (!routePost.returnSchedule || !isRouteTimeValue(routePost.returnSchedule)) {
      return "Set arrival time in HH:MM format (24-hour).";
    }

    if (!routePost.operatingDays.length) {
      return "Select at least one operating day.";
    }

    if (!routePost.contactPhone && !routePost.contactLink) {
      return "Add at least one contact method (phone or Kakao link).";
    }
  }

  return null;
};
