import { ActivityIndicator, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { isDarkAppColors, type AppColors } from "../../brandTheme";
import { useAppCopy } from "../../i18n/AppI18nContext";
import type { AppStyles } from "../../ui/types";

type AppLoadingScreenProps = {
  colors: AppColors;
  styles: AppStyles;
};

export function AppLoadingScreen({ colors, styles }: AppLoadingScreenProps) {
  const copy = useAppCopy();
  const statusBarStyle = isDarkAppColors(colors) ? "light-content" : "dark-content";

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={statusBarStyle} />
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={colors.brand} />
        <Text style={styles.loadingText}>{copy.loading.title}</Text>
      </View>
    </SafeAreaView>
  );
}
