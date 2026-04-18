import { isSupabaseConfigured, supabase } from "../../../lib/supabase";
import type { Database } from "../../../lib/database.types";
import type { RouteKind, RoutePost } from "../../../model";
import { STATE_SEARCH_ALIASES } from "./australianStates";
import type { StateFilter } from "../types";
import { sortByNewest } from "../utils/storage";

const ROUTE_POSTS_TABLE = "route_posts";
const ROUTE_POSTS_SELECT =
  "id,kind,notice_date,from_location,to_location,schedule,return_schedule,available_seats,operating_days,contact_phone,contact_link,note,vehicle_model,vehicle_plate,owner_user_id,owner_name,is_public,created_at";

type RoutePostRecord = Database["public"]["Tables"]["route_posts"]["Row"];
type RoutePostRecordInsert = Database["public"]["Tables"]["route_posts"]["Insert"];

export type FetchRoutePostsQuery = {
  kind?: RouteKind;
  stateFilter?: StateFilter;
  fromQuery?: string;
  toQuery?: string;
  ownerUserId?: string;
  limit?: number;
};

const MAX_SEATS = 8;
const QUERY_CACHE_TTL_MS = 60_000;
const routePostsQueryCache = new Map<string, { fetchedAt: number; posts: RoutePost[] }>();

const normalizeQuery = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokenizeQuery = (value: string) => normalizeQuery(value).split(" ").filter(Boolean);

const escapeLikeToken = (value: string) => value.replace(/[%_]/g, "\\$&");

const normalizeOperatingDays = (value: unknown) =>
  Array.isArray(value)
    ? value
        .map((day) => String(day ?? "").trim())
        .filter(Boolean)
        .slice(0, 7)
    : [];

const normalizeQueryValue = (value: string | undefined) => value?.trim() || undefined;

const normalizeLimit = (value: number | undefined) => {
  if (!Number.isFinite(value)) {
    return undefined;
  }

  const normalized = Math.floor(Number(value));
  return normalized > 0 ? normalized : undefined;
};

const toQueryCacheKey = (query: FetchRoutePostsQuery) =>
  JSON.stringify({
    kind: query.kind,
    stateFilter: query.stateFilter,
    fromQuery: normalizeQueryValue(query.fromQuery),
    toQuery: normalizeQueryValue(query.toQuery),
    ownerUserId: normalizeQueryValue(query.ownerUserId),
    limit: normalizeLimit(query.limit),
  });

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
    oneTimeTripType:
      kind === "one_time" ? (returnSchedule ? "round_trip" : "one_way") : undefined,
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

const toRoutePostRecord = (post: RoutePost): RoutePostRecordInsert => ({
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

const hasRemoteFilterQuery = (query: FetchRoutePostsQuery) =>
  Boolean(
    query.ownerUserId ||
      query.kind ||
      (query.stateFilter && query.stateFilter !== "ALL") ||
      query.fromQuery?.trim() ||
      query.toQuery?.trim()
  );

export const isRoutePostRepositoryEnabled = () => isSupabaseConfigured && Boolean(supabase);

export const getDefaultRoutePostId = (ownerUserId: string, kind: RouteKind) =>
  `${ownerUserId}:${kind}`;

export const fetchRoutePostsFromDb = async (
  query: FetchRoutePostsQuery = {}
): Promise<RoutePost[]> => {
  if (!supabase) {
    return [];
  }

  const cacheKey = toQueryCacheKey(query);
  const cachedEntry = routePostsQueryCache.get(cacheKey);
  if (cachedEntry && Date.now() - cachedEntry.fetchedAt < QUERY_CACHE_TTL_MS) {
    return cachedEntry.posts;
  }

  let dbQuery = supabase
    .from(ROUTE_POSTS_TABLE)
    .select(ROUTE_POSTS_SELECT)
    .order("created_at", { ascending: false });

  if (query.ownerUserId) {
    dbQuery = dbQuery.eq("owner_user_id", query.ownerUserId);
  }

  if (query.kind) {
    dbQuery = dbQuery.eq("kind", query.kind);
  }

  if (query.stateFilter && query.stateFilter !== "ALL") {
    const aliases = STATE_SEARCH_ALIASES[query.stateFilter];
    const stateConditions = aliases
      .flatMap((alias) => {
        const token = escapeLikeToken(alias);
        return [`from_location.ilike.%${token}%`, `to_location.ilike.%${token}%`];
      })
      .join(",");
    dbQuery = dbQuery.or(stateConditions);
  }

  const fromTokens = tokenizeQuery(query.fromQuery ?? "");
  for (const token of fromTokens) {
    dbQuery = dbQuery.ilike("from_location", `%${escapeLikeToken(token)}%`);
  }

  const toTokens = tokenizeQuery(query.toQuery ?? "");
  for (const token of toTokens) {
    dbQuery = dbQuery.ilike("to_location", `%${escapeLikeToken(token)}%`);
  }

  const normalizedLimit = normalizeLimit(query.limit);
  if (normalizedLimit) {
    dbQuery = dbQuery.limit(normalizedLimit);
  }

  const { data, error } = await dbQuery;
  if (error) {
    throw error;
  }

  const posts = sortByNewest((data ?? []).flatMap((record) => {
    const mapped = toRoutePost(record);
    return mapped ? [mapped] : [];
  }));
  routePostsQueryCache.set(cacheKey, {
    fetchedAt: Date.now(),
    posts,
  });
  return posts;
};

export const clearRoutePostsQueryCache = () => {
  routePostsQueryCache.clear();
};

export const shouldSkipRoutePostsCacheWrite = (query: FetchRoutePostsQuery = {}) =>
  hasRemoteFilterQuery(query);

export const upsertRoutePostInDb = async (post: RoutePost): Promise<RoutePost> => {
  if (!supabase) {
    return post;
  }

  const record = toRoutePostRecord(post);
  const { data, error } = await supabase
    .from(ROUTE_POSTS_TABLE)
    .upsert(record, { onConflict: "owner_user_id,kind" })
    .select(ROUTE_POSTS_SELECT)
    .single();
  if (error) {
    throw error;
  }

  clearRoutePostsQueryCache();
  const mapped = toRoutePost(data);
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

  clearRoutePostsQueryCache();
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
    .select(ROUTE_POSTS_SELECT)
    .maybeSingle();
  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  clearRoutePostsQueryCache();
  return toRoutePost(data);
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

  clearRoutePostsQueryCache();
};
