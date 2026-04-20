import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { useAppCopy } from "../../../../i18n/AppI18nContext";
import type { RoutePost } from "../../../../model";
import type { AppStyles } from "../../../../ui/types";
import { useAppColors } from "../../../../ui/useAppColors";

type PostCardFooterProps = {
  post: RoutePost;
  styles: AppStyles;
};

export function PostCardFooter({ post, styles }: PostCardFooterProps) {
  const copy = useAppCopy();
  const colors = useAppColors();

  return (
    <View style={styles.postFooterCard}>
      <View style={styles.postFooterItemRow}>
        <View style={styles.postRouteLeadIconSlot}>
          <MaterialCommunityIcons name="account-circle-outline" size={15} color={colors.mutedIcon} />
        </View>
        <Text style={styles.postFooterLabel}>{copy.community.ownerDriver}</Text>
        <Text numberOfLines={1} style={styles.postFooterValue}>
          {post.ownerName}
        </Text>
      </View>
      <View style={styles.postFooterDivider} />
      <View style={styles.postFooterItemRow}>
        <View style={styles.postRouteLeadIconSlot}>
          <MaterialCommunityIcons name="car-outline" size={15} color={colors.mutedIcon} />
        </View>
        <Text style={styles.postFooterLabel}>{copy.community.ownerVehicle}</Text>
        <Text numberOfLines={1} style={[styles.postFooterValue, styles.postFooterValueSecondary]}>
          {post.vehicleModel} · {post.vehiclePlate}
        </Text>
      </View>
    </View>
  );
}
