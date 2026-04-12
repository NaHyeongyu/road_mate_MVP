import { useMemo, useState, type ReactNode } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { RoutePost } from "../../../model";
import type { AppStyles } from "../../../ui/types";
import { formatNoticeCountdown, formatNoticeDate, getNoticeDayDelta } from "../utils/storage";
import { RoutePostDetailModal } from "./RoutePostDetailModal";
import { PostCardActions } from "./postCard/PostCardActions";
import { PostCardContactRow } from "./postCard/PostCardContactRow";
import { PostCardHeader } from "./postCard/PostCardHeader";
import { PostCardRouteStack } from "./postCard/PostCardRouteStack";

type PostCardProps = {
  post: RoutePost;
  styles: AppStyles;
  isOwnedByCurrentUser?: boolean;
  isSaved?: boolean;
  viewDetailsLabel?: string;
  disableDetailModal?: boolean;
  onViewDetails?: () => void;
  extraContent?: ReactNode;
  onToggleSave?: () => void;
  onDelete?: () => void;
};

export function PostCard({
  post,
  styles,
  isOwnedByCurrentUser = false,
  isSaved = false,
  viewDetailsLabel,
  disableDetailModal = false,
  onViewDetails,
  extraContent,
  onToggleSave,
  onDelete,
}: PostCardProps) {
  const isRegular = post.kind === "regular";
  const seatsLabel = isRegular ? `${post.availableSeats} seats left` : undefined;
  const noticeDateLabel = isRegular ? undefined : formatNoticeDate(post.noticeDate, post.createdAt);
  const noticeTripTypeLabel = isRegular
    ? undefined
    : post.oneTimeTripType === "round_trip" || Boolean(post.returnSchedule)
      ? "Round-trip"
      : "One-way";
  const noticeDayDelta = isRegular ? null : getNoticeDayDelta(post.noticeDate, post.createdAt);
  const noticeCountdownLabel = isRegular ? undefined : formatNoticeCountdown(noticeDayDelta);
  const noticeCountdownTone = isRegular
    ? "unknown"
    : noticeDayDelta === null
      ? "unknown"
      : noticeDayDelta < 0
        ? "past"
        : "upcoming";
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const operatingDaysSummary = useMemo(() => {
    if (!post.operatingDays.length) {
      return "Operating day info not set";
    }
    return post.operatingDays.join(" · ");
  }, [post.operatingDays]);
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails();
      return;
    }

    if (!disableDetailModal) {
      setIsDetailOpen(true);
    }
  };
  const canOpenDetails = Boolean(onViewDetails || !disableDetailModal);
  const shouldShowEditAction = isOwnedByCurrentUser && canOpenDetails && Boolean(onDelete || onViewDetails);
  const shouldShowSaveAction = !isOwnedByCurrentUser && Boolean(onToggleSave);
  const editLabel = viewDetailsLabel ?? "Edit";

  const cardBodyContent = (
    <>
      <View style={styles.postHeaderTopRow}>
        <View style={styles.postHeaderTopMain}>
          <PostCardHeader
            post={post}
            styles={styles}
            isRegular={isRegular}
            seatsLabel={seatsLabel}
            noticeDateLabel={noticeDateLabel}
            noticeTripTypeLabel={noticeTripTypeLabel}
            noticeCountdownLabel={noticeCountdownLabel}
            noticeCountdownTone={noticeCountdownTone}
          />
        </View>
        {shouldShowSaveAction && onToggleSave ? (
          <Pressable
            style={({ pressed }) => [
              styles.postHeaderIconAction,
              isSaved ? styles.postHeaderIconActionActive : null,
              pressed ? styles.postHeaderIconActionPressed : null,
            ]}
            onPress={(event) => {
              event.stopPropagation();
              onToggleSave();
            }}
            hitSlop={6}
          >
            <MaterialCommunityIcons
              name={isSaved ? "bookmark-check" : "bookmark-plus-outline"}
              size={20}
              color={isSaved ? "#1D4ED8" : "#64748B"}
            />
          </Pressable>
        ) : null}
        {shouldShowEditAction ? (
          <Pressable
            style={({ pressed }) => [
              styles.postHeaderEditAction,
              pressed ? styles.postHeaderIconActionPressed : null,
            ]}
            onPress={(event) => {
              event.stopPropagation();
              handleViewDetails();
            }}
            hitSlop={6}
          >
            <MaterialCommunityIcons name="square-edit-outline" size={16} color="#1D4ED8" />
            <Text style={styles.postHeaderEditActionText}>{editLabel}</Text>
          </Pressable>
        ) : null}
      </View>

      <PostCardRouteStack post={post} styles={styles} isRegular={isRegular} />

      <View style={styles.postSummaryRow}>
        <Text numberOfLines={1} style={styles.postSummaryText}>
          {isRegular ? `Runs ${operatingDaysSummary}` : `Notice for ${noticeDateLabel}`}
        </Text>
      </View>

      <PostCardContactRow post={post} styles={styles} />

      {extraContent}
    </>
  );

  return (
    <>
      <View style={styles.postCard}>
        {canOpenDetails ? (
          <Pressable
            style={({ pressed }) => [
              styles.postCardContentPressable,
              pressed ? styles.postCardContentPressablePressed : null,
            ]}
            onPress={handleViewDetails}
          >
            {cardBodyContent}
          </Pressable>
        ) : (
          <View style={styles.postCardContentPressable}>{cardBodyContent}</View>
        )}

        <PostCardActions
          styles={styles}
          onDelete={onDelete}
        />
      </View>

      {!disableDetailModal ? (
        <RoutePostDetailModal
          visible={isDetailOpen}
          post={post}
          styles={styles}
          isOwnedByCurrentUser={isOwnedByCurrentUser}
          isSaved={isSaved}
          onDelete={onDelete}
          onToggleSave={onToggleSave}
          onClose={() => setIsDetailOpen(false)}
        />
      ) : null}
    </>
  );
}
