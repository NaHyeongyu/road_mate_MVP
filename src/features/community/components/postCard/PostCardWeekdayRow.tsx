import { Text, View } from "react-native";

import type { RoutePost } from "../../../../model";
import type { AppStyles } from "../../../../ui/types";

const WEEKDAY_OPTIONS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

type PostCardWeekdayRowProps = {
  post: RoutePost;
  styles: AppStyles;
};

export function PostCardWeekdayRow({ post, styles }: PostCardWeekdayRowProps) {
  const operatingDays = new Set(post.operatingDays);

  return (
    <View style={styles.postWeekdayRow}>
      {WEEKDAY_OPTIONS.map((day) => {
        const active = operatingDays.has(day);
        return (
          <View
            key={`${post.id}-${day}`}
            style={[styles.postWeekdayChip, active ? styles.postWeekdayChipActive : null]}
          >
            <Text style={[styles.postWeekdayText, active ? styles.postWeekdayTextActive : null]}>
              {day}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
