import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AppColors } from "../../../brandTheme";
import { NoticeBanner } from "../../shared/components/NoticeBanner";
import { ScreenHeader } from "../../shared/components/ScreenHeader";
import type { AppStyles } from "../../../ui/types";
import { AuthEmailFormCard } from "./components/AuthEmailFormCard";

export type AuthEmailScreenProps = {
  colors: AppColors;
  styles: AppStyles;
  authMode: "signIn" | "signUp";
  authEmail: string;
  authPassword: string;
  isAuthSubmitting: boolean;
  notice: { tone: "info" | "success" | "error"; text: string };
  onBack: () => void;
  onChangeAuthMode: (mode: "signIn" | "signUp") => void;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onSubmit: () => void;
};

export function AuthEmailScreen({
  colors,
  styles,
  authMode,
  authEmail,
  authPassword,
  isAuthSubmitting,
  notice,
  onBack,
  onChangeAuthMode,
  onChangeEmail,
  onChangePassword,
  onSubmit,
}: AuthEmailScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <>
      <View style={styles.authEmailScreen}>
        <View
          style={[
            styles.headerDock,
            {
              marginTop: -insets.top,
              paddingTop: insets.top + 6,
            },
          ]}
        >
          <ScreenHeader
            title={authMode === "signIn" ? "Email Sign In" : "Email Sign Up"}
            leftActionType="back"
            leftActionLabel="Back"
            onLeftActionPress={onBack}
            styles={styles}
          />
        </View>

        <View style={styles.authEmailBody}>
          <AuthEmailFormCard
            colors={colors}
            styles={styles}
            authMode={authMode}
            authEmail={authEmail}
            authPassword={authPassword}
            isAuthSubmitting={isAuthSubmitting}
            onChangeAuthMode={onChangeAuthMode}
            onChangeEmail={onChangeEmail}
            onChangePassword={onChangePassword}
            onSubmit={onSubmit}
          />

          <NoticeBanner notice={notice} styles={styles} />
        </View>
      </View>
    </>
  );
}
