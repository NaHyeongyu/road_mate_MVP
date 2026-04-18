import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";

import { useAppCopy } from "../../../i18n/AppI18nContext";
import {
  formatLocalizedNoticeCountdown,
  formatLocalizedNoticeDate,
  getLocalizedNoticeDayDelta,
} from "../../../i18n/formatters";
import type { RoutePost } from "../../../model";
import type { AppStyles } from "../../../ui/types";
import { PostCardActions } from "./postCard/PostCardActions";
import { PostCardContactRow } from "./postCard/PostCardContactRow";
import { PostCardFooter } from "./postCard/PostCardFooter";
import { PostCardHeader } from "./postCard/PostCardHeader";
import { PostCardRouteStack } from "./postCard/PostCardRouteStack";
import { PostCardWeekdayRow } from "./postCard/PostCardWeekdayRow";

type RoutePostDetailModalProps = {
  visible: boolean;
  post: RoutePost;
  styles: AppStyles;
  isOwnedByCurrentUser?: boolean;
  isSaved?: boolean;
  onToggleSave?: () => void;
  onDelete?: () => void;
  onClose: () => void;
};

export function RoutePostDetailModal({
  visible,
  post,
  styles,
  isOwnedByCurrentUser = false,
  isSaved = false,
  onToggleSave,
  onDelete,
  onClose,
}: RoutePostDetailModalProps) {
  const copy = useAppCopy();
  const isRegular = post.kind === "regular";
  const shouldShowSaveAction = !isOwnedByCurrentUser && Boolean(onToggleSave);
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
  const detailNote = post.note.trim();

  const handleDelete = () => {
    onDelete?.();
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.postDetailModalOverlay}>
        <Pressable style={styles.postDetailModalBackdrop} onPress={onClose} />

        <View style={styles.postDetailModalCard}>
          <View style={styles.postDetailModalHeaderRow}>
            <View style={styles.postDetailModalTitleBlock}>
              <Text style={styles.postDetailModalTitle}>{copy.common.rideDetails}</Text>
              <Text numberOfLines={1} style={styles.postDetailModalSubtitle}>
                {isRegular
                  ? copy.community.rideDetailsSubtitle(post.from, post.to)
                  : oneTimeSummaryLabel}
              </Text>
            </View>

            <View style={styles.postDetailModalHeaderActions}>
              {shouldShowSaveAction && onToggleSave ? (
                <Pressable
                  style={({ pressed }) => [
                    styles.postDetailModalBookmarkButton,
                    isSaved ? styles.postDetailModalBookmarkButtonActive : null,
                    pressed ? styles.postDetailModalHeaderActionPressed : null,
                  ]}
                  onPress={onToggleSave}
                  hitSlop={6}
                >
                  <MaterialCommunityIcons
                    name={isSaved ? "bookmark-check" : "bookmark-plus-outline"}
                    size={20}
                    color={isSaved ? "#1D4ED8" : "#64748B"}
                  />
                </Pressable>
              ) : null}

              <Pressable
                style={({ pressed }) => [
                  styles.postDetailModalCloseButton,
                  pressed ? styles.postDetailModalHeaderActionPressed : null,
                ]}
                onPress={onClose}
              >
                <MaterialCommunityIcons name="close" size={18} color="#0B0F14" />
              </Pressable>
            </View>
          </View>

          <View style={styles.postDetailModalContent}>
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
            <PostCardRouteStack post={post} styles={styles} isRegular={isRegular} />
            {isRegular ? <PostCardWeekdayRow post={post} styles={styles} /> : null}
            <PostCardFooter post={post} styles={styles} />
            <PostCardContactRow post={post} styles={styles} />

            {detailNote ? (
              <View style={styles.postSummaryRow}>
                <Text style={styles.postSummaryText}>{copy.common.note}</Text>
                <Text style={styles.postNote}>{detailNote}</Text>
              </View>
            ) : null}
            {isOwnedByCurrentUser ? <Text style={styles.mine}>{copy.community.fromMyDriverProfile}</Text> : null}

            <PostCardActions
              styles={styles}
              onDelete={onDelete ? handleDelete : undefined}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
