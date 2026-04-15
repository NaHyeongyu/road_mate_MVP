import { useState } from "react";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import type { AppNotice } from "../../../app/types";
import { supabase } from "../../../lib/supabase";
import type { AuthEntryMethod, AuthMode } from "../types";
import { normalizeEmail } from "../utils/authHelpers";
import { validateAuthInput } from "../utils/authValidation";

WebBrowser.maybeCompleteAuthSession();

type OAuthProvider = "google" | "apple" | "facebook" | "kakao";

type UseAuthFlowArgs = {
  onNotice: (notice: AppNotice) => void;
  onResetSignedInExperience: () => void;
};

type OAuthSessionTokens = {
  accessToken: string;
  refreshToken: string;
};

const OAUTH_REDIRECT_PATH = "auth/callback";
const OAUTH_SCHEME = "roadmate";

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

const getSessionTokensFromCallbackUrl = (callbackUrl: string): OAuthSessionTokens | null => {
  const [baseUrl, hashFragment] = callbackUrl.split("#");
  let url: URL;

  try {
    url = new URL(baseUrl);
  } catch {
    return null;
  }

  const queryParams = url.searchParams;
  const fragmentParams = new URLSearchParams(hashFragment ?? "");
  const accessToken = queryParams.get("access_token") ?? fragmentParams.get("access_token");
  const refreshToken = queryParams.get("refresh_token") ?? fragmentParams.get("refresh_token");

  if (!accessToken || !refreshToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
  };
};

const getOAuthErrorMessageFromCallbackUrl = (callbackUrl: string): string | null => {
  const [baseUrl, hashFragment] = callbackUrl.split("#");
  let url: URL;

  try {
    url = new URL(baseUrl);
  } catch {
    return null;
  }

  const queryParams = url.searchParams;
  const fragmentParams = new URLSearchParams(hashFragment ?? "");
  return (
    queryParams.get("error_description") ??
    fragmentParams.get("error_description") ??
    queryParams.get("error") ??
    fragmentParams.get("error")
  );
};

const getOAuthCodeFromCallbackUrl = (callbackUrl: string): string | null => {
  const [baseUrl, hashFragment] = callbackUrl.split("#");
  let url: URL;

  try {
    url = new URL(baseUrl);
  } catch {
    return null;
  }

  const queryParams = url.searchParams;
  const fragmentParams = new URLSearchParams(hashFragment ?? "");
  return queryParams.get("code") ?? fragmentParams.get("code");
};

export function useAuthFlow({ onNotice, onResetSignedInExperience }: UseAuthFlowArgs) {
  const [authMode, setAuthMode] = useState<AuthMode>("signIn");
  const [authEntryMethod, setAuthEntryMethod] = useState<AuthEntryMethod>("options");
  const [authDisplayName, setAuthDisplayName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [oauthProviderPending, setOauthProviderPending] = useState<OAuthProvider | null>(null);

  const handleSubmitAuth = async () => {
    if (!supabase) {
      onNotice({
        tone: "error",
        text: "Supabase is not configured yet. Add your MVP project values to `.env` first.",
      });
      return;
    }

    const normalizedEmail = normalizeEmail(authEmail);
    const password = authPassword;
    const displayName = authDisplayName.trim();
    const validationError = validateAuthInput({
      authMode,
      email: normalizedEmail,
      password,
      displayName,
    });
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
        onNotice({
          tone: "success",
          text: "Signed in successfully.",
        });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              display_name: displayName,
            },
          },
        });

        if (error) {
          throw error;
        }

        setAuthEmail(normalizedEmail);
        setAuthPassword("");
        setAuthDisplayName("");

        if (data.session) {
          onNotice({
            tone: "success",
            text: `Signed up and signed in as ${displayName}.`,
          });
        } else {
          setAuthMode("signIn");
          onNotice({
            tone: "success",
            text: "Sign-up complete. Check your email to verify your account, then sign in.",
          });
        }
      }
    } catch (error) {
      onNotice({
        tone: "error",
        text: `${authMode === "signIn" ? "Sign in" : "Sign up"} failed: ${(error as Error).message}`,
      });
    } finally {
      setIsAuthSubmitting(false);
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
        text: "Signed out.",
      });
    } catch (error) {
      onNotice({
        tone: "error",
        text: `Sign out failed: ${(error as Error).message}`,
      });
    }
  };

  const handleOAuthSignIn = async (provider: OAuthProvider) => {
    if (!supabase) {
      onNotice({
        tone: "error",
        text: "Supabase is not configured yet. Add your MVP project values to `.env` first.",
      });
      return;
    }

    if (oauthProviderPending) {
      return;
    }

    const providerLabel = getOAuthProviderLabel(provider);
    const redirectTo = Linking.createURL(OAUTH_REDIRECT_PATH, { scheme: OAUTH_SCHEME });
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
        throw new Error("Unable to start OAuth flow. Missing authorization URL.");
      }

      const browserResult = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

      if (browserResult.type !== "success" || !browserResult.url) {
        const wasCanceled = browserResult.type === "cancel" || browserResult.type === "dismiss";
        if (wasCanceled) {
          onNotice({
            tone: "info",
            text: `${providerLabel} sign-in was canceled.`,
          });
        }
        return;
      }

      const callbackErrorMessage = getOAuthErrorMessageFromCallbackUrl(browserResult.url);
      if (callbackErrorMessage) {
        throw new Error(callbackErrorMessage);
      }

      const tokens = getSessionTokensFromCallbackUrl(browserResult.url);
      if (tokens) {
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
        });

        if (setSessionError) {
          throw setSessionError;
        }
      } else {
        const code = getOAuthCodeFromCallbackUrl(browserResult.url);
        if (!code) {
          throw new Error(
            "OAuth callback did not include session tokens. Check Supabase provider redirect URL settings.",
          );
        }

        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          throw exchangeError;
        }
      }

      onNotice({
        tone: "success",
        text: `Signed in with ${providerLabel}.`,
      });
    } catch (error) {
      onNotice({
        tone: "error",
        text: `${providerLabel} sign-in failed: ${(error as Error).message}`,
      });
    } finally {
      setOauthProviderPending(null);
    }
  };

  return {
    authMode,
    authEntryMethod,
    authDisplayName,
    authEmail,
    authPassword,
    isAuthSubmitting,
    oauthProviderPending,
    setAuthMode,
    setAuthEntryMethod,
    setAuthDisplayName,
    setAuthEmail,
    setAuthPassword,
    handleSubmitAuth,
    handleOAuthSignIn,
    handleSignOut,
  };
}
