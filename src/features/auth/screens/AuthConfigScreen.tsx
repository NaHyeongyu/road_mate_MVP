import { Text, View } from "react-native";

import { useAppCopy } from "../../../i18n/AppI18nContext";
import { BrandLogo } from "../../shared/components/BrandLogo";
import type { AppStyles } from "../../../ui/types";

type AuthConfigScreenProps = {
  logoSource: unknown;
  styles: AppStyles;
};

export function AuthConfigScreen({ logoSource, styles }: AuthConfigScreenProps) {
  const copy = useAppCopy();

  return (
    <View style={styles.authPageContent}>
      <View style={styles.authHero}>
        <View style={styles.authHeroRingLarge} />
        <View style={styles.authHeroRingSmall} />
        <View style={styles.brandBadge}>
          <BrandLogo source={logoSource} width={34} height={34} />
          <View style={styles.brandBadgeTextBlock}>
            <Text style={styles.brandBadgeTitle}>Roadmate</Text>
            <Text style={styles.brandBadgeCaption}>{copy.config.badgeCaption}</Text>
          </View>
        </View>

        <Text style={styles.authHeroEyebrow}>{copy.config.eyebrow}</Text>
        <Text style={styles.authHeroTitle}>{copy.config.title}</Text>
        <Text style={styles.authHeroBody}>{copy.config.body}</Text>
      </View>

      <View style={styles.authCard}>
        <View style={styles.authCardHeader}>
          <Text style={styles.authTitle}>{copy.config.missingEnvTitle}</Text>
          <Text style={styles.authSubtitle}>{copy.config.missingEnvBody}</Text>
        </View>

        <View style={styles.configBlock}>
          <Text style={styles.configCode}>EXPO_PUBLIC_SUPABASE_URL=...</Text>
          <Text style={styles.configCode}>EXPO_PUBLIC_SUPABASE_ANON_KEY=...</Text>
        </View>

        <Text style={styles.authHint}>{copy.config.hint}</Text>
      </View>
    </View>
  );
}
