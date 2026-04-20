import { supabase } from "../../../lib/supabase";
import type { Database } from "../../../lib/database.types";

const ADMIN_ROUTE_SELECT =
  "id,kind,is_active,notice_date,return_date,from_location,to_location,schedule,return_schedule,available_seats,operating_days,contact_phone,contact_link,note,vehicle_model,vehicle_plate,owner_user_id,owner_name,is_public,created_at,updated_at";
const ADMIN_DRIVER_PROFILE_SELECT =
  "owner_user_id,vehicle_model,vehicle_plate,vehicle_note,contact_phone,contact_link,created_at,updated_at";
const ADMIN_ACCOUNT_SELECT = "email,display_name,role,enabled,created_at,updated_at";
const ADMIN_SUPPORT_REQUEST_SELECT =
  "id,category,status,user_id,user_email,title,message,admin_note,created_at,updated_at,resolved_at";

export type AdminRoutePostRecord = Database["public"]["Tables"]["route_posts"]["Row"];
export type AdminRoutePostInsert = Database["public"]["Tables"]["route_posts"]["Insert"];
export type AdminRoutePostUpdate = Database["public"]["Tables"]["route_posts"]["Update"];
export type AdminDriverProfileRecord = Database["public"]["Tables"]["driver_profiles"]["Row"];
export type AdminDriverProfileInsert = Database["public"]["Tables"]["driver_profiles"]["Insert"];
export type AdminDriverProfileUpdate = Database["public"]["Tables"]["driver_profiles"]["Update"];
export type AdminAccountRecord = Database["public"]["Tables"]["admin_accounts"]["Row"];
export type AdminAccountRole = AdminAccountRecord["role"];
export type AdminSupportRequestRecord = Database["public"]["Tables"]["support_requests"]["Row"];
export type AdminSupportRequestUpdate = Database["public"]["Tables"]["support_requests"]["Update"];

export type AdminDashboardData = {
  routes: AdminRoutePostRecord[];
  driverProfiles: AdminDriverProfileRecord[];
  adminAccounts: AdminAccountRecord[];
  supportRequests: AdminSupportRequestRecord[];
};

const requireSupabase = () => {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
};

export const isCurrentUserAdminInDb = async () => {
  const client = requireSupabase();
  const { data, error } = await client.rpc("is_current_user_admin");
  if (error) {
    throw error;
  }

  return data === true;
};

export const claimInitialAdminAccountInDb = async () => {
  const client = requireSupabase();
  const { data, error } = await client.rpc("claim_initial_admin_account");
  if (error) {
    throw error;
  }

  return data;
};

export const fetchAdminDashboardData = async (): Promise<AdminDashboardData> => {
  const client = requireSupabase();
  const [routesResult, profilesResult, adminsResult, supportResult] = await Promise.all([
    client.from("route_posts").select(ADMIN_ROUTE_SELECT).order("created_at", { ascending: false }),
    client
      .from("driver_profiles")
      .select(ADMIN_DRIVER_PROFILE_SELECT)
      .order("updated_at", { ascending: false }),
    client.from("admin_accounts").select(ADMIN_ACCOUNT_SELECT).order("email", { ascending: true }),
    client
      .from("support_requests")
      .select(ADMIN_SUPPORT_REQUEST_SELECT)
      .order("created_at", { ascending: false }),
  ]);

  if (routesResult.error) {
    throw routesResult.error;
  }
  if (profilesResult.error) {
    throw profilesResult.error;
  }
  if (adminsResult.error) {
    throw adminsResult.error;
  }
  if (supportResult.error) {
    throw supportResult.error;
  }

  return {
    routes: routesResult.data ?? [],
    driverProfiles: profilesResult.data ?? [],
    adminAccounts: adminsResult.data ?? [],
    supportRequests: supportResult.data ?? [],
  };
};

export const updateAdminRoutePostInDb = async (
  routeId: string,
  patch: AdminRoutePostUpdate
) => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("route_posts")
    .update(patch)
    .eq("id", routeId)
    .select(ADMIN_ROUTE_SELECT)
    .single();
  if (error) {
    throw error;
  }

  return data;
};

export const upsertAdminRoutePostInDb = async (record: AdminRoutePostInsert) => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("route_posts")
    .upsert(record, { onConflict: "id" })
    .select(ADMIN_ROUTE_SELECT)
    .single();
  if (error) {
    throw error;
  }

  return data;
};

export const deleteAdminRoutePostInDb = async (routeId: string) => {
  const client = requireSupabase();
  const { error } = await client.from("route_posts").delete().eq("id", routeId);
  if (error) {
    throw error;
  }
};

export const upsertAdminDriverProfileInDb = async (record: AdminDriverProfileInsert) => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("driver_profiles")
    .upsert(record, { onConflict: "owner_user_id" })
    .select(ADMIN_DRIVER_PROFILE_SELECT)
    .single();
  if (error) {
    throw error;
  }

  return data;
};

export const updateAdminDriverProfileInDb = async (
  ownerUserId: string,
  patch: AdminDriverProfileUpdate
) => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("driver_profiles")
    .update(patch)
    .eq("owner_user_id", ownerUserId)
    .select(ADMIN_DRIVER_PROFILE_SELECT)
    .single();
  if (error) {
    throw error;
  }

  return data;
};

export const deleteAdminDriverProfileInDb = async (ownerUserId: string) => {
  const client = requireSupabase();
  const { error } = await client.from("driver_profiles").delete().eq("owner_user_id", ownerUserId);
  if (error) {
    throw error;
  }
};

export const upsertAdminAccountInDb = async (
  email: string,
  enabled = true,
  role: AdminAccountRole = "operator",
  displayName = ""
) => {
  const client = requireSupabase();
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) {
    throw new Error("Admin email is required.");
  }

  const { data, error } = await client
    .from("admin_accounts")
    .upsert(
      { email: normalizedEmail, enabled, role, display_name: displayName.trim() },
      { onConflict: "email" }
    )
    .select(ADMIN_ACCOUNT_SELECT)
    .single();
  if (error) {
    throw error;
  }

  return data;
};

export const deleteAdminAccountInDb = async (email: string) => {
  const client = requireSupabase();
  const { error } = await client.from("admin_accounts").delete().eq("email", email);
  if (error) {
    throw error;
  }
};

export const updateAdminSupportRequestInDb = async (
  requestId: string,
  patch: AdminSupportRequestUpdate
) => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("support_requests")
    .update(patch)
    .eq("id", requestId)
    .select(ADMIN_SUPPORT_REQUEST_SELECT)
    .single();
  if (error) {
    throw error;
  }

  return data;
};

export const deleteAdminSupportRequestInDb = async (requestId: string) => {
  const client = requireSupabase();
  const { error } = await client.from("support_requests").delete().eq("id", requestId);
  if (error) {
    throw error;
  }
};

export const updateAdminAccountInDb = async (
  email: string,
  patch: Partial<Pick<AdminAccountRecord, "display_name" | "enabled" | "role">>
) => {
  const client = requireSupabase();
  const { data, error } = await client
    .from("admin_accounts")
    .update(patch)
    .eq("email", email)
    .select(ADMIN_ACCOUNT_SELECT)
    .single();
  if (error) {
    throw error;
  }

  return data;
};
