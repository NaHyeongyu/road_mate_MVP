import type { VehicleInfo } from "../../../model";
import type { CommunityActionsContext } from "./types";

export const createCommunityVehicleActions = (context: CommunityActionsContext) => {
  const saveVehicle = async () => {
    if (!context.currentUserId) {
      context.onNotice({
        tone: "error",
        text: "Sign in before saving a vehicle.",
      });
      return;
    }

    const nextVehicle: VehicleInfo = {
      model: context.vehicleDraft.model.trim(),
      plate: context.vehicleDraft.plate.trim().toUpperCase(),
      note: context.vehicleDraft.note.trim(),
    };

    if (!nextVehicle.model || !nextVehicle.plate) {
      context.onNotice({
        tone: "error",
        text: "Driver needs at least a car model and plate number.",
      });
      return;
    }

    await context.persistVehicle(nextVehicle);
    context.onNotice({
      tone: "success",
      text: "Vehicle info saved on this device for your account.",
    });
  };

  return {
    saveVehicle,
  };
};
