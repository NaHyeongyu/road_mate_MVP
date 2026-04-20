import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { AppColors } from "../../../../brandTheme";
import { useAppCopy } from "../../../../i18n/AppI18nContext";
import type { AppStyles } from "../../../../ui/types";

type AuthModeSwitchProps = {
  colors: AppColors;
  styles: AppStyles;
  authMode: "signIn" | "signUp";
  onChangeAuthMode: (mode: "signIn" | "signUp") => void;
};

export function AuthModeSwitch({ colors, styles, authMode, onChangeAuthMode }: AuthModeSwitchProps) {
  const copy = useAppCopy();

  return (
    <View style={styles.authModeRow}>
      <Pressable
        onPress={() => onChangeAuthMode("signIn")}
        style={({ pressed }) => [
          styles.authModeButton,
          authMode === "signIn" ? styles.authModeButtonActive : null,
          pressed && authMode !== "signIn" ? styles.authModeButtonPressed : null,
        ]}
      >
        <View style={styles.authModeButtonContent}>
          <View
            style={[
              styles.authModeButtonIndicator,
              authMode === "signIn" ? styles.authModeButtonIndicatorActive : null,
            ]}
          >
            <MaterialCommunityIcons
              name="login"
              size={14}
              color={authMode === "signIn" ? colors.brandText : colors.mutedIcon}
            />
          </View>
          <Text
            style={[
              styles.authModeButtonText,
              authMode === "signIn" ? styles.authModeButtonTextActive : null,
            ]}
          >
            {copy.auth.signIn}
          </Text>
        </View>
      </Pressable>
      <Pressable
        onPress={() => onChangeAuthMode("signUp")}
        style={({ pressed }) => [
          styles.authModeButton,
          authMode === "signUp" ? styles.authModeButtonActive : null,
          pressed && authMode !== "signUp" ? styles.authModeButtonPressed : null,
        ]}
      >
        <View style={styles.authModeButtonContent}>
          <View
            style={[
              styles.authModeButtonIndicator,
              authMode === "signUp" ? styles.authModeButtonIndicatorActive : null,
            ]}
          >
            <MaterialCommunityIcons
              name="account-plus-outline"
              size={14}
              color={authMode === "signUp" ? colors.brandText : colors.mutedIcon}
            />
          </View>
          <Text
            style={[
              styles.authModeButtonText,
              authMode === "signUp" ? styles.authModeButtonTextActive : null,
            ]}
          >
            {copy.auth.signUp}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
