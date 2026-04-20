import { supabase } from "../../../lib/supabase";
import type { Database } from "../../../lib/database.types";

export type SupportRequestCategory =
  Database["public"]["Tables"]["support_requests"]["Row"]["category"];
export type SupportRequestRecord =
  Database["public"]["Tables"]["support_requests"]["Row"];

type CreateSupportRequestInput = {
  category: SupportRequestCategory;
  userId?: string;
  userEmail: string;
  title: string;
  message: string;
};

const normalizeText = (value: string) => value.trim();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createSupportRequestInDb = async ({
  category,
  userId,
  userEmail,
  title,
  message,
}: CreateSupportRequestInput): Promise<void> => {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const normalizedEmail = normalizeText(userEmail).toLowerCase();
  const normalizedTitle = normalizeText(title);
  const normalizedMessage = normalizeText(message);

  if (!normalizedEmail) {
    throw new Error("Email is required.");
  }
  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    throw new Error("Email is invalid.");
  }
  if (!normalizedTitle) {
    throw new Error("Title is required.");
  }
  if (!normalizedMessage) {
    throw new Error("Message is required.");
  }

  const { error } = await supabase
    .from("support_requests")
    .insert({
      category,
      user_id: userId?.trim() || null,
      user_email: normalizedEmail,
      title: normalizedTitle.slice(0, 120),
      message: normalizedMessage.slice(0, 2000),
    });

  if (error) {
    throw error;
  }
};

export const fetchMySupportRequestsFromDb = async (
  userId: string
): Promise<SupportRequestRecord[]> => {
  if (!supabase || !userId.trim()) {
    return [];
  }

  const { data, error } = await supabase
    .from("support_requests")
    .select(
      "id,category,status,user_id,user_email,title,message,admin_note,created_at,updated_at,resolved_at"
    )
    .eq("user_id", userId.trim())
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
};
