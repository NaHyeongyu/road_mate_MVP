import type { RoutePost } from "../../../model";
import {
  deleteRoutePostInDb,
  getDefaultRoutePostId,
  isRoutePostRepositoryEnabled,
  updateRouteQuickSettingsInDb,
  upsertRoutePostInDb,
} from "../data/routePostRepository";
import { buildRoutePost, validateRoutePost } from "../utils/routeDraft";
import { getPostSaveKey, kindLabel, sortByNewest } from "../utils/storage";
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

  return message;
};

export const createCommunityPostActions = (context: CommunityActionsContext) => {
  const postRoute = async (): Promise<boolean> => {
    if (!context.currentUserId) {
      context.onNotice({
        tone: "error",
        text: "Sign in before posting a route.",
      });
      return false;
    }

    if (!context.savedVehicle.model || !context.savedVehicle.plate) {
      context.onNotice({
        tone: "error",
        text: "Save vehicle info first.",
      });
      return false;
    }

    const nextRoute = buildRoutePost({
      routeDraft: context.routeDraft,
      savedVehicle: context.savedVehicle,
      currentUserId: context.currentUserId,
      currentUserName: context.currentUserName,
    });
    const validationError = validateRoutePost(nextRoute);
    if (validationError) {
      context.onNotice({
        tone: "error",
        text: validationError,
      });
      return false;
    }

    const existingRoute = context.storedPosts.find(
      (post) => post.ownerUserId === context.currentUserId && post.kind === nextRoute.kind
    );
    const routeToPersist = {
      ...nextRoute,
      id: getDefaultRoutePostId(context.currentUserId, nextRoute.kind),
      createdAt: new Date().toISOString(),
    };

    let syncedRoute = routeToPersist;
    let isDbSynced = false;
    if (isRoutePostRepositoryEnabled()) {
      try {
        syncedRoute = await upsertRoutePostInDb(routeToPersist);
        isDbSynced = true;
      } catch (error) {
        context.onNotice({
          tone: "error",
          text: `DB sync failed. Saved only on this device. (${describeRouteDbError(error)})`,
        });
      }
    }

    const nextPosts = sortByNewest([
      syncedRoute,
      ...context.storedPosts.filter(
        (post) =>
          !(post.ownerUserId === context.currentUserId && post.kind === syncedRoute.kind)
      ),
    ]);
    await context.persistPosts(nextPosts);
    if (isDbSynced || !isRoutePostRepositoryEnabled()) {
      const successText =
        syncedRoute.kind === "one_time"
          ? existingRoute
            ? "One-time notice updated and shared to riders."
            : "One-time notice posted and shared to riders."
          : existingRoute
            ? `${kindLabel(syncedRoute.kind)} registration updated and shared to riders.`
            : `${kindLabel(syncedRoute.kind)} registration saved and shared to riders.`;
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

    const nextPosts = context.storedPosts.filter(
      (post) => !(post.id === id && post.ownerUserId === context.currentUserId)
    );

    if (isRoutePostRepositoryEnabled()) {
      try {
        await deleteRoutePostInDb(id, context.currentUserId);
      } catch (error) {
        context.onNotice({
          tone: "error",
          text: `Route delete failed in DB. Local list updated only. (${describeRouteDbError(error)})`,
        });
      }
    }

    await context.persistPosts(nextPosts);
    context.onNotice({
      tone: "info",
      text: "Route removed.",
    });
  };

  const toggleSavedPost = async (post: RoutePost) => {
    if (!context.currentUserId) {
      context.onNotice({
        tone: "error",
        text: "Sign in before saving rides.",
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
      (post) => post.ownerUserId === context.currentUserId && post.kind === kind
    );
    if (!targetPost) {
      context.onNotice({
        tone: "info",
        text: "Save registration first before changing seats or visibility.",
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
          text: `Route update failed in DB. Local values updated only. (${describeRouteDbError(error)})`,
        });
      }
    }

    try {
      await context.persistPosts(nextPosts);
    } catch (error) {
      context.onNotice({
        tone: "error",
        text: `Route quick settings could not be saved locally. (${describeRouteDbError(error)})`,
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
