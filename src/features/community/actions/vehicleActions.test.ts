import { beforeEach, describe, expect, it, vi } from "vitest";

import { getAppCopy } from "../../../i18n/copy";
import { EMPTY_ROUTE_DRAFT, EMPTY_VEHICLE, type VehicleInfo } from "../../../model";
import { createCommunityVehicleActions } from "./vehicleActions";
import type { CommunityActionsContext } from "./types";

const createVehicleDraft = (patch: Partial<VehicleInfo> = {}): VehicleInfo => ({
  ...EMPTY_VEHICLE,
  model: " Kia Carnival ",
  plate: " ab-123 ",
  note: "  note  ",
  contactPhone: " 0412 345 678 ",
  contactLink: " https://open.kakao.com/o/abc ",
  ...patch,
});

const createContext = (
  patch: Partial<CommunityActionsContext> = {}
): CommunityActionsContext & {
  onNoticeMock: ReturnType<typeof vi.fn>;
  persistVehicleMock: ReturnType<typeof vi.fn>;
} => {
  const onNoticeMock = vi.fn();
  const persistVehicleMock = vi.fn(async () => undefined);

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
    vehicleDraft: createVehicleDraft(),
    setMode: vi.fn(),
    setFilter: vi.fn(),
    setStateFilter: vi.fn(),
    setMainTab: vi.fn(),
    setRouteDraft: vi.fn(),
    resetAllRouteDrafts: vi.fn(),
    onNotice: onNoticeMock,
    copy: getAppCopy("en"),
    persistPosts: vi.fn(async () => undefined),
    persistSavedPostKeys: vi.fn(async () => undefined),
    persistVehicle: persistVehicleMock,
    clearCurrentUserStorage: vi.fn(async () => undefined),
  };

  return {
    ...base,
    ...patch,
    onNoticeMock,
    persistVehicleMock,
  };
};

describe("createCommunityVehicleActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("blocks saving vehicle when user is not signed in", async () => {
    const ctx = createContext({ currentUserId: "" });
    const { saveVehicle } = createCommunityVehicleActions(ctx);

    await saveVehicle();

    expect(ctx.persistVehicleMock).not.toHaveBeenCalled();
    expect(ctx.onNoticeMock).toHaveBeenCalledWith({
      tone: "error",
      text: "Sign in before saving a vehicle.",
    });
  });

  it("validates required model and plate", async () => {
    const ctx = createContext({ vehicleDraft: createVehicleDraft({ model: "", plate: "" }) });
    const { saveVehicle } = createCommunityVehicleActions(ctx);

    await saveVehicle();

    expect(ctx.persistVehicleMock).not.toHaveBeenCalled();
    expect(ctx.onNoticeMock).toHaveBeenCalledWith({
      tone: "error",
      text: "Driver needs at least a car model and plate number.",
    });
  });

  it("normalizes and persists vehicle profile", async () => {
    const ctx = createContext();
    const { saveVehicle } = createCommunityVehicleActions(ctx);

    await saveVehicle();

    expect(ctx.persistVehicleMock).toHaveBeenCalledWith({
      model: "Kia Carnival",
      plate: "AB-123",
      note: "note",
      contactPhone: "0412 345 678",
      contactLink: "https://open.kakao.com/o/abc",
    });
    expect(ctx.onNoticeMock).toHaveBeenCalledWith({
      tone: "success",
      text: "Driver profile saved.",
    });
  });
});
