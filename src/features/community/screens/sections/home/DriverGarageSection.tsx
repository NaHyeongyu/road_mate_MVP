import { Pressable, Text, TextInput, View } from "react-native";

import type { AppColors } from "../../../../../brandTheme";
import { useAppCopy } from "../../../../../i18n/AppI18nContext";
import type { VehicleInfo } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { Label } from "../../../../shared/components/Label";

type DriverGarageSectionProps = {
  colors: AppColors;
  styles: AppStyles;
  hasVehicle: boolean;
  vehicleDraft: VehicleInfo;
  onVehicleDraftChange: (draft: VehicleInfo) => void;
  onSaveVehicle: () => void;
};

export function DriverGarageSection({
  colors,
  styles,
  hasVehicle,
  vehicleDraft,
  onVehicleDraftChange,
  onSaveVehicle,
}: DriverGarageSectionProps) {
  const copy = useAppCopy();
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {hasVehicle ? copy.community.myCar : copy.community.driverRegistration}
      </Text>
      <Text style={styles.cardBody}>
        {hasVehicle
          ? copy.community.driverGarageFilled
          : copy.community.driverGarageEmpty}
      </Text>

      <Label text={copy.community.carModel} styles={styles} />
      <TextInput
        value={vehicleDraft.model}
        onChangeText={(value) => onVehicleDraftChange({ ...vehicleDraft, model: value })}
        placeholder="Toyota Corolla"
        placeholderTextColor={colors.subtext}
        style={styles.input}
      />

      <Label text={copy.community.plateNumber} styles={styles} />
      <TextInput
        value={vehicleDraft.plate}
        onChangeText={(value) => onVehicleDraftChange({ ...vehicleDraft, plate: value })}
        autoCapitalize="characters"
        placeholder="NSW 123AB"
        placeholderTextColor={colors.subtext}
        style={styles.input}
      />

      <Label text={copy.common.carNote} optional styles={styles} />
      <TextInput
        value={vehicleDraft.note}
        onChangeText={(value) => onVehicleDraftChange({ ...vehicleDraft, note: value })}
        placeholder="Colour, luggage note, pickup hint"
        placeholderTextColor={colors.subtext}
        style={[styles.input, styles.multiline]}
        multiline
      />

      <Label text={copy.community.contactPhone} optional styles={styles} />
      <TextInput
        value={vehicleDraft.contactPhone}
        onChangeText={(value) => onVehicleDraftChange({ ...vehicleDraft, contactPhone: value })}
        placeholder="0412 345 678"
        placeholderTextColor={colors.subtext}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <Label text={copy.community.chatLink} optional styles={styles} />
      <TextInput
        value={vehicleDraft.contactLink}
        onChangeText={(value) => onVehicleDraftChange({ ...vehicleDraft, contactLink: value })}
        placeholder="https://wa.me/61412345678"
        placeholderTextColor={colors.subtext}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />

      <Pressable style={styles.primaryButton} onPress={onSaveVehicle}>
        <Text style={styles.primaryButtonText}>
          {hasVehicle ? copy.community.saveVehicle : copy.community.completeRegistration}
        </Text>
      </Pressable>
    </View>
  );
}
