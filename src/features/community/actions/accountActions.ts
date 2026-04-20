import { Alert } from "react-native";

import {
  hideMyRoutePostsForAccountDeletionInDb,
  isRoutePostRepositoryEnabled,
} from "../data/routePostRepository";
import { supabase } from "../../../lib/supabase";
import type { CommunityActionsContext } from "./types";

const ACCOUNT_DELETION_RETENTION_DAYS = 30;

type CommunityAccountActions = {
  resetSignedInExperience: () => void;
  handleModeChange: (
    nextMode: CommunityActionsContext["setMode"] extends (value: infer T) => void ? T : never
  ) => void;
  withdrawAccount: () => void;
};

export const createCommunityAccountActions = (
  context: CommunityActionsContext
): CommunityAccountActions => {
  const { copy } = context;

  const resetSignedInExperience = () => {
    context.setMode("rider");
    context.setFilter("regular");
    context.setStateFilter("ALL");
    context.setMainTab("home");
    context.resetAllRouteDrafts();
  };

  const handleModeChange: CommunityAccountActions["handleModeChange"] = (nextMode) => {
    context.setMode(nextMode);

    if (nextMode === "driver") {
      context.setMainTab("home");
      if (!context.hasVehicle) {
        context.onNotice({
          tone: "info",
          text: copy.notices.driverRegistrationFirst,
        });
      } else {
        context.onNotice({ tone: "info", text: "" });
      }
      return;
    }

    if (context.mainTab === "saved") {
      context.setMainTab("home");
    }
  };

  const withdrawAccount = () => {
    if (!supabase || !context.currentUserId) {
      context.onNotice({
        tone: "error",
        text: copy.notices.signInBeforeLeaving,
      });
      return;
    }
    const authClient = supabase;

    Alert.alert(
      copy.alerts.leaveCommunityTitle,
      copy.alerts.leaveCommunityBody,
      [
        { text: copy.common.cancel, style: "cancel" },
        {
          text: copy.alerts.leaveCommunityAction,
          style: "destructive",
          onPress: () => {
            void (async () => {
              try {
                const deletionRequestedAt = new Date();
                const deletionRetentionUntil = new Date(
                  deletionRequestedAt.getTime() +
                    ACCOUNT_DELETION_RETENTION_DAYS * 24 * 60 * 60 * 1000
                );
                const remainingPosts = context.storedPosts.filter(
                  (post) => post.ownerUserId !== context.currentUserId
                );
                await context.persistPosts(remainingPosts);
                await context.clearCurrentUserStorage();
                if (isRoutePostRepositoryEnabled()) {
                  await hideMyRoutePostsForAccountDeletionInDb(context.currentUserId);
                }

                const { error: updateError } = await authClient.auth.updateUser({
                  data: {
                    account_status: "deletion_requested",
                    deletion_requested_at: deletionRequestedAt.toISOString(),
                    deletion_retention_until: deletionRetentionUntil.toISOString(),
                    deletion_retention_days: ACCOUNT_DELETION_RETENTION_DAYS,
                  },
                });
                if (updateError) {
                  throw updateError;
                }

                const { error: signOutError } = await authClient.auth.signOut();
                if (signOutError) {
                  throw signOutError;
                }

                resetSignedInExperience();
                context.onNotice({
                  tone: "success",
                  text: copy.notices.leaveCommunitySuccess,
                });
              } catch (error) {
                context.onNotice({
                  tone: "error",
                  text: copy.notices.leaveCommunityFailed((error as Error).message),
                });
              }
            })();
          },
        },
      ]
    );
  };

  return {
    resetSignedInExperience,
    handleModeChange,
    withdrawAccount,
  };
};
