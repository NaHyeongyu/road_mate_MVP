import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { RouteDraft } from "../../../../../model";
import { toRouteDateFromDate, toRouteTimeFromDate } from "../../../utils/routeForm";
import { useRouteComposerPickers } from "./useRouteComposerPickers";

const createDraft = (patch: Partial<RouteDraft> = {}): RouteDraft => ({
  kind: "regular",
  oneTimeTripType: "round_trip",
  noticeDate: "",
  from: "Brisbane CBD, QLD",
  to: "St Lucia, QLD",
  schedule: "",
  returnSchedule: "",
  availableSeats: "1",
  operatingDays: ["Mon"],
  contactPhone: "",
  contactLink: "",
  note: "",
  isPublic: true,
  ...patch,
});

describe("useRouteComposerPickers", () => {
  it("chains to return-time picker after setting departure when return time is missing", () => {
    const onPatchDraft = vi.fn();
    const draft = createDraft();
    const selectedDate = new Date(2026, 3, 13, 9, 30, 0, 0);

    const { result } = renderHook(() =>
      useRouteComposerPickers({
        routeDraft: draft,
        isOneTimeRoute: false,
        isOneTimeRoundTrip: false,
        onPatchDraft,
      })
    );

    act(() => {
      result.current.openTimePicker("schedule");
    });

    act(() => {
      result.current.handleAndroidTimePickerChange(
        {
          type: "set",
          nativeEvent: { timestamp: selectedDate.getTime(), utcOffset: 0 },
        } as never,
        selectedDate
      );
    });

    expect(onPatchDraft).toHaveBeenCalledWith({ schedule: toRouteTimeFromDate(selectedDate) });
    expect(result.current.activeTimeField).toBe("returnSchedule");
  });

  it("does not chain to return-time picker for one-way one-time route", () => {
    const onPatchDraft = vi.fn();
    const draft = createDraft({ kind: "one_time", oneTimeTripType: "one_way" });
    const selectedDate = new Date(2026, 3, 13, 10, 5, 0, 0);

    const { result } = renderHook(() =>
      useRouteComposerPickers({
        routeDraft: draft,
        isOneTimeRoute: true,
        isOneTimeRoundTrip: false,
        onPatchDraft,
      })
    );

    act(() => {
      result.current.openTimePicker("schedule");
    });

    act(() => {
      result.current.handleAndroidTimePickerChange(
        {
          type: "set",
          nativeEvent: { timestamp: selectedDate.getTime(), utcOffset: 0 },
        } as never,
        selectedDate
      );
    });

    expect(onPatchDraft).toHaveBeenCalledWith({ schedule: toRouteTimeFromDate(selectedDate) });
    expect(result.current.activeTimeField).toBeNull();
  });

  it("confirms iOS date and opens schedule picker when schedule is empty", () => {
    const onPatchDraft = vi.fn();
    const draft = createDraft({ noticeDate: "" });
    const selectedDate = new Date(2026, 4, 2, 12, 0, 0, 0);

    const { result } = renderHook(() =>
      useRouteComposerPickers({
        routeDraft: draft,
        isOneTimeRoute: true,
        isOneTimeRoundTrip: false,
        onPatchDraft,
      })
    );

    act(() => {
      result.current.openDatePicker();
    });

    act(() => {
      result.current.handleIosDatePickerChange({} as never, selectedDate);
    });

    act(() => {
      result.current.handleConfirmIosDate();
    });

    expect(onPatchDraft).toHaveBeenCalledWith({ noticeDate: toRouteDateFromDate(selectedDate) });
    expect(result.current.isDatePickerOpen).toBe(false);
    expect(result.current.activeTimeField).toBe("schedule");
  });

  it("closes time picker on android dismiss without patching", () => {
    const onPatchDraft = vi.fn();
    const draft = createDraft();

    const { result } = renderHook(() =>
      useRouteComposerPickers({
        routeDraft: draft,
        isOneTimeRoute: false,
        isOneTimeRoundTrip: false,
        onPatchDraft,
      })
    );

    act(() => {
      result.current.openTimePicker("schedule");
    });

    act(() => {
      result.current.handleAndroidTimePickerChange(
        {
          type: "dismissed",
          nativeEvent: { timestamp: Date.now(), utcOffset: 0 },
        } as never,
        undefined
      );
    });

    expect(onPatchDraft).not.toHaveBeenCalled();
    expect(result.current.activeTimeField).toBeNull();
  });
});
