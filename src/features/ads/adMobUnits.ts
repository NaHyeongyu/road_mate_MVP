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
const IOS_PRODUCTION_BANNER_UNIT_ID = "ca-app-pub-3379249817166010/9214235562";
const IOS_PRODUCTION_APP_OPEN_UNIT_ID = "ca-app-pub-3379249817166010/3083941481";
const ANDROID_PRODUCTION_BANNER_UNIT_ID = "ca-app-pub-3379249817166010/7824523465";
const ANDROID_PRODUCTION_APP_OPEN_UNIT_ID = "ca-app-pub-3379249817166010/6532231906";
const isKnownGoogleTestAdUnitId = (value: string) =>
  value.startsWith(`${TEST_ADMOB_PUBLISHER_ID}/`);

export const isAdMobSupportedPlatform =
  Platform.OS === "android" || Platform.OS === "ios";
export const isAdMobEnabled =
  Platform.OS === "ios"
    ? parseBooleanEnv(process.env.EXPO_PUBLIC_ENABLE_IOS_ADS ?? process.env.EXPO_PUBLIC_ENABLE_ADS)
    : Platform.OS === "android"
      ? parseBooleanEnv(process.env.EXPO_PUBLIC_ENABLE_ANDROID_ADS ?? process.env.EXPO_PUBLIC_ENABLE_ADS)
      : parseBooleanEnv(process.env.EXPO_PUBLIC_ENABLE_ADS);

const getPlatformProductionAdUnitId = (iosUnitId: string, androidUnitId: string) => {
  if (Platform.OS === "ios") {
    return iosUnitId;
  }

  if (Platform.OS === "android") {
    return androidUnitId;
  }

  return undefined;
};

const resolveAdUnitId = (
  configuredEnvValues: Array<string | undefined>,
  productionUnitId: string | undefined,
  getTestId: () => string
): string | null => {
  if (!isAdMobEnabled || !isAdMobSupportedPlatform) {
    return null;
  }

  const configured = configuredEnvValues.map(trimOrUndefined).find(Boolean);
  if (configured) {
    if (!isDevelopmentRuntime && isKnownGoogleTestAdUnitId(configured)) {
      return null;
    }

    return configured;
  }

  if (!isDevelopmentRuntime) {
    return productionUnitId ?? null;
  }

  return getTestId();
};

export const getBannerAdUnitId = () => {
  return resolveAdUnitId(
    [
      Platform.OS === "ios"
        ? process.env.EXPO_PUBLIC_ADMOB_IOS_BANNER_UNIT_ID
        : process.env.EXPO_PUBLIC_ADMOB_ANDROID_BANNER_UNIT_ID,
      process.env.EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID,
    ],
    getPlatformProductionAdUnitId(
      IOS_PRODUCTION_BANNER_UNIT_ID,
      ANDROID_PRODUCTION_BANNER_UNIT_ID
    ),
    () => getMobileAdsModule()?.TestIds.ADAPTIVE_BANNER ?? TEST_BANNER_UNIT_ID
  );
};

export const getAppOpenAdUnitId = () => {
  return resolveAdUnitId(
    [
      Platform.OS === "ios"
        ? process.env.EXPO_PUBLIC_ADMOB_IOS_APP_OPEN_UNIT_ID
        : process.env.EXPO_PUBLIC_ADMOB_ANDROID_APP_OPEN_UNIT_ID,
      process.env.EXPO_PUBLIC_ADMOB_APP_OPEN_UNIT_ID,
    ],
    getPlatformProductionAdUnitId(
      IOS_PRODUCTION_APP_OPEN_UNIT_ID,
      ANDROID_PRODUCTION_APP_OPEN_UNIT_ID
    ),
    () => getMobileAdsModule()?.TestIds.APP_OPEN ?? TEST_APP_OPEN_UNIT_ID
  );
};
