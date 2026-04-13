import { useEffect } from "react";

import { getSavedPostKeysWithoutOwnPosts } from "../../features/community/utils/savedPostKeys";
import type { RoutePost } from "../../model";

type UseSavedPostKeysCleanupOptions = {
  currentUserId: string;
  savedPostKeys: string[];
  storedPosts: RoutePost[];
  persistSavedPostKeys: (nextKeys: string[]) => Promise<void>;
};

export function useSavedPostKeysCleanup({
  currentUserId,
  savedPostKeys,
  storedPosts,
  persistSavedPostKeys,
}: UseSavedPostKeysCleanupOptions) {
  useEffect(() => {
    if (!currentUserId || !savedPostKeys.length) {
      return;
    }

    const cleanedSavedPostKeys = getSavedPostKeysWithoutOwnPosts({
      currentUserId,
      savedPostKeys,
      storedPosts,
    });
    if (cleanedSavedPostKeys.length === savedPostKeys.length) {
      return;
    }

    void persistSavedPostKeys(cleanedSavedPostKeys).catch(() => {
      // Keep cleanup quiet; storage-level load/save failures are handled elsewhere.
    });
  }, [currentUserId, persistSavedPostKeys, savedPostKeys, storedPosts]);
}
