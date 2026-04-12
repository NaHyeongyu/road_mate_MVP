import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { RouteDraft, RouteKind, RoutePost } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { PostCard } from "../../../components/PostCard";

type DriverOverviewSectionProps = {
  styles: AppStyles;
  driverRouteKind: RouteKind;
  hasRouteRegistration: boolean;
  routeDraft: RouteDraft;
  onOpenRouteRegistration: () => void;
  onAdjustSeats: (delta: number) => void;
  onRouteVisibilityChange: (isPublic: boolean) => void;
};

export function DriverOverviewSection({
  styles,
  driverRouteKind,
  hasRouteRegistration,
  routeDraft,
  onOpenRouteRegistration,
  onAdjustSeats,
  onRouteVisibilityChange,
}: DriverOverviewSectionProps) {
  const routeKindLabel = driverRouteKind === "regular" ? "Regular" : "One-time";
  const isRegular = driverRouteKind === "regular";
  const seats = Number.parseInt(routeDraft.availableSeats, 10);
  const seatsLabel = Number.isFinite(seats) && seats > 0 ? String(seats) : "1";

  const previewPost: RoutePost = {
    id: `driver-overview-${driverRouteKind}`,
    kind: driverRouteKind,
    noticeDate: routeDraft.kind === "one_time" ? routeDraft.noticeDate : undefined,
    from: routeDraft.from,
    to: routeDraft.to,
    schedule: routeDraft.schedule,
    returnSchedule: routeDraft.returnSchedule,
    availableSeats: Number.parseInt(seatsLabel, 10) || 1,
    operatingDays: routeDraft.operatingDays,
    contactPhone: routeDraft.contactPhone || undefined,
    contactLink: routeDraft.contactLink || undefined,
    note: routeDraft.note,
    vehicleModel: "",
    vehiclePlate: "",
    ownerUserId: "me",
    ownerName: "Me",
    isPublic: routeDraft.isPublic,
    createdAt: new Date().toISOString(),
  };
  const quickControlContent = isRegular ? (
    <>
      <View style={styles.driverSimpleControlRow}>
        <Text style={styles.driverSimpleControlLabel}>Seats</Text>
        <View style={styles.driverControlBadgesRow}>
          <Pressable
            style={[styles.postMetaBadge, styles.driverControlBadge, styles.driverControlBadgeCompact]}
            onPress={() => onAdjustSeats(-1)}
          >
            <MaterialCommunityIcons name="minus" size={18} color="#64748B" />
          </Pressable>
          <View style={[styles.postMetaBadge, styles.postMetaBadgePrimary, styles.driverControlBadge]}>
            <MaterialCommunityIcons name="seat-passenger" size={18} color="#1D4ED8" />
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
            style={[styles.postMetaBadge, styles.driverControlBadge, styles.driverControlBadgeCompact]}
            onPress={() => onAdjustSeats(1)}
          >
            <MaterialCommunityIcons name="plus" size={18} color="#64748B" />
          </Pressable>
        </View>
      </View>

      <View style={styles.driverSimpleControlRow}>
        <Text style={styles.driverSimpleControlLabel}>Visibility</Text>
        <View style={styles.driverControlBadgesRow}>
          <Pressable
            style={[
              styles.postMetaBadge,
              styles.driverControlBadge,
              routeDraft.isPublic ? styles.postMetaBadgePrimary : null,
            ]}
            onPress={() => onRouteVisibilityChange(true)}
          >
            <MaterialCommunityIcons
              name="earth"
              size={18}
              color={routeDraft.isPublic ? "#1D4ED8" : "#64748B"}
            />
            <Text
              style={[
                styles.postMetaBadgeText,
                styles.driverControlBadgeText,
                routeDraft.isPublic ? styles.postMetaBadgeTextPrimary : null,
              ]}
            >
              Public
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.postMetaBadge,
              styles.driverControlBadge,
              !routeDraft.isPublic ? styles.postMetaBadgePrimary : null,
            ]}
            onPress={() => onRouteVisibilityChange(false)}
          >
            <MaterialCommunityIcons
              name="lock-outline"
              size={18}
              color={!routeDraft.isPublic ? "#1D4ED8" : "#64748B"}
            />
            <Text
              style={[
                styles.postMetaBadgeText,
                styles.driverControlBadgeText,
                !routeDraft.isPublic ? styles.postMetaBadgeTextPrimary : null,
              ]}
            >
              Private
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  ) : null;

  return (
    <>
      {!hasRouteRegistration ? (
        <View style={styles.postCard}>
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
                color={isRegular ? "#0B0F14" : "#64748B"}
              />
              <Text
                style={[
                  styles.postTypePillText,
                  isRegular ? styles.postTypePillTextRegular : styles.postTypePillTextOneTime,
                ]}
              >
                {routeKindLabel}
              </Text>
            </View>
            <View style={styles.postMetaBadge}>
              <MaterialCommunityIcons name="information-outline" size={14} color="#64748B" />
              <Text style={styles.postMetaBadgeText}>Not registered</Text>
            </View>
          </View>

          <View style={styles.postSummaryRow}>
            <Text style={styles.postSummaryText}>
              No registered information yet. Register once and riders can discover your route.
            </Text>
          </View>

          <View style={styles.postActionsRow}>
            <Pressable style={styles.postActionInfo} onPress={onOpenRouteRegistration}>
              <MaterialCommunityIcons name="plus-circle-outline" size={15} color="#1D4ED8" />
              <Text style={styles.postActionInfoText}>Register now</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <PostCard
          post={previewPost}
          styles={styles}
          isOwnedByCurrentUser
          viewDetailsLabel="Edit registration"
          onViewDetails={onOpenRouteRegistration}
          disableDetailModal
          extraContent={quickControlContent}
        />
      )}
    </>
  );
}
