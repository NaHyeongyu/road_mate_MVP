import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";

import type { AppStyles } from "../../../ui/types";
import { useAppColors } from "../../../ui/useAppColors";

type ToggleChipProps = {
  label: string;
  active: boolean;
  iconName?: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress: () => void;
  styles: AppStyles;
};

export function ToggleChip({ label, active, iconName, onPress, styles }: ToggleChipProps) {
  const colors = useAppColors();

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
          color={active ? colors.brandText : colors.mutedIcon}
        />
      ) : null}
      <Text style={[styles.chipText, active ? styles.chipTextActive : null]}>{label}</Text>
    </Pressable>
  );
}
