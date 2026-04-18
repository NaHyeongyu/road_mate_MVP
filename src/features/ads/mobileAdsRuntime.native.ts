import { NativeModules } from "react-native";

type MobileAdsModule = typeof import("react-native-google-mobile-ads");

let cachedModule: MobileAdsModule | null | undefined;

const hasGoogleMobileAdsNativeModule = () => {
  const nativeFromBridge = (NativeModules as Record<string, unknown> | undefined)?.RNGoogleMobileAdsModule;
  if (nativeFromBridge) {
    return true;
  }

  const turboProxy = (
    globalThis as unknown as { __turboModuleProxy?: ((name: string) => unknown) | undefined }
  ).__turboModuleProxy;
  if (typeof turboProxy === "function") {
    try {
      return Boolean(turboProxy("RNGoogleMobileAdsModule"));
    } catch {
      return false;
    }
  }

  return false;
};

export const getMobileAdsModule = (): MobileAdsModule | null => {
  if (cachedModule !== undefined) {
    return cachedModule;
  }

  if (!hasGoogleMobileAdsNativeModule()) {
    cachedModule = null;
    return cachedModule;
  }

  try {
    cachedModule = require("react-native-google-mobile-ads") as MobileAdsModule;
  } catch {
    cachedModule = null;
  }

  return cachedModule;
};

export const isMobileAdsNativeReady = () => Boolean(getMobileAdsModule());
