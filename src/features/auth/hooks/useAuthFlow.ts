import { useState } from "react";

import type { AppNotice } from "../../../app/types";
import { supabase } from "../../../lib/supabase";
import type { AuthEntryMethod, AuthMode } from "../types";
import { normalizeEmail } from "../utils/authHelpers";
import { validateAuthInput } from "../utils/authValidation";

type UseAuthFlowArgs = {
  onNotice: (notice: AppNotice) => void;
  onResetSignedInExperience: () => void;
};

export function useAuthFlow({ onNotice, onResetSignedInExperience }: UseAuthFlowArgs) {
  const [authMode, setAuthMode] = useState<AuthMode>("signIn");
  const [authEntryMethod, setAuthEntryMethod] = useState<AuthEntryMethod>("options");
  const [authDisplayName, setAuthDisplayName] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);

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

  return {
    authMode,
    authEntryMethod,
    authDisplayName,
    authEmail,
    authPassword,
    isAuthSubmitting,
    setAuthMode,
    setAuthEntryMethod,
    setAuthDisplayName,
    setAuthEmail,
    setAuthPassword,
    handleSubmitAuth,
    handleSignOut,
  };
}
