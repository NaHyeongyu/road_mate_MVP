import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { BrandLogo } from "../../shared/components/BrandLogo";
import { NoticeBanner } from "../../shared/components/NoticeBanner";
import type { AppStyles } from "../../../ui/types";

export type AuthOptionsScreenProps = {
  logoSource: unknown;
  styles: AppStyles;
  notice: { tone: "info" | "success" | "error"; text: string };
  onPressEmail: () => void;
  onPressGoogle: () => void;
  onPressApple: () => void;
};

export function AuthOptionsScreen({
  logoSource,
  styles,
  notice,
  onPressEmail,
  onPressGoogle,
  onPressApple,
}: AuthOptionsScreenProps) {
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
          disabled
          onPress={onPressGoogle}
          style={[styles.providerButton, styles.googleProviderButton, styles.providerButtonDisabled]}
        >
          <View style={styles.providerIconSlot}>
            <MaterialCommunityIcons
              name="google"
              size={16}
              color="#64748B"
              style={[styles.providerIconGlyph, styles.providerIconGlyphTight]}
            />
          </View>
          <Text style={[styles.providerButtonText, styles.providerButtonTextDisabled]}>
            Continue with Google
          </Text>
          <View style={styles.providerSoonBadge}>
            <Text style={styles.providerSoonBadgeText}>Soon</Text>
          </View>
        </Pressable>

        <Pressable
          disabled
          onPress={onPressApple}
          style={[styles.providerButton, styles.appleProviderButton, styles.providerButtonDisabled]}
        >
          <View style={styles.providerIconSlot}>
            <MaterialCommunityIcons
              name="apple"
              size={16}
              color="#64748B"
              style={[styles.providerIconGlyph, styles.providerIconGlyphTight]}
            />
          </View>
          <Text style={[styles.providerButtonText, styles.providerButtonTextDisabled]}>
            Continue with Apple
          </Text>
          <View style={styles.providerSoonBadge}>
            <Text style={styles.providerSoonBadgeText}>Soon</Text>
          </View>
        </Pressable>
      </View>

      <NoticeBanner notice={notice} styles={styles} />
    </>
  );
}
