import { useEffect, useMemo, useState } from "react";

import type { RouteKind, RoutePost } from "../../../../../model";
import { getNoticeDayDelta } from "../../../utils/storage";

type NoticeScope = "upcoming" | "all";

type UseRiderFeedViewStateOptions = {
  filter: RouteKind;
  visiblePosts: RoutePost[];
  currentUserId: string;
  onFilterChange: (filter: RouteKind) => void;
};

export function useRiderFeedViewState({
  filter,
  visiblePosts,
  currentUserId,
  onFilterChange,
}: UseRiderFeedViewStateOptions) {
  const isNoticeFilter = filter === "one_time";
  const [noticeScope, setNoticeScope] = useState<NoticeScope>("upcoming");

  const riderVisiblePosts = useMemo(
    () => visiblePosts.filter((post) => post.ownerUserId !== currentUserId),
    [currentUserId, visiblePosts]
  );

  useEffect(() => {
    if (!isNoticeFilter) {
      setNoticeScope("upcoming");
    }
  }, [isNoticeFilter]);

  const handleToggleFeedType = () => {
    onFilterChange(isNoticeFilter ? "regular" : "one_time");
  };

  const pastNoticeCount = useMemo(() => {
    if (!isNoticeFilter) {
      return 0;
    }

    return riderVisiblePosts.filter((post) => {
      const dayDelta = getNoticeDayDelta(post.noticeDate, post.createdAt);
      return dayDelta !== null && dayDelta < 0;
    }).length;
  }, [isNoticeFilter, riderVisiblePosts]);

  const feedPosts = useMemo(() => {
    if (!isNoticeFilter || noticeScope === "all") {
      return riderVisiblePosts;
    }

    return riderVisiblePosts.filter((post) => {
      const dayDelta = getNoticeDayDelta(post.noticeDate, post.createdAt);
      return dayDelta === null || dayDelta >= 0;
    });
  }, [isNoticeFilter, noticeScope, riderVisiblePosts]);

  return {
    isNoticeFilter,
    noticeScope,
    feedPosts,
    pastNoticeCount,
    showViewNoticesAction: !isNoticeFilter,
    setNoticeScope,
    handleToggleFeedType,
  };
}
