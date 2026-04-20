import type { RouteDraft } from "../../../../../model";
import { isRouteDateValue, isRouteTimeValue } from "../../../utils/routeForm";
import type { RequiredFieldLabels } from "./driverRouteComposerState";

export const DRIVER_HOME_MIN_SEATS = 1;
export const DRIVER_HOME_MAX_SEATS = 8;

export const normalizeDriverHomeSeats = (value: number) =>
  Math.min(Math.max(value, DRIVER_HOME_MIN_SEATS), DRIVER_HOME_MAX_SEATS);

export const getDriverHomeMissingRequiredLabels = (
  routeDraft: RouteDraft,
  hasDriverContactMethod: boolean,
  labels: Pick<
    RequiredFieldLabels,
    | "from"
    | "to"
    | "departureDate"
    | "returnDate"
    | "departureTime"
    | "returnTime"
    | "arrivalTime"
    | "contact"
  >
): string[] => {
  if (routeDraft.kind === "one_time") {
    const checks = [
      { label: labels.from, done: Boolean(routeDraft.from.trim()) },
      { label: labels.to, done: Boolean(routeDraft.to.trim()) },
      { label: labels.departureDate, done: isRouteDateValue(routeDraft.noticeDate) },
      { label: labels.departureTime, done: isRouteTimeValue(routeDraft.schedule) },
      { label: labels.contact, done: hasDriverContactMethod },
      ...(routeDraft.oneTimeTripType === "round_trip"
        ? [
            { label: labels.returnDate, done: isRouteDateValue(routeDraft.returnDate ?? "") },
            { label: labels.returnTime, done: isRouteTimeValue(routeDraft.returnSchedule) },
          ]
        : []),
    ];

    return checks.filter((check) => !check.done).map((check) => check.label);
  }

  const checks = [
    { label: labels.from, done: Boolean(routeDraft.from.trim()) },
    { label: labels.to, done: Boolean(routeDraft.to.trim()) },
    { label: labels.departureTime, done: isRouteTimeValue(routeDraft.schedule) },
    { label: labels.arrivalTime, done: isRouteTimeValue(routeDraft.returnSchedule) },
    { label: labels.contact, done: hasDriverContactMethod },
  ];

  return checks.filter((check) => !check.done).map((check) => check.label);
};
