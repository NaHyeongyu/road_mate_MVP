import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { AppColors } from "../../../../brandTheme";
import type { AppStyles } from "../../../../ui/types";
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
  const homeIconName = isRiderMode ? "home-variant" : "calendar-week";
  const homeLabel = isRiderMode ? "Home" : "Regular";
  const middleIconName = isRiderMode ? "bookmark-multiple-outline" : "clock-outline";
  const middleLabel = isRiderMode ? "Saved" : "One-time";

  return (
    <View
      style={[
        styles.mainBottomBar,
        {
          minHeight: 52 + bottomInset,
          paddingBottom: bottomInset,
        },
      ]}
    >
      <Pressable onPress={() => onMainTabChange("home")} style={styles.mainBottomBarItem}>
        <MaterialCommunityIcons
          color={mainTab === "home" ? colors.brand : colors.subtext}
          name={homeIconName}
          size={20}
        />
        <Text
          style={[
            styles.mainBottomBarLabel,
            mainTab === "home" ? styles.mainBottomBarLabelActive : null,
          ]}
        >
          {homeLabel}
        </Text>
      </Pressable>

      <Pressable onPress={() => onMainTabChange("saved")} style={styles.mainBottomBarItem}>
        <MaterialCommunityIcons
          color={mainTab === "saved" ? colors.brand : colors.subtext}
          name={middleIconName}
          size={20}
        />
        <Text
          style={[
            styles.mainBottomBarLabel,
            mainTab === "saved" ? styles.mainBottomBarLabelActive : null,
          ]}
        >
          {middleLabel}
        </Text>
      </Pressable>

      <Pressable onPress={() => onMainTabChange("mypage")} style={styles.mainBottomBarItem}>
        <MaterialCommunityIcons
          color={mainTab === "mypage" ? colors.brand : colors.subtext}
          name="account-circle-outline"
          size={20}
        />
        <Text
          style={[
            styles.mainBottomBarLabel,
            mainTab === "mypage" ? styles.mainBottomBarLabelActive : null,
          ]}
        >
          My Page
        </Text>
      </Pressable>
    </View>
  );
}
