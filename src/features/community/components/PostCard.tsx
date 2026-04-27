import type { ReactNode } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Pressable,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useAppCopy } from "../../../i18n/AppI18nContext";
import {
  formatLocalizedNoticeCountdown,
  formatLocalizedNoticeDate,
  getLocalizedNoticeDayDelta,
} from "../../../i18n/formatters";
import type { RoutePost } from "../../../model";
import type { AppStyles } from "../../../ui/types";
import { useAppColors } from "../../../ui/useAppColors";
import { useAppViewport } from "../../../ui/viewport";
import { PostCardActions } from "./postCard/PostCardActions";
import { PostCardContactRow } from "./postCard/PostCardContactRow";
import { PostCardHeader } from "./postCard/PostCardHeader";
import { PostCardRouteStack } from "./postCard/PostCardRouteStack";
import { PostCardWeekdayRow } from "./postCard/PostCardWeekdayRow";

type PostCardProps = {
  post: RoutePost;
  styles: AppStyles;
  isOwnedByCurrentUser?: boolean;
  isSaved?: boolean;
  viewDetailsLabel?: string;
  disableDetails?: boolean;
  hideOwnedEditAction?: boolean;
  showNoticeNotePreview?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
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
  disableDetails = false,
  hideOwnedEditAction = false,
  showNoticeNotePreview = true,
  containerStyle,
  onViewDetails,
  extraContent,
  onToggleSave,
  onDelete,
}: PostCardProps) {
  const copy = useAppCopy();
  const colors = useAppColors();
  const { width } = useAppViewport();
  const isCompactLayout = width < 390;
  const isRegular = post.kind === "regular";
  const seatsLabel = isRegular ? copy.community.seatsLeft(post.availableSeats) : undefined;
  const noticeDateLabel = isRegular
    ? undefined
    : formatLocalizedNoticeDate(copy, post.noticeDate, post.createdAt);
  const returnDateLabel =
    isRegular || !(post.oneTimeTripType === "round_trip" || Boolean(post.returnSchedule))
      ? undefined
      : formatLocalizedNoticeDate(copy, post.returnDate ?? post.noticeDate, post.createdAt);
  const noticeTripTypeLabel = isRegular
    ? undefined
    : post.oneTimeTripType === "round_trip" || Boolean(post.returnSchedule)
      ? copy.tripTypes.roundTrip
      : copy.tripTypes.oneWay;
  const noticeDayDelta = isRegular
    ? null
    : getLocalizedNoticeDayDelta(post.noticeDate, post.createdAt);
  const noticeCountdownLabel = isRegular
    ? undefined
    : formatLocalizedNoticeCountdown(copy, noticeDayDelta);
  const noticeCountdownTone = isRegular
    ? "unknown"
    : noticeDayDelta === null
      ? "unknown"
      : noticeDayDelta < 0
        ? "past"
        : "upcoming";
  const oneTimeSummaryLabel =
    !isRegular && noticeDateLabel
      ? returnDateLabel && noticeDateLabel !== returnDateLabel
        ? `${noticeDateLabel} -> ${returnDateLabel}`
        : copy.community.noticeFor(noticeDateLabel)
      : "";
  const canOpenDetails = Boolean(onViewDetails) && !disableDetails;
  const handleViewDetails = () => {
    if (canOpenDetails) {
      onViewDetails?.();
    }
  };
  const shouldShowEditAction = isOwnedByCurrentUser && canOpenDetails && !hideOwnedEditAction;
  const shouldShowSaveAction = !isOwnedByCurrentUser && Boolean(onToggleSave);
  const editLabel = viewDetailsLabel ?? copy.common.edit;
  const notePreview = post.note.trim();
  const shouldShowNoticeNotePreview = !isRegular && showNoticeNotePreview && Boolean(notePreview);

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
            returnDateLabel={returnDateLabel}
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
              pressed
                ? {
                    transform: [{ scale: 0.94 }],
                  }
                : null,
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
              color={isSaved ? colors.accent : colors.mutedIcon}
            />
          </Pressable>
        ) : null}
        {shouldShowEditAction ? (
          <Pressable
            style={({ pressed }) => [
              styles.postHeaderEditAction,
              pressed ? styles.postHeaderIconActionPressed : null,
              pressed
                ? {
                    transform: [{ scale: 0.97 }],
                  }
                : null,
            ]}
            onPress={(event) => {
              event.stopPropagation();
              handleViewDetails();
            }}
            hitSlop={6}
          >
            <MaterialCommunityIcons name="square-edit-outline" size={16} color={colors.accent} />
            <Text style={styles.postHeaderEditActionText}>{editLabel}</Text>
          </Pressable>
        ) : null}
      </View>

      <PostCardRouteStack post={post} styles={styles} isRegular={isRegular} />

      {isRegular ? (
        <PostCardWeekdayRow post={post} styles={styles} />
      ) : (
        <View style={styles.postSummaryRow}>
          <Text numberOfLines={1} style={styles.postSummaryText}>
            {oneTimeSummaryLabel}
          </Text>
        </View>
      )}

      {shouldShowNoticeNotePreview ? (
        <View style={styles.postSummaryRow}>
          <Text style={styles.postSummaryText}>{copy.common.note}</Text>
          <Text numberOfLines={5} ellipsizeMode="tail" style={styles.postNote}>
            {notePreview}
          </Text>
        </View>
      ) : null}

      {extraContent}

      <PostCardContactRow post={post} styles={styles} />
    </>
  );

  return (
    <>
      <View
        style={[
          styles.postCard,
          containerStyle,
          isCompactLayout
            ? {
                padding: 14,
                borderRadius: 16,
                gap: 10,
              }
            : null,
        ]}
      >
        {canOpenDetails ? (
          <Pressable
            style={({ pressed }) => [
              styles.postCardContentPressable,
              pressed ? styles.postCardContentPressablePressed : null,
              pressed
                ? {
                    transform: [{ scale: 0.992 }],
                  }
                : null,
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
    </>
  );
}
