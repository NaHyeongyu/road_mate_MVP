import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

import type { AppStyles } from "../../../ui/types";

type ToggleChipProps = {
  label: string;
  active: boolean;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
  styles: AppStyles;
};

export function ToggleChip({ label, active, iconName, onPress, styles }: ToggleChipProps) {
  return (
    <Pressable
      style={[
        styles.chip,
        iconName
          ? {
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }
          : null,
        active ? styles.chipActive : null,
      ]}
      onPress={onPress}
    >
      {iconName ? (
        <MaterialCommunityIcons
          name={iconName}
          size={16}
          color={active ? "#0B0F14" : "#64748B"}
        />
      ) : null}
      <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{label}</Text>
    </Pressable>
  );
}
