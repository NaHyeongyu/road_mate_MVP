import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { supabase } from "../../lib/supabase";
import type { AppNotice } from "../types";

type UseSessionStateOptions = {
  onLoadError: (notice: AppNotice) => void;
};

export function useSessionState({ onLoadError }: UseSessionStateOptions) {
  const [authSession, setAuthSession] = useState<Session | null>(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    const hydrateSession = async () => {
      if (!supabase) {
        setIsSessionLoading(false);
        return;
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (cancelled) {
          return;
        }

        setAuthSession(session);

        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          setAuthSession(session);
        });
        unsubscribe = () => data.subscription.unsubscribe();
      } catch {
        if (!cancelled) {
          onLoadError({
            tone: "error",
            text: "Authentication session could not be restored.",
          });
        }
      } finally {
        if (!cancelled) {
          setIsSessionLoading(false);
        }
      }
    };

    void hydrateSession();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [onLoadError]);

  return {
    authSession,
    isSessionLoading,
  };
}
