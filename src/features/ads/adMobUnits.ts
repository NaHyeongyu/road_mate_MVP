import { Platform } from "react-native";
import { getMobileAdsModule } from "./mobileAdsRuntime";

const trimOrUndefined = (value: string | undefined) => {
  const normalized = String(value ?? "").trim();
  return normalized || undefined;
};

const TEST_BANNER_UNIT_ID = "ca-app-pub-3940256099942544/6300978111";
const TEST_APP_OPEN_UNIT_ID = "ca-app-pub-3940256099942544/9257395921";

export const isAdMobSupportedPlatform =
  Platform.OS === "android" || Platform.OS === "ios";

export const getBannerAdUnitId = () => {
  const configured = trimOrUndefined(process.env.EXPO_PUBLIC_ADMOB_BANNER_UNIT_ID);
  if (configured) {
    return configured;
  }

  const module = getMobileAdsModule();
  return module?.TestIds.ADAPTIVE_BANNER ?? TEST_BANNER_UNIT_ID;
};

export const getAppOpenAdUnitId = () => {
  const configured = trimOrUndefined(process.env.EXPO_PUBLIC_ADMOB_APP_OPEN_UNIT_ID);
  if (configured) {
    return configured;
  }

  const module = getMobileAdsModule();
  return module?.TestIds.APP_OPEN ?? TEST_APP_OPEN_UNIT_ID;
};
