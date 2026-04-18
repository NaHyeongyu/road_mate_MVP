import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import { useAppCopy } from "../../../i18n/AppI18nContext";
import { BrandLogo } from "../../shared/components/BrandLogo";
import type { AppStyles } from "../../../ui/types";

type GoogleIconProps = {
  disabled: boolean;
};

function GoogleIcon({ disabled }: GoogleIconProps) {
  return (
    <Svg width={18} height={18} viewBox="0 0 48 48" opacity={disabled ? 0.58 : 1}>
      <Path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.73 1.22 9.24 3.6l6.9-6.9C35.8 2.4 30.28 0 24 0 14.63 0 6.51 5.38 2.56 13.22l8.06 6.26C12.53 13.74 17.82 9.5 24 9.5z"
      />
      <Path
        fill="#4285F4"
        d="M46.1 24.5c0-1.64-.15-3.2-.43-4.7H24v9h12.4c-.54 2.9-2.2 5.35-4.67 7v5.8h7.55c4.42-4.07 6.82-10.1 6.82-17.1z"
      />
      <Path
        fill="#FBBC05"
        d="M10.62 28.52A14.5 14.5 0 0 1 9.5 24c0-1.57.27-3.08.75-4.52l-8.06-6.26A24 24 0 0 0 0 24c0 3.87.92 7.53 2.56 10.78l8.06-6.26z"
      />
      <Path
        fill="#34A853"
        d="M24 48c6.48 0 11.92-2.14 15.9-5.8l-7.55-5.8c-2.1 1.4-4.8 2.1-8.35 2.1-6.18 0-11.47-4.24-13.38-9.98l-8.06 6.26C6.51 42.62 14.63 48 24 48z"
      />
    </Svg>
  );
}

export type AuthOptionsScreenProps = {
  logoSource: unknown;
  styles: AppStyles;
  notice: { tone: "info" | "success" | "error"; text: string };
  isSocialAuthEnabled: boolean;
  oauthProviderPending: "google" | "apple" | "facebook" | "kakao" | null;
  onPressEmail: () => void;
  onPressGoogle: () => void;
  onPressApple: () => void;
  onPressFacebook: () => void;
  onPressKakao: () => void;
};

export function AuthOptionsScreen({
  logoSource,
  styles,
  notice,
  isSocialAuthEnabled,
  oauthProviderPending,
  onPressEmail,
  onPressGoogle,
  onPressApple,
  onPressFacebook,
  onPressKakao,
}: AuthOptionsScreenProps) {
  const copy = useAppCopy();
  const isOAuthSubmitting = Boolean(oauthProviderPending);

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={styles.authPageScroll}
      contentContainerStyle={styles.authPageScrollContent}
    >
      <View style={styles.authHero}>
        <View style={styles.authHeroRingLarge} />
        <View style={styles.authHeroRingSmall} />

        <View style={styles.brandBadge}>
          <BrandLogo source={logoSource} width={34} height={34} />
          <View style={styles.brandBadgeTextBlock}>
            <Text style={styles.brandBadgeTitle}>Roadmate</Text>
            <Text style={styles.brandBadgeCaption}>Shared rides for daily routes</Text>
          </View>
        </View>

        <Text style={styles.authHeroEyebrow}>Commute smarter</Text>
        <Text style={styles.authHeroTitle}>Find seats, post routes, and keep auth friction low.</Text>
        <Text style={styles.authHeroBody}>
          Social login is still available, but email sign-up now shows the verification step clearly
          and signs the user in immediately when the confirmation link returns to the app.
        </Text>

        <View style={styles.featureRow}>
          <View style={styles.featurePill}>
            <Text style={styles.featurePillText}>Driver tools</Text>
          </View>
          <View style={styles.featurePill}>
            <Text style={styles.featurePillText}>Rider search</Text>
          </View>
          <View style={styles.featurePill}>
            <Text style={styles.featurePillText}>Clear verification UX</Text>
          </View>
        </View>
      </View>

      <View style={styles.authChooserCard}>
        <View style={styles.authChooserHeader}>
          <Text style={styles.authSectionEyebrow}>Choose access</Text>
          <Text style={styles.authSectionTitle}>Start with social login or email.</Text>
          <Text style={styles.authSectionBody}>
            Email is the cleanest option when you want a direct password flow and an explicit
            verification checkpoint.
          </Text>
        </View>

        {isSocialAuthEnabled ? (
          <>
            <Pressable
              disabled={isOAuthSubmitting}
              onPress={onPressGoogle}
              style={[
                styles.providerButton,
                styles.googleProviderButton,
                isOAuthSubmitting ? styles.providerButtonDisabled : null,
              ]}
            >
              <View style={styles.providerIconSlot}>
                <GoogleIcon disabled={isOAuthSubmitting} />
              </View>
              <Text
                style={[
                  styles.providerButtonText,
                  styles.googleProviderButtonText,
                  isOAuthSubmitting ? styles.providerButtonTextDisabled : null,
                ]}
              >
                {oauthProviderPending === "google"
                  ? copy.auth.openingProvider("Google")
                  : copy.auth.continueWithProvider("Google")}
              </Text>
            </Pressable>

            <Pressable
              disabled={isOAuthSubmitting}
              onPress={onPressApple}
              style={[
                styles.providerButton,
                styles.appleProviderButton,
                isOAuthSubmitting ? styles.providerButtonDisabled : null,
              ]}
            >
              <View style={styles.providerIconSlot}>
                <MaterialCommunityIcons
                  name="apple"
                  size={18}
                  color={isOAuthSubmitting ? "#64748B" : "#FFFFFF"}
                  style={[styles.providerIconGlyph, styles.providerIconGlyphTight]}
                />
              </View>
              <Text
                style={[
                  styles.providerButtonText,
                  styles.appleProviderButtonText,
                  isOAuthSubmitting ? styles.providerButtonTextDisabled : null,
                ]}
              >
                {oauthProviderPending === "apple"
                  ? copy.auth.openingProvider("Apple")
                  : copy.auth.continueWithProvider("Apple")}
              </Text>
            </Pressable>

            <Pressable
              disabled={isOAuthSubmitting}
              onPress={onPressFacebook}
              style={[
                styles.providerButton,
                styles.facebookProviderButton,
                isOAuthSubmitting ? styles.providerButtonDisabled : null,
              ]}
            >
              <View style={styles.providerIconSlot}>
                <MaterialCommunityIcons
                  name="facebook"
                  size={18}
                  color={isOAuthSubmitting ? "#64748B" : "#FFFFFF"}
                  style={[styles.providerIconGlyph, styles.providerIconGlyphTight]}
                />
              </View>
              <Text
                style={[
                  styles.providerButtonText,
                  styles.facebookProviderButtonText,
                  isOAuthSubmitting ? styles.providerButtonTextDisabled : null,
                ]}
              >
                {oauthProviderPending === "facebook"
                  ? copy.auth.openingProvider("Facebook")
                  : copy.auth.continueWithProvider("Facebook")}
              </Text>
            </Pressable>

            <Pressable
              disabled={isOAuthSubmitting}
              onPress={onPressKakao}
              style={[
                styles.providerButton,
                styles.kakaoProviderButton,
                isOAuthSubmitting ? styles.providerButtonDisabled : null,
              ]}
            >
              <View style={styles.providerIconSlot}>
                <MaterialCommunityIcons
                  name="chat"
                  size={18}
                  color={isOAuthSubmitting ? "#64748B" : "#191919"}
                  style={[styles.providerIconGlyph, styles.providerIconGlyphTight]}
                />
              </View>
              <Text
                style={[
                  styles.providerButtonText,
                  styles.kakaoProviderButtonText,
                  isOAuthSubmitting ? styles.providerButtonTextDisabled : null,
                ]}
              >
                {oauthProviderPending === "kakao"
                  ? copy.auth.openingProvider("Kakao")
                  : copy.auth.continueWithProvider("Kakao")}
              </Text>
            </Pressable>
          </>
        ) : (
          <Text style={styles.cardBody}>{copy.auth.emailEnabled}</Text>
        )}

        <View style={styles.authDividerRow}>
          <View style={styles.authDividerLine} />
          <Text style={styles.authDividerText}>or</Text>
          <View style={styles.authDividerLine} />
        </View>

        <Pressable
          disabled={isOAuthSubmitting}
          onPress={onPressEmail}
          style={[
            styles.providerButton,
            styles.emailProviderButton,
            isOAuthSubmitting ? styles.providerButtonDisabled : null,
          ]}
        >
          <View style={styles.providerIconSlot}>
            <MaterialCommunityIcons
              name="email-outline"
              size={18}
              color="#0B0F14"
              style={styles.providerIconGlyph}
            />
          </View>
          <Text style={styles.emailProviderButtonText}>{copy.auth.continueWithEmail}</Text>
        </Pressable>

        <Text style={styles.authEntryHint}>
          New email accounts get a verification link. When that link opens Roadmate again, the app
          completes sign-in automatically.
        </Text>
      </View>
    </ScrollView>
  );
}
