import { isSupabaseConfigured, supabase } from "../../../lib/supabase";
import type { RouteKind, RoutePost } from "../../../model";
import { sortByNewest } from "../utils/storage";

const ROUTE_POSTS_TABLE = "route_posts";

type RoutePostRecord = {
  id: string;
  kind: RouteKind;
  notice_date: string | null;
  from_location: string;
  to_location: string;
  schedule: string;
  return_schedule: string | null;
  available_seats: number;
  operating_days: string[];
  contact_phone: string | null;
  contact_link: string | null;
  note: string;
  vehicle_model: string;
  vehicle_plate: string;
  owner_user_id: string;
  owner_name: string;
  is_public: boolean;
  created_at: string;
};

const MAX_SEATS = 8;

const normalizeOperatingDays = (value: unknown) =>
  Array.isArray(value)
    ? value
        .map((day) => String(day ?? "").trim())
        .filter(Boolean)
        .slice(0, 7)
    : [];

const toRoutePost = (record: Partial<RoutePostRecord>): RoutePost | null => {
  const id = String(record.id ?? "").trim();
  const from = String(record.from_location ?? "").trim();
  const to = String(record.to_location ?? "").trim();
  const schedule = String(record.schedule ?? "").trim();
  const ownerUserId = String(record.owner_user_id ?? "").trim();
  const vehicleModel = String(record.vehicle_model ?? "").trim();
  const vehiclePlate = String(record.vehicle_plate ?? "").trim();

  if (!id || !from || !to || !schedule || !ownerUserId || !vehicleModel || !vehiclePlate) {
    return null;
  }

  const kind = record.kind === "one_time" ? "one_time" : "regular";
  const availableSeatsRaw = Number(record.available_seats);
  const availableSeats =
    Number.isFinite(availableSeatsRaw) && availableSeatsRaw > 0
      ? Math.min(availableSeatsRaw, MAX_SEATS)
      : 1;
  const returnSchedule = String(record.return_schedule ?? "").trim();
  const contactPhone = String(record.contact_phone ?? "").trim();
  const contactLink = String(record.contact_link ?? "").trim();
  const note = String(record.note ?? "").trim();
  const createdAt = String(record.created_at ?? new Date().toISOString()).trim();
  const noticeDateRaw = String(record.notice_date ?? "").trim();

  return {
    id,
    kind,
    noticeDate:
      kind === "one_time" ? noticeDateRaw || createdAt.slice(0, 10) || undefined : undefined,
    from,
    to,
    schedule,
    returnSchedule: returnSchedule || undefined,
    availableSeats,
    operatingDays: normalizeOperatingDays(record.operating_days),
    contactPhone: contactPhone || undefined,
    contactLink: contactLink || undefined,
    note,
    vehicleModel,
    vehiclePlate,
    ownerUserId,
    ownerName: String(record.owner_name ?? "Community driver").trim() || "Community driver",
    isPublic: record.is_public !== false,
    createdAt,
  };
};

const toRoutePostRecord = (post: RoutePost): RoutePostRecord => ({
  id: post.id,
  kind: post.kind,
  notice_date: post.kind === "one_time" ? post.noticeDate?.trim() || null : null,
  from_location: post.from.trim(),
  to_location: post.to.trim(),
  schedule: post.schedule.trim(),
  return_schedule: post.returnSchedule?.trim() || null,
  available_seats: Math.min(Math.max(post.availableSeats, 1), MAX_SEATS),
  operating_days: post.operatingDays.slice(0, 7),
  contact_phone: post.contactPhone?.trim() || null,
  contact_link: post.contactLink?.trim() || null,
  note: post.note.trim(),
  vehicle_model: post.vehicleModel.trim(),
  vehicle_plate: post.vehiclePlate.trim(),
  owner_user_id: post.ownerUserId.trim(),
  owner_name: post.ownerName.trim(),
  is_public: post.isPublic,
  created_at: post.createdAt,
});

export const isRoutePostRepositoryEnabled = () => isSupabaseConfigured && Boolean(supabase);

export const getDefaultRoutePostId = (ownerUserId: string, kind: RouteKind) =>
  `${ownerUserId}:${kind}`;

export const fetchRoutePostsFromDb = async (): Promise<RoutePost[]> => {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from(ROUTE_POSTS_TABLE)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    throw error;
  }

  return sortByNewest((data ?? []).flatMap((record) => {
    const mapped = toRoutePost(record as Partial<RoutePostRecord>);
    return mapped ? [mapped] : [];
  }));
};

export const upsertRoutePostInDb = async (post: RoutePost): Promise<RoutePost> => {
  if (!supabase) {
    return post;
  }

  const record = toRoutePostRecord(post);
  const { data, error } = await supabase
    .from(ROUTE_POSTS_TABLE)
    .upsert(record, { onConflict: "owner_user_id,kind" })
    .select("*")
    .single();
  if (error) {
    throw error;
  }

  const mapped = toRoutePost(data as Partial<RoutePostRecord>);
  return mapped ?? post;
};

export const deleteRoutePostInDb = async (routeId: string, ownerUserId: string) => {
  if (!supabase) {
    return;
  }

  const { error } = await supabase
    .from(ROUTE_POSTS_TABLE)
    .delete()
    .eq("id", routeId)
    .eq("owner_user_id", ownerUserId);
  if (error) {
    throw error;
  }
};

type UpdateRouteQuickSettingsInDbInput = {
  routeId: string;
  ownerUserId: string;
  availableSeats: number;
  isPublic: boolean;
};

export const updateRouteQuickSettingsInDb = async ({
  routeId,
  ownerUserId,
  availableSeats,
  isPublic,
}: UpdateRouteQuickSettingsInDbInput): Promise<RoutePost | null> => {
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from(ROUTE_POSTS_TABLE)
    .update({
      available_seats: Math.min(Math.max(availableSeats, 1), MAX_SEATS),
      is_public: isPublic,
    })
    .eq("id", routeId)
    .eq("owner_user_id", ownerUserId)
    .select("*")
    .maybeSingle();
  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return toRoutePost(data as Partial<RoutePostRecord>);
};

export const deleteMyRoutePostsInDb = async (ownerUserId: string) => {
  if (!supabase) {
    return;
  }

  const { error } = await supabase
    .from(ROUTE_POSTS_TABLE)
    .delete()
    .eq("owner_user_id", ownerUserId);
  if (error) {
    throw error;
  }
};
