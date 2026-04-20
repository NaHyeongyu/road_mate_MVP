import { Alert } from "react-native";

import type { RoutePost } from "../../../model";
import {
  deactivateOneTimeRoutePostsInDb,
  deleteRoutePostInDb,
  getDefaultRoutePostId,
  getNextRoutePostId,
  isRoutePostRepositoryEnabled,
  updateRouteQuickSettingsInDb,
  upsertRoutePostInDb,
} from "../data/routePostRepository";
import { buildRoutePost, validateRoutePost } from "../utils/routeDraft";
import {
  getPostSaveKey,
  isActiveOneTimePost,
  kindLabel,
  sortByNewest,
} from "../utils/storage";
import type { CommunityActionsContext, RouteQuickSettingsInput } from "./types";

const describeRouteDbError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error ?? "Unknown error");

  if (message.includes('relation "route_posts" does not exist')) {
    return "Supabase route_posts table is missing. Run docs/supabase-route-posts.sql.";
  }
  if (message.includes('column "notice_date" of relation "route_posts" does not exist')) {
    return "Supabase notice_date column is missing. Apply latest route_posts migration.";
  }
  if (message.toLowerCase().includes("row-level security")) {
    return "Supabase RLS policy blocked this action. Check route_posts policies.";
  }
  if (message.includes("route_posts_owner_kind_key")) {
    return "Route uniqueness conflict detected. Retry once after app refresh.";
  }
  if (message.includes("route_posts_owner_active_one_time_key")) {
    return "Only one active one-time notice can be kept at a time.";
  }

  return message;
};

export const createCommunityPostActions = (context: CommunityActionsContext) => {
  const { copy } = context;

  const postRoute = async (): Promise<boolean> => {
    if (!context.currentUserId) {
      context.onNotice({
        tone: "error",
        text: copy.notices.signInBeforePosting,
      });
      return false;
    }

    if (!context.savedVehicle.model || !context.savedVehicle.plate) {
      context.onNotice({
        tone: "error",
        text: copy.notices.saveVehicleInfoFirst,
      });
      return false;
    }

    const nextRoute = buildRoutePost({
      routeDraft: context.routeDraft,
      savedVehicle: context.savedVehicle,
      currentUserId: context.currentUserId,
      currentUserName: context.currentUserName,
    });
    const validationError = validateRoutePost(nextRoute, copy.validation);
    if (validationError) {
      context.onNotice({
        tone: "error",
        text: validationError,
      });
      return false;
    }

    const existingRoute =
      nextRoute.kind === "one_time"
        ? context.storedPosts.find(
            (post) =>
              post.ownerUserId === context.currentUserId && isActiveOneTimePost(post)
          )
        : context.storedPosts.find(
            (post) => post.ownerUserId === context.currentUserId && post.kind === nextRoute.kind
          );
    const createdAt = existingRoute?.createdAt ?? new Date().toISOString();
    const shouldArchiveExistingOneTimePosts = nextRoute.kind === "one_time" && !existingRoute;
    const routeToPersist: RoutePost = {
      ...nextRoute,
      id:
        existingRoute?.id ??
        (nextRoute.kind === "regular"
          ? getDefaultRoutePostId(context.currentUserId, nextRoute.kind)
          : getNextRoutePostId(context.currentUserId, nextRoute.kind, createdAt)),
      isActive: nextRoute.kind === "one_time" ? true : undefined,
      createdAt,
    };

    let syncedRoute = routeToPersist;
    let isDbSynced = false;
    if (isRoutePostRepositoryEnabled()) {
      try {
        if (shouldArchiveExistingOneTimePosts) {
          await deactivateOneTimeRoutePostsInDb(context.currentUserId);
        }
        syncedRoute = await upsertRoutePostInDb(routeToPersist);
        isDbSynced = true;
      } catch (error) {
        context.onNotice({
          tone: "error",
          text: copy.notices.localDbSyncFailed(describeRouteDbError(error)),
        });
      }
    }

    const nextPosts = sortByNewest([
      syncedRoute,
      ...context.storedPosts
        .filter((post) => {
          if (syncedRoute.kind === "regular") {
            return !(post.ownerUserId === context.currentUserId && post.kind === "regular");
          }

          return post.id !== syncedRoute.id;
        })
        .map((post) => {
          if (
            shouldArchiveExistingOneTimePosts &&
            post.ownerUserId === context.currentUserId &&
            post.kind === "one_time" &&
            post.isActive !== false
          ) {
            return {
              ...post,
              isActive: false,
            };
          }

          return post;
        }),
    ]);
    await context.persistPosts(nextPosts);
    if (isDbSynced || !isRoutePostRepositoryEnabled()) {
      const successText =
        syncedRoute.kind === "one_time"
          ? existingRoute
            ? copy.notices.oneTimeNoticeUpdated
            : copy.notices.oneTimeNoticePosted
          : existingRoute
            ? copy.notices.registrationUpdated(kindLabel(syncedRoute.kind))
            : copy.notices.registrationSaved(kindLabel(syncedRoute.kind));
      context.onNotice({
        tone: "success",
        text: successText,
      });
    }

    return true;
  };

  const removeRoute = async (id: string) => {
    if (!context.currentUserId) {
      return;
    }

    const targetRoute = context.storedPosts.find(
      (post) => post.id === id && post.ownerUserId === context.currentUserId
    );
    const routeKind = targetRoute?.kind === "one_time" ? copy.common.oneTime : copy.common.regular;

    Alert.alert(
      copy.alerts.deleteRouteTitle(routeKind),
      copy.alerts.deleteRouteBody(routeKind),
      [
        { text: copy.common.cancel, style: "cancel" },
        {
          text: copy.common.delete,
          style: "destructive",
          onPress: () => {
            void (async () => {
              const nextPosts = context.storedPosts.filter(
                (post) => !(post.id === id && post.ownerUserId === context.currentUserId)
              );

              if (isRoutePostRepositoryEnabled()) {
                try {
                  await deleteRoutePostInDb(id, context.currentUserId);
                } catch (error) {
                  context.onNotice({
                    tone: "error",
                    text: copy.notices.routeDeleteFailed(describeRouteDbError(error)),
                  });
                }
              }

              await context.persistPosts(nextPosts);
              context.onNotice({
                tone: "info",
                text: copy.notices.routeRemoved,
              });
            })();
          },
        },
      ],
      { cancelable: true }
    );
  };

  const toggleSavedPost = async (post: RoutePost) => {
    if (!context.currentUserId) {
      context.onNotice({
        tone: "error",
        text: copy.notices.signInBeforeSavingRides,
      });
      return;
    }

    const key = getPostSaveKey(post);
    const nextKeys = context.savedPostKeySet.has(key)
      ? context.savedPostKeys.filter((value) => value !== key)
      : [key, ...context.savedPostKeys];

    await context.persistSavedPostKeys(nextKeys);
  };

  const saveRouteQuickSettings = async ({
    kind,
    availableSeats,
    isPublic,
  }: RouteQuickSettingsInput) => {
    if (!context.currentUserId) {
      return;
    }

    const normalizedSeats = Math.min(Math.max(availableSeats, 1), 8);
    const targetPost = context.storedPosts.find(
      (post) =>
        post.ownerUserId === context.currentUserId &&
        post.kind === kind &&
        (kind !== "one_time" || isActiveOneTimePost(post))
    );
    if (!targetPost) {
      context.onNotice({
        tone: "info",
        text: copy.notices.saveRegistrationBeforeSettings,
      });
      return;
    }

    let nextPosts = context.storedPosts.map((post) => {
      if (post.ownerUserId !== context.currentUserId || post.kind !== kind) {
        return post;
      }

      return {
        ...post,
        availableSeats: normalizedSeats,
        isPublic,
      };
    });

    if (isRoutePostRepositoryEnabled()) {
      try {
        const syncedPost = await updateRouteQuickSettingsInDb({
          routeId: targetPost.id,
          ownerUserId: context.currentUserId,
          availableSeats: normalizedSeats,
          isPublic,
        });
        if (syncedPost) {
          nextPosts = nextPosts.map((post) => (post.id === syncedPost.id ? syncedPost : post));
        }
      } catch (error) {
        context.onNotice({
          tone: "error",
          text: copy.notices.routeUpdateFailed(describeRouteDbError(error)),
        });
      }
    }

    try {
      await context.persistPosts(nextPosts);
    } catch (error) {
      context.onNotice({
        tone: "error",
        text: copy.notices.routeQuickSettingsSaveFailed(describeRouteDbError(error)),
      });
    }
  };

  return {
    postRoute,
    removeRoute,
    toggleSavedPost,
    saveRouteQuickSettings,
  };
};
