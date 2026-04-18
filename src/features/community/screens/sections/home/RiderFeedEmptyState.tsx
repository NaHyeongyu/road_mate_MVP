import { Text } from "react-native";

import { useAppCopy } from "../../../../../i18n/AppI18nContext";
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
  copy,
  isSearchReady,
  hasSearchRequested,
  isNoticeFilter,
  noticeScope,
  pastNoticeCount,
}: {
  copy: ReturnType<typeof useAppCopy>;
  isSearchReady: boolean;
  hasSearchRequested: boolean;
  isNoticeFilter: boolean;
  noticeScope: NoticeScope;
  pastNoticeCount: number;
}) {
  if (!isSearchReady) {
    return copy.community.chooseSearchPrompt(isNoticeFilter);
  }

  if (!hasSearchRequested) {
    return copy.community.tapSearchPrompt(isNoticeFilter);
  }

  if (isNoticeFilter && noticeScope === "upcoming" && pastNoticeCount > 0) {
    return copy.community.pastOnlyPrompt;
  }

  if (isNoticeFilter) {
    return copy.community.noNoticesMatch;
  }

  return copy.community.noRidesMatch;
}

export function RiderFeedEmptyState({
  styles,
  isSearchReady,
  hasSearchRequested,
  isNoticeFilter,
  noticeScope,
  pastNoticeCount,
}: RiderFeedEmptyStateProps) {
  const copy = useAppCopy();
  return (
    <Text style={styles.routeSearchEmptyText}>
      {toEmptyMessage({
        copy,
        isSearchReady,
        hasSearchRequested,
        isNoticeFilter,
        noticeScope,
        pastNoticeCount,
      })}
    </Text>
  );
}
