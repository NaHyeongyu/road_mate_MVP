import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { AppColors } from "../../../brandTheme";
import { useAppCopy } from "../../../i18n/AppI18nContext";
import { ScreenHeader } from "../../shared/components/ScreenHeader";
import type { AppStyles } from "../../../ui/types";
import { AuthEmailFormCard } from "./components/AuthEmailFormCard";

export type AuthEmailScreenProps = {
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
  onBack: () => void;
  onChangeAuthMode: (mode: "signIn" | "signUp") => void;
  onChangeEmail: (value: string) => void;
  onChangePassword: (value: string) => void;
  onChangePasswordConfirm: (value: string) => void;
  onSubmit: () => void;
  onCheckEmailDuplicate: () => void;
  onOpenPasswordResetPage: () => void;
  onCompletePasswordReset: () => void;
  onResendVerificationEmail: () => void;
};

export function AuthEmailScreen({
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
  onBack,
  onChangeAuthMode,
  onChangeEmail,
  onChangePassword,
  onChangePasswordConfirm,
  onSubmit,
  onCheckEmailDuplicate,
  onOpenPasswordResetPage,
  onCompletePasswordReset,
  onResendVerificationEmail,
}: AuthEmailScreenProps) {
  const insets = useSafeAreaInsets();
  const copy = useAppCopy();

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
            title={
              isPasswordRecoveryMode
                ? copy.auth.passwordRecoveryTitle
                : authMode === "signIn"
                  ? copy.auth.emailSignInTitle
                  : copy.auth.emailSignUpTitle
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
          <AuthEmailFormCard
            colors={colors}
            styles={styles}
            authMode={authMode}
            authEmail={authEmail}
            authPassword={authPassword}
            authPasswordConfirm={authPasswordConfirm}
            isAuthSubmitting={isAuthSubmitting}
            pendingVerificationEmail={pendingVerificationEmail}
            isResendingVerification={isResendingVerification}
            isPasswordRecoveryMode={isPasswordRecoveryMode}
            isPasswordResetEmailSending={isPasswordResetEmailSending}
            isPasswordResetSubmitting={isPasswordResetSubmitting}
            emailDuplicateCheckStatus={emailDuplicateCheckStatus}
            isCheckingEmailDuplicate={isCheckingEmailDuplicate}
            onChangeAuthMode={onChangeAuthMode}
            onChangeEmail={onChangeEmail}
            onChangePassword={onChangePassword}
            onChangePasswordConfirm={onChangePasswordConfirm}
            onSubmit={isPasswordRecoveryMode ? onCompletePasswordReset : onSubmit}
            onCheckEmailDuplicate={onCheckEmailDuplicate}
            onOpenPasswordResetPage={onOpenPasswordResetPage}
            onResendVerificationEmail={onResendVerificationEmail}
          />

        </ScrollView>
      </View>
    </>
  );
}
