import { Pressable, Text, View } from "react-native";

import { useAppCopy } from "../../../../../i18n/AppI18nContext";
import type { AppCopy } from "../../../../../i18n/copy";
import type { RoutePost } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { PostCard } from "../../../components/PostCard";
import { isPreviousOneTimePost } from "../../../utils/storage";
import type { PreviousNoticesPeriod } from "./useDriverHomeOverviewState";

type PreviousNoticesPageProps = {
  styles: AppStyles;
  posts: RoutePost[];
  period: PreviousNoticesPeriod;
  onPeriodChange: (period: PreviousNoticesPeriod) => void;
  onOpenRouteDetailPage: (post: RoutePost) => void;
};

const PERIOD_OPTIONS: PreviousNoticesPeriod[] = ["all", "30d", "90d", "365d"];

const getNoticeTimestamp = (post: RoutePost) => {
  const noticeDate = String(post.noticeDate ?? "").trim();
  if (noticeDate) {
    const noticeTimestamp = Date.parse(`${noticeDate}T00:00:00`);
    if (Number.isFinite(noticeTimestamp)) {
      return noticeTimestamp;
    }
  }

  const createdAt = Date.parse(post.createdAt);
  return Number.isFinite(createdAt) ? createdAt : 0;
};

const getPeriodLabel = (copy: AppCopy, period: PreviousNoticesPeriod) => {
  switch (period) {
    case "30d":
      return copy.community.previousNotices30Days;
    case "90d":
      return copy.community.previousNotices90Days;
    case "365d":
      return copy.community.previousNotices365Days;
    case "all":
    default:
      return copy.community.previousNoticesAll;
  }
};

const isPostWithinPeriod = (post: RoutePost, period: PreviousNoticesPeriod) => {
  if (period === "all") {
    return true;
  }

  const days = period === "30d" ? 30 : period === "90d" ? 90 : 365;
  const threshold = Date.now() - days * 24 * 60 * 60 * 1000;

  return getNoticeTimestamp(post) >= threshold;
};

export function PreviousNoticesPage({
  styles,
  posts,
  period,
  onPeriodChange,
  onOpenRouteDetailPage,
}: PreviousNoticesPageProps) {
  const copy = useAppCopy();
  const previousPosts = posts
    .filter(isPreviousOneTimePost)
    .filter((post) => isPostWithinPeriod(post, period))
    .sort((left, right) => getNoticeTimestamp(right) - getNoticeTimestamp(left));

  return (
    <View style={{ gap: 14 }}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{copy.community.previousNotices}</Text>
        <Text style={styles.cardBody}>{copy.community.previousNoticesDescription}</Text>
      </View>

      <View style={styles.row}>
        {PERIOD_OPTIONS.map((option) => (
          <Pressable
            key={option}
            style={[styles.chip, period === option ? styles.chipActive : null]}
            onPress={() => onPeriodChange(option)}
          >
            <Text style={[styles.chipText, period === option ? styles.chipTextActive : null]}>
              {getPeriodLabel(copy, option)}
            </Text>
          </Pressable>
        ))}
      </View>

      {previousPosts.length ? (
        <View style={{ gap: 12 }}>
          {previousPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              styles={styles}
              onViewDetails={() => onOpenRouteDetailPage(post)}
            />
          ))}
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardBody}>{copy.community.noPreviousNoticesInRange}</Text>
        </View>
      )}
    </View>
  );
}
