import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useAppCopy } from "../../../../../i18n/AppI18nContext";
import type { RouteDraft, RouteKind, RoutePost, VehicleInfo } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { useAppColors } from "../../../../../ui/useAppColors";
import { PostCard } from "../../../components/PostCard";

type DriverOverviewSectionProps = {
  styles: AppStyles;
  driverRouteKind: RouteKind;
  activePublishedPost: RoutePost | null;
  hasRouteRegistration: boolean;
  hasDraftInput: boolean;
  isDraftReady: boolean;
  missingRequiredLabels: string[];
  isQuickSettingSaving: boolean;
  hasPreviousOneTimePosts: boolean;
  routeDraft: RouteDraft;
  savedVehicle: VehicleInfo;
  onOpenRouteRegistration: () => void;
  onOpenRouteDetailPage: (post: RoutePost) => void;
  onOpenPreviousNoticesPage: () => void;
  onAdjustSeats: (delta: number) => void;
  onRouteVisibilityChange: (isPublic: boolean) => void;
};

export function DriverOverviewSection({
  styles,
  driverRouteKind,
  activePublishedPost,
  hasRouteRegistration,
  hasDraftInput,
  isDraftReady,
  missingRequiredLabels,
  isQuickSettingSaving,
  hasPreviousOneTimePosts,
  routeDraft,
  savedVehicle,
  onOpenRouteRegistration,
  onOpenRouteDetailPage,
  onOpenPreviousNoticesPage,
  onAdjustSeats,
  onRouteVisibilityChange,
}: DriverOverviewSectionProps) {
  const copy = useAppCopy();
  const colors = useAppColors();
  const routeKindLabel = driverRouteKind === "regular" ? copy.common.regular : copy.common.oneTime;
  const isRegular = driverRouteKind === "regular";
  const notePreview = routeDraft.note.trim();
  const profileContactPhone = savedVehicle.contactPhone.trim();
  const profileContactLink = savedVehicle.contactLink.trim();
  const seats = Number.parseInt(routeDraft.availableSeats, 10);
  const seatsLabel = Number.isFinite(seats) && seats > 0 ? String(seats) : "1";
  const previewMissingLabels = missingRequiredLabels.slice(0, 3);
  const remainingMissingCount = Math.max(0, missingRequiredLabels.length - previewMissingLabels.length);
  const registrationEmptyText = hasDraftInput
    ? isDraftReady
      ? copy.community.driverDraftReady
      : copy.community.driverDraftStarted
    : !isRegular
      ? copy.community.driverNoActiveOneTimeNotice
      : copy.community.driverNoRegistration;
  const draftMissingText =
    hasDraftInput && !isDraftReady && previewMissingLabels.length
      ? copy.community.missingPreview(previewMissingLabels, remainingMissingCount)
      : "";
  const registerActionText = hasDraftInput
    ? isDraftReady
      ? copy.community.reviewAndSave
      : copy.community.continueDraft
    : copy.community.registerNow;

  const previewPost: RoutePost = {
    id: `driver-overview-${driverRouteKind}`,
    kind: driverRouteKind,
    oneTimeTripType: driverRouteKind === "one_time" ? routeDraft.oneTimeTripType : undefined,
    noticeDate: driverRouteKind === "one_time" ? routeDraft.noticeDate : undefined,
    returnDate:
      driverRouteKind === "one_time" && routeDraft.oneTimeTripType === "round_trip"
        ? routeDraft.returnDate || routeDraft.noticeDate || undefined
        : undefined,
    from: routeDraft.from,
    to: routeDraft.to,
    schedule: routeDraft.schedule,
    returnSchedule:
      driverRouteKind === "one_time" && routeDraft.oneTimeTripType !== "round_trip"
        ? undefined
        : routeDraft.returnSchedule,
    availableSeats: Number.parseInt(seatsLabel, 10) || 1,
    operatingDays: routeDraft.operatingDays,
    contactPhone: isRegular
      ? profileContactPhone || undefined
      : profileContactPhone || routeDraft.contactPhone || undefined,
	    contactLink: isRegular
	      ? profileContactLink || undefined
	      : profileContactLink || routeDraft.contactLink || undefined,
	    note: routeDraft.note,
	    vehicleModel: savedVehicle.model.trim(),
	    vehiclePlate: savedVehicle.plate.trim(),
	    ownerUserId: "me",
    ownerName: copy.common.me,
    isPublic: routeDraft.isPublic,
    createdAt: new Date().toISOString(),
  };
  const quickControlContent = isRegular ? (
    <>
      <View style={styles.driverSimpleControlRow}>
        <Text style={styles.driverSimpleControlLabel}>{copy.common.seats}</Text>
        <View style={styles.driverControlBadgesRow}>
          <Pressable
            style={[
              styles.postMetaBadge,
              styles.driverControlBadge,
              styles.driverControlBadgeCompact,
              isQuickSettingSaving ? { opacity: 0.56 } : null,
            ]}
            disabled={isQuickSettingSaving}
            onPress={() => onAdjustSeats(-1)}
          >
            <MaterialCommunityIcons name="minus" size={18} color={colors.mutedIcon} />
          </Pressable>
          <View style={[styles.postMetaBadge, styles.postMetaBadgePrimary, styles.driverControlBadge]}>
            <MaterialCommunityIcons name="seat-passenger" size={18} color={colors.accent} />
            <Text
              style={[
                styles.postMetaBadgeText,
                styles.postMetaBadgeTextPrimary,
                styles.driverControlBadgeText,
              ]}
            >
              {seatsLabel}
            </Text>
          </View>
          <Pressable
            style={[
              styles.postMetaBadge,
              styles.driverControlBadge,
              styles.driverControlBadgeCompact,
              isQuickSettingSaving ? { opacity: 0.56 } : null,
            ]}
            disabled={isQuickSettingSaving}
            onPress={() => onAdjustSeats(1)}
          >
            <MaterialCommunityIcons name="plus" size={18} color={colors.mutedIcon} />
          </Pressable>
        </View>
      </View>

      <View style={styles.driverSimpleControlRow}>
        <Text style={styles.driverSimpleControlLabel}>{copy.common.visibility}</Text>
        <View style={styles.driverControlBadgesRow}>
          <Pressable
            style={[
              styles.postMetaBadge,
              styles.driverControlBadge,
              routeDraft.isPublic ? styles.postMetaBadgePrimary : null,
              isQuickSettingSaving ? { opacity: 0.56 } : null,
            ]}
            disabled={isQuickSettingSaving}
            onPress={() => onRouteVisibilityChange(true)}
          >
            <MaterialCommunityIcons
              name="earth"
              size={18}
              color={routeDraft.isPublic ? colors.accent : colors.mutedIcon}
            />
            <Text
              style={[
                styles.postMetaBadgeText,
                styles.driverControlBadgeText,
                routeDraft.isPublic ? styles.postMetaBadgeTextPrimary : null,
              ]}
            >
              {copy.common.public}
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.postMetaBadge,
              styles.driverControlBadge,
              !routeDraft.isPublic ? styles.postMetaBadgePrimary : null,
              isQuickSettingSaving ? { opacity: 0.56 } : null,
            ]}
            disabled={isQuickSettingSaving}
            onPress={() => onRouteVisibilityChange(false)}
          >
            <MaterialCommunityIcons
              name="lock-outline"
              size={18}
              color={!routeDraft.isPublic ? colors.accent : colors.mutedIcon}
            />
            <Text
              style={[
                styles.postMetaBadgeText,
                styles.driverControlBadgeText,
                !routeDraft.isPublic ? styles.postMetaBadgeTextPrimary : null,
              ]}
            >
              {copy.common.private}
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  ) : null;
  const previewExtraContent = (
    <>
      {quickControlContent}
      {notePreview ? (
        <View style={styles.postSummaryRow}>
          <Text style={styles.postSummaryText}>{copy.common.additionalDetails}</Text>
          <Text style={styles.postNote}>{notePreview}</Text>
        </View>
      ) : null}
    </>
  );
  return (
    <>
      {!hasRouteRegistration ? (
        <View style={styles.postCard}>
          <View style={styles.postSummaryRow}>
            <Text style={styles.postSummaryText}>{registrationEmptyText}</Text>
            {draftMissingText ? <Text style={styles.postNote}>{draftMissingText}</Text> : null}
          </View>

          <Pressable
            style={[
              styles.primaryButton,
              {
                marginTop: 2,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              },
            ]}
            onPress={onOpenRouteRegistration}
          >
            <MaterialCommunityIcons name="plus-circle-outline" size={17} color={colors.brandText} />
            <Text style={styles.primaryButtonText}>{registerActionText}</Text>
          </Pressable>
        </View>
      ) : (
        <View style={{ gap: 10 }}>
          <PostCard
            post={activePublishedPost ?? previewPost}
            styles={styles}
            isOwnedByCurrentUser
            disableDetails={!activePublishedPost}
            hideOwnedEditAction
            showNoticeNotePreview={false}
            onViewDetails={
              activePublishedPost ? () => onOpenRouteDetailPage(activePublishedPost) : undefined
            }
            extraContent={previewExtraContent}
          />

          <Pressable
            onPress={onOpenRouteRegistration}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                marginTop: 0,
                backgroundColor: colors.panel,
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              },
              pressed ? styles.primaryButtonDisabled : null,
            ]}
          >
            <MaterialCommunityIcons name="square-edit-outline" size={17} color={colors.text} />
            <Text style={[styles.primaryButtonText, { color: colors.text }]}>
              {copy.common.edit}
            </Text>
          </Pressable>
        </View>
      )}

      {driverRouteKind === "one_time" && hasPreviousOneTimePosts ? (
        <View style={{ marginTop: 8 }}>
          <Pressable
            onPress={onOpenPreviousNoticesPage}
            style={({ pressed }) => [
              {
                ...styles.primaryButton,
                marginTop: 0,
                backgroundColor: colors.panel,
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              },
              pressed ? styles.primaryButtonDisabled : null,
            ]}
          >
            <MaterialCommunityIcons name="history" size={18} color={colors.text} />
            <Text style={[styles.primaryButtonText, { color: colors.text }]}>
              {copy.community.viewPreviousNotices}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </>
  );
}
