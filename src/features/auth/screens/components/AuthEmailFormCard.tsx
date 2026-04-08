import { Pressable, Text, TextInput, View } from "react-native";

import type { AppColors } from "../../../../brandTheme";
import type { AppStyles } from "../../../../ui/types";
import { AuthModeSwitch } from "./AuthModeSwitch";

type AuthEmailFormCardProps = {
  colors: AppColors;
  styles: AppStyles;
  authMode: "signIn" | "signUp";
  authDisplayName: string;
  authEmail: string;
  authPassword: string;
  isAuthSubmitting: boolean;
  onChangeAuthMode: (mode: "signIn" | "signUp") => void;
  onChangeDisplayName: (value: string) => void;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onSubmit: () => void;
};

export function AuthEmailFormCard({
  colors,
  styles,
  authMode,
  authDisplayName,
  authEmail,
  authPassword,
  isAuthSubmitting,
  onChangeAuthMode,
  onChangeDisplayName,
  onChangeEmail,
  onChangePassword,
  onSubmit,
}: AuthEmailFormCardProps) {
  return (
    <View style={[styles.authCard, styles.authStandaloneCard, styles.authEntryCard]}>
      <View style={styles.authCardHeader}>
        <Text style={styles.authEntryTitle}>Get Started with Roadmate</Text>
        <Text style={styles.authEntrySubtitle}>
          {authMode === "signIn"
            ? "Sign in with email to start exploring and posting rides."
            : "Create an account with email to start using Roadmate."}
        </Text>
      </View>

      <AuthModeSwitch styles={styles} authMode={authMode} onChangeAuthMode={onChangeAuthMode} />

      {authMode === "signUp" ? (
        <TextInput
          autoCapitalize="words"
          onChangeText={onChangeDisplayName}
          placeholder="Name"
          placeholderTextColor={colors.subtext}
          style={styles.authInput}
          value={authDisplayName}
        />
      ) : null}

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        onChangeText={onChangeEmail}
        placeholder="Email"
        placeholderTextColor={colors.subtext}
        style={styles.authInput}
        value={authEmail}
      />

      <TextInput
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={onChangePassword}
        placeholder="Password (at least 6 characters)"
        placeholderTextColor={colors.subtext}
        secureTextEntry
        style={styles.authInput}
        value={authPassword}
      />

      <Pressable
        disabled={isAuthSubmitting}
        onPress={onSubmit}
        style={[styles.authSubmitButton, isAuthSubmitting ? styles.primaryButtonDisabled : null]}
      >
        <Text style={styles.authSubmitButtonText}>
          {isAuthSubmitting ? "Working..." : authMode === "signIn" ? "Sign In" : "Sign Up"}
        </Text>
      </Pressable>

      <Text style={styles.authEntryHint}>
        {authMode === "signIn"
          ? "Don’t have an account? Switch to Sign Up."
          : "Email verification may be required after sign-up."}
      </Text>
    </View>
  );
}
