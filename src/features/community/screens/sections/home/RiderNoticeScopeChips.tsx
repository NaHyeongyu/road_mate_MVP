import { Pressable, Text, View, useWindowDimensions } from "react-native";

import { useAppCopy } from "../../../../../i18n/AppI18nContext";
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
  const copy = useAppCopy();
  const { width } = useWindowDimensions();
  const isCompactLayout = width < 390;

  return (
    <View style={styles.riderScopeRow}>
      <Pressable
        onPress={() => onNoticeScopeChange("upcoming")}
        style={({ pressed }) => [
          styles.chip,
          styles.riderScopeChip,
          isCompactLayout ? styles.riderScopeChipCompact : null,
          noticeScope === "upcoming" ? styles.chipActive : null,
          pressed ? styles.routeFilterItemPressed : null,
        ]}
      >
        <Text
          style={[
            styles.chipText,
            styles.riderScopeChipText,
            noticeScope === "upcoming" ? styles.chipTextActive : null,
          ]}
        >
          {copy.community.upcoming}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onNoticeScopeChange("all")}
        style={({ pressed }) => [
          styles.chip,
          styles.riderScopeChip,
          isCompactLayout ? styles.riderScopeChipCompact : null,
          noticeScope === "all" ? styles.chipActive : null,
          pressed ? styles.routeFilterItemPressed : null,
        ]}
      >
        <Text
          style={[
            styles.chipText,
            styles.riderScopeChipText,
            noticeScope === "all" ? styles.chipTextActive : null,
          ]}
        >
          {copy.community.allNotices}
        </Text>
      </Pressable>
    </View>
  );
}
