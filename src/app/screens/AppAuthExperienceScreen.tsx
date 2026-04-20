import { KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AppColors } from "../../brandTheme";
import { AuthConfigScreen } from "../../features/auth/screens/AuthConfigScreen";
import { AuthEmailScreen } from "../../features/auth/screens/AuthEmailScreen";
import { AuthPasswordResetScreen } from "../../features/auth/screens/AuthPasswordResetScreen";
import { APP_BAR_BG } from "../../ui/styleFragments/layout/constants";
import type { AppStyles } from "../../ui/types";
import type { RoadmateAppState } from "../useRoadmateAppState";
import {
  buildAuthEmailScreenProps,
  buildAuthPasswordResetScreenProps,
} from "./screenBindings";

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
  const authEmailScreenProps = buildAuthEmailScreenProps({ appState, colors, styles });
  const authPasswordResetScreenProps = buildAuthPasswordResetScreenProps({
    appState,
    colors,
    styles,
  });

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
        style={styles.authPageFrame}
      >
        {appState.authEntryMethod === "passwordReset" ? (
          <AuthPasswordResetScreen {...authPasswordResetScreenProps} />
        ) : (
          <AuthEmailScreen {...authEmailScreenProps} />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
