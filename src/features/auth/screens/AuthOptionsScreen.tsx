import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { BrandLogo } from "../../shared/components/BrandLogo";
import { NoticeBanner } from "../../shared/components/NoticeBanner";
import type { AppStyles } from "../../../ui/types";

export type AuthOptionsScreenProps = {
  logoSource: unknown;
  styles: AppStyles;
  notice: { tone: "info" | "success" | "error"; text: string };
  oauthProviderPending: "google" | "apple" | null;
  onPressEmail: () => void;
  onPressGoogle: () => void;
  onPressApple: () => void;
};

export function AuthOptionsScreen({
  logoSource,
  styles,
  notice,
  oauthProviderPending,
  onPressEmail,
  onPressGoogle,
  onPressApple,
}: AuthOptionsScreenProps) {
  const isOAuthSubmitting = Boolean(oauthProviderPending);

  return (
    <>
      <View style={styles.authSimpleHero}>
        <View style={styles.authLogoStage}>
          <BrandLogo source={logoSource} width={188} height={188} />
        </View>
        <Text style={styles.authSimpleTitle}>Get Started with Roadmate</Text>
      </View>

      <View style={styles.authChooserCard}>
        <Pressable onPress={onPressEmail} style={[styles.providerButton, styles.emailProviderButton]}>
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
      </View>

      <NoticeBanner notice={notice} styles={styles} />
    </>
  );
}
