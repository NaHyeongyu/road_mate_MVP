import { useMemo } from "react";
import { useColorScheme } from "react-native";

import RoadmateLogoDark from "./assets/branding/logo_dark.svg";
import RoadmateLogoLight from "./assets/branding/logo_light.svg";
import { AppAuthExperienceScreen } from "./src/app/screens/AppAuthExperienceScreen";
import { AppCommunityExperienceScreen } from "./src/app/screens/AppCommunityExperienceScreen";
import { AppLoadingScreen } from "./src/app/screens/AppLoadingScreen";
import { useAppOpenAd } from "./src/features/ads/hooks/useAppOpenAd";
import { useRoadmateAppState } from "./src/app/useRoadmateAppState";
import { brandPalette } from "./src/brandTheme";
import { supabase } from "./src/lib/supabase";
import { createStyles } from "./src/ui/createStyles";

export default function App() {
  const scheme = useColorScheme();
  const isDarkMode = scheme === "dark";
  const appState = useRoadmateAppState();

  const isSupabaseReady = appState.isSupabaseConfigured && Boolean(supabase);
  const isAuthExperience = !appState.currentUser || !isSupabaseReady;
  const colors = isAuthExperience
    ? brandPalette.light
    : isDarkMode
      ? brandPalette.dark
      : brandPalette.light;
  const logoSource = isAuthExperience
    ? (RoadmateLogoLight as unknown)
    : isDarkMode
      ? (RoadmateLogoDark as unknown)
      : (RoadmateLogoLight as unknown);
  const styles = useMemo(() => createStyles(colors), [colors]);
  useAppOpenAd({ enabled: Boolean(appState.currentUser) });

  if (appState.loading || (appState.currentUserId && appState.isVehicleLoading)) {
    return <AppLoadingScreen colors={colors} styles={styles} scheme={scheme} />;
  }

  if (!appState.currentUser) {
    return (
      <AppAuthExperienceScreen
        appState={appState}
        colors={colors}
        styles={styles}
        logoSource={logoSource}
        isSupabaseReady={isSupabaseReady}
      />
    );
  }

  return (
    <AppCommunityExperienceScreen
      appState={appState}
      colors={colors}
      styles={styles}
      scheme={scheme}
    />
  );
}
