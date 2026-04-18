import type { VehicleInfo } from "../../../model";
import type { CommunityActionsContext } from "./types";

export const createCommunityVehicleActions = (context: CommunityActionsContext) => {
  const saveVehicle = async () => {
    if (!context.currentUserId) {
      context.onNotice({
        tone: "error",
        text: context.copy.notices.signInBeforeSavingVehicle,
      });
      return;
    }

    const nextVehicle: VehicleInfo = {
      model: context.vehicleDraft.model.trim(),
      plate: context.vehicleDraft.plate.trim().toUpperCase(),
      note: context.vehicleDraft.note.trim(),
      contactPhone: context.vehicleDraft.contactPhone.trim(),
      contactLink: context.vehicleDraft.contactLink.trim(),
    };

    if (!nextVehicle.model || !nextVehicle.plate) {
      context.onNotice({
        tone: "error",
        text: context.copy.notices.vehicleModelAndPlateRequired,
      });
      return;
    }

    await context.persistVehicle(nextVehicle);
    context.onNotice({
      tone: "success",
      text: context.copy.notices.driverProfileSaved,
    });
  };

  return {
    saveVehicle,
  };
};
