import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { RoutePost } from "../../../../model";
import type { AppStyles } from "../../../../ui/types";
import { openPlaceInGoogleMaps } from "./linking";

type PostCardRouteStackProps = {
  post: RoutePost;
  styles: AppStyles;
  isRegular: boolean;
};

export function PostCardRouteStack({ post, styles, isRegular }: PostCardRouteStackProps) {
  return (
    <View style={styles.postRouteStack}>
      <Pressable
        onPress={() => openPlaceInGoogleMaps(post.from)}
        style={({ pressed }) => [styles.postRouteStopBlock, pressed ? styles.postRouteStopBlockPressed : null]}
      >
        <View style={styles.postRouteStopRow}>
          <View style={styles.postRouteLeadIconSlot}>
            <MaterialCommunityIcons name="map-marker-outline" size={16} color="#64748B" />
          </View>
          <Text numberOfLines={2} style={styles.postRouteEndpointTextPrimary}>
            {post.from}
          </Text>
        </View>
        <View style={styles.postRouteTimeRow}>
          <View style={styles.postRouteLeadIconSlot}>
            <MaterialCommunityIcons name="clock-outline" size={14} color="#64748B" />
          </View>
          <Text style={styles.postRouteTimeText}>{post.schedule}</Text>
        </View>
      </Pressable>

      <View style={styles.postRouteDirectionRow}>
        <View style={styles.postRouteConnectorLine} />
        <View
          style={[
            styles.postRouteDirectionChip,
            isRegular ? styles.postRouteDirectionChipRegular : styles.postRouteDirectionChipOneTime,
          ]}
        >
          <MaterialCommunityIcons
            color={isRegular ? "#0B0F14" : "#64748B"}
            name={isRegular ? "swap-vertical" : "arrow-down"}
            size={16}
            style={styles.postRouteDirectionIcon}
          />
        </View>
        <View style={styles.postRouteConnectorLine} />
      </View>

      <Pressable
        onPress={() => openPlaceInGoogleMaps(post.to)}
        style={({ pressed }) => [styles.postRouteStopBlock, pressed ? styles.postRouteStopBlockPressed : null]}
      >
        <View style={styles.postRouteStopRow}>
          <View style={styles.postRouteLeadIconSlot}>
            <MaterialCommunityIcons name="map-marker-check-outline" size={16} color="#64748B" />
          </View>
          <Text numberOfLines={2} style={styles.postRouteEndpointTextPrimary}>
            {post.to}
          </Text>
        </View>
        {isRegular || post.returnSchedule ? (
          <View style={styles.postRouteTimeRow}>
            <View style={styles.postRouteLeadIconSlot}>
              <MaterialCommunityIcons name="clock-outline" size={14} color="#64748B" />
            </View>
            <Text style={styles.postRouteTimeText}>{post.returnSchedule || "--:--"}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}
