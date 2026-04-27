import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { AppColors } from "../../../../brandTheme";
import { useAppCopy } from "../../../../i18n/AppI18nContext";
import type { AppStyles } from "../../../../ui/types";
import { useAppViewport } from "../../../../ui/viewport";
import type { MainTab } from "../../types";

type CommunityBottomBarProps = {
  colors: AppColors;
  styles: AppStyles;
  mainTab: MainTab;
  isRiderMode: boolean;
  bottomInset: number;
  onMainTabChange: (tab: MainTab) => void;
};

export function CommunityBottomBar({
  colors,
  styles,
  mainTab,
  isRiderMode,
  bottomInset,
  onMainTabChange,
}: CommunityBottomBarProps) {
  const copy = useAppCopy();
  const { width } = useAppViewport();
  const isCompactLayout = width < 390;
  const homeIconName = isRiderMode ? "home-variant" : "calendar-week";
  const homeLabel = isRiderMode ? copy.common.home : copy.common.regular;
  const middleIconName = isRiderMode ? "bookmark-multiple-outline" : "clock-outline";
  const middleLabel = isRiderMode ? copy.common.saved : copy.common.oneTime;

  return (
    <View
      style={[
        styles.mainBottomBar,
        {
          minHeight: 52 + bottomInset,
          paddingBottom: bottomInset,
        },
        isCompactLayout
          ? {
              paddingHorizontal: 4,
            }
          : null,
      ]}
    >
      <Pressable
        onPress={() => onMainTabChange("home")}
        style={({ pressed }) => [
          styles.mainBottomBarItem,
          isCompactLayout
            ? {
                gap: 1,
              }
            : null,
          pressed
            ? {
                opacity: 0.78,
                transform: [{ scale: 0.97 }],
              }
            : null,
        ]}
      >
        <MaterialCommunityIcons
          color={mainTab === "home" ? colors.brand : colors.subtext}
          name={homeIconName}
          size={20}
        />
        <Text
          style={[
            styles.mainBottomBarLabel,
            mainTab === "home" ? styles.mainBottomBarLabelActive : null,
            isCompactLayout
              ? {
                  fontSize: 11,
                }
              : null,
          ]}
        >
          {homeLabel}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onMainTabChange("saved")}
        style={({ pressed }) => [
          styles.mainBottomBarItem,
          isCompactLayout
            ? {
                gap: 1,
              }
            : null,
          pressed
            ? {
                opacity: 0.78,
                transform: [{ scale: 0.97 }],
              }
            : null,
        ]}
      >
        <MaterialCommunityIcons
          color={mainTab === "saved" ? colors.brand : colors.subtext}
          name={middleIconName}
          size={20}
        />
        <Text
          style={[
            styles.mainBottomBarLabel,
            mainTab === "saved" ? styles.mainBottomBarLabelActive : null,
            isCompactLayout
              ? {
                  fontSize: 11,
                }
              : null,
          ]}
        >
          {middleLabel}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onMainTabChange("mypage")}
        style={({ pressed }) => [
          styles.mainBottomBarItem,
          isCompactLayout
            ? {
                gap: 1,
              }
            : null,
          pressed
            ? {
                opacity: 0.78,
                transform: [{ scale: 0.97 }],
              }
            : null,
        ]}
      >
        <MaterialCommunityIcons
          color={mainTab === "mypage" ? colors.brand : colors.subtext}
          name="account-circle-outline"
          size={20}
        />
        <Text
          style={[
            styles.mainBottomBarLabel,
            mainTab === "mypage" ? styles.mainBottomBarLabelActive : null,
            isCompactLayout
              ? {
                  fontSize: 11,
                }
              : null,
          ]}
        >
          {copy.common.myPage}
        </Text>
      </Pressable>
    </View>
  );
}
