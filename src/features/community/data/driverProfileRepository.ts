import { isSupabaseConfigured, supabase } from "../../../lib/supabase";
import type { Database } from "../../../lib/database.types";
import { EMPTY_VEHICLE, type VehicleInfo } from "../../../model";

const DRIVER_PROFILES_TABLE = "driver_profiles";
const DRIVER_PROFILES_SELECT =
  "owner_user_id,vehicle_model,vehicle_plate,vehicle_note,contact_phone,contact_link,created_at,updated_at";

type DriverProfileRecord = Database["public"]["Tables"]["driver_profiles"]["Row"];
type DriverProfileRecordInsert = Database["public"]["Tables"]["driver_profiles"]["Insert"];

const toVehicleFromRecord = (record: Partial<DriverProfileRecord>): VehicleInfo => ({
  model: String(record.vehicle_model ?? "").trim(),
  plate: String(record.vehicle_plate ?? "").trim(),
  note: String(record.vehicle_note ?? "").trim(),
  contactPhone: String(record.contact_phone ?? "").trim(),
  contactLink: String(record.contact_link ?? "").trim(),
});

const toRecordFromVehicle = (
  ownerUserId: string,
  vehicle: VehicleInfo
): DriverProfileRecordInsert => ({
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
    .select(DRIVER_PROFILES_SELECT)
    .eq("owner_user_id", ownerUserId)
    .maybeSingle();
  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return toVehicleFromRecord(data);
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
    .select(DRIVER_PROFILES_SELECT)
    .single();
  if (error) {
    throw error;
  }

  return toVehicleFromRecord(data);
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
