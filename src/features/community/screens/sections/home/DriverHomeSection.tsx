import { useEffect, useMemo } from "react";

import type { RouteDraft, RouteKind, RoutePost } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { isRouteDateValue, isRouteTimeValue } from "../../../utils/routeForm";
import { DriverOverviewSection } from "./DriverOverviewSection";

type DriverHomeSectionProps = {
  styles: AppStyles;
  driverRouteKind: "regular" | "one_time";
  routeDraft: RouteDraft;
  myPosts: RoutePost[];
  onRouteDraftChange: (draft: RouteDraft) => void;
  onSaveRouteQuickSettings: (input: {
    kind: RouteKind;
    availableSeats: number;
    isPublic: boolean;
  }) => void;
  onOpenRouteRegistrationPage: () => void;
};

const MIN_SEATS = 1;
const MAX_SEATS = 8;

const isRouteDraftReady = (routeDraft: RouteDraft) => {
  if (routeDraft.kind === "one_time") {
    return Boolean(
      isRouteDateValue(routeDraft.noticeDate) &&
      routeDraft.from.trim() &&
        routeDraft.to.trim() &&
        isRouteTimeValue(routeDraft.schedule)
    );
  }

  const hasContactMethod = Boolean(routeDraft.contactPhone.trim() || routeDraft.contactLink.trim());
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

export function DriverHomeSection({
  styles,
  driverRouteKind,
  routeDraft,
  myPosts,
  onRouteDraftChange,
  onSaveRouteQuickSettings,
  onOpenRouteRegistrationPage,
}: DriverHomeSectionProps) {
  const myPostsForActiveKind = useMemo(
    () => myPosts.filter((post) => post.kind === driverRouteKind),
    [driverRouteKind, myPosts]
  );
  const latestRegisteredPost = myPostsForActiveKind[0] ?? null;
  const activeRouteDraft =
    isRouteDraftReady(routeDraft) || !latestRegisteredPost ? routeDraft : toDraftFromPost(latestRegisteredPost);
  const hasRouteRegistration = isRouteDraftReady(routeDraft) || Boolean(latestRegisteredPost);

  useEffect(() => {
    if (isRouteDraftReady(routeDraft) || hasRouteDraftInput(routeDraft) || !latestRegisteredPost) {
      return;
    }

    onRouteDraftChange(toDraftFromPost(latestRegisteredPost));
  }, [latestRegisteredPost, onRouteDraftChange, routeDraft]);

  const handleOpenRouteRegistration = () => {
    if (!isRouteDraftReady(routeDraft) && !hasRouteDraftInput(routeDraft) && latestRegisteredPost) {
      onRouteDraftChange(toDraftFromPost(latestRegisteredPost));
    }

    onOpenRouteRegistrationPage();
  };

  const handleAdjustSeats = (delta: number) => {
    if (!hasRouteRegistration) {
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
    onSaveRouteQuickSettings({
      kind: driverRouteKind,
      availableSeats: nextSeats,
      isPublic: nextDraft.isPublic,
    });
  };

  const handleRouteVisibilityChange = (isPublic: boolean) => {
    if (!hasRouteRegistration || activeRouteDraft.isPublic === isPublic) {
      return;
    }

    const nextDraft = {
      ...activeRouteDraft,
      kind: driverRouteKind,
      isPublic,
    };

    onRouteDraftChange(nextDraft);
    onSaveRouteQuickSettings({
      kind: driverRouteKind,
      availableSeats: normalizeSeats(Number.parseInt(nextDraft.availableSeats, 10) || MIN_SEATS),
      isPublic,
    });
  };

  return (
    <DriverOverviewSection
      styles={styles}
      driverRouteKind={driverRouteKind}
      hasRouteRegistration={hasRouteRegistration}
      routeDraft={activeRouteDraft}
      onOpenRouteRegistration={handleOpenRouteRegistration}
      onAdjustSeats={handleAdjustSeats}
      onRouteVisibilityChange={handleRouteVisibilityChange}
    />
  );
}
