import { Pressable, Text, TextInput, View } from "react-native";

import type { AppColors } from "../../../../../brandTheme";
import type { VehicleInfo } from "../../../../../model";
import type { AppStyles } from "../../../../../ui/types";
import { Label } from "../../../../shared/components/Label";

type DriverGarageSectionProps = {
  colors: AppColors;
  styles: AppStyles;
  hasVehicle: boolean;
  vehicleDraft: VehicleInfo;
  savedVehicle: VehicleInfo;
  onVehicleDraftChange: (draft: VehicleInfo) => void;
  onSaveVehicle: () => void;
};

export function DriverGarageSection({
  colors,
  styles,
  hasVehicle,
  vehicleDraft,
  savedVehicle,
  onVehicleDraftChange,
  onSaveVehicle,
}: DriverGarageSectionProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{hasVehicle ? "My car" : "Driver registration"}</Text>
      <Text style={styles.cardBody}>
        {hasVehicle
          ? "One driver profile only. Vehicle and contact info are auto-applied to regular and one-time posts."
          : "Before using driver mode, register your vehicle and contact profile first."}
      </Text>

      <Label text="Car model" styles={styles} />
      <TextInput
        value={vehicleDraft.model}
        onChangeText={(value) => onVehicleDraftChange({ ...vehicleDraft, model: value })}
        placeholder="Toyota Corolla"
        placeholderTextColor={colors.subtext}
        style={styles.input}
      />

      <Label text="Plate number" styles={styles} />
      <TextInput
        value={vehicleDraft.plate}
        onChangeText={(value) => onVehicleDraftChange({ ...vehicleDraft, plate: value })}
        autoCapitalize="characters"
        placeholder="QLD 123AB"
        placeholderTextColor={colors.subtext}
        style={styles.input}
      />

      <Label text="Car note" optional styles={styles} />
      <TextInput
        value={vehicleDraft.note}
        onChangeText={(value) => onVehicleDraftChange({ ...vehicleDraft, note: value })}
        placeholder="Colour, luggage note, pickup hint"
        placeholderTextColor={colors.subtext}
        style={[styles.input, styles.multiline]}
        multiline
      />

      <Label text="Contact phone" optional styles={styles} />
      <TextInput
        value={vehicleDraft.contactPhone}
        onChangeText={(value) => onVehicleDraftChange({ ...vehicleDraft, contactPhone: value })}
        placeholder="+61 412 345 678"
        placeholderTextColor={colors.subtext}
        keyboardType="phone-pad"
        style={styles.input}
      />

      <Label text="Open chat link" optional styles={styles} />
      <TextInput
        value={vehicleDraft.contactLink}
        onChangeText={(value) => onVehicleDraftChange({ ...vehicleDraft, contactLink: value })}
        placeholder="https://open.kakao.com/o/..."
        placeholderTextColor={colors.subtext}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.input}
      />

      <Pressable style={styles.primaryButton} onPress={onSaveVehicle}>
        <Text style={styles.primaryButtonText}>{hasVehicle ? "Save vehicle" : "Complete registration"}</Text>
      </Pressable>

      {hasVehicle ? (
        <View style={styles.savedBlock}>
          <Text style={styles.savedTitle}>Saved vehicle</Text>
          <Text style={styles.savedValue}>
            {savedVehicle.model} · {savedVehicle.plate}
          </Text>
          {savedVehicle.note ? <Text style={styles.savedNote}>{savedVehicle.note}</Text> : null}
          {savedVehicle.contactPhone ? <Text style={styles.savedNote}>Phone: {savedVehicle.contactPhone}</Text> : null}
          {savedVehicle.contactLink ? <Text style={styles.savedNote}>Chat: {savedVehicle.contactLink}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}
