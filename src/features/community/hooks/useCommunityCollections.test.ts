import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { RoutePost } from "../../../model";
import { useCommunityCollections } from "./useCommunityCollections";

const createPost = (patch: Partial<RoutePost> = {}): RoutePost => ({
  id: "post-1",
  kind: "regular",
  oneTimeTripType: undefined,
  noticeDate: undefined,
  from: "Alpha Bay, NSW 2000",
  to: "Beta Hill, NSW 2150",
  schedule: "08:00",
  returnSchedule: "17:00",
  availableSeats: 3,
  operatingDays: ["Mon"],
  contactPhone: "",
  contactLink: "",
  note: "",
  vehicleModel: "Kia Carnival",
  vehiclePlate: "ABC123",
  ownerUserId: "driver-1",
  ownerName: "Driver One",
  isPublic: true,
  createdAt: "2026-04-14T00:00:00.000Z",
  ...patch,
});

describe("useCommunityCollections", () => {
  it("does not expose demo seed posts unless they are explicitly enabled", () => {
    const { result } = renderHook(() =>
      useCommunityCollections({
        currentUserId: "rider-1",
        filter: "regular",
        stateFilter: "QLD",
        fromSearchQuery: "Brisbane CBD",
        toSearchQuery: "St Lucia",
        storedPosts: [],
        savedPostKeys: [],
      })
    );

    expect(result.current.visiblePosts).toEqual([]);
  });

  it("hides visible posts until both from and to are provided", () => {
    const post = createPost();

    const { result } = renderHook(() =>
      useCommunityCollections({
        currentUserId: "rider-1",
        filter: "regular",
        stateFilter: "ALL",
        fromSearchQuery: "alpha",
        toSearchQuery: "",
        storedPosts: [post],
        savedPostKeys: [],
      })
    );

    expect(result.current.visiblePosts).toEqual([]);
  });

  it("returns matches when only state filter is selected", () => {
    const post = createPost();

    const { result } = renderHook(() =>
      useCommunityCollections({
        currentUserId: "rider-1",
        filter: "regular",
        stateFilter: "NSW",
        fromSearchQuery: "",
        toSearchQuery: "",
        storedPosts: [post],
        savedPostKeys: [],
      })
    );

    expect(result.current.visiblePosts.map((item) => item.id)).toContain("post-1");
  });

  it("returns matches when both from and to queries are present", () => {
    const post = createPost();

    const { result } = renderHook(() =>
      useCommunityCollections({
        currentUserId: "rider-1",
        filter: "regular",
        stateFilter: "NSW",
        fromSearchQuery: "alpha",
        toSearchQuery: "beta",
        storedPosts: [post],
        savedPostKeys: [],
      })
    );

    expect(result.current.visiblePosts.map((item) => item.id)).toContain("post-1");
  });

  it("prioritizes exact route matches before partial matches", () => {
    const bothExact = createPost({
      id: "post-both",
      from: "Alpha Bay, NSW 2000",
      to: "Beta Hill, NSW 2150",
      createdAt: "2026-04-10T00:00:00.000Z",
    });
    const fromExact = createPost({
      id: "post-from",
      from: "Alpha Bay, NSW 2000",
      to: "Beta Hill Central, NSW 2150",
      createdAt: "2026-04-13T00:00:00.000Z",
    });
    const toExact = createPost({
      id: "post-to",
      from: "Alpha Bay Riverside, NSW 2000",
      to: "Beta Hill, NSW 2150",
      createdAt: "2026-04-12T00:00:00.000Z",
    });
    const partial = createPost({
      id: "post-partial",
      from: "Alpha Bay Riverside, NSW 2000",
      to: "Beta Hill Central, NSW 2150",
      createdAt: "2026-04-14T00:00:00.000Z",
    });

    const { result } = renderHook(() =>
      useCommunityCollections({
        currentUserId: "rider-1",
        filter: "regular",
        stateFilter: "NSW",
        fromSearchQuery: "Alpha Bay, NSW 2000",
        toSearchQuery: "Beta Hill, NSW 2150",
        storedPosts: [partial, toExact, fromExact, bothExact],
        savedPostKeys: [],
      })
    );

    expect(result.current.visiblePosts.map((item) => item.id).slice(0, 4)).toEqual([
      "post-both",
      "post-from",
      "post-to",
      "post-partial",
    ]);
  });
});
