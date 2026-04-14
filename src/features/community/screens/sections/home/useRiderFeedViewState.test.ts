import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { RouteKind, RoutePost } from "../../../../../model";
import { useRiderFeedViewState } from "./useRiderFeedViewState";

const toRouteDate = (dayOffset: number) => {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + dayOffset);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const createPost = (patch: Partial<RoutePost> = {}): RoutePost => ({
  id: "post-1",
  kind: "regular",
  oneTimeTripType: undefined,
  noticeDate: undefined,
  from: "Brisbane CBD, QLD",
  to: "St Lucia, QLD",
  schedule: "09:00",
  returnSchedule: "17:00",
  availableSeats: 3,
  operatingDays: ["Mon", "Tue"],
  contactPhone: "",
  contactLink: "",
  note: "",
  vehicleModel: "Kia Carnival",
  vehiclePlate: "123ABC",
  ownerUserId: "driver-1",
  ownerName: "Driver One",
  isPublic: true,
  createdAt: new Date().toISOString(),
  ...patch,
});

const renderViewState = ({
  filter,
  visiblePosts,
  currentUserId = "rider-1",
}: {
  filter: RouteKind;
  visiblePosts: RoutePost[];
  currentUserId?: string;
}) => {
  const hook = renderHook(
    (props: { filter: RouteKind }) =>
      useRiderFeedViewState({
        filter: props.filter,
        visiblePosts,
        currentUserId,
      }),
    {
      initialProps: { filter },
    }
  );

  return hook;
};

describe("useRiderFeedViewState", () => {
  it("filters out rider-owned posts in regular feed", () => {
    const ownPost = createPost({ id: "own", ownerUserId: "rider-1" });
    const otherPost = createPost({ id: "other", ownerUserId: "driver-2" });

    const { result } = renderViewState({
      filter: "regular",
      visiblePosts: [ownPost, otherPost],
    });

    expect(result.current.isNoticeFilter).toBe(false);
    expect(result.current.feedPosts.map((post) => post.id)).toEqual(["other"]);
  });

  it("hides past notices in upcoming scope and shows them in all scope", () => {
    const pastNotice = createPost({
      id: "past",
      kind: "one_time",
      oneTimeTripType: "one_way",
      noticeDate: toRouteDate(-1),
      returnSchedule: undefined,
      ownerUserId: "driver-2",
    });
    const upcomingNotice = createPost({
      id: "upcoming",
      kind: "one_time",
      oneTimeTripType: "one_way",
      noticeDate: toRouteDate(1),
      returnSchedule: undefined,
      ownerUserId: "driver-3",
    });

    const { result } = renderViewState({
      filter: "one_time",
      visiblePosts: [pastNotice, upcomingNotice],
    });

    expect(result.current.noticeScope).toBe("upcoming");
    expect(result.current.pastNoticeCount).toBe(1);
    expect(result.current.feedPosts.map((post) => post.id)).toEqual(["upcoming"]);

    act(() => {
      result.current.setNoticeScope("all");
    });

    expect(result.current.feedPosts.map((post) => post.id)).toEqual(["past", "upcoming"]);
  });

  it("resets notice scope to upcoming when switching away from notice filter", () => {
    const post = createPost({ id: "notice", kind: "one_time", noticeDate: toRouteDate(1) });
    const { result, rerender } = renderViewState({
      filter: "one_time",
      visiblePosts: [post],
    });

    act(() => {
      result.current.setNoticeScope("all");
    });
    expect(result.current.noticeScope).toBe("all");

    rerender({ filter: "regular" });

    expect(result.current.noticeScope).toBe("upcoming");
  });
});
