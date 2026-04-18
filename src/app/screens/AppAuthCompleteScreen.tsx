import { useEffect } from "react";
import { Pressable, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AppColors } from "../../brandTheme";
import { BrandLogo } from "../../features/shared/components/BrandLogo";
import { useAppCopy } from "../../i18n/AppI18nContext";
import type { AppStyles } from "../../ui/types";

const ROADMATE_APP_URL = "roadmate://";

function isLikelyMobileBrowser() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /android|iphone|ipad|ipod/i.test(navigator.userAgent);
}

function readAuthErrorMessage() {
  if (typeof window === "undefined") {
    return "";
  }

  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));

  return (
    searchParams.get("error_description") ??
    hashParams.get("error_description") ??
    searchParams.get("error") ??
    hashParams.get("error") ??
    ""
  );
}

function openRoadmateApp() {
  if (typeof window === "undefined") {
    return;
  }

  window.location.assign(ROADMATE_APP_URL);
}

type AppAuthCompleteScreenProps = {
  colors: AppColors;
  styles: AppStyles;
  logoSource: unknown;
};

export function AppAuthCompleteScreen({
  colors,
  styles,
  logoSource,
}: AppAuthCompleteScreenProps) {
  const copy = useAppCopy();
  const isMobileBrowser = isLikelyMobileBrowser();
  const authErrorMessage = readAuthErrorMessage();
  const hasError = Boolean(authErrorMessage);

  useEffect(() => {
    if (hasError || !isMobileBrowser) {
      return;
    }

    const timer = window.setTimeout(() => {
      openRoadmateApp();
    }, 900);

    return () => {
      window.clearTimeout(timer);
    };
  }, [hasError, isMobileBrowser]);

  return (
    <SafeAreaView style={[styles.safeArea, styles.authPage]}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} translucent={false} />

      <View
        style={[
          styles.authPageContent,
          {
            justifyContent: "center",
            gap: 18,
          },
        ]}
      >
        <View style={styles.authHero}>
          <View style={styles.authHeroRingLarge} />
          <View style={styles.authHeroRingSmall} />

          <View style={styles.brandBadge}>
            <BrandLogo source={logoSource} width={34} height={34} />
            <View style={styles.brandBadgeTextBlock}>
              <Text style={styles.brandBadgeTitle}>Roadmate</Text>
              <Text style={styles.brandBadgeCaption}>{copy.authComplete.eyebrow}</Text>
            </View>
          </View>

          <Text style={styles.authHeroTitle}>
            {hasError ? copy.authComplete.errorTitle : copy.authComplete.title}
          </Text>
          <Text style={styles.authHeroBody}>
            {hasError
              ? copy.authComplete.errorBody(authErrorMessage)
              : isMobileBrowser
                ? copy.authComplete.mobileBody
                : copy.authComplete.desktopBody}
          </Text>
        </View>

        <View style={[styles.authCard, styles.authStandaloneCard, styles.authEntryCard]}>
          <View style={styles.authCardHeader}>
            <Text style={styles.authEntryTitle}>{copy.authComplete.nextTitle}</Text>
            <Text style={styles.authEntrySubtitle}>
              {isMobileBrowser
                ? copy.authComplete.nextBodyMobile
                : copy.authComplete.nextBodyDesktop}
            </Text>
          </View>

          {isMobileBrowser ? (
            <Pressable onPress={openRoadmateApp} style={styles.authSubmitButton}>
              <Text style={styles.authSubmitButtonText}>{copy.authComplete.openApp}</Text>
            </Pressable>
          ) : null}

          <Text style={styles.authEntryHint}>
            {isMobileBrowser ? copy.authComplete.mobileHint : copy.authComplete.desktopHint}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
