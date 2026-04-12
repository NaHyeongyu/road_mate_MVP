import { useEffect, useMemo, useState } from "react";

import type { RouteDraft, RouteKind, RoutePost } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { isRouteDateValue, isRouteTimeValue } from "../../../utils/routeForm";
import { DriverOverviewSection } from "./DriverOverviewSection";

type DriverHomeSectionProps = {
  styles: AppStyles;
  driverRouteKind: "regular" | "one_time";
  routeDraft: RouteDraft;
  hasDriverContactMethod: boolean;
  myPosts: RoutePost[];
  onRouteDraftChange: (draft: RouteDraft) => void;
  onSaveRouteQuickSettings: (input: {
    kind: RouteKind;
    availableSeats: number;
    isPublic: boolean;
  }) => Promise<void>;
  onOpenRouteRegistrationPage: () => void;
};

const MIN_SEATS = 1;
const MAX_SEATS = 8;

const isRouteDraftReady = (routeDraft: RouteDraft, hasDriverContactMethod: boolean) => {
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

const toDraftFromPost = (post: RoutePost): RouteDraft => ({
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

const normalizeSeats = (value: number) => Math.min(Math.max(value, MIN_SEATS), MAX_SEATS);

const hasRouteDraftInput = (routeDraft: RouteDraft) =>
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

const getMissingRequiredLabels = (routeDraft: RouteDraft, hasDriverContactMethod: boolean): string[] => {
  if (routeDraft.kind === "one_time") {
    const checks = [
      { label: "From", done: Boolean(routeDraft.from.trim()) },
      { label: "To", done: Boolean(routeDraft.to.trim()) },
      { label: "Date", done: isRouteDateValue(routeDraft.noticeDate) },
      { label: "Time", done: isRouteTimeValue(routeDraft.schedule) },
      ...(routeDraft.oneTimeTripType === "round_trip"
        ? [{ label: "Return time", done: isRouteTimeValue(routeDraft.returnSchedule) }]
        : []),
    ];

    return checks.filter((check) => !check.done).map((check) => check.label);
  }

  const checks = [
    { label: "From", done: Boolean(routeDraft.from.trim()) },
    { label: "To", done: Boolean(routeDraft.to.trim()) },
    { label: "Departure time", done: isRouteTimeValue(routeDraft.schedule) },
    { label: "Arrival time", done: isRouteTimeValue(routeDraft.returnSchedule) },
    {
      label: "Contact",
      done: Boolean(hasDriverContactMethod || routeDraft.contactPhone.trim() || routeDraft.contactLink.trim()),
    },
  ];

  return checks.filter((check) => !check.done).map((check) => check.label);
};

export function DriverHomeSection({
  styles,
  driverRouteKind,
  routeDraft,
  hasDriverContactMethod,
  myPosts,
  onRouteDraftChange,
  onSaveRouteQuickSettings,
  onOpenRouteRegistrationPage,
}: DriverHomeSectionProps) {
  const [isQuickSettingSaving, setIsQuickSettingSaving] = useState(false);
  const hasDraftInput = hasRouteDraftInput(routeDraft);
  const isDraftReady = isRouteDraftReady(routeDraft, hasDriverContactMethod);
  const missingRequiredLabels = useMemo(
    () => getMissingRequiredLabels(routeDraft, hasDriverContactMethod),
    [hasDriverContactMethod, routeDraft]
  );
  const myPostsForActiveKind = useMemo(
    () => myPosts.filter((post) => post.kind === driverRouteKind),
    [driverRouteKind, myPosts]
  );
  const latestRegisteredPost = myPostsForActiveKind[0] ?? null;
  const hasPublishedRoute = Boolean(latestRegisteredPost);
  const activeRouteDraft =
    isDraftReady || !latestRegisteredPost ? routeDraft : toDraftFromPost(latestRegisteredPost);

  useEffect(() => {
    if (isDraftReady || hasDraftInput || !latestRegisteredPost) {
      return;
    }

    onRouteDraftChange(toDraftFromPost(latestRegisteredPost));
  }, [hasDraftInput, isDraftReady, latestRegisteredPost, onRouteDraftChange]);

  const handleOpenRouteRegistration = () => {
    if (!isDraftReady && !hasDraftInput && latestRegisteredPost) {
      onRouteDraftChange(toDraftFromPost(latestRegisteredPost));
    }

    onOpenRouteRegistrationPage();
  };

  const handleAdjustSeats = (delta: number) => {
    if (!hasPublishedRoute || isQuickSettingSaving) {
      return;
    }

    const currentSeats = normalizeSeats(Number.parseInt(activeRouteDraft.availableSeats, 10) || MIN_SEATS);
    const nextSeats = normalizeSeats(currentSeats + delta);

    if (nextSeats === currentSeats) {
      return;
    }

    const nextDraft = {
      ...activeRouteDraft,
      kind: driverRouteKind,
      availableSeats: String(nextSeats),
    };

    onRouteDraftChange(nextDraft);
    setIsQuickSettingSaving(true);
    void onSaveRouteQuickSettings({
      kind: driverRouteKind,
      availableSeats: nextSeats,
      isPublic: nextDraft.isPublic,
    })
      .catch(() => {
        // Notice is handled in action layer; avoid unhandled rejections here.
      })
      .finally(() => {
        setIsQuickSettingSaving(false);
      });
  };

  const handleRouteVisibilityChange = (isPublic: boolean) => {
    if (!hasPublishedRoute || isQuickSettingSaving || activeRouteDraft.isPublic === isPublic) {
      return;
    }

    const nextDraft = {
      ...activeRouteDraft,
      kind: driverRouteKind,
      isPublic,
    };

    onRouteDraftChange(nextDraft);
    setIsQuickSettingSaving(true);
    void onSaveRouteQuickSettings({
      kind: driverRouteKind,
      availableSeats: normalizeSeats(Number.parseInt(nextDraft.availableSeats, 10) || MIN_SEATS),
      isPublic,
    })
      .catch(() => {
        // Notice is handled in action layer; avoid unhandled rejections here.
      })
      .finally(() => {
        setIsQuickSettingSaving(false);
      });
  };

  return (
    <DriverOverviewSection
      styles={styles}
      driverRouteKind={driverRouteKind}
      hasRouteRegistration={hasPublishedRoute}
      hasDraftInput={hasDraftInput}
      isDraftReady={isDraftReady}
      missingRequiredLabels={missingRequiredLabels}
      isQuickSettingSaving={isQuickSettingSaving}
      routeDraft={activeRouteDraft}
      onOpenRouteRegistration={handleOpenRouteRegistration}
      onAdjustSeats={handleAdjustSeats}
      onRouteVisibilityChange={handleRouteVisibilityChange}
    />
  );
}
