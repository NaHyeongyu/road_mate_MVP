import { KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AppColors } from "../../brandTheme";
import { AuthConfigScreen } from "../../features/auth/screens/AuthConfigScreen";
import { AuthEmailScreen } from "../../features/auth/screens/AuthEmailScreen";
import { AuthOptionsScreen } from "../../features/auth/screens/AuthOptionsScreen";
import { APP_BAR_BG } from "../../ui/styleFragments/layout/constants";
import type { AppStyles } from "../../ui/types";
import type { RoadmateAppState } from "../useRoadmateAppState";
import { buildAuthEmailScreenProps, buildAuthOptionsScreenProps } from "./screenBindings";

type AppAuthExperienceScreenProps = {
  appState: RoadmateAppState;
  colors: AppColors;
  styles: AppStyles;
  logoSource: unknown;
  isSupabaseReady: boolean;
};

export function AppAuthExperienceScreen({
  appState,
  colors,
  styles,
  logoSource,
  isSupabaseReady,
}: AppAuthExperienceScreenProps) {
  const authOptionsScreenProps = buildAuthOptionsScreenProps({ appState, styles, logoSource });
  const authEmailScreenProps = buildAuthEmailScreenProps({ appState, colors, styles });
  const authContentStyle =
    appState.authEntryMethod === "options" ? styles.authPageContent : styles.authPageFrame;

  if (!isSupabaseReady) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.authPage]}>
        <StatusBar barStyle="dark-content" backgroundColor={APP_BAR_BG} translucent={false} />
        <AuthConfigScreen logoSource={logoSource} styles={styles} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, styles.authPage]}>
      <StatusBar barStyle="dark-content" backgroundColor={APP_BAR_BG} translucent={false} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={authContentStyle}
      >
        {appState.authEntryMethod === "options" ? (
          <AuthOptionsScreen {...authOptionsScreenProps} />
        ) : (
          <AuthEmailScreen {...authEmailScreenProps} />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
