import { Alert } from "react-native";

import { deleteMyRoutePostsInDb, isRoutePostRepositoryEnabled } from "../data/routePostRepository";
import {
  deleteMyDriverProfileInDb,
  isDriverProfileRepositoryEnabled,
} from "../data/driverProfileRepository";
import { supabase } from "../../../lib/supabase";
import type { CommunityActionsContext } from "./types";

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
                const remainingPosts = context.storedPosts.filter(
                  (post) => post.ownerUserId !== context.currentUserId
                );
                await context.persistPosts(remainingPosts);
                await context.clearCurrentUserStorage();
                if (isRoutePostRepositoryEnabled()) {
                  await deleteMyRoutePostsInDb(context.currentUserId);
                }
                if (isDriverProfileRepositoryEnabled()) {
                  await deleteMyDriverProfileInDb(context.currentUserId);
                }

                const { error: updateError } = await authClient.auth.updateUser({
                  data: {
                    account_status: "withdrawn",
                    withdrawn_at: new Date().toISOString(),
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
