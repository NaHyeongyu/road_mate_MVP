import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { RouteDraft, RoutePost } from "../../../model";
import { toDraftFromPost } from "../utils/routeDraftState";
import { useDriverRegistrationPageState } from "./useDriverRegistrationPageState";

const createDraft = (patch: Partial<RouteDraft> = {}): RouteDraft => ({
  kind: "regular",
  oneTimeTripType: "round_trip",
  noticeDate: "",
  from: "",
  to: "",
  schedule: "",
  returnSchedule: "",
  availableSeats: "1",
  operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  contactPhone: "",
  contactLink: "",
  note: "",
  isPublic: true,
  ...patch,
});

const createPost = (patch: Partial<RoutePost> = {}): RoutePost => ({
  id: "post-1",
  kind: "regular",
  oneTimeTripType: undefined,
  noticeDate: undefined,
  from: "Brisbane CBD, QLD",
  to: "St Lucia, QLD",
  schedule: "08:30",
  returnSchedule: "17:45",
  availableSeats: 3,
  operatingDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  contactPhone: "0412 345 678",
  contactLink: "",
  note: "Near station",
  vehicleModel: "Kia Carnival",
  vehiclePlate: "123ABC",
  ownerUserId: "driver-1",
  ownerName: "Driver One",
  isPublic: true,
  createdAt: "2026-04-12T00:00:00.000Z",
  ...patch,
});

describe("useDriverRegistrationPageState", () => {
  it("derives active route kind from driver saved tab", () => {
    const onRouteDraftChange = vi.fn();
    const onPostRoute = vi.fn(async () => true);

    const { result } = renderHook(() =>
      useDriverRegistrationPageState({
        mode: "driver",
        mainTab: "saved",
        myPosts: [],
        routeDraft: createDraft(),
        hasDriverContactMethod: false,
        onRouteDraftChange,
        onPostRoute,
      })
    );

    expect(result.current.activeDriverRouteKind).toBe("one_time");
  });

  it("opens and closes registration page based on mode changes", () => {
    const onRouteDraftChange = vi.fn();
    const onPostRoute = vi.fn(async () => true);

    const { result, rerender } = renderHook(
      (props: { mode: "rider" | "driver" }) =>
        useDriverRegistrationPageState({
          mode: props.mode,
          mainTab: "home",
          myPosts: [],
          routeDraft: createDraft(),
          hasDriverContactMethod: false,
          onRouteDraftChange,
          onPostRoute,
        }),
      {
        initialProps: { mode: "driver" as "rider" | "driver" },
      }
    );

    act(() => {
      result.current.openDriverRegistrationPage();
    });
    expect(result.current.isDriverRegistrationPageVisible).toBe(true);

    rerender({ mode: "rider" });
    expect(result.current.isDriverRegistrationPageVisible).toBe(false);
  });

  it("closes registration page after successful save", async () => {
    const onRouteDraftChange = vi.fn();
    const onPostRoute = vi.fn(async () => true);

    const { result } = renderHook(() =>
      useDriverRegistrationPageState({
        mode: "driver",
        mainTab: "home",
        myPosts: [],
        routeDraft: createDraft(),
        hasDriverContactMethod: false,
        onRouteDraftChange,
        onPostRoute,
      })
    );

    act(() => {
      result.current.openDriverRegistrationPage();
    });

    let didSave = false;
    await act(async () => {
      didSave = await result.current.handleSaveRouteRegistration();
    });

    expect(didSave).toBe(true);
    expect(result.current.isDriverRegistrationPageVisible).toBe(false);
  });

  it("hydrates route draft from latest post when opening registration with empty draft", () => {
    const onRouteDraftChange = vi.fn();
    const onPostRoute = vi.fn(async () => true);
    const latestPost = createPost();

    const { result } = renderHook(() =>
      useDriverRegistrationPageState({
        mode: "driver",
        mainTab: "home",
        myPosts: [latestPost],
        routeDraft: createDraft(),
        hasDriverContactMethod: false,
        onRouteDraftChange,
        onPostRoute,
      })
    );

    act(() => {
      result.current.openDriverRegistrationPage();
    });

    expect(onRouteDraftChange).toHaveBeenCalledWith(toDraftFromPost(latestPost));
  });
});
