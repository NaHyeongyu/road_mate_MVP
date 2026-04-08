import { Text, View } from "react-native";

import { BrandLogo } from "../../shared/components/BrandLogo";
import type { AppStyles } from "../../../ui/types";

type AuthConfigScreenProps = {
  logoSource: unknown;
  styles: AppStyles;
};

export function AuthConfigScreen({ logoSource, styles }: AuthConfigScreenProps) {
  return (
    <View style={styles.authPageContent}>
      <View style={styles.authHero}>
        <View style={styles.authHeroRingLarge} />
        <View style={styles.authHeroRingSmall} />
        <View style={styles.brandBadge}>
          <BrandLogo source={logoSource} width={34} height={34} />
          <View style={styles.brandBadgeTextBlock}>
            <Text style={styles.brandBadgeTitle}>Roadmate</Text>
            <Text style={styles.brandBadgeCaption}>MVP Supabase hookup</Text>
          </View>
        </View>

        <Text style={styles.authHeroEyebrow}>Configuration required</Text>
        <Text style={styles.authHeroTitle}>Connect this MVP to your new Supabase project.</Text>
        <Text style={styles.authHeroBody}>
          Add your MVP project URL and anon key to `rodemate_mvp/.env`, then restart Expo.
        </Text>
      </View>

      <View style={styles.authCard}>
        <View style={styles.authCardHeader}>
          <Text style={styles.authTitle}>Missing Supabase env</Text>
          <Text style={styles.authSubtitle}>
            Create `.env` from `.env.example` and set the two public values below.
          </Text>
        </View>

        <View style={styles.configBlock}>
          <Text style={styles.configCode}>EXPO_PUBLIC_SUPABASE_URL=...</Text>
          <Text style={styles.configCode}>EXPO_PUBLIC_SUPABASE_ANON_KEY=...</Text>
        </View>

        <Text style={styles.authHint}>
          Once those values are set, this login page will use real Supabase Auth instead of the
          previous local-only mock.
        </Text>
      </View>
    </View>
  );
}
