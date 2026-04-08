import { ActivityIndicator, StatusBar, Text, View } from "react-native";
import type { ColorSchemeName } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AppColors } from "../../brandTheme";
import type { AppStyles } from "../../ui/types";

type AppLoadingScreenProps = {
  colors: AppColors;
  styles: AppStyles;
  scheme: ColorSchemeName;
};

export function AppLoadingScreen({ colors, styles, scheme }: AppLoadingScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={scheme === "dark" ? "light-content" : "dark-content"} />
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={colors.brand} />
        <Text style={styles.loadingText}>Loading roadmate_mvp...</Text>
      </View>
    </SafeAreaView>
  );
}
