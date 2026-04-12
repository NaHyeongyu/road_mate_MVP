import { useEffect, useState } from "react";

import type { AppNotice } from "../../../app/types";
import { EMPTY_VEHICLE, type VehicleInfo } from "../../../model";
import {
  fetchMyDriverProfileFromDb,
  isDriverProfileRepositoryEnabled,
  upsertMyDriverProfileInDb,
} from "../data/driverProfileRepository";
import {
  clearCommunityStorageForUser,
  loadSavedPostKeysForUser,
  loadVehicleForUser,
  persistSavedPostKeysForUser,
  persistVehicleForUser,
} from "../utils/userCommunityStorage";

type UseUserCommunityStorageStateOptions = {
  currentUserId: string;
  onLoadError: (notice: AppNotice) => void;
};

export function useUserCommunityStorageState({
  currentUserId,
  onLoadError,
}: UseUserCommunityStorageStateOptions) {
  const [vehicleDraft, setVehicleDraft] = useState<VehicleInfo>(EMPTY_VEHICLE);
  const [savedVehicle, setSavedVehicle] = useState<VehicleInfo>(EMPTY_VEHICLE);
  const [savedPostKeys, setSavedPostKeys] = useState<string[]>([]);
  const [isVehicleLoading, setIsVehicleLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const hydrateVehicle = async () => {
      if (!currentUserId) {
        setSavedVehicle(EMPTY_VEHICLE);
        setVehicleDraft(EMPTY_VEHICLE);
        setIsVehicleLoading(false);
        return;
      }

      setIsVehicleLoading(true);

      try {
        const localVehicle = await loadVehicleForUser(currentUserId);
        if (cancelled) {
          return;
        }

        setSavedVehicle(localVehicle);
        setVehicleDraft(localVehicle);

        if (isDriverProfileRepositoryEnabled()) {
          try {
            const remoteVehicle = await fetchMyDriverProfileFromDb(currentUserId);
            if (cancelled || !remoteVehicle) {
              return;
            }

            setSavedVehicle(remoteVehicle);
            setVehicleDraft(remoteVehicle);
            await persistVehicleForUser(currentUserId, remoteVehicle);
          } catch {
            if (!cancelled) {
              onLoadError({
                tone: "error",
                text: "Driver profile DB load failed. Using saved profile on this device.",
              });
            }
          }
        }
      } catch {
        if (!cancelled) {
          setSavedVehicle(EMPTY_VEHICLE);
          setVehicleDraft(EMPTY_VEHICLE);
          onLoadError({
            tone: "error",
            text: "Your saved vehicle could not be loaded for this account.",
          });
        }
      } finally {
        if (!cancelled) {
          setIsVehicleLoading(false);
        }
      }
    };

    void hydrateVehicle();

    return () => {
      cancelled = true;
    };
  }, [currentUserId, onLoadError]);

  useEffect(() => {
    let cancelled = false;

    const hydrateSavedPosts = async () => {
      if (!currentUserId) {
        setSavedPostKeys([]);
        return;
      }

      try {
        const nextKeys = await loadSavedPostKeysForUser(currentUserId);
        if (cancelled) {
          return;
        }

        setSavedPostKeys(nextKeys);
      } catch {
        if (!cancelled) {
          setSavedPostKeys([]);
          onLoadError({
            tone: "error",
            text: "Your saved rides could not be loaded for this account.",
          });
        }
      }
    };

    void hydrateSavedPosts();

    return () => {
      cancelled = true;
    };
  }, [currentUserId, onLoadError]);

  const persistVehicle = async (nextVehicle: VehicleInfo) => {
    if (!currentUserId) {
      return;
    }

    let vehicleToPersist = nextVehicle;
    if (isDriverProfileRepositoryEnabled()) {
      try {
        vehicleToPersist = await upsertMyDriverProfileInDb(currentUserId, nextVehicle);
      } catch {
        onLoadError({
          tone: "error",
          text: "Driver profile DB sync failed. Saved only on this device.",
        });
      }
    }

    await persistVehicleForUser(currentUserId, vehicleToPersist);
    setSavedVehicle(vehicleToPersist);
    setVehicleDraft(vehicleToPersist);
  };

  const persistSavedPostKeys = async (nextKeys: string[]) => {
    if (!currentUserId) {
      return;
    }

    const normalized = await persistSavedPostKeysForUser(currentUserId, nextKeys);
    setSavedPostKeys(normalized);
  };

  const clearCurrentUserStorage = async () => {
    if (!currentUserId) {
      return;
    }

    await clearCommunityStorageForUser(currentUserId);
    setSavedPostKeys([]);
    setSavedVehicle(EMPTY_VEHICLE);
    setVehicleDraft(EMPTY_VEHICLE);
  };

  return {
    vehicleDraft,
    setVehicleDraft,
    savedVehicle,
    savedPostKeys,
    isVehicleLoading,
    persistSavedPostKeys,
    persistVehicle,
    clearCurrentUserStorage,
  };
}
