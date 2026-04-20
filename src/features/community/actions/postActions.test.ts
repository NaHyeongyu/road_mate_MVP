import { Alert } from "react-native";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { getAppCopy } from "../../../i18n/copy";
import { EMPTY_ROUTE_DRAFT, EMPTY_VEHICLE, type RouteDraft, type RoutePost, type VehicleInfo } from "../../../model";
import { getPostSaveKey } from "../utils/storage";
import { createCommunityPostActions } from "./postActions";
import type { CommunityActionsContext } from "./types";

const mockDeleteRoutePostInDb = vi.fn();
const mockDeactivateOneTimeRoutePostsInDb = vi.fn();
const mockIsRoutePostRepositoryEnabled = vi.fn(() => false);
const mockUpdateRouteQuickSettingsInDb = vi.fn();
const mockUpsertRoutePostInDb = vi.fn();

vi.mock("../data/routePostRepository", () => ({
  deactivateOneTimeRoutePostsInDb: (...args: unknown[]) => mockDeactivateOneTimeRoutePostsInDb(...args),
  deleteRoutePostInDb: (...args: unknown[]) => mockDeleteRoutePostInDb(...args),
  getDefaultRoutePostId: (ownerUserId: string, kind: "regular" | "one_time") => `${ownerUserId}:${kind}`,
  getNextRoutePostId: (ownerUserId: string, kind: "regular" | "one_time", uniqueToken: string) =>
    `${ownerUserId}:${kind}:${uniqueToken}`,
  isRoutePostRepositoryEnabled: () => mockIsRoutePostRepositoryEnabled(),
  updateRouteQuickSettingsInDb: (...args: unknown[]) => mockUpdateRouteQuickSettingsInDb(...args),
  upsertRoutePostInDb: (...args: unknown[]) => mockUpsertRoutePostInDb(...args),
}));

vi.mock("react-native", () => ({
  Alert: {
    alert: vi.fn(),
  },
}));

const createValidRouteDraft = (patch: Partial<RouteDraft> = {}): RouteDraft => ({
  ...EMPTY_ROUTE_DRAFT,
  kind: "regular",
  oneTimeTripType: "round_trip",
  from: "Brisbane CBD, QLD",
  to: "St Lucia, QLD",
  schedule: "08:30",
  returnSchedule: "17:30",
  availableSeats: "3",
  operatingDays: ["Mon", "Tue"],
  contactPhone: "",
  contactLink: "",
  isPublic: true,
  ...patch,
});

const createSavedVehicle = (patch: Partial<VehicleInfo> = {}): VehicleInfo => ({
  ...EMPTY_VEHICLE,
  model: "Kia Carnival",
  plate: "123ABC",
  contactPhone: "0412 345 678",
  contactLink: "",
  ...patch,
});

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
  persistSavedPostKeysMock: ReturnType<typeof vi.fn>;
} => {
  const onNoticeMock = vi.fn();
  const persistPostsMock = vi.fn(async () => undefined);
  const persistSavedPostKeysMock = vi.fn(async () => undefined);

  const context: CommunityActionsContext = {
    currentUserId: "user-1",
    currentUserName: "Driver One",
    mainTab: "home",
    hasVehicle: true,
    storedPosts: [],
    savedPostKeys: [],
    savedPostKeySet: new Set<string>(),
    routeDraft: createValidRouteDraft(),
    savedVehicle: createSavedVehicle(),
    vehicleDraft: createSavedVehicle(),
    setMode: vi.fn(),
    setFilter: vi.fn(),
    setStateFilter: vi.fn(),
    setMainTab: vi.fn(),
    setRouteDraft: vi.fn(),
    resetAllRouteDrafts: vi.fn(),
    onNotice: onNoticeMock,
    copy: getAppCopy("en"),
    persistPosts: persistPostsMock,
    persistSavedPostKeys: persistSavedPostKeysMock,
    persistVehicle: vi.fn(async () => undefined),
    clearCurrentUserStorage: vi.fn(async () => undefined),
  };

  const merged = {
    ...context,
    ...patch,
  };

  return {
    ...merged,
    onNoticeMock,
    persistPostsMock,
    persistSavedPostKeysMock,
  };
};

describe("createCommunityPostActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsRoutePostRepositoryEnabled.mockReturnValue(false);
  });

  it("returns error and false when posting without signed-in user", async () => {
    const ctx = createContext({ currentUserId: "" });
    const { postRoute } = createCommunityPostActions(ctx);

    const result = await postRoute();

    expect(result).toBe(false);
    expect(ctx.persistPostsMock).not.toHaveBeenCalled();
    expect(ctx.onNoticeMock).toHaveBeenCalledWith({
      tone: "error",
      text: "Sign in before posting a route.",
    });
  });

  it("posts regular route locally and emits success notice when repository is disabled", async () => {
    const existing = createPost({ id: "existing", kind: "regular", createdAt: "2026-04-12T00:00:00.000Z" });
    const ctx = createContext({ storedPosts: [existing] });
    const { postRoute } = createCommunityPostActions(ctx);

    const result = await postRoute();

    expect(result).toBe(true);
    expect(ctx.persistPostsMock).toHaveBeenCalledTimes(1);
    const persistedPosts = ctx.persistPostsMock.mock.calls[0]?.[0] as RoutePost[];
    expect(persistedPosts).toHaveLength(1);
    expect(persistedPosts[0]?.id).toBe("existing");
    expect(persistedPosts[0]?.ownerUserId).toBe("user-1");
    expect(ctx.onNoticeMock).toHaveBeenCalledWith({
      tone: "success",
      text: "Regular registration updated and shared to riders.",
    });
  });

  it("keeps previous one-time notices and creates a new active notice when none is active", async () => {
    const previousNotice = createPost({
      id: "notice-old",
      kind: "one_time",
      noticeDate: "2026-04-10",
      createdAt: "2026-04-10T00:00:00.000Z",
      isActive: true,
      availableSeats: 1,
      operatingDays: [],
      returnSchedule: undefined,
    });
    const ctx = createContext({
      storedPosts: [previousNotice],
      routeDraft: createValidRouteDraft({
        kind: "one_time",
        oneTimeTripType: "one_way",
        noticeDate: "2026-04-20",
        schedule: "09:00",
        returnSchedule: "",
      }),
    });
    const { postRoute } = createCommunityPostActions(ctx);

    const result = await postRoute();

    expect(result).toBe(true);
    const persistedPosts = ctx.persistPostsMock.mock.calls[0]?.[0] as RoutePost[];
    expect(persistedPosts).toHaveLength(2);
    expect(persistedPosts[0]?.kind).toBe("one_time");
    expect(persistedPosts[0]?.isActive).toBe(true);
    expect(persistedPosts[0]?.vehicleModel).toBe("Kia Carnival");
    expect(persistedPosts[0]?.vehiclePlate).toBe("123ABC");
    expect(persistedPosts[0]?.contactPhone).toBe("0412 345 678");
    expect(persistedPosts[1]?.id).toBe("notice-old");
    expect(persistedPosts[1]?.isActive).toBe(false);
    expect(ctx.onNoticeMock).toHaveBeenCalledWith({
      tone: "success",
      text: "One-time notice posted and shared to riders.",
    });
  });

  it("blocks one-time notices when saved driver profile has no contact method", async () => {
    const ctx = createContext({
      savedVehicle: createSavedVehicle({ contactPhone: "", contactLink: "" }),
      routeDraft: createValidRouteDraft({
        kind: "one_time",
        oneTimeTripType: "one_way",
        noticeDate: "2026-04-20",
        schedule: "09:00",
        returnSchedule: "",
      }),
    });
    const { postRoute } = createCommunityPostActions(ctx);

    const result = await postRoute();

    expect(result).toBe(false);
    expect(ctx.persistPostsMock).not.toHaveBeenCalled();
    expect(ctx.onNoticeMock).toHaveBeenCalledWith({
      tone: "error",
      text: "Add at least one contact method in driver profile (phone or chat link).",
    });
  });

  it("toggles saved post key by adding and removing", async () => {
    const post = createPost({ id: "route-2", ownerUserId: "driver-2" });
    const key = getPostSaveKey(post);

    const addCtx = createContext({ savedPostKeys: [], savedPostKeySet: new Set<string>() });
    const { toggleSavedPost: addToggle } = createCommunityPostActions(addCtx);

    await addToggle(post);

    expect(addCtx.persistSavedPostKeysMock).toHaveBeenCalledWith([key]);

    const removeCtx = createContext({
      savedPostKeys: [key, "other:1"],
      savedPostKeySet: new Set<string>([key, "other:1"]),
    });
    const { toggleSavedPost: removeToggle } = createCommunityPostActions(removeCtx);

    await removeToggle(post);

    expect(removeCtx.persistSavedPostKeysMock).toHaveBeenCalledWith(["other:1"]);
  });

  it("asks for confirmation before removing a route", async () => {
    const targetPost = createPost({ id: "route-delete", ownerUserId: "user-1" });
    const ctx = createContext({ storedPosts: [targetPost] });
    const { removeRoute } = createCommunityPostActions(ctx);

    await removeRoute(targetPost.id);

    expect(Alert.alert).toHaveBeenCalledWith(
      "Delete Regular?",
      "This will remove this Regular registration from rider search. This cannot be undone.",
      expect.any(Array),
      { cancelable: true }
    );
    expect(ctx.persistPostsMock).not.toHaveBeenCalled();
  });

  it("removes a route after confirmation", async () => {
    const targetPost = createPost({ id: "route-delete", ownerUserId: "user-1" });
    const otherPost = createPost({ id: "other", ownerUserId: "user-2" });
    const ctx = createContext({ storedPosts: [targetPost, otherPost] });
    vi.mocked(Alert.alert).mockImplementation((_, __, buttons) => {
      buttons?.[1]?.onPress?.();
    });
    const { removeRoute } = createCommunityPostActions(ctx);

    await removeRoute(targetPost.id);
    await Promise.resolve();

    expect(ctx.persistPostsMock).toHaveBeenCalledWith([otherPost]);
    expect(ctx.onNoticeMock).toHaveBeenCalledWith({
      tone: "info",
      text: "Route removed.",
    });
  });

  it("updates quick settings locally with normalized seats when target route exists", async () => {
    const targetPost = createPost({ kind: "regular", availableSeats: 3, isPublic: true });
    const otherPost = createPost({ id: "other", ownerUserId: "driver-2", availableSeats: 2 });
    const ctx = createContext({ storedPosts: [targetPost, otherPost] });
    const { saveRouteQuickSettings } = createCommunityPostActions(ctx);

    await saveRouteQuickSettings({ kind: "regular", availableSeats: 99, isPublic: false });

    expect(ctx.persistPostsMock).toHaveBeenCalledTimes(1);
    const persistedPosts = ctx.persistPostsMock.mock.calls[0]?.[0] as RoutePost[];
    const updatedTarget = persistedPosts.find((post) => post.id === targetPost.id);
    expect(updatedTarget?.availableSeats).toBe(8);
    expect(updatedTarget?.isPublic).toBe(false);
    expect(mockUpdateRouteQuickSettingsInDb).not.toHaveBeenCalled();
  });

  it("shows info notice when quick settings are requested before registration exists", async () => {
    const ctx = createContext({ storedPosts: [] });
    const { saveRouteQuickSettings } = createCommunityPostActions(ctx);

    await saveRouteQuickSettings({ kind: "regular", availableSeats: 4, isPublic: true });

    expect(ctx.persistPostsMock).not.toHaveBeenCalled();
    expect(ctx.onNoticeMock).toHaveBeenCalledWith({
      tone: "info",
      text: "Save registration first before changing seats or visibility.",
    });
  });
});
