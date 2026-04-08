import { Pressable, Text, View } from "react-native";

import type { AppStyles } from "../../../../ui/types";

type AuthModeSwitchProps = {
  styles: AppStyles;
  authMode: "signIn" | "signUp";
  onChangeAuthMode: (mode: "signIn" | "signUp") => void;
};

export function AuthModeSwitch({ styles, authMode, onChangeAuthMode }: AuthModeSwitchProps) {
  return (
    <View style={styles.authModeRow}>
      <Pressable
        onPress={() => onChangeAuthMode("signIn")}
        style={[styles.authModeButton, authMode === "signIn" ? styles.authModeButtonActive : null]}
      >
        <Text
          style={[
            styles.authModeButtonText,
            authMode === "signIn" ? styles.authModeButtonTextActive : null,
          ]}
        >
          Sign In
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChangeAuthMode("signUp")}
        style={[styles.authModeButton, authMode === "signUp" ? styles.authModeButtonActive : null]}
      >
        <Text
          style={[
            styles.authModeButtonText,
            authMode === "signUp" ? styles.authModeButtonTextActive : null,
          ]}
        >
          Sign Up
        </Text>
      </Pressable>
    </View>
  );
}
