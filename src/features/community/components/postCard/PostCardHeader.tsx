import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

import type { RoutePost } from "../../../../model";
import type { AppStyles } from "../../../../ui/types";
import { kindLabel } from "../../utils/storage";

type PostCardHeaderProps = {
  post: RoutePost;
  styles: AppStyles;
  isRegular: boolean;
  seatsLabel?: string;
};

export function PostCardHeader({ post, styles, isRegular, seatsLabel }: PostCardHeaderProps) {
  const typeIconColor = isRegular ? "#0B0F14" : "#475569";

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
          {kindLabel(post.kind)}
        </Text>
      </View>
      {seatsLabel ? (
        <View style={[styles.postMetaBadge, styles.postMetaBadgePrimary]}>
          <MaterialCommunityIcons name="seat-passenger" size={14} color="#1D4ED8" />
          <Text style={[styles.postMetaBadgeText, styles.postMetaBadgeTextPrimary]}>{seatsLabel}</Text>
        </View>
      ) : null}
    </View>
  );
}
