import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { AppColors } from "../../../../../brandTheme";
import type { RouteKind } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";

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
  return (
    <View style={styles.routeFilterRow}>
      <Pressable
        onPress={() => onFilterChange("regular")}
        style={({ pressed }) => [
          styles.routeFilterItem,
          filter === "regular" ? styles.routeFilterItemActive : null,
          pressed ? styles.routeFilterItemPressed : null,
        ]}
      >
        <MaterialCommunityIcons
          color={filter === "regular" ? colors.brandText : colors.subtext}
          name="calendar-week"
          size={16}
        />
        <Text
          style={[
            styles.routeFilterItemText,
            filter === "regular" ? styles.routeFilterItemTextActive : null,
          ]}
        >
          Regular
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onFilterChange("one_time")}
        style={({ pressed }) => [
          styles.routeFilterItem,
          filter === "one_time" ? styles.routeFilterItemActive : null,
          pressed ? styles.routeFilterItemPressed : null,
        ]}
      >
        <MaterialCommunityIcons
          color={filter === "one_time" ? colors.brandText : colors.subtext}
          name="clock-outline"
          size={16}
        />
        <Text
          style={[
            styles.routeFilterItemText,
            filter === "one_time" ? styles.routeFilterItemTextActive : null,
          ]}
        >
          Notices
        </Text>
      </Pressable>
    </View>
  );
}
