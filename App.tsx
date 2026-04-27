import { useMemo } from "react";
import { Platform, StyleSheet, useColorScheme, useWindowDimensions, View } from "react-native";

import RoadmateLogoDark from "./assets/branding/logo_dark.svg";
import RoadmateLogoLight from "./assets/branding/logo_light.svg";
import { AppAdminOperationsScreen } from "./src/app/screens/AppAdminOperationsScreen";
import { AppAuthExperienceScreen } from "./src/app/screens/AppAuthExperienceScreen";
import { AppAuthCompleteScreen } from "./src/app/screens/AppAuthCompleteScreen";
import { AppCommunityExperienceScreen } from "./src/app/screens/AppCommunityExperienceScreen";
import { AppLanguageSelectionScreen } from "./src/app/screens/AppLanguageSelectionScreen";
import { AppLoadingScreen } from "./src/app/screens/AppLoadingScreen";
import { useAppOpenAd } from "./src/features/ads/hooks/useAppOpenAd";
import { NoticeBanner } from "./src/features/shared/components/NoticeBanner";
import { useRoadmateAppState } from "./src/app/useRoadmateAppState";
import { brandPalette } from "./src/brandTheme";
import { AppI18nProvider } from "./src/i18n/AppI18nContext";
import { supabase } from "./src/lib/supabase";
import { AppColorsProvider } from "./src/ui/useAppColors";
import { createStyles } from "./src/ui/createStyles";
import {
  AppViewportProvider,
  PHONE_VIEWPORT_MAX_WIDTH,
} from "./src/ui/viewport";

export default function App() {
  const scheme = useColorScheme();
  const { width: windowWidth } = useWindowDimensions();
  const appState = useRoadmateAppState();
  const isWebAuthCompleteRoute =
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    window.location.pathname.replace(/\/+$/, "") === "/auth/complete";
  const isWebAdminRoute =
    Platform.OS === "web" &&
    typeof window !== "undefined" &&
    window.location.pathname.replace(/\/+$/, "") === "/admin";

  const isSupabaseReady = appState.isSupabaseConfigured && Boolean(supabase);
  const isLanguageSelectionExperience = !appState.hasCompletedLanguageSelection;
  const isAuthExperience = appState.authEntryMethod !== "options";
  const shouldUseDarkMode =
    isWebAdminRoute ||
    appState.appThemeMode === "dark" ||
    (appState.appThemeMode === "system" && scheme === "dark");
  const colors = shouldUseDarkMode ? brandPalette.dark : brandPalette.light;
  const logoSource = shouldUseDarkMode
    ? (RoadmateLogoDark as unknown)
    : (RoadmateLogoLight as unknown);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const shouldUseNativePhoneFrame =
    Platform.OS !== "web" && windowWidth > PHONE_VIEWPORT_MAX_WIDTH;
  const viewportWidth = shouldUseNativePhoneFrame
    ? PHONE_VIEWPORT_MAX_WIDTH
    : windowWidth;
  const viewport = useMemo(
    () => ({
      width: viewportWidth,
      windowWidth,
      isPhoneFrameActive: shouldUseNativePhoneFrame,
    }),
    [shouldUseNativePhoneFrame, viewportWidth, windowWidth]
  );
  useAppOpenAd({ enabled: Boolean(appState.currentUser) && !isWebAdminRoute });

  return (
    <AppI18nProvider language={appState.appLanguage} onChangeLanguage={appState.setAppLanguage}>
      <AppColorsProvider colors={colors}>
        <AppViewportProvider value={viewport}>
          <View
            style={[
              appViewportStyles.root,
              shouldUseNativePhoneFrame ? appViewportStyles.rootFramed : null,
              { backgroundColor: colors.bg },
            ]}
          >
            <View
              style={[
                appViewportStyles.frame,
                shouldUseNativePhoneFrame ? appViewportStyles.nativePhoneFrame : null,
              ]}
            >
              {isWebAdminRoute ? (
                <AppAdminOperationsScreen appState={appState} isSupabaseReady={isSupabaseReady} />
              ) : isWebAuthCompleteRoute ? (
                <AppAuthCompleteScreen colors={colors} styles={styles} logoSource={logoSource} />
              ) : appState.loading || (appState.currentUserId && appState.isVehicleLoading) ? (
                <AppLoadingScreen colors={colors} styles={styles} />
              ) : isLanguageSelectionExperience ? (
                <AppLanguageSelectionScreen colors={colors} styles={styles} />
              ) : isAuthExperience ? (
                <AppAuthExperienceScreen
                  appState={appState}
                  colors={colors}
                  styles={styles}
                  logoSource={logoSource}
                  isSupabaseReady={isSupabaseReady}
                />
              ) : (
                <AppCommunityExperienceScreen
                  appState={appState}
                  colors={colors}
                  styles={styles}
                />
              )}

              <NoticeBanner notice={appState.notice} styles={styles} />
            </View>
          </View>
        </AppViewportProvider>
      </AppColorsProvider>
    </AppI18nProvider>
  );
}

const appViewportStyles = StyleSheet.create({
  root: {
    flex: 1,
  },
  rootFramed: {
    alignItems: "center",
  },
  frame: {
    flex: 1,
    width: "100%",
  },
  nativePhoneFrame: {
    maxWidth: PHONE_VIEWPORT_MAX_WIDTH,
    overflow: "hidden",
  },
});
