import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { BrandLogo } from "../../shared/components/BrandLogo";
import { NoticeBanner } from "../../shared/components/NoticeBanner";
import type { AppStyles } from "../../../ui/types";

export type AuthOptionsScreenProps = {
  logoSource: unknown;
  styles: AppStyles;
  notice: { tone: "info" | "success" | "error"; text: string };
  oauthProviderPending: "google" | "apple" | "facebook" | null;
  onPressEmail: () => void;
  onPressGoogle: () => void;
  onPressApple: () => void;
  onPressFacebook: () => void;
};

export function AuthOptionsScreen({
  logoSource,
  styles,
  notice,
  oauthProviderPending,
  onPressEmail,
  onPressGoogle,
  onPressApple,
  onPressFacebook,
}: AuthOptionsScreenProps) {
  const isOAuthSubmitting = Boolean(oauthProviderPending);

  return (
    <>
      <View style={styles.authSimpleHero}>
        <View style={styles.authLogoStage}>
          <BrandLogo source={logoSource} width={188} height={188} />
        </View>
        <Text style={styles.authSimpleTitle}>Get Started with Roadmate</Text>
        <Text style={styles.authSimpleSubtitle}>Choose a quick login method to continue.</Text>
      </View>

      <View style={styles.authChooserCard}>
        <Text style={styles.authProviderSectionTitle}>Quick Login</Text>

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
            <MaterialCommunityIcons
              name="google"
              size={16}
              color={isOAuthSubmitting ? "#64748B" : "#FFFFFF"}
              style={[styles.providerIconGlyph, styles.providerIconGlyphTight]}
            />
          </View>
          <Text
            style={[
              styles.providerButtonText,
              styles.googleProviderButtonText,
              isOAuthSubmitting ? styles.providerButtonTextDisabled : null,
            ]}
          >
            {oauthProviderPending === "google" ? "Opening Google..." : "Continue with Google"}
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
              size={16}
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
            {oauthProviderPending === "apple" ? "Opening Apple..." : "Continue with Apple"}
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
              size={16}
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
            {oauthProviderPending === "facebook" ? "Opening Facebook..." : "Continue with Facebook"}
          </Text>
        </Pressable>

        <View style={styles.authProviderDividerRow}>
          <View style={styles.authProviderDividerLine} />
          <Text style={styles.authProviderDividerText}>or</Text>
          <View style={styles.authProviderDividerLine} />
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
              size={16}
              color="#0B0F14"
              style={styles.providerIconGlyph}
            />
          </View>
          <Text style={styles.emailProviderButtonText}>Continue with Email</Text>
        </Pressable>
      </View>

      <NoticeBanner notice={notice} styles={styles} />
    </>
  );
}
