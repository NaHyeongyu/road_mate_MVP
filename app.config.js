const IOS_TEST_ADMOB_APP_ID = "ca-app-pub-3940256099942544~1458002511";
const ANDROID_TEST_ADMOB_APP_ID = "ca-app-pub-3940256099942544~3347511713";
const PLACEHOLDER_ADMOB_APP_ID_PREFIX = "ca-app-pub-1234567890123456~";

const trimOrUndefined = (value) => {
  const normalized = String(value ?? "").trim();
  return normalized || undefined;
};

const parseBooleanEnv = (value) => {
  const normalized = String(value ?? "").trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
};

const resolveBooleanEnv = (primaryValue, fallbackValue) => {
  const configured = trimOrUndefined(primaryValue);
  return parseBooleanEnv(configured ?? fallbackValue);
};

const isPlaceholderAdMobAppId = (value) =>
  value === IOS_TEST_ADMOB_APP_ID ||
  value === ANDROID_TEST_ADMOB_APP_ID ||
  value.startsWith(PLACEHOLDER_ADMOB_APP_ID_PREFIX);

const getRequiredAdMobAppId = (envName) => {
  const configured = trimOrUndefined(process.env[envName]);

  if (!configured) {
    throw new Error(`${envName} must be set when EXPO_PUBLIC_ENABLE_ADS=true.`);
  }

  if (isPlaceholderAdMobAppId(configured)) {
    throw new Error(`${envName} must be a real AdMob App ID, not a placeholder/test value.`);
  }

  return configured;
};

const getNativeAdMobAppId = (envName, fallbackValue) => {
  const configured = trimOrUndefined(process.env[envName]);
  return configured || fallbackValue;
};

module.exports = ({ config }) => {
  const buildPlatform = trimOrUndefined(process.env.EAS_BUILD_PLATFORM);
  const isAndroidBuild = buildPlatform === "android";
  const isIosBuild = buildPlatform === "ios";
  const existingPlugins = Array.isArray(config.plugins) ? config.plugins : [];
  const pluginsWithoutNativeBranding = existingPlugins.filter((plugin) => {
    if (Array.isArray(plugin)) {
      return plugin[0] !== "react-native-google-mobile-ads" && plugin[0] !== "expo-splash-screen";
    }

    return plugin !== "react-native-google-mobile-ads" && plugin !== "expo-splash-screen";
  });
  const isAndroidAdsEnabled = resolveBooleanEnv(
    process.env.EXPO_PUBLIC_ENABLE_ANDROID_ADS,
    process.env.EXPO_PUBLIC_ENABLE_ADS
  );
  const isIosAdsEnabled = resolveBooleanEnv(
    process.env.EXPO_PUBLIC_ENABLE_IOS_ADS,
    process.env.EXPO_PUBLIC_ENABLE_ADS
  );
  const adMobPlugin = [
    [
      "react-native-google-mobile-ads",
      {
        // Keep a valid native App ID configured even when ads are disabled.
        // The iOS SDK can crash on launch if the module is linked without it.
        androidAppId: isAndroidAdsEnabled && !isIosBuild
          ? getRequiredAdMobAppId("ADMOB_ANDROID_APP_ID")
          : getNativeAdMobAppId("ADMOB_ANDROID_APP_ID", ANDROID_TEST_ADMOB_APP_ID),
        iosAppId: isIosAdsEnabled && !isAndroidBuild
          ? getRequiredAdMobAppId("ADMOB_IOS_APP_ID")
          : getNativeAdMobAppId("ADMOB_IOS_APP_ID", IOS_TEST_ADMOB_APP_ID),
        delayAppMeasurementInit: true,
        skAdNetworkItems: [],
      },
    ],
  ];
  const splashScreenPlugin = [
    [
      "expo-splash-screen",
      {
        image: "./assets/roadmate-splash-mark.png",
        resizeMode: "contain",
        backgroundColor: "#FFFFFF",
        imageWidth: 180,
      },
    ],
  ];

  return {
    ...config,
    plugins: [
      ...pluginsWithoutNativeBranding,
      ...splashScreenPlugin,
      ...adMobPlugin,
    ],
  };
};
