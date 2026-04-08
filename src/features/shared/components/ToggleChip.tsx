import { Pressable, Text } from "react-native";

import type { AppStyles } from "../../../ui/types";

type ToggleChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
  styles: AppStyles;
};

export function ToggleChip({ label, active, onPress, styles }: ToggleChipProps) {
  return (
    <Pressable style={[styles.chip, active ? styles.chipActive : null]} onPress={onPress}>
      <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{label}</Text>
    </Pressable>
  );
}
