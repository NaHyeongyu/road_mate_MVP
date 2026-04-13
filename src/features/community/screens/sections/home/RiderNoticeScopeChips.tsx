import { Pressable, Text, View } from "react-native";

import type { AppStyles } from "../../../../../ui/types";

type NoticeScope = "upcoming" | "all";

type RiderNoticeScopeChipsProps = {
  styles: AppStyles;
  noticeScope: NoticeScope;
  onNoticeScopeChange: (scope: NoticeScope) => void;
};

export function RiderNoticeScopeChips({
  styles,
  noticeScope,
  onNoticeScopeChange,
}: RiderNoticeScopeChipsProps) {
  return (
    <View style={styles.row}>
      <Pressable
        onPress={() => onNoticeScopeChange("upcoming")}
        style={({ pressed }) => [
          styles.chip,
          noticeScope === "upcoming" ? styles.chipActive : null,
          pressed ? styles.routeFilterItemPressed : null,
        ]}
      >
        <Text style={[styles.chipText, noticeScope === "upcoming" ? styles.chipTextActive : null]}>
          Upcoming
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onNoticeScopeChange("all")}
        style={({ pressed }) => [
          styles.chip,
          noticeScope === "all" ? styles.chipActive : null,
          pressed ? styles.routeFilterItemPressed : null,
        ]}
      >
        <Text style={[styles.chipText, noticeScope === "all" ? styles.chipTextActive : null]}>
          All notices
        </Text>
      </Pressable>
    </View>
  );
}
