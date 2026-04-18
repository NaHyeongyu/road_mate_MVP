import type { AppCopy } from "./copy";

const NOTICE_DAY_MS = 24 * 60 * 60 * 1000;

const toDateFromValue = (value: string | undefined, fallbackCreatedAt?: string) => {
  const raw = String(value ?? "").trim() || String(fallbackCreatedAt ?? "").trim().slice(0, 10);
  if (!raw) {
    return null;
  }

  const date = raw.includes("T") ? new Date(raw) : new Date(`${raw}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const formatLocalizedDate = (copy: AppCopy, value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return copy.common.recently;
  }

  return date.toLocaleDateString(copy.meta.locale, {
    month: "short",
    day: "numeric",
  });
};

export const formatLocalizedNoticeDate = (
  copy: AppCopy,
  value: string | undefined,
  fallbackCreatedAt?: string
) => {
  const date = toDateFromValue(value, fallbackCreatedAt);
  if (!date) {
    return copy.common.dateTbd;
  }

  return date.toLocaleDateString(copy.meta.locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const getLocalizedNoticeDayDelta = (
  value: string | undefined,
  fallbackCreatedAt?: string
) => {
  const date = toDateFromValue(value, fallbackCreatedAt);
  if (!date) {
    return null;
  }

  const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((normalized.getTime() - todayStart.getTime()) / NOTICE_DAY_MS);
};

export const formatLocalizedNoticeCountdown = (copy: AppCopy, dayDelta: number | null) => {
  if (dayDelta === null) {
    return copy.common.dateTbd;
  }

  if (dayDelta < 0) {
    return copy.common.past;
  }

  if (dayDelta === 0) {
    return copy.common.today;
  }

  if (dayDelta === 1) {
    return copy.common.tomorrow;
  }

  return `D-${dayDelta}`;
};
