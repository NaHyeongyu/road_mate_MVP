import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import type { AppColors } from "../../../../brandTheme";
import { useAppCopy } from "../../../../i18n/AppI18nContext";
import type { AppStyles } from "../../../../ui/types";
import { AuthModeSwitch } from "./AuthModeSwitch";

type AuthEmailFormCardProps = {
  colors: AppColors;
  styles: AppStyles;
  authMode: "signIn" | "signUp";
  authEmail: string;
  authPassword: string;
  authPasswordConfirm: string;
  isAuthSubmitting: boolean;
  pendingVerificationEmail: string;
  isResendingVerification: boolean;
  isPasswordRecoveryMode: boolean;
  isPasswordResetEmailSending: boolean;
  isPasswordResetSubmitting: boolean;
  emailDuplicateCheckStatus: "idle" | "available" | "duplicate";
  isCheckingEmailDuplicate: boolean;
  onChangeAuthMode: (mode: "signIn" | "signUp") => void;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangePasswordConfirm: (value: string) => void;
  onSubmit: () => void;
  onCheckEmailDuplicate: () => void;
  onOpenPasswordResetPage: () => void;
  onResendVerificationEmail: () => void;
};

export function AuthEmailFormCard({
  colors,
  styles,
  authMode,
  authEmail,
  authPassword,
  authPasswordConfirm,
  isAuthSubmitting,
  pendingVerificationEmail,
  isResendingVerification,
  isPasswordRecoveryMode,
  isPasswordResetEmailSending,
  isPasswordResetSubmitting,
  emailDuplicateCheckStatus,
  isCheckingEmailDuplicate,
  onChangeAuthMode,
  onChangeEmail,
  onChangePassword,
  onChangePasswordConfirm,
  onSubmit,
  onCheckEmailDuplicate,
  onOpenPasswordResetPage,
  onResendVerificationEmail,
}: AuthEmailFormCardProps) {
  const hasPendingVerification = Boolean(pendingVerificationEmail);
  const copy = useAppCopy();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordConfirmVisible, setIsPasswordConfirmVisible] = useState(false);
  const isDuplicateSignUpLocked =
    authMode === "signUp" &&
    emailDuplicateCheckStatus === "duplicate" &&
    !isPasswordRecoveryMode;
  const isBusy = isAuthSubmitting || isPasswordResetSubmitting;
  const isSignUpReady =
    authMode !== "signUp" ||
    isPasswordRecoveryMode ||
    (emailDuplicateCheckStatus === "available" &&
      authPassword.length >= 6 &&
      authPassword === authPasswordConfirm);
  const isSubmitDisabled = isBusy || isDuplicateSignUpLocked || !isSignUpReady;
  const duplicateCheckLabel =
    emailDuplicateCheckStatus === "available"
      ? copy.auth.emailAvailable
      : copy.auth.emailAlreadyRegistered;
  const duplicateCheckLabelStyle =
    emailDuplicateCheckStatus === "available"
      ? styles.authStatusSuccessText
      : styles.authStatusErrorText;

  return (
    <View style={styles.authEmailForm}>
      <View style={styles.authCardHeader}>
        <Text style={styles.authEntryTitle}>
          {isPasswordRecoveryMode
            ? copy.auth.passwordRecoveryTitle
            : authMode === "signIn"
              ? copy.auth.emailSignInTitle
              : copy.auth.emailSignUpTitle}
        </Text>
        <Text style={styles.authEntrySubtitle}>
          {isPasswordRecoveryMode
            ? copy.auth.passwordRecoverySubtitle
            : authMode === "signIn"
              ? copy.auth.entrySubtitleSignIn
              : copy.auth.entrySubtitleSignUp}
        </Text>
      </View>

      {isPasswordRecoveryMode ? null : (
        <AuthModeSwitch styles={styles} authMode={authMode} onChangeAuthMode={onChangeAuthMode} />
      )}

      {hasPendingVerification && !isPasswordRecoveryMode ? (
        <View style={styles.authVerificationPanel}>
          <View style={styles.authVerificationHeader}>
            <View style={styles.authVerificationIconWrap}>
              <MaterialCommunityIcons name="email-check-outline" size={22} color={colors.hero} />
            </View>
            <View style={styles.authVerificationHeaderCopy}>
              <Text style={styles.authVerificationEyebrow}>Verification email sent</Text>
              <Text style={styles.authVerificationTitle}>{pendingVerificationEmail}</Text>
            </View>
          </View>

          <Text style={styles.authVerificationText}>
            Open the newest verification email, finish confirmation, then return to Roadmate and
            sign in with the same email.
          </Text>

          <View style={styles.authVerificationSteps}>
            <View style={styles.authVerificationStepRow}>
              <Text style={styles.authVerificationStepBullet}>1</Text>
              <Text style={styles.authVerificationStepText}>
                Open the newest verification email from Roadmate.
              </Text>
            </View>
            <View style={styles.authVerificationStepRow}>
              <Text style={styles.authVerificationStepBullet}>2</Text>
                <Text style={styles.authVerificationStepText}>
                  Complete confirmation in the browser page that opens.
                </Text>
              </View>
              <View style={styles.authVerificationStepRow}>
                <Text style={styles.authVerificationStepBullet}>3</Text>
                <Text style={styles.authVerificationStepText}>
                  Return to Roadmate and sign in again if the app does not reopen automatically.
                </Text>
              </View>
          </View>

          <View style={styles.authInlineActions}>
            <Pressable
              disabled={isResendingVerification}
              onPress={onResendVerificationEmail}
              style={[
                styles.authSubmitButton,
                isResendingVerification ? styles.primaryButtonDisabled : null,
              ]}
            >
              <Text style={styles.authSubmitButtonText}>
                {isResendingVerification ? copy.auth.working : "Resend email"}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <View style={styles.authFieldGroup}>
        <Text style={styles.authFieldLabel}>{copy.common.email}</Text>
        <TextInput
          editable={!isPasswordRecoveryMode}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          keyboardType="email-address"
          onChangeText={onChangeEmail}
          placeholder={copy.auth.emailPlaceholder}
          placeholderTextColor={colors.subtext}
          style={[styles.authInput, isPasswordRecoveryMode ? styles.authInputReadOnly : null]}
          textContentType="emailAddress"
          value={authEmail}
        />

        {authMode === "signUp" && !isPasswordRecoveryMode ? (
          <>
            <View style={styles.authFieldActionRow}>
              <Pressable
                disabled={isAuthSubmitting || isCheckingEmailDuplicate}
                onPress={onCheckEmailDuplicate}
                style={styles.authTextButton}
              >
                <Text
                  style={[
                    styles.authTextButtonLabel,
                    isAuthSubmitting || isCheckingEmailDuplicate
                      ? styles.authTextButtonLabelDisabled
                      : null,
                  ]}
                >
                  {isCheckingEmailDuplicate ? copy.auth.working : copy.auth.checkEmailDuplicate}
                </Text>
              </Pressable>
            </View>

            {emailDuplicateCheckStatus !== "idle" ? (
              <Text style={[styles.authStatusText, duplicateCheckLabelStyle]}>
                {duplicateCheckLabel}
              </Text>
            ) : null}
          </>
        ) : null}
      </View>

      <View style={styles.authFieldGroup}>
        <Text style={styles.authFieldLabel}>
          {isPasswordRecoveryMode ? copy.auth.newPasswordLabel : copy.auth.passwordLabel}
        </Text>
        <View
          style={[
            styles.authInputRow,
            isDuplicateSignUpLocked ? styles.authInputRowReadOnly : null,
          ]}
        >
          <TextInput
            editable={!isDuplicateSignUpLocked}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={
              isPasswordRecoveryMode || authMode === "signUp"
                ? "new-password"
                : "current-password"
            }
            onChangeText={onChangePassword}
            onSubmitEditing={onSubmit}
            placeholder={copy.auth.passwordPlaceholder}
            placeholderTextColor={colors.subtext}
            returnKeyType="go"
            secureTextEntry={!isPasswordVisible}
            style={styles.authInputField}
            textContentType={
              isPasswordRecoveryMode || authMode === "signUp" ? "newPassword" : "password"
            }
            value={authPassword}
          />
          <Pressable
            disabled={isDuplicateSignUpLocked}
            onPress={() => setIsPasswordVisible((current) => !current)}
            style={styles.authInputTrailingButton}
          >
            <MaterialCommunityIcons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={isDuplicateSignUpLocked ? colors.subtext : colors.text}
            />
          </Pressable>
        </View>

        {authMode === "signIn" && !isPasswordRecoveryMode ? (
          <View style={styles.authFieldActionRow}>
            <Pressable
              disabled={isAuthSubmitting}
              onPress={onOpenPasswordResetPage}
              style={styles.authTextButton}
            >
              <Text
                style={[
                  styles.authTextButtonLabel,
                  isAuthSubmitting ? styles.authTextButtonLabelDisabled : null,
                ]}
              >
                {copy.auth.forgotPassword}
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>

      {authMode === "signUp" || isPasswordRecoveryMode ? (
        <View style={styles.authFieldGroup}>
          <Text style={styles.authFieldLabel}>{copy.auth.passwordConfirmLabel}</Text>
          <View
            style={[
              styles.authInputRow,
              isDuplicateSignUpLocked ? styles.authInputRowReadOnly : null,
            ]}
          >
            <TextInput
              editable={!isDuplicateSignUpLocked}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="new-password"
              onChangeText={onChangePasswordConfirm}
              onSubmitEditing={onSubmit}
              placeholder={copy.auth.passwordConfirmPlaceholder}
              placeholderTextColor={colors.subtext}
              returnKeyType="go"
              secureTextEntry={!isPasswordConfirmVisible}
              style={styles.authInputField}
              textContentType="newPassword"
              value={authPasswordConfirm}
            />
            <Pressable
              disabled={isDuplicateSignUpLocked}
              onPress={() => setIsPasswordConfirmVisible((current) => !current)}
              style={styles.authInputTrailingButton}
            >
              <MaterialCommunityIcons
                name={isPasswordConfirmVisible ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={isDuplicateSignUpLocked ? colors.subtext : colors.text}
              />
            </Pressable>
          </View>
        </View>
      ) : null}

      <Pressable
        disabled={isSubmitDisabled}
        onPress={onSubmit}
        style={[
          styles.authSubmitButton,
          isSubmitDisabled ? styles.primaryButtonDisabled : null,
        ]}
      >
        <Text style={styles.authSubmitButtonText}>
          {isBusy
            ? copy.auth.working
            : isPasswordRecoveryMode
              ? copy.auth.resetPassword
              : authMode === "signIn"
                ? copy.auth.signIn
                : copy.auth.signUp}
        </Text>
      </Pressable>

      {isPasswordRecoveryMode ? null : (
        <Text style={styles.authEntryHint}>
          {authMode === "signIn"
            ? hasPendingVerification
              ? "Already verified? Sign in manually if the email link did not reopen the app."
              : "Need an account first? Switch to Sign Up."
            : "We keep the verification step explicit so users can see exactly what happened after sign-up."}
        </Text>
      )}
    </View>
  );
}
