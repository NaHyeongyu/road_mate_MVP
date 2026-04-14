import { Text } from "react-native";

import type { AppStyles } from "../../../../../ui/types";

type NoticeScope = "upcoming" | "all";

type RiderFeedEmptyStateProps = {
  styles: AppStyles;
  isSearchReady: boolean;
  hasSearchRequested: boolean;
  isNoticeFilter: boolean;
  noticeScope: NoticeScope;
  pastNoticeCount: number;
};

function toEmptyMessage({
  isSearchReady,
  hasSearchRequested,
  isNoticeFilter,
  noticeScope,
  pastNoticeCount,
}: {
  isSearchReady: boolean;
  hasSearchRequested: boolean;
  isNoticeFilter: boolean;
  noticeScope: NoticeScope;
  pastNoticeCount: number;
}) {
  if (!isSearchReady) {
    return isNoticeFilter
      ? "Choose a state or enter both from and to to search notices."
      : "Choose a state or enter both from and to to search rides.";
  }

  if (!hasSearchRequested) {
    return isNoticeFilter ? "Tap search to view notices." : "Tap search to view rides.";
  }

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
  isSearchReady,
  hasSearchRequested,
  isNoticeFilter,
  noticeScope,
  pastNoticeCount,
}: RiderFeedEmptyStateProps) {
  return (
    <Text style={styles.routeSearchEmptyText}>
      {toEmptyMessage({ isSearchReady, hasSearchRequested, isNoticeFilter, noticeScope, pastNoticeCount })}
    </Text>
  );
}
