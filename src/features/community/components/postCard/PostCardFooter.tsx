import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { RoutePost } from "../../../../model";
import type { AppStyles } from "../../../../ui/types";

type PostCardFooterProps = {
  post: RoutePost;
  styles: AppStyles;
};

export function PostCardFooter({ post, styles }: PostCardFooterProps) {
  return (
    <View style={styles.postFooterCard}>
      <View style={styles.postFooterItemRow}>
        <View style={styles.postRouteLeadIconSlot}>
          <MaterialCommunityIcons name="account-circle-outline" size={15} color="#64748B" />
        </View>
        <Text style={styles.postFooterLabel}>Driver</Text>
        <Text numberOfLines={1} style={styles.postFooterValue}>
          {post.ownerName}
        </Text>
      </View>
      <View style={styles.postFooterDivider} />
      <View style={styles.postFooterItemRow}>
        <View style={styles.postRouteLeadIconSlot}>
          <MaterialCommunityIcons name="car-outline" size={15} color="#64748B" />
        </View>
        <Text style={styles.postFooterLabel}>Vehicle</Text>
        <Text numberOfLines={1} style={[styles.postFooterValue, styles.postFooterValueSecondary]}>
          {post.vehicleModel} · {post.vehiclePlate}
        </Text>
      </View>
    </View>
  );
}
