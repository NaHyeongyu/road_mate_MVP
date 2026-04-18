import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AppColors } from "../../../brandTheme";
import { useAppCopy } from "../../../i18n/AppI18nContext";
import { ScreenHeader } from "../../shared/components/ScreenHeader";
import type { AppStyles } from "../../../ui/types";

export type AuthPasswordResetScreenProps = {
  colors: AppColors;
  styles: AppStyles;
  authEmail: string;
  authPassword: string;
  authPasswordConfirm: string;
  isPasswordRecoveryMode: boolean;
  isPasswordResetEmailSending: boolean;
  isPasswordResetSubmitting: boolean;
  passwordResetEmailStatus: "idle" | "registered" | "missing";
  passwordResetSentEmail: string;
  passwordResetEmailCooldownSeconds: number;
  isPasswordResetReadyToChange: boolean;
  isCheckingPasswordResetEmail: boolean;
  onBack: () => void;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangePasswordConfirm: (value: string) => void;
  onCheckRegisteredEmail: () => void;
  onStartPasswordResetRecovery: () => void;
  onSendPasswordResetEmail: () => void;
  onCompletePasswordReset: () => void;
};

function formatCooldown(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

export function AuthPasswordResetScreen({
  colors,
  styles,
  authEmail,
  authPassword,
  authPasswordConfirm,
  isPasswordRecoveryMode,
  isPasswordResetEmailSending,
  isPasswordResetSubmitting,
  passwordResetEmailStatus,
  passwordResetSentEmail,
  passwordResetEmailCooldownSeconds,
  isPasswordResetReadyToChange,
  isCheckingPasswordResetEmail,
  onBack,
  onChangeEmail,
  onChangePassword,
  onChangePasswordConfirm,
  onCheckRegisteredEmail,
  onStartPasswordResetRecovery,
  onSendPasswordResetEmail,
  onCompletePasswordReset,
}: AuthPasswordResetScreenProps) {
  const copy = useAppCopy();
  const insets = useSafeAreaInsets();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);
  const canSendPasswordResetEmail =
    passwordResetEmailStatus === "registered" &&
    !isCheckingPasswordResetEmail &&
    !isPasswordResetEmailSending &&
    passwordResetEmailCooldownSeconds === 0 &&
    !isPasswordResetReadyToChange;
  const canCompletePasswordReset =
    !isPasswordResetSubmitting &&
    authPassword.length >= 6 &&
    authPassword === authPasswordConfirm;
  const passwordResetEmailLabel = passwordResetSentEmail || authEmail;
  const cooldownLabel =
    passwordResetEmailCooldownSeconds > 0
      ? copy.auth.passwordResetResendCountdown(formatCooldown(passwordResetEmailCooldownSeconds))
      : copy.auth.sendPasswordResetEmail;

  return (
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
          title={
            isPasswordRecoveryMode
              ? copy.auth.passwordRecoveryTitle
              : copy.auth.passwordResetRequestTitle
          }
          leftActionType="back"
          leftActionLabel={copy.common.back}
          onLeftActionPress={onBack}
          styles={styles}
        />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.authPageScroll}
        contentContainerStyle={styles.authEmailBody}
      >
        <View style={styles.authEmailForm}>
          <View style={styles.authCardHeader}>
            <Text style={styles.authEntryTitle}>
              {isPasswordRecoveryMode
                ? copy.auth.passwordRecoveryTitle
                : copy.auth.passwordResetRequestTitle}
            </Text>
            <Text style={styles.authEntrySubtitle}>
              {isPasswordRecoveryMode
                ? copy.auth.passwordRecoverySubtitle
                : copy.auth.passwordResetRequestSubtitle}
            </Text>
          </View>

          {isPasswordRecoveryMode ? (
            <>
              <View style={styles.authFieldGroup}>
                <Text style={styles.authFieldLabel}>{copy.auth.newPasswordLabel}</Text>
                <View style={styles.authInputRow}>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    onChangeText={onChangePassword}
                    onSubmitEditing={onCompletePasswordReset}
                    placeholder={copy.auth.passwordPlaceholder}
                    placeholderTextColor={colors.subtext}
                    returnKeyType="go"
                    secureTextEntry={!isPasswordVisible}
                    style={styles.authInputField}
                    textContentType="newPassword"
                    value={authPassword}
                  />
                  <Pressable
                    onPress={() => setIsPasswordVisible((current) => !current)}
                    style={styles.authInputTrailingButton}
                  >
                    <MaterialCommunityIcons
                      name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={colors.text}
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.authFieldGroup}>
                <Text style={styles.authFieldLabel}>{copy.auth.passwordConfirmLabel}</Text>
                <View style={styles.authInputRow}>
                  <TextInput
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="new-password"
                    onChangeText={onChangePasswordConfirm}
                    onSubmitEditing={onCompletePasswordReset}
                    placeholder={copy.auth.passwordConfirmPlaceholder}
                    placeholderTextColor={colors.subtext}
                    returnKeyType="go"
                    secureTextEntry={!isPasswordConfirmVisible}
                    style={styles.authInputField}
                    textContentType="newPassword"
                    value={authPasswordConfirm}
                  />
                  <Pressable
                    onPress={() => setIsPasswordConfirmVisible((current) => !current)}
                    style={styles.authInputTrailingButton}
                  >
                    <MaterialCommunityIcons
                      name={isPasswordConfirmVisible ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={colors.text}
                    />
                  </Pressable>
                </View>
              </View>

              <Pressable
                disabled={!canCompletePasswordReset}
                onPress={onCompletePasswordReset}
                style={[
                  styles.authSubmitButton,
                  !canCompletePasswordReset ? styles.primaryButtonDisabled : null,
                ]}
              >
                <Text style={styles.authSubmitButtonText}>
                  {isPasswordResetSubmitting ? copy.auth.working : copy.auth.changePassword}
                </Text>
              </Pressable>
            </>
          ) : (
            <>
              {isPasswordResetReadyToChange ? (
                <>
                  <View style={styles.authVerificationPanel}>
                    <View style={styles.authVerificationHeader}>
                      <View style={styles.authVerificationIconWrap}>
                        <MaterialCommunityIcons
                          name="check-circle-outline"
                          size={22}
                          color={colors.hero}
                        />
                      </View>
                      <View style={styles.authVerificationHeaderCopy}>
                        <Text style={styles.authVerificationEyebrow}>
                          {copy.auth.passwordResetVerifiedEyebrow}
                        </Text>
                        <Text style={styles.authVerificationTitle}>
                          {copy.auth.passwordResetVerifiedTitle}
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.authVerificationText}>
                      {copy.auth.passwordResetVerifiedSubtitle}
                    </Text>
                  </View>

                  <Pressable
                    onPress={onStartPasswordResetRecovery}
                    style={styles.authSubmitButton}
                  >
                    <Text style={styles.authSubmitButtonText}>
                      {copy.auth.continueToPasswordChange}
                    </Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <View style={styles.authFieldGroup}>
                    <Text style={styles.authFieldLabel}>{copy.common.email}</Text>
                    <TextInput
                      autoCapitalize="none"
                      autoCorrect={false}
                      autoComplete="email"
                      keyboardType="email-address"
                      onChangeText={onChangeEmail}
                      placeholder={copy.auth.emailPlaceholder}
                      placeholderTextColor={colors.subtext}
                      style={styles.authInput}
                      textContentType="emailAddress"
                      value={authEmail}
                    />

                    <View style={styles.authFieldActionRow}>
                      <Pressable
                        disabled={isCheckingPasswordResetEmail || isPasswordResetEmailSending}
                        onPress={onCheckRegisteredEmail}
                        style={styles.authTextButton}
                      >
                        <Text
                          style={[
                            styles.authTextButtonLabel,
                            isCheckingPasswordResetEmail || isPasswordResetEmailSending
                              ? styles.authTextButtonLabelDisabled
                              : null,
                          ]}
                        >
                          {isCheckingPasswordResetEmail
                            ? copy.auth.working
                            : copy.auth.checkRegisteredEmail}
                        </Text>
                      </Pressable>
                    </View>
                  </View>

                  {passwordResetEmailStatus !== "idle" ? (
                    <Text
                      style={[
                        styles.authStatusText,
                        passwordResetEmailStatus === "registered"
                          ? styles.authStatusSuccessText
                          : styles.authStatusErrorText,
                      ]}
                    >
                      {passwordResetEmailStatus === "registered"
                        ? copy.auth.registeredEmailConfirmed
                        : copy.auth.unregisteredEmail}
                    </Text>
                  ) : null}

                  {passwordResetSentEmail ? (
                    <View style={styles.authVerificationPanel}>
                      <View style={styles.authVerificationHeader}>
                        <View style={styles.authVerificationIconWrap}>
                          <MaterialCommunityIcons
                            name="email-check-outline"
                            size={22}
                            color={colors.hero}
                          />
                        </View>
                        <View style={styles.authVerificationHeaderCopy}>
                          <Text style={styles.authVerificationEyebrow}>
                            {copy.auth.passwordResetEmailSentEyebrow}
                          </Text>
                          <Text style={styles.authVerificationTitle}>
                            {passwordResetEmailLabel}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.authVerificationText}>
                        {copy.auth.passwordResetEmailSentSubtitle}
                      </Text>
                    </View>
                  ) : null}

                  <Pressable
                    disabled={!canSendPasswordResetEmail}
                    onPress={onSendPasswordResetEmail}
                    style={[
                      styles.authSubmitButton,
                      !canSendPasswordResetEmail ? styles.primaryButtonDisabled : null,
                    ]}
                  >
                    <Text style={styles.authSubmitButtonText}>
                      {isPasswordResetEmailSending ? copy.auth.working : cooldownLabel}
                    </Text>
                  </Pressable>

                  <Text style={styles.authEntryHint}>{copy.auth.passwordResetRequestHint}</Text>
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
