import { useEffect, useRef } from "react";
import { AppState } from "react-native";

import { getAppOpenAdUnitId, isAdMobSupportedPlatform } from "../adMobUnits";
import { getMobileAdsModule } from "../mobileAdsRuntime";

type UseAppOpenAdOptions = {
  enabled: boolean;
};

export function useAppOpenAd({ enabled }: UseAppOpenAdOptions) {
  const appStateRef = useRef(AppState.currentState);
  const isLoadedRef = useRef(false);
  const isShowingRef = useRef(false);
  const hasShownInSessionRef = useRef(false);

  useEffect(() => {
    const module = getMobileAdsModule();
    const mobileAdsFactory = module?.default;
    const adUnitId = getAppOpenAdUnitId();
    if (!enabled) {
      isLoadedRef.current = false;
      isShowingRef.current = false;
      hasShownInSessionRef.current = false;
    }

    if (
      !enabled ||
      !isAdMobSupportedPlatform ||
      !adUnitId ||
      !module ||
      typeof mobileAdsFactory !== "function"
    ) {
      return;
    }

    const appOpenAd = module.AppOpenAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const showIfReady = () => {
      if (!isLoadedRef.current || isShowingRef.current || hasShownInSessionRef.current) {
        return;
      }

      isShowingRef.current = true;
      hasShownInSessionRef.current = true;
      void appOpenAd.show().catch(() => {
        isShowingRef.current = false;
        isLoadedRef.current = false;
      });
    };

    const unsubLoaded = appOpenAd.addAdEventListener(module.AdEventType.LOADED, () => {
      isLoadedRef.current = true;
      showIfReady();
    });

    const unsubOpened = appOpenAd.addAdEventListener(module.AdEventType.OPENED, () => {
      isShowingRef.current = true;
    });

    const unsubClosed = appOpenAd.addAdEventListener(module.AdEventType.CLOSED, () => {
      isShowingRef.current = false;
      isLoadedRef.current = false;
    });

    const unsubError = appOpenAd.addAdEventListener(module.AdEventType.ERROR, () => {
      isLoadedRef.current = false;
      isShowingRef.current = false;
    });

    void mobileAdsFactory().initialize().finally(() => {
      appOpenAd.load();
    });

    const appStateSubscription = AppState.addEventListener("change", (nextState) => {
      const previousState = appStateRef.current;
      appStateRef.current = nextState;
      const isForegrounding =
        (previousState === "background" || previousState === "inactive") &&
        nextState === "active";

      if (!isForegrounding) {
        return;
      }

      if (hasShownInSessionRef.current) {
        return;
      }

      if (isLoadedRef.current) {
        showIfReady();
      } else {
        appOpenAd.load();
      }
    });

    return () => {
      appStateSubscription.remove();
      unsubLoaded();
      unsubOpened();
      unsubClosed();
      unsubError();
    };
  }, [enabled]);
}
