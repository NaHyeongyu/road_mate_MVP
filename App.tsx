import { useMemo } from "react";
import { Platform, useColorScheme, View } from "react-native";

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
import { createStyles } from "./src/ui/createStyles";

export default function App() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";
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
  const shouldUseLightShell =
    !isWebAdminRoute && (isLanguageSelectionExperience || isAuthExperience || isWebAuthCompleteRoute);
  const colors = shouldUseLightShell
    ? brandPalette.light
    : isWebAdminRoute
      ? brandPalette.dark
      : isDarkMode
      ? brandPalette.dark
      : brandPalette.light;
  const logoSource = shouldUseLightShell
    ? (RoadmateLogoLight as unknown)
    : isDarkMode
      ? (RoadmateLogoDark as unknown)
      : (RoadmateLogoLight as unknown);
  const styles = useMemo(() => createStyles(colors), [colors]);
  useAppOpenAd({ enabled: Boolean(appState.currentUser) && !isWebAdminRoute });

  return (
    <AppI18nProvider language={appState.appLanguage} onChangeLanguage={appState.setAppLanguage}>
      <View style={{ flex: 1 }}>
        {isWebAdminRoute ? (
          <AppAdminOperationsScreen appState={appState} isSupabaseReady={isSupabaseReady} />
        ) : isWebAuthCompleteRoute ? (
          <AppAuthCompleteScreen colors={colors} styles={styles} logoSource={logoSource} />
        ) : appState.loading || (appState.currentUserId && appState.isVehicleLoading) ? (
          <AppLoadingScreen colors={colors} styles={styles} scheme={scheme} />
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
            scheme={scheme}
          />
        )}

        <NoticeBanner notice={appState.notice} styles={styles} />
      </View>
    </AppI18nProvider>
  );
}
