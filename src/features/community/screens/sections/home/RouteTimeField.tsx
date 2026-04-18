import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { AppStyles } from "../../../../../ui/types";
import { toRouteTimeDisplayLabel } from "../../../utils/routeForm";
import { Label } from "../../../../shared/components/Label";

type RouteTimeFieldProps = {
  styles: AppStyles;
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
};

export function RouteTimeField({
  styles,
  label,
  value,
  placeholder,
  onPress,
}: RouteTimeFieldProps) {
  const displayLabel = toRouteTimeDisplayLabel(value);
  const hasValue = Boolean(displayLabel);

  return (
    <>
      <Label text={label} styles={styles} />
      <Pressable
        style={({ pressed }) => [styles.timeFieldButton, pressed ? styles.timeFieldButtonPressed : null]}
        onPress={onPress}
      >
        <View style={styles.pickerFieldMain}>
          <View style={styles.pickerFieldIconWrap}>
            <MaterialCommunityIcons name="clock-time-four-outline" size={18} color="#475569" />
          </View>
          <View style={styles.timeFieldButtonTextWrap}>
            <Text style={[styles.timeFieldButtonValue, hasValue ? null : styles.timeFieldButtonPlaceholder]}>
              {hasValue ? displayLabel : placeholder}
            </Text>
            <Text style={styles.timeFieldButtonHint}>
              {hasValue ? "Tap to change" : "Tap to select"}
            </Text>
          </View>
        </View>
        <MaterialCommunityIcons
          name="chevron-down"
          size={18}
          color="#94A3B8"
          style={styles.pickerFieldChevron}
        />
      </Pressable>
    </>
  );
}
