import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  type FetchRoutePostsQuery,
  fetchRoutePostsFromDb,
  isRoutePostRepositoryEnabled,
  shouldSkipRoutePostsCacheWrite,
} from "../../features/community/data/routePostRepository";
import {
  POSTS_KEY,
  parsePosts,
  sortByNewest,
} from "../../features/community/utils/storage";
import type { RoutePost } from "../../model";
import { supabase } from "../../lib/supabase";
import type { AppNotice } from "../types";

type UseStoredPostsStateOptions = {
  currentUserId: string;
  shouldSyncRemotePosts: boolean;
  remoteQuery?: FetchRoutePostsQuery;
  onLoadError: (notice: AppNotice) => void;
};

export function useStoredPostsState({
  currentUserId,
  shouldSyncRemotePosts,
  remoteQuery,
  onLoadError,
}: UseStoredPostsStateOptions) {
  const [storedPosts, setStoredPosts] = useState<RoutePost[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let releaseRemoteSubscription: (() => void) | undefined;

    const syncCache = async (posts: RoutePost[]) => {
      try {
        await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(posts));
      } catch {
        // Keep UI state usable even if local cache write fails.
      }
    };

    const hydrateLocalPosts = async () => {
      const storedRoutePosts = await AsyncStorage.getItem(POSTS_KEY);
      if (cancelled) {
        return;
      }
      setStoredPosts(sortByNewest(parsePosts(storedRoutePosts)));
    };

    const refreshRemotePosts = async (showErrorNotice: boolean) => {
      if (!isRoutePostRepositoryEnabled()) {
        return false;
      }

      try {
        const remotePosts = await fetchRoutePostsFromDb(remoteQuery);
        if (cancelled) {
          return true;
        }

        setStoredPosts(remotePosts);
        if (!shouldSkipRoutePostsCacheWrite(remoteQuery)) {
          await syncCache(remotePosts);
        }
        return true;
      } catch (error) {
        if (!cancelled && showErrorNotice) {
          onLoadError({
            tone: "error",
            text: `Route DB load failed. Using local cache. (${(error as Error).message})`,
          });
        }
        return false;
      }
    };

    const hydratePosts = async () => {
      try {
        await hydrateLocalPosts();
        if (!shouldSyncRemotePosts) {
          return;
        }

        const didSyncRemote = await refreshRemotePosts(true);
        if (didSyncRemote && supabase) {
          const supabaseClient = supabase;
          const channel = supabaseClient
            .channel("route_posts:public_feed")
            .on(
              "postgres_changes",
              {
                event: "*",
                schema: "public",
                table: "route_posts",
              },
              () => {
                void refreshRemotePosts(false);
              }
            )
            .subscribe();

          releaseRemoteSubscription = () => {
            void supabaseClient.removeChannel(channel);
          };
        }
      } catch {
        if (!cancelled) {
          onLoadError({
            tone: "error",
            text: "Saved MVP data could not be loaded.",
          });
        }
      } finally {
        if (!cancelled) {
          setIsPostsLoading(false);
        }
      }
    };

    void hydratePosts();

    return () => {
      cancelled = true;
      releaseRemoteSubscription?.();
    };
  }, [currentUserId, onLoadError, remoteQuery, shouldSyncRemotePosts]);

  const persistPosts = async (nextPosts: RoutePost[]) => {
    const normalizedPosts = sortByNewest(nextPosts);
    await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(normalizedPosts));
    setStoredPosts(normalizedPosts);
  };

  return {
    storedPosts,
    isPostsLoading,
    persistPosts,
  };
}
