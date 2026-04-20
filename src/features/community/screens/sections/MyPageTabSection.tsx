import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import type { AppColors } from "../../../../brandTheme";
import { useAppCopy } from "../../../../i18n/AppI18nContext";
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
  onRequestAuth: () => void;
  onOpenSettingsPage: () => void;
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
  onRequestAuth,
  onOpenSettingsPage,
}: MyPageTabSectionProps) {
  const copy = useAppCopy();
  const isDriverMode = mode === "driver";
  const hasContactMethod = Boolean(
    savedVehicle.contactPhone.trim() || savedVehicle.contactLink.trim()
  );
  const driverProfileStatusText = !isDriverMode
    ? copy.community.riderModeActive
    : hasVehicle
      ? hasContactMethod
        ? copy.community.driverProfileReady
        : copy.community.driverProfileMissingContact
      : copy.community.driverProfileIncomplete;

  return (
    <>
      {!isAuthenticated ? (
        <View style={styles.card}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 14,
                backgroundColor: colors.panelAlt,
              }}
            >
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={22}
                color={colors.hero}
              />
            </View>
            <Text style={styles.cardTitle}>{copy.common.guest}</Text>
          </View>

          <Text style={styles.cardBody}>{copy.community.guestMyPageMessage}</Text>

          <Pressable
            style={[
              styles.primaryButton,
              {
                marginTop: 0,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              },
            ]}
            onPress={onRequestAuth}
          >
            <MaterialCommunityIcons
              name="account-plus-outline"
              size={18}
              color={colors.brandText}
            />
            <Text style={styles.primaryButtonText}>{copy.auth.signUp}</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{copy.common.accountSummary}</Text>
            <Text style={styles.cardBody}>
              {copy.community.accountSummaryName(currentUserName)}
            </Text>
            <Text style={styles.cardBody}>
              {copy.community.accountSummaryEmail(currentUserEmail)}
            </Text>
            <View style={styles.row}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>
                  {copy.community.accountSummaryRole(isDriverMode ? copy.common.driver : copy.common.rider)}
                </Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipText}>{copy.community.accountSummaryRoutes(myPostsCount)}</Text>
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>{copy.community.driverProfileStatus}</Text>
            <Text style={styles.cardBody}>{driverProfileStatusText}</Text>
            {!isDriverMode ? (
              <Text style={styles.cardBody}>{copy.community.switchToDriver}</Text>
            ) : !hasVehicle ? (
              <Text style={styles.cardBody}>{copy.community.registerVehicleFirst}</Text>
            ) : (
              <>
                <Text style={styles.cardBody}>{copy.community.vehicleRow(savedVehicle.model, savedVehicle.plate)}</Text>
                {savedVehicle.contactPhone ? (
                  <Text style={styles.cardBody}>{copy.community.phoneRow(savedVehicle.contactPhone)}</Text>
                ) : null}
                {savedVehicle.contactLink ? (
                  <Text numberOfLines={1} style={styles.cardBody}>
                    {toContactLinkLabel(savedVehicle.contactLink)}: {savedVehicle.contactLink}
                  </Text>
                ) : null}
                {!savedVehicle.contactPhone && !savedVehicle.contactLink ? (
                  <Text style={styles.cardBody}>
                    {copy.community.addContactMethod}
                  </Text>
                ) : null}
                {savedVehicle.note ? (
                  <Text numberOfLines={2} style={styles.cardBody}>
                    {copy.community.carNoteRow(savedVehicle.note)}
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
        </>
      )}

      <Pressable
        style={[
          styles.primaryButton,
          {
            marginTop: 0,
            backgroundColor: colors.panel,
            borderWidth: 1,
            borderColor: colors.border,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          },
        ]}
        onPress={onOpenSettingsPage}
      >
        <MaterialCommunityIcons
          name="cog-outline"
          size={18}
          color={colors.text}
        />
        <Text style={[styles.primaryButtonText, { color: colors.text }]}>
          {copy.common.settings}
        </Text>
      </Pressable>
    </>
  );
}
