import { useState } from "react";
import { Pressable, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { AppColors } from "../../brandTheme";
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
        <View style={[styles.authCard, styles.authStandaloneCard, styles.authEntryCard]}>
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
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    borderWidth: 2,
                    borderColor: isSelected ? colors.brandText : colors.border,
                    backgroundColor: isSelected ? colors.brandText : "transparent",
                  }}
                />
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
