import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import type { AppColors } from "../../../../brandTheme";
import type { VehicleInfo } from "../../../../model";
import type { AppStyles } from "../../../../ui/types";
import type { Mode } from "../../types";
import { toContactLinkLabel } from "../../utils/contactLink";
import { DriverGarageSection } from "./home/DriverGarageSection";

type MyPageTabSectionProps = {
  colors: AppColors;
  styles: AppStyles;
  currentUserName: string;
  currentUserEmail: string;
  isAuthenticated: boolean;
  mode: Mode;
  myPostsCount: number;
  hasVehicle: boolean;
  vehicleDraft: VehicleInfo;
  savedVehicle: VehicleInfo;
  onVehicleDraftChange: (draft: VehicleInfo) => void;
  onSaveVehicle: () => void;
  onSignOut: () => void;
  onWithdrawAccount: () => void;
  onRequestAuth: () => void;
};

export function MyPageTabSection({
  colors,
  styles,
  currentUserName,
  currentUserEmail,
  isAuthenticated,
  mode,
  myPostsCount,
  hasVehicle,
  vehicleDraft,
  savedVehicle,
  onVehicleDraftChange,
  onSaveVehicle,
  onSignOut,
  onWithdrawAccount,
  onRequestAuth,
}: MyPageTabSectionProps) {
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [confirmWithdraw, setConfirmWithdraw] = useState(false);
  const isDriverMode = mode === "driver";
  const hasContactMethod = Boolean(
    savedVehicle.contactPhone.trim() || savedVehicle.contactLink.trim()
  );
  const driverProfileStatusText = !isDriverMode
    ? "Rider mode is active."
    : hasVehicle
      ? hasContactMethod
        ? "Driver profile is ready for posting."
        : "Driver profile is saved, but contact method is missing."
      : "Driver profile is not completed yet.";

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account summary</Text>
        <Text style={styles.cardBody}>Name: {isAuthenticated ? currentUserName : "Guest"}</Text>
        <Text style={styles.cardBody}>Email: {isAuthenticated ? currentUserEmail : "--"}</Text>
        <View style={styles.row}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Role: {isDriverMode ? "Driver" : "Rider"}</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>My routes: {myPostsCount}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Driver profile status</Text>
        <Text style={styles.cardBody}>{driverProfileStatusText}</Text>
        {!isDriverMode ? (
          <Text style={styles.cardBody}>Switch to driver mode to manage your vehicle profile.</Text>
        ) : !hasVehicle ? (
          <Text style={styles.cardBody}>
            Register vehicle and contact details once to start posting regular or one-time routes.
          </Text>
        ) : (
          <>
            <Text style={styles.cardBody}>
              Vehicle: {savedVehicle.model} · {savedVehicle.plate}
            </Text>
            {savedVehicle.contactPhone ? (
              <Text style={styles.cardBody}>Phone: {savedVehicle.contactPhone}</Text>
            ) : null}
            {savedVehicle.contactLink ? (
              <Text numberOfLines={1} style={styles.cardBody}>
                {toContactLinkLabel(savedVehicle.contactLink)}: {savedVehicle.contactLink}
              </Text>
            ) : null}
            {!savedVehicle.contactPhone && !savedVehicle.contactLink ? (
              <Text style={styles.cardBody}>
                Add phone or chat link (WhatsApp/Kakao/Telegram) to make riders contact you.
              </Text>
            ) : null}
            {savedVehicle.note ? (
              <Text numberOfLines={2} style={styles.cardBody}>
                Car note: {savedVehicle.note}
              </Text>
            ) : null}
          </>
        )}
      </View>

      {isDriverMode ? (
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
        {isAuthenticated ? (
          <Text style={styles.cardBody}>
            Sign out keeps your account. Withdrawal removes access and clears your local driver
            profile.
          </Text>
        ) : (
          <Text style={styles.cardBody}>
            You are browsing as guest. Create an account to save rides and register as a driver.
          </Text>
        )}

        {!isAuthenticated ? (
          <Pressable style={styles.primaryButton} onPress={onRequestAuth}>
            <Text style={styles.primaryButtonText}>Create account with email</Text>
          </Pressable>
        ) : null}

        {!isAuthenticated ? null : (
          <>
            {confirmSignOut ? (
              <Text style={styles.cardBody}>Tap sign out once more to confirm.</Text>
            ) : null}
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

            {confirmWithdraw ? (
              <Text style={styles.cardBody}>Tap withdraw once more to confirm account withdrawal.</Text>
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
          </>
        )}
      </View>
    </>
  );
}
