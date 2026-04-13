import { act, renderHook } from "@testing-library/react";
import type { RefObject } from "react";
import type { TextInput } from "react-native";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { RouteDraft } from "../../../../../model";
import { useRouteComposerPlaces } from "./useRouteComposerPlaces";

const createDraft = (patch: Partial<RouteDraft> = {}): RouteDraft => ({
  kind: "regular",
  oneTimeTripType: "round_trip",
  noticeDate: "",
  from: "Brisbane",
  to: "St Lucia",
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

const createToInputRef = (focus = vi.fn()): RefObject<TextInput | null> =>
  ({
    current: { focus } as unknown as TextInput,
  }) as RefObject<TextInput | null>;

describe("useRouteComposerPlaces", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows from suggestions when the from field is focused", () => {
    const onPatchDraft = vi.fn();
    const onCompleteDestination = vi.fn();
    const toInputRef = createToInputRef();

    const { result } = renderHook(() =>
      useRouteComposerPlaces({
        routeDraft: createDraft({ from: "bris" }),
        toInputRef,
        onPatchDraft,
        onCompleteDestination,
      })
    );

    expect(result.current.showFromSuggestions).toBe(false);

    act(() => {
      result.current.handleFromFocus();
    });

    expect(result.current.fromSuggestions.length).toBeGreaterThan(0);
    expect(result.current.showFromSuggestions).toBe(true);
  });

  it("selecting a from suggestion patches draft and focuses the to input", () => {
    const onPatchDraft = vi.fn();
    const onCompleteDestination = vi.fn();
    const focus = vi.fn();
    const toInputRef = createToInputRef(focus);

    const { result } = renderHook(() =>
      useRouteComposerPlaces({
        routeDraft: createDraft({ from: "bris" }),
        toInputRef,
        onPatchDraft,
        onCompleteDestination,
      })
    );

    act(() => {
      result.current.handleSelectFromSuggestion("Brisbane CBD, QLD");
    });

    expect(onPatchDraft).toHaveBeenCalledWith({ from: "Brisbane CBD, QLD" });
    expect(focus).toHaveBeenCalledTimes(1);
  });

  it("closes from suggestions after blur timeout", () => {
    const onPatchDraft = vi.fn();
    const onCompleteDestination = vi.fn();
    const toInputRef = createToInputRef();

    const { result } = renderHook(() =>
      useRouteComposerPlaces({
        routeDraft: createDraft({ from: "bris" }),
        toInputRef,
        onPatchDraft,
        onCompleteDestination,
      })
    );

    act(() => {
      result.current.handleFromFocus();
    });
    expect(result.current.showFromSuggestions).toBe(true);

    act(() => {
      result.current.handleFromBlur();
      vi.advanceTimersByTime(120);
    });

    expect(result.current.showFromSuggestions).toBe(false);
  });

  it("selecting a to suggestion patches draft, closes suggestions, and triggers completion", () => {
    const onPatchDraft = vi.fn();
    const onCompleteDestination = vi.fn();
    const toInputRef = createToInputRef();

    const { result } = renderHook(() =>
      useRouteComposerPlaces({
        routeDraft: createDraft({ to: "st" }),
        toInputRef,
        onPatchDraft,
        onCompleteDestination,
      })
    );

    act(() => {
      result.current.handleToFocus();
      result.current.handleSelectToSuggestion("St Lucia, QLD");
    });

    expect(onPatchDraft).toHaveBeenCalledWith({ to: "St Lucia, QLD" });
    expect(onCompleteDestination).toHaveBeenCalledTimes(1);
    expect(result.current.showToSuggestions).toBe(false);
  });
});
