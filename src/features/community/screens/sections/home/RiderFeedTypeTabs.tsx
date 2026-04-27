import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { AppColors } from "../../../../../brandTheme";
import { useAppCopy } from "../../../../../i18n/AppI18nContext";
import type { RouteKind } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { useAppViewport } from "../../../../../ui/viewport";

type RiderFeedTypeTabsProps = {
  colors: AppColors;
  styles: AppStyles;
  filter: RouteKind;
  onFilterChange: (filter: RouteKind) => void;
};

export function RiderFeedTypeTabs({
  colors,
  styles,
  filter,
  onFilterChange,
}: RiderFeedTypeTabsProps) {
  const copy = useAppCopy();
  const { width } = useAppViewport();
  const isCompactLayout = width < 390;

  return (
    <View style={[styles.routeFilterRow, isCompactLayout ? styles.routeFilterRowCompact : null]}>
      <Pressable
        onPress={() => onFilterChange("regular")}
        style={({ pressed }) => [
          styles.routeFilterItem,
          isCompactLayout ? styles.routeFilterItemCompact : null,
          filter === "regular" ? styles.routeFilterItemActive : null,
          pressed ? styles.routeFilterItemPressed : null,
        ]}
      >
        <MaterialCommunityIcons
          color={filter === "regular" ? colors.brandText : colors.subtext}
          name="calendar-week"
          size={isCompactLayout ? 15 : 16}
        />
        <Text
          style={[
            styles.routeFilterItemText,
            isCompactLayout ? styles.routeFilterItemTextCompact : null,
            filter === "regular" ? styles.routeFilterItemTextActive : null,
          ]}
        >
          {copy.common.regular}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onFilterChange("one_time")}
        style={({ pressed }) => [
          styles.routeFilterItem,
          isCompactLayout ? styles.routeFilterItemCompact : null,
          filter === "one_time" ? styles.routeFilterItemActive : null,
          pressed ? styles.routeFilterItemPressed : null,
        ]}
      >
        <MaterialCommunityIcons
          color={filter === "one_time" ? colors.brandText : colors.subtext}
          name="clock-outline"
          size={isCompactLayout ? 15 : 16}
        />
        <Text
          style={[
            styles.routeFilterItemText,
            isCompactLayout ? styles.routeFilterItemTextCompact : null,
            filter === "one_time" ? styles.routeFilterItemTextActive : null,
          ]}
        >
          {copy.common.notices}
        </Text>
      </Pressable>
    </View>
  );
}
