import { isSupabaseConfigured, supabase } from "../../../lib/supabase";
import { EMPTY_VEHICLE, type VehicleInfo } from "../../../model";

const DRIVER_PROFILES_TABLE = "driver_profiles";

type DriverProfileRecord = {
  owner_user_id: string;
  vehicle_model: string;
  vehicle_plate: string;
  vehicle_note: string;
  contact_phone: string | null;
  contact_link: string | null;
  created_at: string;
  updated_at: string;
};

const toVehicleFromRecord = (record: Partial<DriverProfileRecord>): VehicleInfo => ({
  model: String(record.vehicle_model ?? "").trim(),
  plate: String(record.vehicle_plate ?? "").trim(),
  note: String(record.vehicle_note ?? "").trim(),
  contactPhone: String(record.contact_phone ?? "").trim(),
  contactLink: String(record.contact_link ?? "").trim(),
});

const toRecordFromVehicle = (ownerUserId: string, vehicle: VehicleInfo) => ({
  owner_user_id: ownerUserId,
  vehicle_model: vehicle.model.trim(),
  vehicle_plate: vehicle.plate.trim(),
  vehicle_note: vehicle.note.trim(),
  contact_phone: vehicle.contactPhone.trim() || null,
  contact_link: vehicle.contactLink.trim() || null,
});

export const isDriverProfileRepositoryEnabled = () => isSupabaseConfigured && Boolean(supabase);

export const fetchMyDriverProfileFromDb = async (ownerUserId: string): Promise<VehicleInfo | null> => {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from(DRIVER_PROFILES_TABLE)
    .select("*")
    .eq("owner_user_id", ownerUserId)
    .maybeSingle();
  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return toVehicleFromRecord(data as Partial<DriverProfileRecord>);
};

export const upsertMyDriverProfileInDb = async (
  ownerUserId: string,
  vehicle: VehicleInfo
): Promise<VehicleInfo> => {
  if (!supabase) {
    return {
      ...EMPTY_VEHICLE,
      ...vehicle,
    };
  }

  const { data, error } = await supabase
    .from(DRIVER_PROFILES_TABLE)
    .upsert(toRecordFromVehicle(ownerUserId, vehicle), { onConflict: "owner_user_id" })
    .select("*")
    .single();
  if (error) {
    throw error;
  }

  return toVehicleFromRecord(data as Partial<DriverProfileRecord>);
};

export const deleteMyDriverProfileInDb = async (ownerUserId: string) => {
  if (!supabase) {
    return;
  }

  const { error } = await supabase
    .from(DRIVER_PROFILES_TABLE)
    .delete()
    .eq("owner_user_id", ownerUserId);
  if (error) {
    throw error;
  }
};
