import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useAppCopy } from "../../../i18n/AppI18nContext";
import {
  formatLocalizedNoticeCountdown,
  formatLocalizedNoticeDate,
  getLocalizedNoticeDayDelta,
} from "../../../i18n/formatters";
import type { RoutePost } from "../../../model";
import type { AppStyles } from "../../../ui/types";
import { PostCardContactRow } from "./postCard/PostCardContactRow";
import { PostCardHeader } from "./postCard/PostCardHeader";
import { PostCardRouteStack } from "./postCard/PostCardRouteStack";
import { PostCardWeekdayRow } from "./postCard/PostCardWeekdayRow";

type RoutePostDetailPageProps = {
  post: RoutePost;
  styles: AppStyles;
  isOwnedByCurrentUser?: boolean;
  isSaved?: boolean;
  onToggleSave?: () => void;
};

type DriverInfoRow = {
  iconName: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: string;
};

export function RoutePostDetailPage({
  post,
  styles,
  isOwnedByCurrentUser = false,
  isSaved = false,
  onToggleSave,
}: RoutePostDetailPageProps) {
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
  const driverInfoRows: DriverInfoRow[] = [
    {
      iconName: "account-circle-outline",
      label: copy.common.driver,
      value: post.ownerName,
    },
    {
      iconName: "car-outline",
      label: copy.common.vehicle,
      value: `${post.vehicleModel} · ${post.vehiclePlate}`,
    },
    {
      iconName: "seat-passenger",
      label: copy.common.seats,
      value: copy.community.seatsLeft(post.availableSeats),
    },
  ];
  const detailNote = post.note.trim();

  return (
    <View style={styles.postDetailPageCard}>
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
      </View>

      <PostCardRouteStack post={post} styles={styles} isRegular={isRegular} enableMapLinks />
      {isRegular ? <PostCardWeekdayRow post={post} styles={styles} /> : null}

      <View style={styles.postDriverInfoCard}>
        <View style={styles.postDriverInfoHeader}>
          <MaterialCommunityIcons name="steering" size={16} color="#0B0F14" />
          <Text style={styles.postDriverInfoTitle}>{copy.common.driverInfo}</Text>
        </View>

        <View style={styles.postDriverInfoRows}>
          {driverInfoRows.map((item) => (
            <View key={item.label} style={styles.postDriverInfoRow}>
              <View style={styles.postDriverInfoIconSlot}>
                <MaterialCommunityIcons name={item.iconName} size={15} color="#64748B" />
              </View>
              <Text style={styles.postDriverInfoLabel}>{item.label}</Text>
              <Text numberOfLines={1} style={styles.postDriverInfoValue}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <PostCardContactRow post={post} styles={styles} />

      {detailNote ? (
        <View style={styles.postSummaryRow}>
          <Text style={styles.postSummaryText}>{copy.common.note}</Text>
          <Text style={styles.postNote}>{detailNote}</Text>
        </View>
      ) : null}
      {isOwnedByCurrentUser ? <Text style={styles.mine}>{copy.community.fromMyDriverProfile}</Text> : null}
    </View>
  );
}
