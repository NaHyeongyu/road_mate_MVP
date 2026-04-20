import { Pressable, Text, View } from "react-native";

import type { RouteDraft } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { useAppCopy } from "../../../../../i18n/AppI18nContext";
import { Label } from "../../../../shared/components/Label";
import { ToggleChip } from "../../../../shared/components/ToggleChip";
import { OperatingDaysChips } from "./OperatingDaysChips";

type RegularRouteSettingsSectionProps = {
  styles: AppStyles;
  routeDraft: RouteDraft;
  currentSeatCount: number;
  onDecreaseSeats: () => void;
  onIncreaseSeats: () => void;
  onRouteDraftChange: (draft: RouteDraft) => void;
  onSetVisibility: (isPublic: boolean) => void;
};

export function RegularRouteSettingsSection({
  styles,
  routeDraft,
  currentSeatCount,
  onDecreaseSeats,
  onIncreaseSeats,
  onRouteDraftChange,
  onSetVisibility,
}: RegularRouteSettingsSectionProps) {
  const copy = useAppCopy();

  return (
    <>
      <Label text={copy.common.availableSeats} styles={styles} />
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

      <Label text={copy.common.operatingDays} styles={styles} />
      <OperatingDaysChips styles={styles} routeDraft={routeDraft} onRouteDraftChange={onRouteDraftChange} />

      <View style={styles.routeComposerDivider} />

      <Label text={copy.common.visibility} styles={styles} />
      <Text style={styles.cardBody}>
        {routeDraft.isPublic
          ? copy.community.publicVisibilityDescription
          : copy.community.privateVisibilityDescription}
      </Text>
      <View style={styles.row}>
        <ToggleChip
          label={copy.common.public}
          iconName="earth"
          active={routeDraft.isPublic}
          onPress={() => onSetVisibility(true)}
          styles={styles}
        />
        <ToggleChip
          label={copy.common.private}
          iconName="lock-outline"
          active={!routeDraft.isPublic}
          onPress={() => onSetVisibility(false)}
          styles={styles}
        />
      </View>
    </>
  );
}
