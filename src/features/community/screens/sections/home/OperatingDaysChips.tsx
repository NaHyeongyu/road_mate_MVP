import { View } from "react-native";

import type { RouteDraft } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { toggleOperatingDay, WEEKDAY_OPTIONS } from "../../../../community/utils/routeForm";
import { ToggleChip } from "../../../../shared/components/ToggleChip";

type OperatingDaysChipsProps = {
  styles: AppStyles;
  routeDraft: RouteDraft;
  onRouteDraftChange: (draft: RouteDraft) => void;
};

export function OperatingDaysChips({
  styles,
  routeDraft,
  onRouteDraftChange,
}: OperatingDaysChipsProps) {
  return (
    <View style={styles.row}>
      {WEEKDAY_OPTIONS.map((day) => (
        <ToggleChip
          key={day}
          label={day}
          active={routeDraft.operatingDays.includes(day)}
          onPress={() =>
            onRouteDraftChange({
              ...routeDraft,
              operatingDays: toggleOperatingDay(routeDraft, day),
            })
          }
          styles={styles}
        />
      ))}
    </View>
  );
}
