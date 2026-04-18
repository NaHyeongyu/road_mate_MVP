import { Pressable, Text, View } from "react-native";

import type { AppColors } from "../../../../../brandTheme";
import type { RouteDraft } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { WEEKDAY_OPTIONS } from "../../../../community/utils/routeForm";
import { Label } from "../../../../shared/components/Label";
import { ToggleChip } from "../../../../shared/components/ToggleChip";
import { OperatingDaysChips } from "./OperatingDaysChips";
import { hasSameDays } from "./driverRouteComposerState";

type RegularRouteSettingsSectionProps = {
  colors: AppColors;
  styles: AppStyles;
  routeDraft: RouteDraft;
  currentSeatCount: number;
  onDecreaseSeats: () => void;
  onIncreaseSeats: () => void;
  onApplyOperatingDays: (days: readonly string[]) => void;
  onRouteDraftChange: (draft: RouteDraft) => void;
  onSetVisibility: (isPublic: boolean) => void;
};

const WEEKDAY_PRESET = WEEKDAY_OPTIONS.slice(0, 5);
const WEEKEND_PRESET = WEEKDAY_OPTIONS.slice(5);

export function RegularRouteSettingsSection({
  colors,
  styles,
  routeDraft,
  currentSeatCount,
  onDecreaseSeats,
  onIncreaseSeats,
  onApplyOperatingDays,
  onRouteDraftChange,
  onSetVisibility,
}: RegularRouteSettingsSectionProps) {
  const isWeekdayPresetActive = hasSameDays(routeDraft.operatingDays, WEEKDAY_PRESET);
  const isWeekendPresetActive = hasSameDays(routeDraft.operatingDays, WEEKEND_PRESET);
  const isAllDaysPresetActive = hasSameDays(routeDraft.operatingDays, WEEKDAY_OPTIONS);

  return (
    <>
      <Label text="Available seats" styles={styles} />
      <View style={styles.row}>
        <Pressable style={styles.chip} onPress={onDecreaseSeats}>
          <Text style={styles.chipText}>-</Text>
        </Pressable>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{currentSeatCount}</Text>
        </View>
        <Pressable style={styles.chip} onPress={onIncreaseSeats}>
          <Text style={styles.chipText}>+</Text>
        </Pressable>
      </View>

      <View style={styles.routeComposerDivider} />

      <Label text="Operating days" styles={styles} />
      <View style={styles.row}>
        <ToggleChip
          label="Weekdays"
          active={isWeekdayPresetActive}
          onPress={() => onApplyOperatingDays(WEEKDAY_PRESET)}
          styles={styles}
        />
        <ToggleChip
          label="Weekend"
          active={isWeekendPresetActive}
          onPress={() => onApplyOperatingDays(WEEKEND_PRESET)}
          styles={styles}
        />
        <ToggleChip
          label="All week"
          active={isAllDaysPresetActive}
          onPress={() => onApplyOperatingDays(WEEKDAY_OPTIONS)}
          styles={styles}
        />
      </View>
      <OperatingDaysChips styles={styles} routeDraft={routeDraft} onRouteDraftChange={onRouteDraftChange} />

      <View style={styles.routeComposerDivider} />

      <Label text="Visibility" styles={styles} />
      <Text style={styles.cardBody}>
        {routeDraft.isPublic
          ? "Public: riders can discover this route."
          : "Private: hidden from rider search and visible only to you."}
      </Text>
      <View style={styles.row}>
        <ToggleChip
          label="Public"
          active={routeDraft.isPublic}
          onPress={() => onSetVisibility(true)}
          styles={styles}
        />
        <ToggleChip
          label="Private"
          active={!routeDraft.isPublic}
          onPress={() => onSetVisibility(false)}
          styles={styles}
        />
      </View>
    </>
  );
}
