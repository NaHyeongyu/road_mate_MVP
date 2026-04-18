const parseBooleanEnv = (value: string | undefined) => {
  const normalized = String(value ?? "").trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
};

export const isSocialAuthEnabled = parseBooleanEnv(process.env.EXPO_PUBLIC_ENABLE_SOCIAL_AUTH);
