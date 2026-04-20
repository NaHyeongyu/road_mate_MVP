import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useAppCopy } from "../../../../../i18n/AppI18nContext";
import type { AppStyles } from "../../../../../ui/types";
import { useAppColors } from "../../../../../ui/useAppColors";
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
  const copy = useAppCopy();
  const colors = useAppColors();
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
            <MaterialCommunityIcons name="clock-time-four-outline" size={18} color={colors.mutedIcon} />
          </View>
          <View style={styles.timeFieldButtonTextWrap}>
            <Text style={[styles.timeFieldButtonValue, hasValue ? null : styles.timeFieldButtonPlaceholder]}>
              {hasValue ? displayLabel : placeholder}
            </Text>
            <Text style={styles.timeFieldButtonHint}>
              {hasValue ? copy.common.tapToChange : copy.common.tapToSelect}
            </Text>
          </View>
        </View>
        <MaterialCommunityIcons
          name="chevron-down"
          size={18}
          color={colors.disabledText}
          style={styles.pickerFieldChevron}
        />
      </Pressable>
    </>
  );
}
