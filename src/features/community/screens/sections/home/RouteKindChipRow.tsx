import { View } from "react-native";

import type { RouteDraft } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { ToggleChip } from "../../../../shared/components/ToggleChip";

type RouteKindChipRowProps = {
  styles: AppStyles;
  routeDraft: RouteDraft;
  onRouteDraftChange: (draft: RouteDraft) => void;
};

export function RouteKindChipRow({
  styles,
  routeDraft,
  onRouteDraftChange,
}: RouteKindChipRowProps) {
  return (
    <View style={styles.row}>
      <ToggleChip
        label="Regular"
        active={routeDraft.kind === "regular"}
        onPress={() => onRouteDraftChange({ ...routeDraft, kind: "regular" })}
        styles={styles}
      />
      <ToggleChip
        label="One-time"
        active={routeDraft.kind === "one_time"}
        onPress={() => onRouteDraftChange({ ...routeDraft, kind: "one_time" })}
        styles={styles}
      />
    </View>
  );
}
