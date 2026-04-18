import { Platform } from "react-native";
import { getMobileAdsModule } from "./mobileAdsRuntime";

const trimOrUndefined = (value: string | undefined) => {
  const normalized = String(value ?? "").trim();
  return normalized || undefined;
};

const parseBooleanEnv = (value: string | undefined) => {
  const normalized = String(value ?? "").trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
};

const isDevelopmentRuntime = process.env.NODE_ENV !== "production";
const TEST_ADMOB_PUBLISHER_ID = "ca-app-pub-3940256099942544";
const TEST_BANNER_UNIT_ID = "ca-app-pub-3940256099942544/6300978111";
const TEST_APP_OPEN_UNIT_ID = "ca-app-pub-3940256099942544/9257395921";
const isKnownGoogleTestAdUnitId = (value: string) =>
  value.startsWith(`${TEST_ADMOB_PUBLISHER_ID}/`);

export const isAdMobSupportedPlatform =
  Platform.OS === "android" || Platform.OS === "ios";
export const isAdMobEnabled = parseBooleanEnv(process.env.EXPO_PUBLIC_ENABLE_ADS);

const resolveAdUnitId = (
  configuredEnvValue: string | undefined,
  getTestId: () => string
): string | null => {
  if (!isAdMobEnabled || !isAdMobSupportedPlatform) {
    return null;
  }

  const configured = trimOrUndefined(configuredEnvValue);
  if (configured) {
    if (!isDevelopmentRuntime && isKnownGoogleTestAdUnitId(configured)) {
      return null;
    }

    return configured;
  }

  if (!isDevelopmentRuntime) {
    return null;
  }

  return getTestId();
};

export const getBannerAdUnitId = () => {
  const module = getMobileAdsModule();
  return resolveAdUnitId(
    process.env.EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID,
    () => module?.TestIds.ADAPTIVE_BANNER ?? TEST_BANNER_UNIT_ID
  );
};

export const getAppOpenAdUnitId = () => {
  const module = getMobileAdsModule();
  return resolveAdUnitId(
    process.env.EXPO_PUBLIC_ADMOB_APP_OPEN_UNIT_ID,
    () => module?.TestIds.APP_OPEN ?? TEST_APP_OPEN_UNIT_ID
  );
};
