type MobileAdsModule = typeof import("react-native-google-mobile-ads");

export const getMobileAdsModule = (): MobileAdsModule | null => null;

export const isMobileAdsNativeReady = () => false;
