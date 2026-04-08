import AsyncStorage from "@react-native-async-storage/async-storage";

import type { VehicleInfo } from "../../../model";
import {
  getSavedPostsStorageKey,
  getVehicleStorageKey,
  parseSavedPostKeys,
  parseVehicle,
} from "./storage";

export const loadVehicleForUser = async (userId: string): Promise<VehicleInfo> => {
  const storedVehicle = await AsyncStorage.getItem(getVehicleStorageKey(userId));
  return parseVehicle(storedVehicle);
};

export const loadSavedPostKeysForUser = async (userId: string): Promise<string[]> => {
  const savedRaw = await AsyncStorage.getItem(getSavedPostsStorageKey(userId));
  return parseSavedPostKeys(savedRaw);
};

export const persistVehicleForUser = async (userId: string, vehicle: VehicleInfo) => {
  await AsyncStorage.setItem(getVehicleStorageKey(userId), JSON.stringify(vehicle));
};

export const persistSavedPostKeysForUser = async (userId: string, nextKeys: string[]) => {
  const normalized = Array.from(
    new Set(
      nextKeys
        .map((value) => String(value ?? "").trim())
        .filter(Boolean)
    )
  );

  await AsyncStorage.setItem(getSavedPostsStorageKey(userId), JSON.stringify(normalized));
  return normalized;
};

export const clearCommunityStorageForUser = async (userId: string) => {
  await AsyncStorage.removeItem(getSavedPostsStorageKey(userId));
  await AsyncStorage.removeItem(getVehicleStorageKey(userId));
};
