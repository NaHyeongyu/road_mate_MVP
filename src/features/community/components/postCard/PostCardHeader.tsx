import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { useAppCopy } from "../../../../i18n/AppI18nContext";
import type { RoutePost } from "../../../../model";
import type { AppStyles } from "../../../../ui/types";
import { useAppColors } from "../../../../ui/useAppColors";

type PostCardHeaderProps = {
  post: RoutePost;
  styles: AppStyles;
  isRegular: boolean;
  seatsLabel?: string;
  noticeDateLabel?: string;
  returnDateLabel?: string;
  noticeTripTypeLabel?: string;
  noticeCountdownLabel?: string;
  noticeCountdownTone?: "upcoming" | "past" | "unknown";
};

export function PostCardHeader({
  post,
  styles,
  isRegular,
  seatsLabel,
  noticeDateLabel,
  returnDateLabel,
  noticeTripTypeLabel,
  noticeCountdownLabel,
  noticeCountdownTone = "unknown",
}: PostCardHeaderProps) {
  const copy = useAppCopy();
  const colors = useAppColors();
  const typeIconColor = isRegular ? colors.brandText : colors.neutralText;
  const isPastNotice = noticeCountdownTone === "past";
  const isUpcomingNotice = noticeCountdownTone === "upcoming";

  return (
    <View style={styles.postHeaderRow}>
      <View
        style={[
          styles.postTypePill,
          isRegular ? styles.postTypePillRegular : styles.postTypePillOneTime,
        ]}
      >
        <MaterialCommunityIcons
          name={isRegular ? "calendar-sync" : "clock-outline"}
          size={14}
          color={typeIconColor}
        />
        <Text
          style={[
            styles.postTypePillText,
            isRegular ? styles.postTypePillTextRegular : styles.postTypePillTextOneTime,
          ]}
        >
          {post.kind === "regular" ? copy.common.regular : copy.common.notices}
        </Text>
      </View>
      {isRegular && seatsLabel ? (
        <View style={[styles.postMetaBadge, styles.postMetaBadgePrimary]}>
          <MaterialCommunityIcons name="seat-passenger" size={14} color={colors.accent} />
          <Text style={[styles.postMetaBadgeText, styles.postMetaBadgeTextPrimary]}>{seatsLabel}</Text>
        </View>
      ) : null}
      {!isRegular && noticeTripTypeLabel ? (
        <View style={styles.postMetaBadge}>
          <MaterialCommunityIcons
            name={noticeTripTypeLabel === copy.tripTypes.roundTrip ? "swap-horizontal" : "arrow-right"}
            size={14}
            color={colors.mutedIcon}
          />
          <Text style={styles.postMetaBadgeText}>{noticeTripTypeLabel}</Text>
        </View>
      ) : null}
      {!isRegular && noticeDateLabel ? (
        <View style={[styles.postMetaBadge, styles.postMetaBadgePrimary]}>
          <MaterialCommunityIcons name="calendar-start-outline" size={14} color={colors.accent} />
          <Text style={[styles.postMetaBadgeText, styles.postMetaBadgeTextPrimary]}>
            {noticeDateLabel}
          </Text>
        </View>
      ) : null}
      {!isRegular && returnDateLabel ? (
        <View style={[styles.postMetaBadge, styles.postMetaBadgePrimary]}>
          <MaterialCommunityIcons name="calendar-end-outline" size={14} color={colors.accent} />
          <Text style={[styles.postMetaBadgeText, styles.postMetaBadgeTextPrimary]}>
            {returnDateLabel}
          </Text>
        </View>
      ) : null}
      {!isRegular && noticeCountdownLabel ? (
        <View
          style={[
            styles.postMetaBadge,
            isPastNotice
              ? styles.postMetaBadgeNeutral
              : isUpcomingNotice
                ? styles.postMetaBadgeWarning
                : null,
          ]}
        >
          <MaterialCommunityIcons
            name={isPastNotice ? "clock-alert-outline" : "calendar-check-outline"}
            size={14}
            color={isPastNotice ? colors.neutralText : colors.warning}
          />
          <Text
            style={[
              styles.postMetaBadgeText,
              isPastNotice
                ? styles.postMetaBadgeTextNeutral
                : isUpcomingNotice
                  ? styles.postMetaBadgeTextWarning
                  : null,
            ]}
          >
            {noticeCountdownLabel}
          </Text>
        </View>
      ) : null}
    </View>
  );
}
