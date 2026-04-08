import {
  EMPTY_VEHICLE,
  type RouteKind,
  type RoutePost,
  type VehicleInfo,
} from "../../../model";

export const POSTS_KEY = "roadmate_mvp.posts";
export const VEHICLE_KEY_PREFIX = "roadmate_mvp.vehicle.";
export const SAVED_POSTS_KEY_PREFIX = "roadmate_mvp.saved_posts.";

export const kindLabel = (kind: RouteKind) => (kind === "regular" ? "Regular" : "One-time");

export const sortByNewest = (posts: RoutePost[]) =>
  [...posts].sort((left, right) => right.createdAt.localeCompare(left.createdAt));

export const getVehicleStorageKey = (userId: string) => `${VEHICLE_KEY_PREFIX}${userId}`;
export const getSavedPostsStorageKey = (userId: string) => `${SAVED_POSTS_KEY_PREFIX}${userId}`;
export const getPostSaveKey = (post: Pick<RoutePost, "id" | "ownerUserId">) =>
  `${post.ownerUserId}:${post.id}`;

export const parseVehicle = (raw: string | null): VehicleInfo => {
  if (!raw) {
    return EMPTY_VEHICLE;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<VehicleInfo>;
    return {
      model: String(parsed.model ?? "").trim(),
      plate: String(parsed.plate ?? "").trim(),
      note: String(parsed.note ?? "").trim(),
    };
  } catch {
    return EMPTY_VEHICLE;
  }
};

export const parsePosts = (raw: string | null): RoutePost[] => {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.flatMap((item) => {
      if (!item || typeof item !== "object") {
        return [];
      }

      const post = item as Partial<RoutePost> & { ownerEmail?: string };
      const id = String(post.id ?? "").trim();
      const from = String(post.from ?? "").trim();
      const to = String(post.to ?? "").trim();
      const schedule = String(post.schedule ?? "").trim();
      const returnSchedule = String(post.returnSchedule ?? "").trim();
      const availableSeatsRaw = Number(post.availableSeats);
      const availableSeats =
        Number.isFinite(availableSeatsRaw) && availableSeatsRaw > 0
          ? Math.min(availableSeatsRaw, 8)
          : 1;
      const operatingDays = Array.isArray(post.operatingDays)
        ? post.operatingDays
            .map((day) => String(day ?? "").trim())
            .filter(Boolean)
            .slice(0, 7)
        : [];
      const vehicleModel = String(post.vehicleModel ?? "").trim();
      const vehiclePlate = String(post.vehiclePlate ?? "").trim();
      const ownerUserId = String(post.ownerUserId ?? post.ownerEmail ?? "").trim();
      const contactPhone = String(post.contactPhone ?? "").trim();
      const contactLink = String(post.contactLink ?? "").trim();
      const isPublic = typeof post.isPublic === "boolean" ? post.isPublic : true;

      if (!id || !from || !to || !schedule || !vehicleModel || !vehiclePlate || !ownerUserId) {
        return [];
      }

      return [
        {
          id,
          kind: post.kind === "one_time" ? "one_time" : "regular",
          from,
          to,
          schedule,
          returnSchedule: returnSchedule || undefined,
          availableSeats,
          operatingDays,
          contactPhone: contactPhone || undefined,
          contactLink: contactLink || undefined,
          note: String(post.note ?? "").trim(),
          vehicleModel,
          vehiclePlate,
          ownerUserId,
          ownerName: String(post.ownerName ?? "Community driver").trim() || "Community driver",
          isPublic,
          createdAt: String(post.createdAt ?? new Date().toISOString()),
        },
      ];
    });
  } catch {
    return [];
  }
};

export const parseSavedPostKeys = (raw: string | null): string[] => {
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    const keys = parsed
      .map((value) => String(value ?? "").trim())
      .filter(Boolean);
    return Array.from(new Set(keys));
  } catch {
    return [];
  }
};

export const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString("en-AU", {
    month: "short",
    day: "numeric",
  });
};
