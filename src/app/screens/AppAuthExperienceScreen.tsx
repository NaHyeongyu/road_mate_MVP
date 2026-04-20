import { KeyboardAvoidingView, Platform, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { isDarkAppColors, type AppColors } from "../../brandTheme";
import { AuthConfigScreen } from "../../features/auth/screens/AuthConfigScreen";
import { AuthEmailScreen } from "../../features/auth/screens/AuthEmailScreen";
import { AuthPasswordResetScreen } from "../../features/auth/screens/AuthPasswordResetScreen";
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
  const statusBarStyle = isDarkAppColors(colors) ? "light-content" : "dark-content";
  const authEmailScreenProps = buildAuthEmailScreenProps({ appState, colors, styles });
  const authPasswordResetScreenProps = buildAuthPasswordResetScreenProps({
    appState,
    colors,
    styles,
  });

  if (!isSupabaseReady) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.authPage]}>
        <StatusBar barStyle={statusBarStyle} backgroundColor={colors.bg} translucent={false} />
        <AuthConfigScreen logoSource={logoSource} styles={styles} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, styles.authPage]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={colors.bg} translucent={false} />
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
