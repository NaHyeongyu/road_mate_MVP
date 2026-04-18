const IOS_TEST_ADMOB_APP_ID = "ca-app-pub-3940256099942544~1458002511";
const ANDROID_TEST_ADMOB_APP_ID = "ca-app-pub-3940256099942544~3347511713";

const trimOrUndefined = (value) => {
  const normalized = String(value ?? "").trim();
  return normalized || undefined;
};

const parseBooleanEnv = (value) => {
  const normalized = String(value ?? "").trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes" || normalized === "on";
};

const isReleaseLikeBuild = () => {
  const profile = trimOrUndefined(process.env.EAS_BUILD_PROFILE);
  return process.env.NODE_ENV === "production" || Boolean(profile && profile !== "development");
};

const getAdMobAppId = (envName, fallbackValue) => {
  const configured = trimOrUndefined(process.env[envName]);
  if (configured) {
    return configured;
  }

  if (isReleaseLikeBuild()) {
    throw new Error(`${envName} must be set for non-development builds.`);
  }

  return fallbackValue;
};

module.exports = ({ config }) => {
  const existingPlugins = Array.isArray(config.plugins) ? config.plugins : [];
  const pluginsWithoutNativeBranding = existingPlugins.filter((plugin) => {
    if (Array.isArray(plugin)) {
      return plugin[0] !== "react-native-google-mobile-ads" && plugin[0] !== "expo-splash-screen";
    }

    return plugin !== "react-native-google-mobile-ads" && plugin !== "expo-splash-screen";
  });
  const isAdsEnabled = parseBooleanEnv(process.env.EXPO_PUBLIC_ENABLE_ADS);
  const adMobPlugin = !isAdsEnabled
    ? []
    : [
        [
          "react-native-google-mobile-ads",
          {
            androidAppId: getAdMobAppId("ADMOB_ANDROID_APP_ID", ANDROID_TEST_ADMOB_APP_ID),
            iosAppId: getAdMobAppId("ADMOB_IOS_APP_ID", IOS_TEST_ADMOB_APP_ID),
            delayAppMeasurementInit: true,
            userTrackingUsageDescription:
              "This identifier will be used to deliver personalized ads to you.",
          },
        ],
      ];
  const splashScreenPlugin = [
    [
      "expo-splash-screen",
      {
        image: "./assets/roadmate-mark.png",
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
