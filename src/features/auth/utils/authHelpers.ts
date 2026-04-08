import type { Session } from "@supabase/supabase-js";

export const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const deriveDisplayName = (session: Session | null) => {
  const metadataName = String(session?.user.user_metadata?.display_name ?? "").trim();
  if (metadataName) {
    return metadataName;
  }

  const email = String(session?.user.email ?? "").trim();
  if (!email) {
    return "Roadmate driver";
  }

  return email.split("@")[0] || "Roadmate driver";
};
