import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

import type { AppNotice } from "../../../../app/types";
import type { RoutePost } from "../../../../model";
import type { AppStyles } from "../../../../ui/types";
import { PostCard } from "../../components/PostCard";
import { NoticeBanner } from "../../../shared/components/NoticeBanner";
import { getPostSaveKey } from "../../utils/storage";

type SavedTabSectionProps = {
  styles: AppStyles;
  notice: AppNotice;
  isRiderMode: boolean;
  savedPosts: RoutePost[];
  currentUserId: string;
  savedPostKeys: string[];
  onToggleSavedPost: (post: RoutePost) => void;
};

export function SavedTabSection({
  styles,
  notice,
  isRiderMode,
  savedPosts,
  currentUserId,
  savedPostKeys,
  onToggleSavedPost,
}: SavedTabSectionProps) {
  const [sortMode, setSortMode] = useState<"saved_recent" | "notice_recent">("saved_recent");
  const savedPostKeySet = useMemo(() => new Set(savedPostKeys), [savedPostKeys]);
  const riderVisibleSavedPosts = useMemo(
    () => savedPosts.filter((post) => post.ownerUserId !== currentUserId),
    [currentUserId, savedPosts]
  );
  const savedPostOrderMap = useMemo(
    () =>
      new Map(
        savedPostKeys.map((key, index) => [key, index] as const)
      ),
    [savedPostKeys]
  );
  const sortedSavedPosts = useMemo(() => {
    const toTimestamp = (value: string) => {
      const parsed = Date.parse(value);
      return Number.isFinite(parsed) ? parsed : 0;
    };
    const byCreatedAtDesc = (left: RoutePost, right: RoutePost) =>
      right.createdAt.localeCompare(left.createdAt);
    const byNoticeDateDesc = (left: RoutePost, right: RoutePost) => {
      const leftNoticeDate = left.noticeDate ? Date.parse(`${left.noticeDate}T00:00:00`) : NaN;
      const rightNoticeDate = right.noticeDate ? Date.parse(`${right.noticeDate}T00:00:00`) : NaN;
      const leftTimestamp = Number.isFinite(leftNoticeDate) ? leftNoticeDate : toTimestamp(left.createdAt);
      const rightTimestamp = Number.isFinite(rightNoticeDate)
        ? rightNoticeDate
        : toTimestamp(right.createdAt);
      return rightTimestamp - leftTimestamp;
    };

    return [...riderVisibleSavedPosts].sort((left, right) => {
      if (sortMode === "saved_recent") {
        const leftOrder = savedPostOrderMap.get(getPostSaveKey(left));
        const rightOrder = savedPostOrderMap.get(getPostSaveKey(right));
        const normalizedLeft = Number.isFinite(leftOrder) ? (leftOrder as number) : Number.MAX_SAFE_INTEGER;
        const normalizedRight = Number.isFinite(rightOrder)
          ? (rightOrder as number)
          : Number.MAX_SAFE_INTEGER;
        if (normalizedLeft !== normalizedRight) {
          return normalizedLeft - normalizedRight;
        }
        return byCreatedAtDesc(left, right);
      }

      if (left.kind !== right.kind) {
        return left.kind === "one_time" ? -1 : 1;
      }

      return left.kind === "one_time" ? byNoticeDateDesc(left, right) : byCreatedAtDesc(left, right);
    });
  }, [riderVisibleSavedPosts, savedPostOrderMap, sortMode]);

  if (!isRiderMode) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Saved rides</Text>
        <Text style={styles.cardBody}>Saved is available in rider mode only.</Text>
      </View>
    );
  }

  return (
    <>
      <NoticeBanner notice={notice} styles={styles} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Saved rides</Text>
        <Text style={styles.cardBody}>Total saved: {riderVisibleSavedPosts.length}</Text>
        <View style={styles.row}>
          <Pressable
            style={[styles.chip, sortMode === "saved_recent" ? styles.chipActive : null]}
            onPress={() => setSortMode("saved_recent")}
          >
            <Text style={[styles.chipText, sortMode === "saved_recent" ? styles.chipTextActive : null]}>
              Saved recent
            </Text>
          </Pressable>
          <Pressable
            style={[styles.chip, sortMode === "notice_recent" ? styles.chipActive : null]}
            onPress={() => setSortMode("notice_recent")}
          >
            <Text style={[styles.chipText, sortMode === "notice_recent" ? styles.chipTextActive : null]}>
              Notice recent
            </Text>
          </Pressable>
        </View>
      </View>

      {sortedSavedPosts.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.cardBody}>No saved rides yet.</Text>
        </View>
      ) : (
        sortedSavedPosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            styles={styles}
            isSaved={savedPostKeySet.has(getPostSaveKey(post))}
            onToggleSave={() => onToggleSavedPost(post)}
          />
        ))
      )}
    </>
  );
}
