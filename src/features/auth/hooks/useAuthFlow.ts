import { useEffect, useRef, useState } from "react";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import type { AppNotice } from "../../../app/types";
import type { AppCopy } from "../../../i18n/copy";
import { supabase } from "../../../lib/supabase";
import type { AuthEntryMethod, AuthMode } from "../types";
import {
  isEmailAlreadyRegisteredError,
  isEmailConfirmationRequiredError,
  parseAuthCallback,
} from "../utils/authCallback";
import { normalizeEmail } from "../utils/authHelpers";
import { validateAuthInput } from "../utils/authValidation";

WebBrowser.maybeCompleteAuthSession();

type OAuthProvider = "google" | "apple" | "facebook" | "kakao";

type UseAuthFlowArgs = {
  copy: AppCopy;
  onNotice: (notice: AppNotice) => void;
  onResetSignedInExperience: () => void;
};

type OAuthSessionTokens = {
  accessToken: string;
  refreshToken: string;
};

type AuthCallbackFlow = "standard" | "recovery";
type AuthCallbackResult = {
  status: "ignored" | "handled" | "duplicate";
  flow?: AuthCallbackFlow;
};
type EmailDuplicateCheckStatus = "idle" | "available" | "duplicate";
type PasswordResetEmailStatus = "idle" | "registered" | "missing";

const OAUTH_REDIRECT_PATH = "auth/callback";
const OAUTH_SCHEME = "roadmate";
const EMAIL_AUTH_REDIRECT_URL = `${OAUTH_SCHEME}://${OAUTH_REDIRECT_PATH}`;
const DEFAULT_AUTH_WEB_URL = "https://rodematemvp.vercel.app";
const SIGNUP_COMPLETE_PATH = "/auth/complete";
const PASSWORD_RESET_EMAIL_COOLDOWN_SECONDS = 90;

const getOAuthProviderLabel = (provider: OAuthProvider) => {
  if (provider === "google") {
    return "Google";
  }

  if (provider === "apple") {
    return "Apple";
  }

  if (provider === "kakao") {
    return "Kakao";
  }

  return "Facebook";
};

const getAuthRedirectUrl = () => Linking.createURL(OAUTH_REDIRECT_PATH, { scheme: OAUTH_SCHEME });
const getPasswordResetRedirectUrl = () => EMAIL_AUTH_REDIRECT_URL;
const getSignupEmailRedirectUrl = () => {
  const configuredSiteUrl = String(process.env.EXPO_PUBLIC_SITE_URL ?? "").trim();
  const baseUrl = (configuredSiteUrl || DEFAULT_AUTH_WEB_URL).replace(/\/+$/, "");
  return `${baseUrl}${SIGNUP_COMPLETE_PATH}`;
};

function isMissingEmailCheckFunctionError(message: string) {
  return /is_email_registered|function .*does not exist|could not find the function/i.test(
    message,
  );
}

export function useAuthFlow({ copy, onNotice, onResetSignedInExperience }: UseAuthFlowArgs) {
  const [authMode, setAuthMode] = useState<AuthMode>("signIn");
  const [authEntryMethod, setAuthEntryMethod] = useState<AuthEntryMethod>("options");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authPasswordConfirm, setAuthPasswordConfirm] = useState("");
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState("");
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [isPasswordRecoveryMode, setIsPasswordRecoveryMode] = useState(false);
  const [isPasswordResetEmailSending, setIsPasswordResetEmailSending] = useState(false);
  const [isPasswordResetSubmitting, setIsPasswordResetSubmitting] = useState(false);
  const [passwordResetEmailStatus, setPasswordResetEmailStatus] =
    useState<PasswordResetEmailStatus>("idle");
  const [passwordResetCheckedEmail, setPasswordResetCheckedEmail] = useState("");
  const [passwordResetSentEmail, setPasswordResetSentEmail] = useState("");
  const [passwordResetEmailCooldownSeconds, setPasswordResetEmailCooldownSeconds] = useState(0);
  const [isPasswordResetReadyToChange, setIsPasswordResetReadyToChange] = useState(false);
  const [isCheckingPasswordResetEmail, setIsCheckingPasswordResetEmail] = useState(false);
  const [emailDuplicateCheckStatus, setEmailDuplicateCheckStatus] =
    useState<EmailDuplicateCheckStatus>("idle");
  const [emailDuplicateCheckEmail, setEmailDuplicateCheckEmail] = useState("");
  const [isCheckingEmailDuplicate, setIsCheckingEmailDuplicate] = useState(false);
  const [oauthProviderPending, setOauthProviderPending] = useState<OAuthProvider | null>(null);
  const processedCallbackUrlsRef = useRef(new Set<string>());
  const callbackUrlInFlightRef = useRef<string | null>(null);

  const resetEmailDuplicateCheck = () => {
    setEmailDuplicateCheckStatus("idle");
    setEmailDuplicateCheckEmail("");
  };

  const resetPasswordResetEmailCheck = () => {
    setPasswordResetEmailStatus("idle");
    setPasswordResetCheckedEmail("");
  };

  const resetPasswordResetRequestState = () => {
    resetPasswordResetEmailCheck();
    setPasswordResetSentEmail("");
    setPasswordResetEmailCooldownSeconds(0);
    setIsPasswordResetReadyToChange(false);
  };

  useEffect(() => {
    if (passwordResetEmailCooldownSeconds <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setPasswordResetEmailCooldownSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [passwordResetEmailCooldownSeconds]);

  const checkWhetherEmailIsRegistered = async (
    normalizedEmail: string,
  ): Promise<boolean | null> => {
    if (!supabase) {
      return null;
    }

    const { data, error } = await supabase.rpc("is_email_registered", {
      check_email: normalizedEmail,
    });

    if (!error) {
      return Boolean(data);
    }

    if (isMissingEmailCheckFunctionError(error.message)) {
      return null;
    }

    throw error;
  };

  const runEmailDuplicateCheck = async (
    normalizedEmail: string,
    options?: {
      announceResult?: boolean;
      surfaceErrors?: boolean;
    },
  ): Promise<EmailDuplicateCheckStatus | "unknown" | "invalid"> => {
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      if (options?.surfaceErrors ?? true) {
        onNotice({
          tone: "error",
          text: copy.validation.validEmail,
        });
      }
      return "invalid";
    }

    setIsCheckingEmailDuplicate(true);

    try {
      const isRegistered = await checkWhetherEmailIsRegistered(normalizedEmail);
      if (isRegistered === null) {
        if (options?.surfaceErrors ?? true) {
          onNotice({
            tone: "error",
            text: copy.notices.duplicateCheckFailed(
              copy.notices.emailDuplicateCheckUnavailable
            ),
          });
        }
        return "unknown";
      }

      setEmailDuplicateCheckEmail(normalizedEmail);

      if (isRegistered) {
        setEmailDuplicateCheckStatus("duplicate");
        if (options?.announceResult ?? true) {
          onNotice({
            tone: "error",
            text: copy.notices.duplicateEmailFound(normalizedEmail),
          });
        }
        return "duplicate";
      }

      setEmailDuplicateCheckStatus("available");
      if (options?.announceResult ?? true) {
        onNotice({
          tone: "success",
          text: copy.notices.emailAvailableForSignUp(normalizedEmail),
        });
      }
      return "available";
    } catch (error) {
      if (options?.surfaceErrors ?? true) {
        onNotice({
          tone: "error",
          text: copy.notices.duplicateCheckFailed((error as Error).message),
        });
      }
      return "unknown";
    } finally {
      setIsCheckingEmailDuplicate(false);
    }
  };

  const runPasswordResetEmailCheck = async (
    normalizedEmail: string,
    options?: {
      surfaceErrors?: boolean;
    },
  ): Promise<PasswordResetEmailStatus | "unknown" | "invalid"> => {
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      if (options?.surfaceErrors ?? true) {
        onNotice({
          tone: "error",
          text: copy.validation.validEmail,
        });
      }
      return "invalid";
    }

    setIsCheckingPasswordResetEmail(true);

    try {
      const isRegistered = await checkWhetherEmailIsRegistered(normalizedEmail);
      if (isRegistered === null) {
        if (options?.surfaceErrors ?? true) {
          onNotice({
            tone: "error",
            text: copy.notices.passwordResetEmailCheckFailed(
              copy.notices.emailDuplicateCheckUnavailable
            ),
          });
        }
        return "unknown";
      }

      setPasswordResetCheckedEmail(normalizedEmail);

      if (isRegistered) {
        setPasswordResetEmailStatus("registered");
        return "registered";
      }

      setPasswordResetEmailStatus("missing");
      return "missing";
    } catch (error) {
      if (options?.surfaceErrors ?? true) {
        onNotice({
          tone: "error",
          text: copy.notices.passwordResetEmailCheckFailed((error as Error).message),
        });
      }
      return "unknown";
    } finally {
      setIsCheckingPasswordResetEmail(false);
    }
  };

  const completeAuthFromCallbackUrl = async (
    callbackUrl: string,
  ): Promise<AuthCallbackResult> => {
    if (!supabase) {
      return { status: "ignored" };
    }

    const parsedCallback = parseAuthCallback(callbackUrl);
    if (!parsedCallback) {
      return { status: "ignored" };
    }

    if (
      processedCallbackUrlsRef.current.has(callbackUrl) ||
      callbackUrlInFlightRef.current === callbackUrl
    ) {
      return { status: "duplicate" };
    }

    callbackUrlInFlightRef.current = callbackUrl;

    try {
      if (parsedCallback.errorMessage) {
        throw new Error(parsedCallback.errorMessage);
      }

      const tokens =
        parsedCallback.accessToken && parsedCallback.refreshToken
          ? ({
              accessToken: parsedCallback.accessToken,
              refreshToken: parsedCallback.refreshToken,
            } satisfies OAuthSessionTokens)
          : null;

      if (tokens) {
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
        });

        if (setSessionError) {
          throw setSessionError;
        }
      } else if (parsedCallback.code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
          parsedCallback.code,
        );

        if (exchangeError) {
          throw exchangeError;
        }
      }

      processedCallbackUrlsRef.current.add(callbackUrl);
      const callbackFlow = parsedCallback.type === "recovery" ? "recovery" : "standard";
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const resolvedUserEmail = normalizeEmail(String(user?.email ?? ""));

      setPendingVerificationEmail("");
      setAuthPassword("");
      setAuthPasswordConfirm("");
      setAuthEmail(resolvedUserEmail);

      if (callbackFlow === "recovery") {
        setAuthMode("signIn");
        setAuthEntryMethod("passwordReset");
        setIsPasswordRecoveryMode(false);
        setPasswordResetCheckedEmail(resolvedUserEmail);
        setPasswordResetEmailStatus("registered");
        setPasswordResetSentEmail(resolvedUserEmail);
        setPasswordResetEmailCooldownSeconds(0);
        setIsPasswordResetReadyToChange(true);
      } else {
        setIsPasswordRecoveryMode(false);
        setAuthEntryMethod("options");
      }

      return {
        status: "handled",
        flow: callbackFlow,
      };
    } finally {
      if (callbackUrlInFlightRef.current === callbackUrl) {
        callbackUrlInFlightRef.current = null;
      }
    }
  };

  useEffect(() => {
    let active = true;

    const handleIncomingAuthCallback = async (callbackUrl: string | null) => {
      if (!callbackUrl || !active) {
        return;
      }

      try {
        const result = await completeAuthFromCallbackUrl(callbackUrl);
        if (result.status !== "handled" || !active) {
          return;
        }

        onNotice({
          tone: result.flow === "recovery" ? "info" : "success",
          text:
            result.flow === "recovery"
              ? copy.notices.passwordResetReady
              : copy.notices.emailVerifiedAndSignedIn,
        });
      } catch (error) {
        if (!active) {
          return;
        }

        onNotice({
          tone: "error",
          text: copy.notices.authenticationCouldNotBeCompleted((error as Error).message),
        });
      }
    };

    void Linking.getInitialURL().then((callbackUrl) => {
      void handleIncomingAuthCallback(callbackUrl);
    });

    const subscription = Linking.addEventListener("url", ({ url }) => {
      void handleIncomingAuthCallback(url);
    });

    return () => {
      active = false;
      subscription.remove();
    };
  }, [copy, onNotice]);

  const handleAuthModeChange = (mode: AuthMode) => {
    setAuthMode(mode);
    setAuthPasswordConfirm("");
    setIsPasswordRecoveryMode(false);
    resetPasswordResetRequestState();

    if (mode === "signUp") {
      setPendingVerificationEmail("");
    } else {
      resetEmailDuplicateCheck();
    }
  };

  const handleAuthEmailChange = (value: string) => {
    const normalizedValue = normalizeEmail(value);
    setAuthEmail(value);

    if (pendingVerificationEmail && normalizedValue !== pendingVerificationEmail) {
      setPendingVerificationEmail("");
    }

    if (emailDuplicateCheckEmail && normalizedValue !== emailDuplicateCheckEmail) {
      resetEmailDuplicateCheck();
    }

    if (passwordResetCheckedEmail && normalizedValue !== passwordResetCheckedEmail) {
      resetPasswordResetRequestState();
    }
  };

  const handleAuthPasswordChange = (value: string) => {
    setAuthPassword(value);
  };

  const handleCheckEmailDuplicate = async () => {
    if (!supabase) {
      onNotice({
        tone: "error",
        text: copy.notices.supabaseNotConfigured,
      });
      return;
    }

    await runEmailDuplicateCheck(normalizeEmail(authEmail), {
      announceResult: true,
      surfaceErrors: true,
    });
  };

  const handleOpenPasswordReset = () => {
    setAuthPassword("");
    setAuthPasswordConfirm("");
    setIsPasswordRecoveryMode(false);
    resetPasswordResetRequestState();
    setAuthEntryMethod("passwordReset");
  };

  const handleStartPasswordResetRecovery = () => {
    setAuthPassword("");
    setAuthPasswordConfirm("");
    setIsPasswordRecoveryMode(true);
  };

  const handleCheckPasswordResetEmail = async () => {
    if (!supabase) {
      onNotice({
        tone: "error",
        text: copy.notices.supabaseNotConfigured,
      });
      return;
    }

    await runPasswordResetEmailCheck(normalizeEmail(authEmail), {
      surfaceErrors: true,
    });
  };

  const handleRequestPasswordReset = async () => {
    if (!supabase) {
      onNotice({
        tone: "error",
        text: copy.notices.supabaseNotConfigured,
      });
      return;
    }

    const normalizedEmail = normalizeEmail(authEmail);
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      onNotice({
        tone: "error",
        text: copy.notices.enterEmailBeforePasswordReset,
      });
      return;
    }

    const checkedResetStatus =
      passwordResetCheckedEmail === normalizedEmail ? passwordResetEmailStatus : "idle";
    if (checkedResetStatus !== "registered") {
      const emailCheckResult = await runPasswordResetEmailCheck(normalizedEmail, {
        surfaceErrors: true,
      });

      if (emailCheckResult !== "registered") {
        if (emailCheckResult === "missing") {
          onNotice({
            tone: "error",
            text: copy.notices.passwordResetEmailNotRegistered(normalizedEmail),
          });
        }
        return;
      }
    }

    if (passwordResetEmailCooldownSeconds > 0) {
      return;
    }

    setIsPasswordResetEmailSending(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
        redirectTo: getPasswordResetRedirectUrl(),
      });

      if (error) {
        throw error;
      }

      setAuthEmail(normalizedEmail);
      setAuthPassword("");
      setAuthPasswordConfirm("");
      setPasswordResetSentEmail(normalizedEmail);
      setPasswordResetEmailCooldownSeconds(PASSWORD_RESET_EMAIL_COOLDOWN_SECONDS);
      setIsPasswordResetReadyToChange(false);
      onNotice({
        tone: "success",
        text: copy.notices.passwordResetEmailSent(normalizedEmail),
      });
    } catch (error) {
      onNotice({
        tone: "error",
        text: copy.notices.passwordResetFailed((error as Error).message),
      });
    } finally {
      setIsPasswordResetEmailSending(false);
    }
  };

  const handleCompletePasswordReset = async () => {
    if (!supabase) {
      onNotice({
        tone: "error",
        text: copy.notices.supabaseNotConfigured,
      });
      return;
    }

    if (authPassword.length < 6) {
      onNotice({
        tone: "error",
        text: copy.validation.passwordLength,
      });
      return;
    }

    if (authPassword !== authPasswordConfirm) {
      onNotice({
        tone: "error",
        text: copy.validation.passwordConfirmMismatch,
      });
      return;
    }

    setIsPasswordResetSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: authPassword,
      });

      if (error) {
        throw error;
      }

      setIsPasswordRecoveryMode(false);
      setIsPasswordResetReadyToChange(false);
      setAuthPassword("");
      setAuthPasswordConfirm("");
      setPasswordResetSentEmail("");
      setPasswordResetEmailCooldownSeconds(0);
      setAuthEntryMethod("options");
      onNotice({
        tone: "success",
        text: copy.notices.passwordResetComplete,
      });
    } catch (error) {
      onNotice({
        tone: "error",
        text: copy.notices.passwordResetFailed((error as Error).message),
      });
    } finally {
      setIsPasswordResetSubmitting(false);
    }
  };

  const handleCloseEmailAuth = () => {
    setIsPasswordRecoveryMode(false);
    setAuthPassword("");
    setAuthPasswordConfirm("");
    resetEmailDuplicateCheck();
    resetPasswordResetRequestState();
    setAuthEntryMethod("options");
  };

  const handleSubmitAuth = async () => {
    if (!supabase) {
      onNotice({
        tone: "error",
        text: copy.notices.supabaseNotConfigured,
      });
      return;
    }

    const normalizedEmail = normalizeEmail(authEmail);
    const password = authPassword;

    if (isPasswordRecoveryMode) {
      await handleCompletePasswordReset();
      return;
    }

    const validationError = validateAuthInput({
      authMode,
      email: normalizedEmail,
      password,
      passwordConfirm: authPasswordConfirm,
    }, copy);
    if (validationError) {
      onNotice({
        tone: "error",
        text: validationError,
      });
      return;
    }

    setIsAuthSubmitting(true);

    try {
      if (authMode === "signIn") {
        const { error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (error) {
          throw error;
        }

        setAuthEmail(normalizedEmail);
        setAuthPassword("");
        setAuthPasswordConfirm("");
        setPendingVerificationEmail("");
        resetEmailDuplicateCheck();
        setAuthEntryMethod("options");
        onNotice({
          tone: "success",
          text: copy.notices.signInSuccess,
        });
      } else {
        const cachedEmailCheckStatus =
          emailDuplicateCheckEmail === normalizedEmail ? emailDuplicateCheckStatus : "idle";

        if (cachedEmailCheckStatus === "duplicate") {
          onNotice({
            tone: "error",
            text: copy.notices.duplicateEmailFound(normalizedEmail),
          });
          return;
        }

        if (cachedEmailCheckStatus !== "available") {
          const duplicateCheckResult = await runEmailDuplicateCheck(normalizedEmail, {
            announceResult: false,
            surfaceErrors: false,
          });

          if (duplicateCheckResult === "duplicate") {
            onNotice({
              tone: "error",
              text: copy.notices.duplicateEmailFound(normalizedEmail),
            });
            return;
          }
        }

        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            emailRedirectTo: getSignupEmailRedirectUrl(),
          },
        });

        if (error) {
          throw error;
        }

        setAuthEmail(normalizedEmail);
        setAuthPassword("");
        setAuthPasswordConfirm("");
        resetEmailDuplicateCheck();

        if (data.session) {
          setPendingVerificationEmail("");
          setAuthEntryMethod("options");
          onNotice({
            tone: "success",
            text: copy.notices.signUpAndIn(normalizedEmail),
          });
        } else {
          setPendingVerificationEmail(normalizedEmail);
          setAuthMode("signIn");
          onNotice({
            tone: "success",
            text: copy.notices.verificationEmailSent(normalizedEmail),
          });
        }
      }
    } catch (error) {
      const errorMessage = (error as Error).message;

      if (authMode === "signUp" && isEmailAlreadyRegisteredError(errorMessage)) {
        setEmailDuplicateCheckEmail(normalizedEmail);
        setEmailDuplicateCheckStatus("duplicate");
        onNotice({
          tone: "error",
          text: copy.notices.duplicateEmailFound(normalizedEmail),
        });
        return;
      }

      if (authMode === "signIn" && isEmailConfirmationRequiredError(errorMessage)) {
        setPendingVerificationEmail(normalizedEmail);
        onNotice({
          tone: "info",
          text: copy.notices.emailVerificationStillNeeded(normalizedEmail),
        });
        return;
      }

      onNotice({
        tone: "error",
        text: copy.notices.authFailed(
          authMode === "signIn" ? copy.auth.signIn : copy.auth.signUp,
          errorMessage
        ),
      });
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleResendVerificationEmail = async () => {
    if (!supabase) {
      onNotice({
        tone: "error",
        text: copy.notices.supabaseNotConfigured,
      });
      return;
    }

    const emailToResend = pendingVerificationEmail || normalizeEmail(authEmail);
    if (!emailToResend) {
      onNotice({
        tone: "error",
        text: copy.notices.enterEmailBeforeResendingVerification,
      });
      return;
    }

    setIsResendingVerification(true);

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: emailToResend,
        options: {
          emailRedirectTo: getSignupEmailRedirectUrl(),
        },
      });

      if (error) {
        throw error;
      }

      setPendingVerificationEmail(emailToResend);
      onNotice({
        tone: "success",
        text: copy.notices.verificationEmailResent(emailToResend),
      });
    } catch (error) {
      onNotice({
        tone: "error",
        text: copy.notices.verificationEmailResendFailed((error as Error).message),
      });
    } finally {
      setIsResendingVerification(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }

      onResetSignedInExperience();
      onNotice({
        tone: "info",
        text: copy.notices.signedOut,
      });
    } catch (error) {
      onNotice({
        tone: "error",
        text: copy.notices.authFailed(copy.auth.signOut, (error as Error).message),
      });
    }
  };

  const handleOAuthSignIn = async (provider: OAuthProvider) => {
    if (!supabase) {
      onNotice({
        tone: "error",
        text: copy.notices.supabaseNotConfigured,
      });
      return;
    }

    if (oauthProviderPending) {
      return;
    }

    const providerLabel = getOAuthProviderLabel(provider);
    const redirectTo = getAuthRedirectUrl();
    setOauthProviderPending(provider);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        throw error;
      }

      if (!data?.url) {
        throw new Error(copy.notices.oauthMissingAuthorizationUrl);
      }

      const browserResult = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      if (browserResult.type !== "success" || !browserResult.url) {
        const wasCanceled = browserResult.type === "cancel" || browserResult.type === "dismiss";
        if (wasCanceled) {
          onNotice({
            tone: "info",
            text: copy.notices.oauthCanceled(providerLabel),
          });
        }
        return;
      }

      const result = await completeAuthFromCallbackUrl(browserResult.url);
      if (result.status !== "handled") {
        throw new Error(copy.notices.oauthMissingSessionTokens);
      }

      onNotice({
        tone: "success",
        text: copy.notices.oauthSuccess(providerLabel),
      });
      setAuthEntryMethod("options");
    } catch (error) {
      onNotice({
        tone: "error",
        text: copy.notices.authFailed(`${providerLabel} ${copy.auth.signIn}`, (error as Error).message),
      });
    } finally {
      setOauthProviderPending(null);
    }
  };

  return {
    authMode,
    authEntryMethod,
    authEmail,
    authPassword,
    authPasswordConfirm,
    isAuthSubmitting,
    pendingVerificationEmail,
    isResendingVerification,
    isPasswordRecoveryMode,
    isPasswordResetEmailSending,
    isPasswordResetSubmitting,
    passwordResetEmailStatus,
    passwordResetSentEmail,
    passwordResetEmailCooldownSeconds,
    isPasswordResetReadyToChange,
    isCheckingPasswordResetEmail,
    emailDuplicateCheckStatus,
    isCheckingEmailDuplicate,
    oauthProviderPending,
    setAuthMode: handleAuthModeChange,
    setAuthEntryMethod,
    setAuthEmail: handleAuthEmailChange,
    setAuthPassword: handleAuthPasswordChange,
    setAuthPasswordConfirm,
    handleSubmitAuth,
    handleCheckEmailDuplicate,
    handleCheckPasswordResetEmail,
    handleOpenPasswordReset,
    handleStartPasswordResetRecovery,
    handleRequestPasswordReset,
    handleCloseEmailAuth,
    handleResendVerificationEmail,
    handleCompletePasswordReset,
    handleOAuthSignIn,
    handleSignOut,
  };
}
