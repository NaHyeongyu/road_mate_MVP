import { useState } from "react";
import { Pressable, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";

import { isDarkAppColors, type AppColors } from "../../brandTheme";
import { useAppI18n } from "../../i18n/AppI18nContext";
import type { AppStyles } from "../../ui/types";

type AppLanguageSelectionScreenProps = {
  colors: AppColors;
  styles: AppStyles;
};

export function AppLanguageSelectionScreen({
  colors,
  styles,
}: AppLanguageSelectionScreenProps) {
  const { copy, language, options, setLanguage } = useAppI18n();
  const [pendingLanguage, setPendingLanguage] = useState(language);
  const statusBarStyle = isDarkAppColors(colors) ? "light-content" : "dark-content";

  return (
    <SafeAreaView style={[styles.safeArea, styles.authPage]}>
      <StatusBar barStyle={statusBarStyle} backgroundColor={colors.bg} translucent={false} />

      <View
        style={[
          styles.authPageContent,
          {
            justifyContent: "center",
            gap: 18,
          },
        ]}
      >
        <View style={{ width: "100%", maxWidth: 420, alignSelf: "center", gap: 14 }}>
          <View style={styles.authCardHeader}>
            <Text style={styles.authSectionEyebrow}>{copy.languageSelection.eyebrow}</Text>
            <Text style={styles.authEntryTitle}>{copy.languageSelection.title}</Text>
            <Text style={styles.authEntrySubtitle}>{copy.languageSelection.body}</Text>
          </View>

          {options.map((option) => {
            const isSelected = option.code === pendingLanguage;

            return (
              <Pressable
                key={option.code}
                onPress={() => setPendingLanguage(option.code)}
                style={[
                  styles.providerButton,
                  {
                    backgroundColor: isSelected ? colors.brand : colors.panelAlt,
                    borderColor: isSelected ? colors.brand : colors.border,
                    minHeight: 60,
                    justifyContent: "space-between",
                  },
                ]}
              >
                <View style={{ gap: 2 }}>
                  <Text
                    style={[
                      styles.providerButtonText,
                      {
                        color: isSelected ? colors.brandText : colors.text,
                      },
                    ]}
                  >
                    {option.nativeLabel}
                  </Text>
                  <Text
                    style={[
                      styles.authEntryHint,
                      {
                        color: isSelected ? colors.brandText : colors.subtext,
                      },
                    ]}
                  >
                    {option.englishLabel}
                  </Text>
                </View>

                <View
                  style={{
                    width: 22,
                    height: 22,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isSelected ? (
                    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M5 12.4l4.2 4.2L19 6.8"
                        stroke={colors.hero}
                        strokeWidth={2.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  ) : null}
                </View>
              </Pressable>
            );
          })}

          <Pressable onPress={() => setLanguage(pendingLanguage)} style={styles.authSubmitButton}>
            <Text style={styles.authSubmitButtonText}>{copy.languageSelection.continue}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
