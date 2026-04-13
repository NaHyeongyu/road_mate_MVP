import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { AppStyles } from "../../../../../ui/types";

type NoticeScope = "upcoming" | "all";

type RiderFeedEmptyStateProps = {
  styles: AppStyles;
  isNoticeFilter: boolean;
  noticeScope: NoticeScope;
  pastNoticeCount: number;
  showViewNoticesAction: boolean;
  onPressViewNotices: () => void;
};

function toEmptyMessage({
  isNoticeFilter,
  noticeScope,
  pastNoticeCount,
}: {
  isNoticeFilter: boolean;
  noticeScope: NoticeScope;
  pastNoticeCount: number;
}) {
  if (isNoticeFilter && noticeScope === "upcoming" && pastNoticeCount > 0) {
    return "Only past notices match this filter or search.";
  }

  if (isNoticeFilter) {
    return "No notices match this filter or search.";
  }

  return "No rides match this filter or search.";
}

export function RiderFeedEmptyState({
  styles,
  isNoticeFilter,
  noticeScope,
  pastNoticeCount,
  showViewNoticesAction,
  onPressViewNotices,
}: RiderFeedEmptyStateProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.empty}>{toEmptyMessage({ isNoticeFilter, noticeScope, pastNoticeCount })}</Text>
      {showViewNoticesAction ? (
        <View style={styles.postActionsRow}>
          <Pressable style={styles.postActionSave} onPress={onPressViewNotices}>
            <MaterialCommunityIcons name="bullhorn-outline" size={15} color="#8A5A00" />
            <Text style={styles.postActionSaveText}>View notices</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}
