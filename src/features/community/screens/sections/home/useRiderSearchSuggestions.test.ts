import { act, renderHook } from "@testing-library/react";
import type { RefObject } from "react";
import type { TextInput } from "react-native";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useRiderSearchSuggestions } from "./useRiderSearchSuggestions";

vi.mock("react-native", () => ({
  Keyboard: {
    dismiss: vi.fn(),
  },
}));

const createToInputRef = (focus = vi.fn()): RefObject<TextInput | null> =>
  ({
    current: { focus } as unknown as TextInput,
  }) as RefObject<TextInput | null>;

describe("useRiderSearchSuggestions", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("keeps typed from text out of the rider search query until a suggestion is selected", () => {
    const onFromSearchQueryChange = vi.fn();
    const onToSearchQueryChange = vi.fn();
    const toInputRef = createToInputRef();

    const { result } = renderHook(() =>
      useRiderSearchSuggestions({
        stateFilter: "ALL",
        fromSearchQuery: "",
        toSearchQuery: "",
        toInputRef,
        onFromSearchQueryChange,
        onToSearchQueryChange,
      })
    );

    act(() => {
      result.current.handleFromChangeText("123 George St");
    });

    expect(result.current.fromInputValue).toBe("123 George St");
    expect(result.current.hasSelectedFrom).toBe(false);
    expect(onFromSearchQueryChange).not.toHaveBeenCalled();
  });

  it("selecting a from suggestion commits the rider search query and focuses destination", () => {
    const onFromSearchQueryChange = vi.fn();
    const onToSearchQueryChange = vi.fn();
    const focus = vi.fn();
    const toInputRef = createToInputRef(focus);

    const { result } = renderHook(() =>
      useRiderSearchSuggestions({
        stateFilter: "ALL",
        fromSearchQuery: "",
        toSearchQuery: "",
        toInputRef,
        onFromSearchQueryChange,
        onToSearchQueryChange,
      })
    );

    act(() => {
      result.current.handleSelectFromSuggestion("Sydney CBD, NSW");
    });

    expect(onFromSearchQueryChange).toHaveBeenCalledWith("Sydney CBD, NSW");
    expect(focus).toHaveBeenCalledTimes(1);
  });

  it("resolves exact typed suggestions when search is submitted", () => {
    const onFromSearchQueryChange = vi.fn();
    const onToSearchQueryChange = vi.fn();
    const toInputRef = createToInputRef();

    const { result } = renderHook(() =>
      useRiderSearchSuggestions({
        stateFilter: "ALL",
        fromSearchQuery: "",
        toSearchQuery: "",
        toInputRef,
        onFromSearchQueryChange,
        onToSearchQueryChange,
      })
    );

    act(() => {
      result.current.handleFromChangeText("Sydney CBD NSW 2000");
      result.current.handleToChangeText("North Sydney NSW");
    });

    expect(result.current.canResolveFromInput).toBe(true);
    expect(result.current.canResolveToInput).toBe(true);

    act(() => {
      expect(result.current.resolvePendingSearchSelections()).toMatchObject({
        isValid: true,
        from: "Sydney CBD, NSW",
        to: "North Sydney, NSW",
      });
    });

    expect(onFromSearchQueryChange).toHaveBeenCalledWith("Sydney CBD, NSW");
    expect(onToSearchQueryChange).toHaveBeenCalledWith("North Sydney, NSW");
  });

  it("rejects typed search text that does not exactly match a suggestion", () => {
    const onFromSearchQueryChange = vi.fn();
    const onToSearchQueryChange = vi.fn();
    const toInputRef = createToInputRef();

    const { result } = renderHook(() =>
      useRiderSearchSuggestions({
        stateFilter: "ALL",
        fromSearchQuery: "",
        toSearchQuery: "",
        toInputRef,
        onFromSearchQueryChange,
        onToSearchQueryChange,
      })
    );

    act(() => {
      result.current.handleFromChangeText("123 George St");
      result.current.handleToChangeText("North Sydney NSW");
    });

    expect(result.current.canResolveFromInput).toBe(false);

    act(() => {
      expect(result.current.resolvePendingSearchSelections()).toMatchObject({
        isValid: false,
        invalidField: "from",
      });
    });

    expect(onFromSearchQueryChange).not.toHaveBeenCalled();
  });

  it("restores unselected rider search text on blur", () => {
    const onFromSearchQueryChange = vi.fn();
    const onToSearchQueryChange = vi.fn();
    const toInputRef = createToInputRef();

    const { result } = renderHook(() =>
      useRiderSearchSuggestions({
        stateFilter: "ALL",
        fromSearchQuery: "Brisbane CBD, QLD",
        toSearchQuery: "",
        toInputRef,
        onFromSearchQueryChange,
        onToSearchQueryChange,
      })
    );

    act(() => {
      result.current.handleFromFocus();
      result.current.handleFromChangeText("123 George St");
      result.current.handleFromBlur();
      vi.advanceTimersByTime(120);
    });

    expect(result.current.fromInputValue).toBe("Brisbane CBD, QLD");
    expect(result.current.hasSelectedFrom).toBe(true);
    expect(onFromSearchQueryChange).not.toHaveBeenCalled();
  });
});
