import type { ReactNode } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useAppCopy } from "../../../../i18n/AppI18nContext";
import { formatLocalizedNoticeDate } from "../../../../i18n/formatters";
import type { RoutePost } from "../../../../model";
import type { AppStyles } from "../../../../ui/types";
import { openPlaceInGoogleMaps } from "./linking";

type PostCardRouteStackProps = {
  post: RoutePost;
  styles: AppStyles;
  isRegular: boolean;
  enableMapLinks?: boolean;
};

export function PostCardRouteStack({
  post,
  styles,
  isRegular,
  enableMapLinks = false,
}: PostCardRouteStackProps) {
  const copy = useAppCopy();
  const isOneTimeRoundTrip =
    !isRegular && (post.oneTimeTripType === "round_trip" || Boolean(post.returnSchedule));
  const shouldShowReturnTime = isRegular || isOneTimeRoundTrip;
  const departureDateLabel = !isRegular
    ? formatLocalizedNoticeDate(copy, post.noticeDate, post.createdAt)
    : null;
  const returnDateLabel =
    !isRegular && isOneTimeRoundTrip
      ? formatLocalizedNoticeDate(copy, post.returnDate ?? post.noticeDate, post.createdAt)
      : null;
  const renderRouteStopBlock = (place: string, content: ReactNode) =>
    enableMapLinks ? (
      <Pressable
        onPress={() => openPlaceInGoogleMaps(place)}
        style={({ pressed }) => [
          styles.postRouteStopBlock,
          pressed ? styles.postRouteStopBlockPressed : null,
        ]}
      >
        {content}
      </Pressable>
    ) : (
      <View style={styles.postRouteStopBlock}>{content}</View>
    );

  return (
    <View style={styles.postRouteStack}>
      {renderRouteStopBlock(
        post.from,
        <>
          <View style={styles.postRouteStopRow}>
            <View style={styles.postRouteLeadIconSlot}>
              <MaterialCommunityIcons name="map-marker-outline" size={16} color="#64748B" />
            </View>
            <Text numberOfLines={2} style={styles.postRouteEndpointTextPrimary}>
              {post.from}
            </Text>
          </View>
          {!isRegular ? (
            <View style={styles.postRouteTimeRow}>
              <View style={styles.postRouteLeadIconSlot}>
                <MaterialCommunityIcons name="calendar-month-outline" size={14} color="#64748B" />
              </View>
              <Text style={styles.postRouteTimeText}>{departureDateLabel}</Text>
            </View>
          ) : null}
          <View style={styles.postRouteTimeRow}>
            <View style={styles.postRouteLeadIconSlot}>
              <MaterialCommunityIcons name="clock-outline" size={14} color="#64748B" />
            </View>
            <Text style={styles.postRouteTimeText}>{post.schedule}</Text>
          </View>
        </>
      )}

      <View style={styles.postRouteDirectionRow}>
        <View style={styles.postRouteConnectorLine} />
        <View
          style={[
            styles.postRouteDirectionChip,
            shouldShowReturnTime ? styles.postRouteDirectionChipRegular : styles.postRouteDirectionChipOneTime,
          ]}
        >
          <MaterialCommunityIcons
            color={shouldShowReturnTime ? "#0B0F14" : "#64748B"}
            name={shouldShowReturnTime ? "swap-vertical" : "arrow-down"}
            size={16}
            style={styles.postRouteDirectionIcon}
          />
        </View>
        <View style={styles.postRouteConnectorLine} />
      </View>

      {renderRouteStopBlock(
        post.to,
        <>
          <View style={styles.postRouteStopRow}>
            <View style={styles.postRouteLeadIconSlot}>
              <MaterialCommunityIcons name="map-marker-check-outline" size={16} color="#64748B" />
            </View>
            <Text numberOfLines={2} style={styles.postRouteEndpointTextPrimary}>
              {post.to}
            </Text>
          </View>
          {shouldShowReturnTime ? (
            <>
              {isRegular ? null : (
                <View style={styles.postRouteTimeRow}>
                  <View style={styles.postRouteLeadIconSlot}>
                    <MaterialCommunityIcons name="calendar-month-outline" size={14} color="#64748B" />
                  </View>
                  <Text style={styles.postRouteTimeText}>{returnDateLabel}</Text>
                </View>
              )}
              <View style={styles.postRouteTimeRow}>
                <View style={styles.postRouteLeadIconSlot}>
                  <MaterialCommunityIcons name="clock-outline" size={14} color="#64748B" />
                </View>
                <Text style={styles.postRouteTimeText}>{post.returnSchedule || "--:--"}</Text>
              </View>
            </>
          ) : null}
        </>
      )}
    </View>
  );
}
