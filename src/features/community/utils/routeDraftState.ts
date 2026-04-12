import type { RouteDraft, RoutePost } from "../../../model";
import { isRouteDateValue, isRouteTimeValue } from "./routeForm";

export const isRouteDraftReady = (routeDraft: RouteDraft, hasDriverContactMethod: boolean) => {
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

export const hasRouteDraftInput = (routeDraft: RouteDraft) =>
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

export const toDraftFromPost = (post: RoutePost): RouteDraft => ({
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
