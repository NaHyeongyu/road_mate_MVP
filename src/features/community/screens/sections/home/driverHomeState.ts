import type { RouteDraft } from "../../../../../model";
import { isRouteDateValue, isRouteTimeValue } from "../../../utils/routeForm";

export const DRIVER_HOME_MIN_SEATS = 1;
export const DRIVER_HOME_MAX_SEATS = 8;

export const normalizeDriverHomeSeats = (value: number) =>
  Math.min(Math.max(value, DRIVER_HOME_MIN_SEATS), DRIVER_HOME_MAX_SEATS);

export const getDriverHomeMissingRequiredLabels = (
  routeDraft: RouteDraft,
  hasDriverContactMethod: boolean
): string[] => {
  if (routeDraft.kind === "one_time") {
    const checks = [
      { label: "From", done: Boolean(routeDraft.from.trim()) },
      { label: "To", done: Boolean(routeDraft.to.trim()) },
      { label: "Departure date", done: isRouteDateValue(routeDraft.noticeDate) },
      { label: "Departure time", done: isRouteTimeValue(routeDraft.schedule) },
      ...(routeDraft.oneTimeTripType === "round_trip"
        ? [
            { label: "Return date", done: isRouteDateValue(routeDraft.returnDate ?? "") },
            { label: "Return time", done: isRouteTimeValue(routeDraft.returnSchedule) },
          ]
        : []),
    ];

    return checks.filter((check) => !check.done).map((check) => check.label);
  }

  const checks = [
    { label: "From", done: Boolean(routeDraft.from.trim()) },
    { label: "To", done: Boolean(routeDraft.to.trim()) },
    { label: "Departure time", done: isRouteTimeValue(routeDraft.schedule) },
    { label: "Arrival time", done: isRouteTimeValue(routeDraft.returnSchedule) },
    { label: "Contact", done: hasDriverContactMethod },
  ];

  return checks.filter((check) => !check.done).map((check) => check.label);
};
