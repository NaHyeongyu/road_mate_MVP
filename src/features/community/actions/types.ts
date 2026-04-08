import type { AppNotice } from "../../../app/types";
import type { RouteDraft, RouteKind, RoutePost, VehicleInfo } from "../../../model";
import type { Filter, MainTab, Mode } from "../types";

export type CommunityActionsContext = {
  currentUserId: string;
  currentUserName: string;
  mainTab: MainTab;
  hasVehicle: boolean;
  storedPosts: RoutePost[];
  savedPostKeys: string[];
  savedPostKeySet: Set<string>;
  routeDraft: RouteDraft;
  savedVehicle: VehicleInfo;
  vehicleDraft: VehicleInfo;
  setMode: (value: Mode) => void;
  setFilter: (value: Filter) => void;
  setMainTab: (value: MainTab) => void;
  setRouteDraft: (value: RouteDraft) => void;
  resetAllRouteDrafts: () => void;
  onNotice: (notice: AppNotice) => void;
  persistPosts: (nextPosts: RoutePost[]) => Promise<void>;
  persistSavedPostKeys: (nextKeys: string[]) => Promise<void>;
  persistVehicle: (nextVehicle: VehicleInfo) => Promise<void>;
  clearCurrentUserStorage: () => Promise<void>;
};

export type RouteQuickSettingsInput = {
  kind: RouteKind;
  availableSeats: number;
  isPublic: boolean;
};
