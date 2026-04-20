import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { useAppI18n } from "../../../../../i18n/AppI18nContext";
import type { AppStyles } from "../../../../../ui/types";
import { toRouteDateDisplayLabel } from "../../../utils/routeForm";
import { Label } from "../../../../shared/components/Label";

type RouteDateFieldProps = {
  styles: AppStyles;
  label: string;
  value: string;
  placeholder: string;
  onPress: () => void;
};

export function RouteDateField({
  styles,
  label,
  value,
  placeholder,
  onPress,
}: RouteDateFieldProps) {
  const { copy, language } = useAppI18n();
  const displayLabel = toRouteDateDisplayLabel(value, language);
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
            <MaterialCommunityIcons name="calendar-month-outline" size={18} color="#475569" />
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
          color="#94A3B8"
          style={styles.pickerFieldChevron}
        />
      </Pressable>
    </>
  );
}
