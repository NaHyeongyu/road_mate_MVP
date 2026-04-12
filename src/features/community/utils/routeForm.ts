import type { RouteDraft } from "../../../model";

export const WEEKDAY_OPTIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export const ROUTE_TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
export const ROUTE_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const padTimeSegment = (value: number) => String(value).padStart(2, "0");

const to12HourLabel = (hour24: number, minute: number) => {
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return `${hour12}:${padTimeSegment(minute)} ${period}`;
};

export const formatRouteTime = (hour24: number, minute: number) =>
  `${padTimeSegment(hour24)}:${padTimeSegment(minute)}`;

export const isRouteTimeValue = (value: string) => ROUTE_TIME_PATTERN.test(value.trim());
export const isRouteDateValue = (value: string) => {
  const trimmed = value.trim();
  if (!ROUTE_DATE_PATTERN.test(trimmed)) {
    return false;
  }

  const [yearSegment, monthSegment, daySegment] = trimmed.split("-");
  const year = Number.parseInt(yearSegment ?? "", 10);
  const month = Number.parseInt(monthSegment ?? "", 10);
  const day = Number.parseInt(daySegment ?? "", 10);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return false;
  }

  const date = new Date(Date.UTC(year, month - 1, day));
  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

export const toRouteTimeDisplayLabel = (value: string) => {
  if (!isRouteTimeValue(value)) {
    return "";
  }

  const [hourSegment, minuteSegment] = value.split(":");
  const hour = Number.parseInt(hourSegment ?? "", 10);
  const minute = Number.parseInt(minuteSegment ?? "", 10);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return "";
  }

  const date = new Date();
  date.setHours(hour, minute, 0, 0);

  try {
    return date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return to12HourLabel(hour, minute);
  }
};

export const toRouteTimeFromDate = (date: Date) => formatRouteTime(date.getHours(), date.getMinutes());
export const toRouteDateFromDate = (date: Date) =>
  `${date.getFullYear()}-${padTimeSegment(date.getMonth() + 1)}-${padTimeSegment(date.getDate())}`;

export const toDateFromRouteTime = (value: string) => {
  const date = new Date();
  date.setSeconds(0, 0);

  if (!isRouteTimeValue(value)) {
    return date;
  }

  const [hourSegment, minuteSegment] = value.split(":");
  const hour = Number.parseInt(hourSegment ?? "", 10);
  const minute = Number.parseInt(minuteSegment ?? "", 10);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return date;
  }

  date.setHours(hour, minute, 0, 0);
  return date;
};

export const toDateFromRouteDate = (value: string) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);

  if (!isRouteDateValue(value)) {
    return date;
  }

  const [yearSegment, monthSegment, daySegment] = value.split("-");
  const year = Number.parseInt(yearSegment ?? "", 10);
  const month = Number.parseInt(monthSegment ?? "", 10);
  const day = Number.parseInt(daySegment ?? "", 10);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return date;
  }

  date.setFullYear(year, month - 1, day);
  return date;
};

export const toRouteDateDisplayLabel = (value: string) => {
  if (!isRouteDateValue(value)) {
    return "";
  }

  const date = toDateFromRouteDate(value);
  try {
    return date.toLocaleDateString("en-AU", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
};

export const normalizeSeatsInput = (raw: string) => {
  const digits = raw.replace(/\D/g, "").slice(0, 2);
  if (!digits) {
    return "";
  }

  return String(Math.min(Number.parseInt(digits, 10), 8));
};

export const toggleOperatingDay = (routeDraft: RouteDraft, day: string) => {
  const nextSet = new Set(routeDraft.operatingDays);
  if (nextSet.has(day)) {
    nextSet.delete(day);
  } else {
    nextSet.add(day);
  }

  return WEEKDAY_OPTIONS.filter((value) => nextSet.has(value));
};
