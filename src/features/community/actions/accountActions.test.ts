import { waitFor } from "@testing-library/react";
import { Alert } from "react-native";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getAppCopy } from "../../../i18n/copy";
import { EMPTY_ROUTE_DRAFT, EMPTY_VEHICLE, type RoutePost } from "../../../model";
import { createCommunityAccountActions } from "./accountActions";
import type { CommunityActionsContext } from "./types";

const mocked = vi.hoisted(() => ({
  deleteMyRoutePostsInDb: vi.fn(),
  hideMyRoutePostsForAccountDeletionInDb: vi.fn(),
  isRoutePostRepositoryEnabled: vi.fn(() => false),
  deleteMyDriverProfileInDb: vi.fn(),
  isDriverProfileRepositoryEnabled: vi.fn(() => false),
  updateUser: vi.fn(async () => ({ error: null })),
  signOut: vi.fn(async () => ({ error: null })),
}));

vi.mock("../data/routePostRepository", () => ({
  deleteMyRoutePostsInDb: (...args: unknown[]) => mocked.deleteMyRoutePostsInDb(...args),
  hideMyRoutePostsForAccountDeletionInDb: (...args: unknown[]) =>
    mocked.hideMyRoutePostsForAccountDeletionInDb(...args),
  isRoutePostRepositoryEnabled: () => mocked.isRoutePostRepositoryEnabled(),
}));

vi.mock("../data/driverProfileRepository", () => ({
  deleteMyDriverProfileInDb: (...args: unknown[]) => mocked.deleteMyDriverProfileInDb(...args),
  isDriverProfileRepositoryEnabled: () => mocked.isDriverProfileRepositoryEnabled(),
}));

vi.mock("../../../lib/supabase", () => ({
  supabase: {
    auth: {
      updateUser: mocked.updateUser,
      signOut: mocked.signOut,
    },
  },
  isSupabaseConfigured: true,
}));

vi.mock("react-native", () => ({
  Alert: {
    alert: vi.fn(),
  },
}));

const createPost = (patch: Partial<RoutePost> = {}): RoutePost => ({
  id: "route-1",
  kind: "regular",
  oneTimeTripType: undefined,
  noticeDate: undefined,
  from: "Brisbane CBD, QLD",
  to: "St Lucia, QLD",
  schedule: "08:30",
  returnSchedule: "17:30",
  availableSeats: 3,
  operatingDays: ["Mon", "Tue"],
  contactPhone: "0412 345 678",
  contactLink: "",
  note: "",
  vehicleModel: "Kia Carnival",
  vehiclePlate: "123ABC",
  ownerUserId: "user-1",
  ownerName: "Driver One",
  isPublic: true,
  createdAt: "2026-04-13T00:00:00.000Z",
  ...patch,
});

const createContext = (
  patch: Partial<CommunityActionsContext> = {}
): CommunityActionsContext & {
  onNoticeMock: ReturnType<typeof vi.fn>;
  persistPostsMock: ReturnType<typeof vi.fn>;
  clearCurrentUserStorageMock: ReturnType<typeof vi.fn>;
  setModeMock: ReturnType<typeof vi.fn>;
  setFilterMock: ReturnType<typeof vi.fn>;
  setStateFilterMock: ReturnType<typeof vi.fn>;
  setMainTabMock: ReturnType<typeof vi.fn>;
  resetAllRouteDraftsMock: ReturnType<typeof vi.fn>;
} => {
  const onNoticeMock = vi.fn();
  const persistPostsMock = vi.fn(async () => undefined);
  const clearCurrentUserStorageMock = vi.fn(async () => undefined);
  const setModeMock = vi.fn();
  const setFilterMock = vi.fn();
  const setStateFilterMock = vi.fn();
  const setMainTabMock = vi.fn();
  const resetAllRouteDraftsMock = vi.fn();

  const base: CommunityActionsContext = {
    currentUserId: "user-1",
    currentUserName: "Driver One",
    mainTab: "home",
    hasVehicle: true,
    storedPosts: [],
    savedPostKeys: [],
    savedPostKeySet: new Set<string>(),
    routeDraft: EMPTY_ROUTE_DRAFT,
    savedVehicle: EMPTY_VEHICLE,
    vehicleDraft: EMPTY_VEHICLE,
    setMode: setModeMock,
    setFilter: setFilterMock,
    setStateFilter: setStateFilterMock,
    setMainTab: setMainTabMock,
    setRouteDraft: vi.fn(),
    resetAllRouteDrafts: resetAllRouteDraftsMock,
    onNotice: onNoticeMock,
    copy: getAppCopy("en"),
    persistPosts: persistPostsMock,
    persistSavedPostKeys: vi.fn(async () => undefined),
    persistVehicle: vi.fn(async () => undefined),
    clearCurrentUserStorage: clearCurrentUserStorageMock,
  };

  return {
    ...base,
    ...patch,
    onNoticeMock,
    persistPostsMock,
    clearCurrentUserStorageMock,
    setModeMock,
    setFilterMock,
    setStateFilterMock,
    setMainTabMock,
    resetAllRouteDraftsMock,
  };
};

describe("createCommunityAccountActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocked.isRoutePostRepositoryEnabled.mockReturnValue(false);
    mocked.isDriverProfileRepositoryEnabled.mockReturnValue(false);
    mocked.updateUser.mockResolvedValue({ error: null });
    mocked.signOut.mockResolvedValue({ error: null });
  });

  it("switches to driver mode and shows info when vehicle is missing", () => {
    const ctx = createContext({ hasVehicle: false });
    const { handleModeChange } = createCommunityAccountActions(ctx);

    handleModeChange("driver");

    expect(ctx.setModeMock).toHaveBeenCalledWith("driver");
    expect(ctx.setMainTabMock).toHaveBeenCalledWith("home");
    expect(ctx.onNoticeMock).toHaveBeenCalledWith({
      tone: "info",
      text: "Complete driver registration first: save your car model and plate.",
    });
  });

  it("switches rider mode from saved tab back to home", () => {
    const ctx = createContext({ mainTab: "saved" });
    const { handleModeChange } = createCommunityAccountActions(ctx);

    handleModeChange("rider");

    expect(ctx.setModeMock).toHaveBeenCalledWith("rider");
    expect(ctx.setMainTabMock).toHaveBeenCalledWith("home");
  });

  it("blocks withdrawal when user is not signed in", () => {
    const ctx = createContext({ currentUserId: "" });
    const { withdrawAccount } = createCommunityAccountActions(ctx);

    withdrawAccount();

    expect(Alert.alert).not.toHaveBeenCalled();
    expect(ctx.onNoticeMock).toHaveBeenCalledWith({
      tone: "error",
      text: "Sign in before leaving the community.",
    });
  });

  it("completes withdrawal flow after confirmation", async () => {
    mocked.isRoutePostRepositoryEnabled.mockReturnValue(true);
    mocked.isDriverProfileRepositoryEnabled.mockReturnValue(true);

    const ownPost = createPost({ id: "own", ownerUserId: "user-1" });
    const otherPost = createPost({ id: "other", ownerUserId: "user-2" });
    const ctx = createContext({ storedPosts: [ownPost, otherPost] });

    vi.mocked(Alert.alert).mockImplementation((_, __, buttons) => {
      const withdrawButton = buttons?.find((button) => button.text === "Request deletion");
      withdrawButton?.onPress?.();
    });

    const { withdrawAccount } = createCommunityAccountActions(ctx);

    withdrawAccount();

    await waitFor(() => {
      expect(mocked.signOut).toHaveBeenCalledTimes(1);
    });

    expect(ctx.persistPostsMock).toHaveBeenCalledWith([otherPost]);
    expect(ctx.clearCurrentUserStorageMock).toHaveBeenCalledTimes(1);
    expect(mocked.hideMyRoutePostsForAccountDeletionInDb).toHaveBeenCalledWith("user-1");
    expect(mocked.deleteMyRoutePostsInDb).not.toHaveBeenCalled();
    expect(mocked.deleteMyDriverProfileInDb).not.toHaveBeenCalled();
    expect(mocked.updateUser).toHaveBeenCalledTimes(1);
    expect(mocked.updateUser).toHaveBeenCalledWith({
      data: expect.objectContaining({
        account_status: "deletion_requested",
        deletion_retention_days: 30,
      }),
    });
    expect(mocked.signOut).toHaveBeenCalledTimes(1);

    expect(ctx.setModeMock).toHaveBeenCalledWith("rider");
    expect(ctx.setFilterMock).toHaveBeenCalledWith("regular");
    expect(ctx.setStateFilterMock).toHaveBeenCalledWith("ALL");
    expect(ctx.setMainTabMock).toHaveBeenCalledWith("home");
    expect(ctx.resetAllRouteDraftsMock).toHaveBeenCalledTimes(1);

    expect(ctx.onNoticeMock).toHaveBeenCalledWith({
      tone: "success",
      text:
        "Account deletion requested. Your data is retained for 30 days, hidden from public search, and you have been signed out.",
    });
  });
});
