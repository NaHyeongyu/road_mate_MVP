import { createCommunityAccountActions } from "../actions/accountActions";
import { createCommunityPostActions } from "../actions/postActions";
import type { CommunityActionsContext } from "../actions/types";
import { createCommunityVehicleActions } from "../actions/vehicleActions";

export function useCommunityActions(context: CommunityActionsContext) {
  const { resetSignedInExperience, handleModeChange, withdrawAccount } =
    createCommunityAccountActions(context);
  const { saveVehicle } = createCommunityVehicleActions(context);
  const { postRoute, removeRoute, toggleSavedPost, saveRouteQuickSettings } =
    createCommunityPostActions(context);

  return {
    handleModeChange,
    withdrawAccount,
    saveVehicle,
    postRoute,
    removeRoute,
    toggleSavedPost,
    saveRouteQuickSettings,
    resetSignedInExperience,
  };
}
