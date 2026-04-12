import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import type { AppColors } from "../../../../brandTheme";
import type { VehicleInfo } from "../../../../model";
import type { AppStyles } from "../../../../ui/types";
import type { Mode } from "../../types";
import { DriverGarageSection } from "./home/DriverGarageSection";

type MyPageTabSectionProps = {
  colors: AppColors;
  styles: AppStyles;
  currentUserName: string;
  currentUserEmail: string;
  mode: Mode;
  myPostsCount: number;
  hasVehicle: boolean;
  vehicleDraft: VehicleInfo;
  savedVehicle: VehicleInfo;
  onVehicleDraftChange: (draft: VehicleInfo) => void;
  onSaveVehicle: () => void;
  onSignOut: () => void;
  onWithdrawAccount: () => void;
};

export function MyPageTabSection({
  colors,
  styles,
  currentUserName,
  currentUserEmail,
  mode,
  myPostsCount,
  hasVehicle,
  vehicleDraft,
  savedVehicle,
  onVehicleDraftChange,
  onSaveVehicle,
  onSignOut,
  onWithdrawAccount,
}: MyPageTabSectionProps) {
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>My page</Text>
        <Text style={styles.cardBody}>Name: {currentUserName}</Text>
        <Text style={styles.cardBody}>Email: {currentUserEmail}</Text>
        <Text style={styles.cardBody}>Active role: {mode === "driver" ? "Driver" : "Rider"}</Text>
        <Text style={styles.cardBody}>My posted routes: {myPostsCount}</Text>
        {mode === "driver" && hasVehicle ? (
          <>
            <Text style={styles.cardBody}>
              Vehicle: {savedVehicle.model} · {savedVehicle.plate}
            </Text>
            {savedVehicle.contactPhone ? (
              <Text style={styles.cardBody}>Phone: {savedVehicle.contactPhone}</Text>
            ) : null}
            {savedVehicle.contactLink ? (
              <Text style={styles.cardBody}>Open chat: {savedVehicle.contactLink}</Text>
            ) : null}
          </>
        ) : null}
      </View>

      {mode === "driver" ? (
        <DriverGarageSection
          colors={colors}
          styles={styles}
          hasVehicle={hasVehicle}
          vehicleDraft={vehicleDraft}
          onVehicleDraftChange={onVehicleDraftChange}
          onSaveVehicle={onSaveVehicle}
        />
      ) : null}

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account management</Text>
        <Text style={styles.cardBody}>
          Manage session and withdrawal from here. Withdrawal signs you out and clears your local
          driver profile.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            if (confirmSignOut) {
              onSignOut();
              return;
            }
            setConfirmSignOut(true);
            setConfirmWithdraw(false);
          }}
        >
          <Text style={styles.primaryButtonText}>
            {confirmSignOut ? "Confirm sign out" : "Sign out"}
          </Text>
        </Pressable>
        {confirmSignOut ? (
          <Pressable style={styles.inlineTextButton} onPress={() => setConfirmSignOut(false)}>
            <Text style={styles.inlineTextButtonText}>Cancel sign out</Text>
          </Pressable>
        ) : null}

        <Pressable
          style={styles.dangerButton}
          onPress={() => {
            if (confirmWithdraw) {
              onWithdrawAccount();
              return;
            }
            setConfirmWithdraw(true);
            setConfirmSignOut(false);
          }}
        >
          <Text style={styles.dangerButtonText}>
            {confirmWithdraw ? "Confirm withdraw account" : "Withdraw account"}
          </Text>
        </Pressable>
        {confirmWithdraw ? (
          <Pressable style={styles.inlineTextButton} onPress={() => setConfirmWithdraw(false)}>
            <Text style={styles.inlineTextButtonText}>Cancel withdrawal</Text>
          </Pressable>
        ) : null}
      </View>
    </>
  );
}
